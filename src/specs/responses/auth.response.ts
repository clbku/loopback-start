import {model, property} from '@loopback/repository';
import {User} from '../../models';

@model()
export class UserRegisterResponse {
  @property()
  user: User;

  @property()
  token: string;
}

export class UserLoginResponse extends UserRegisterResponse {}
