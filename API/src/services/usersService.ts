import { APIError } from '../errors/APIError.js';
import { StatusCodes } from 'http-status-codes';
import UserProfile from '../models/UserProfile.js';
import UserRepository from '../repositories/userRepository.js';
import UpdateUserRequest from '../requests/user/updateUserRequest.js';
import FilesRepository from '../repositories/filesRepository.js';
import intoStream from 'into-stream';

export default class UsersService {
  constructor(
    private readonly currentUserId: number,
    private readonly usersRepository: UserRepository = new UserRepository(currentUserId),
    private readonly filesRepository: FilesRepository = new FilesRepository(),
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

  async updateUser(data: UpdateUserRequest): Promise<UserProfile> {
    let avatarUrl = (await this.usersRepository.findById(this.currentUserId))?.avatar_url ?? null;
    if (data.photo) {
      avatarUrl = await this.filesRepository.upload(
        `user-${this.currentUserId}/${data.photo.name}`,
        data.photo.type,
        intoStream(data.photo.data),
      );
    }
    return await this.usersRepository.updateUser({
      id: this.currentUserId,
      username: '',
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dateOfBirth,
      avatar_url: avatarUrl,
    });
  }

  async getFollowers(userId: number): Promise<UserProfile[]> {
    return await this.usersRepository.findAllFollowers(userId);
  }

  async getFollowings(userId: number): Promise<UserProfile[]> {
    return await this.usersRepository.findAllFollowings(userId);
  }

  async follow(userId: number) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new APIError(`User with id ${userId} not found`, StatusCodes.BAD_REQUEST, true);
    }

    if (this.currentUserId == userId) {
      throw new APIError(`User can't follow himself`, StatusCodes.FORBIDDEN, true);
    }

    // if current user already follows user
    if (await this.usersRepository.alreadyFollows(userId)) {
      return await this.usersRepository.unfollow(userId);
    } else {
      return await this.usersRepository.follow(userId);
    }
  }
}
