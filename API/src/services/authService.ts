import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/userRepository.js';
import config from '../config/index.js';
import { APIError } from '../errors/APIError.js';
import { StatusCodes } from 'http-status-codes';
import LoginRequest from '../requests/auth/loginRequest.js';
import RegistrationRequest from '../requests/auth/registrationRequest.js';
import logger from '../config/logger.js';
import ChangePasswordRequest from '../requests/auth/changePasswordRequest.js';
import intoStream from 'into-stream';
import FilesRepository from '../repositories/filesRepository.js';

export type UserClaims = {
  id: number;
  email: string;
  username: string;
  type: 'user' | 'admin' | 'deleted';
};

export default class AuthService {
  constructor(
    private readonly currentUser?: UserClaims,
    private readonly userRepository: UserRepository = new UserRepository(currentUser?.id ?? 0),
    private readonly filesRepository: FilesRepository = new FilesRepository(),
  ) {}

  async login(request: LoginRequest): Promise<{ token: string }> {
    const { email, password } = request;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new APIError('User not found', StatusCodes.BAD_REQUEST, true);
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

      let photoUrl: string | null = null;
      if (request.photo) {
        photoUrl = await this.filesRepository.upload(
          `user-${createdUser.id}/${request.photo.name}`,
          request.photo.type,
          intoStream(request.photo.data),
        );
        await this.userRepository.addAvatar(createdUser.id, photoUrl);
      }

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

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    const { oldPassword, newPassword } = request;

    if (oldPassword === newPassword) {
      throw new APIError('New password must be different from old password', StatusCodes.BAD_REQUEST, true);
    }

    const user = await this.userRepository.findByEmail(this.currentUser?.email ?? '');
    if (!user) {
      throw new APIError('User not found', StatusCodes.BAD_REQUEST, true);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new APIError('Invalid password', StatusCodes.UNAUTHORIZED, true);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userRepository.updatePassword(user.id, hashedPassword);
  }
}
