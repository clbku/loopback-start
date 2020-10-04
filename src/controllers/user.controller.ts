import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {get} from '@loopback/rest';
import {User} from '../models';
// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

export class UserController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER) private user: User,
  ) {}

  @authenticate('jwt')
  @get('/me')
  async get(): Promise<User> {
    return this.user;
  }
}
