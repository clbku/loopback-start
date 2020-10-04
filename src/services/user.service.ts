import {repository} from '@loopback/repository';
import bcrypt from 'bcryptjs';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {ErrorCode} from '../types';

export class UserService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async create(user: User): Promise<User> {
    const savedUser = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (!savedUser) {
      return this.userRepository.create(user);
    }
    const e = new Error(`User whose email ${user.email} already exists`);
    Object.assign(e, {
      code: ErrorCode.USER_EXISTED,
      status: 400,
    });
    throw e;
  }

  async find(email: string, password: string): Promise<User> {
    const savedUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!savedUser) {
      const e = new Error(`Cannot found user with email ${email}`);
      Object.assign(e, {
        code: ErrorCode.USER_EXISTED,
        status: 401,
      });
      throw e;
    }
    if (bcrypt.compareSync(password, savedUser.password || '')) {
      return savedUser;
    } else {
      const e = new Error(
        `Account information is incorrect. Please check again.`,
      );
      Object.assign(e, {
        code: ErrorCode.USER_EXISTED,
        status: 401,
      });
      throw e;
    }
  }
}
