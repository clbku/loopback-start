import {model, property} from '@loopback/repository';

@model()
export class UserRegisterRequest {
  @property({
    description: 'User name',
    type: 'string',
    jsonSchema: {
      maxLength: 30,
      minLength: 2,
    },
  })
  firstName: string;
  @property({
    description: 'User name',
    type: 'string',
    jsonSchema: {
      maxLength: 30,
      minLength: 2,
    },
  })
  lastName: string;
  @property({
    type: 'string',
    jsonSchema: {
      format: 'email',
      minLength: 5,
      maxLength: 320,
      transform: ['toLowerCase'],
    },
  })
  email: string;
  @property({
    type: 'string',
    jsonSchema: {
      minLength: 8,
      maxLength: 64,
    },
  })
  password: string;
}

@model()
export class UserLoginRequest {
  @property({
    type: 'string',
    jsonSchema: {
      format: 'email',
      minLength: 5,
      maxLength: 320,
      transform: ['toLowerCase'],
    },
  })
  email: string;
  @property({
    type: 'string',
    jsonSchema: {
      minLength: 8,
      maxLength: 64,
    },
  })
  password: string;
}
