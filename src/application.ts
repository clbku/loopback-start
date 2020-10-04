import {
  AuthenticateActionProvider,
  AuthenticationBindings,
  AuthenticationComponent,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {ReferenceObject, SecuritySchemeObject} from '@loopback/openapi-v3';
import {RepositoryMixin} from '@loopback/repository';
import {OpenApiSpec, RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {AuthenticationBindings as CustomAuthenticationBindings} from './keys';
import {JWTStrategyProvider} from './providers';
import {MySequence} from './sequence';
import {JwtAuthenticationService} from './services';
import {JWTStrategy} from './strategies';

export {ApplicationConfig};

export class LoopbackStarterKitApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.openAPISetting();

    // Set up the custom sequence
    this.sequence(MySequence);
    this.basePath('/api');

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.binding();

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  openAPISetting = () => {
    type SecuritySchemeObjects = {
      [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
    };
    const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    };
    const SECURITY_SPEC = [{bearerAuth: []}];
    const spec: OpenApiSpec = {
      openapi: '3.0.0',
      info: {title: 'pkg.name', version: 'pkg.version'},
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      servers: [{url: '/api'}],
      security: SECURITY_SPEC,
    };
    this.api(spec);
  };

  binding = () => {
    this.bind(AuthenticationBindings.STRATEGY).toProvider(JWTStrategyProvider);
    this.bind(AuthenticationBindings.AUTH_ACTION).toProvider(
      AuthenticateActionProvider,
    );
    this.bind(CustomAuthenticationBindings.JWT_STRATEGY).toClass(JWTStrategy);
    this.bind(CustomAuthenticationBindings.JWT_SERVICE).toClass(
      JwtAuthenticationService,
    );
  };
}
