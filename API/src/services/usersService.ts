import { APIError } from '../errors/APIError.js';
import { StatusCodes } from 'http-status-codes';
import UserProfileModel from '../models/UserProfileModel.js';
import UserRepository from '../repositories/userRepository.js';

export default class UsersService {
  constructor(
    private readonly currentUserId: number,
    private readonly usersRepository: UserRepository = new UserRepository(currentUserId),
  ) {}

  async getUserById(userId: number): Promise<UserProfileModel> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new APIError(`User with id ${userId} not found`, StatusCodes.NOT_FOUND, true);
    }
    return user;
  }
}
