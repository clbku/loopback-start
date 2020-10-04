import jwt from 'jsonwebtoken';
import {promisify} from 'util';
import {PostgresDataSource} from '../datasources';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {ErrorCode} from '../types';

require('dotenv').config();

const signAsync: any = promisify(jwt.sign);
const verifyAsync: any = promisify(jwt.verify);

export class JwtAuthenticationService {
  private jwt_secret: string = process.env.JWT_SECRET || 'abc';

  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository(new PostgresDataSource());
  }

  genAccessToken = async (user: User): Promise<string> => {
    if (!user) {
      const error = new Error('Error generating token : user is null');
      Object.assign(error, {
        code: ErrorCode.ERROR_GENERATING_TOKEN,
        statusCode: 401,
      });
      throw error;
    }

    user.password = undefined;
    let token: string = '';
    try {
      token = (await signAsync(
        JSON.parse(
          JSON.stringify({
            id: user.id,
            email: user.email,
          }),
        ),
        this.jwt_secret,
        {expiresIn: '1h'},
      )) as string;
      return token;
    } catch (e) {
      const error = new Error(`Error encoding token: ${e.message}`);
      Object.assign(error, {
        code: ErrorCode.ERROR_ENCODING_TOKEN,
        statusCode: 401,
      });
      throw error;
    }
  };

  async verifyAccessToken(token: string): Promise<any> {
    if (!token) {
      const error = new Error(`Error verifying token : 'token' is null`);
      Object.assign(error, {
        code: ErrorCode.ERROR_VERIFYING_TOKEN,
        statusCode: 401,
      });
      throw error;
    }
    try {
      const payload: {
        id: number;
        email: string;
      } = await verifyAsync(token, this.jwt_secret);

      const user = await this.userRepository.findOne({
        where: {
          id: payload.id,
          email: payload.email,
        },
      });

      return user;
    } catch (e) {
      console.log(e);
      const error = new Error(`Error verifying token : ${e.message}`);
      Object.assign(error, {
        code: ErrorCode.ERROR_VERIFYING_TOKEN,
        statusCode: 401,
      });
      throw error;
    }
  }
}
