// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import bcrypt from 'bcryptjs';
import {User} from '../models';
import {JwtAuthenticationService, UserService} from '../services';
import {PostLoginSpec, PostRegisterSpec} from '../specs/auth.spec';
import {UserLoginRequest, UserRegisterRequest} from '../specs/requests';
import {UserLoginResponse, UserRegisterResponse} from '../specs/responses';
// import {inject} from '@loopback/core';

export class AuthController {
  constructor(
    @service(JwtAuthenticationService)
    public jwtService: JwtAuthenticationService,
    @service(UserService)
    public userService: UserService,
  ) {}

  @post('/register', PostRegisterSpec)
  async postUserRegister(
    @requestBody() body: UserRegisterRequest,
  ): Promise<UserRegisterResponse> {
    let user = new User();
    user.lastName = body.lastName;
    user.firstName = body.firstName;
    user.email = body.email;
    user.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10));

    try {
      user = await this.userService.create(user);
      return {
        user,
        token: await this.jwtService.genAccessToken(user),
      };
    } catch (e) {
      throw e;
    }
  }

  @post('/login', PostLoginSpec)
  async postUserLogin(
    @requestBody() body: UserLoginRequest,
  ): Promise<UserLoginResponse> {
    const user = await this.userService.find(body.email, body.password);
    return {
      user,
      token: await this.jwtService.genAccessToken(user),
    };
  }
}
