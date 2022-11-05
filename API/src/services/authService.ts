import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/userRepository';
import config from '../config/index';
import { APIError } from '../errors/APIError';
import { StatusCodes } from 'http-status-codes';
import LoginRequest from '../requests/loginRequest';
import RegistrationRequest from '../requests/registrationRequest';
import logger from '../config/logger';

export type UserClaims = {
  id: number;
  email: string;
  username: string;
  type: 'user' | 'admin' | 'deleted';
};

export default class AuthService {
  constructor(
    private readonly currentUser?: UserClaims,
    private readonly userRepository: UserRepository = new UserRepository(currentUser?.id),
  ) {}

  async login(request: LoginRequest): Promise<{ token: string }> {
    const { email, password } = request;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new APIError('User not found', StatusCodes.NOT_FOUND, true);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new APIError('Invalid password', StatusCodes.UNAUTHORIZED, true);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, type: user.user_type },
      config.jwTokenKey,
      {
        expiresIn: 60 * 60 * 24,
      },
    );

    return { token };
  }

  async register(request: RegistrationRequest): Promise<{ token: string }> {
    const { email, password, username, first_name, last_name, date_of_birth } = request;

    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new APIError('User already exists', StatusCodes.CONFLICT, true);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const createdUser = await this.userRepository.create({
        email,
        password_hash: hashedPassword,
        username,
        first_name,
        last_name,
        date_of_birth,
        user_type: 'user',
        joined_at: new Date(),
      });

      const token = jwt.sign(
        { id: createdUser.id, username: createdUser.username, email: createdUser.email, type: createdUser.user_type },
        config.jwTokenKey,
        {
          expiresIn: config.token_expiration,
        },
      );

      return { token };
    } catch (error) {
      logger.error(error);
      throw new APIError('Failed to create user', StatusCodes.INTERNAL_SERVER_ERROR, true);
    }
  }
}
