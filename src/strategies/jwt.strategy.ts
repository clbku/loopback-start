import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {AuthenticationBindings} from '../keys';
import {User} from '../models';
import {JwtAuthenticationService} from '../services';
import {ErrorCode} from '../types';
import {AuthenticationStrategy} from './authenticate.strategy';

export class JWTStrategy implements AuthenticationStrategy {
  constructor(
    @inject(AuthenticationBindings.JWT_SERVICE)
    public jwt_authentication_service: JwtAuthenticationService,
  ) {}

  public name: string = 'jwt';

  async authenticate(req: Request): Promise<User | undefined> {
    let token = req.headers['authorization'];
    if (!token) {
      throw new HttpErrors.Unauthorized('No access token found!');
    }
    if (token.startsWith('Bearer ') || token.startsWith('bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      const user = await this.jwt_authentication_service.verifyAccessToken(
        token,
      );
      if (!user) {
        const error = new Error(`Error verifying token : User not found`);
        Object.assign(error, {
          code: ErrorCode.ERROR_VERIFYING_TOKEN,
          statusCode: 401,
        });
        throw error;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
