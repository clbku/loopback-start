import {
  AuthenticationBindings,
  AuthenticationMetadata,
} from '@loopback/authentication';
import {inject, Provider, ValueOrPromise} from '@loopback/context';
import {AuthenticationBindings as CustomAuthenticationBindings} from '../keys';
import {JWTStrategy} from '../strategies/JWT.strategy';

export class JWTStrategyProvider implements Provider<JWTStrategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],

    @inject(CustomAuthenticationBindings.JWT_STRATEGY)
    private jwt_strategy: JWTStrategy,
  ) {}

  value(): ValueOrPromise<JWTStrategy | undefined> {
    if (!this.metadata) {
      return undefined;
    }

    let name = undefined;
    for (const data of this.metadata) {
      if (data.strategy) {
        name = data.strategy;
      }
    }
    if (name === this.jwt_strategy.name) {
      return this.jwt_strategy;
    } else {
      return Promise.reject(`The strategy ${name} is not available`);
    }
  }
}
