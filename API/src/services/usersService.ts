import { APIError } from '../errors/APIError.js';
import { StatusCodes } from 'http-status-codes';
import UserProfile from '../models/UserProfile.js';
import UserRepository from '../repositories/userRepository.js';

export default class UsersService {
  constructor(
    private readonly currentUserId: number,
    private readonly usersRepository: UserRepository = new UserRepository(currentUserId),
  ) {}

  async getUsers(): Promise<UserProfile[]> {
    return await this.usersRepository.findAll();
  }

  async getUserById(userId: number): Promise<UserProfile> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new APIError(`User with id ${userId} not found`, StatusCodes.NOT_FOUND, true);
    }
    return user;
  }

  async getFollowers(userId: number): Promise<UserProfile[]> {
    return await this.usersRepository.findAllFollowers(userId);
  }

  async getFollowings(userId: number): Promise<UserProfile[]> {
    return await this.usersRepository.findAllFollowings(userId);
  }
}
