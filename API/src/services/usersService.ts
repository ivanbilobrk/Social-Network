import UserProfileModel from '../models/UserProfileModel.js';
import UserRepository from '../repositories/userRepository.js';

export default class UsersService {
  constructor(
    private readonly currentUserId: number,
    private readonly usersRepository: UserRepository = new UserRepository(currentUserId),
  ) {}

  async getUserById(userId: number): Promise<UserProfileModel[] | null> {
    return await this.usersRepository.findById(userId);
  }
}
