import {BindingKey} from '@loopback/context';
import {JwtAuthenticationService} from './services';
import {JWTStrategy} from './strategies/JWT.strategy';

export namespace AuthenticationBindings {
  export const JWT_STRATEGY = BindingKey.create<JWTStrategy>(
    'authentication.strategies.jwt.strategy',
  );
  export const JWT_SERVICE = BindingKey.create<JwtAuthenticationService>(
    'services.authentication.jwt.service',
  );
}
