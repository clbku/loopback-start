import {Request} from '@loopback/rest';
import {User} from '../models';

export interface AuthenticationStrategy {
  authenticate(req: Request): Promise<User | undefined>;
}
