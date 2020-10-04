import {OperationObject} from '@loopback/rest';
import {UserLoginResponse, UserRegisterResponse} from './responses';

export const PostRegisterSpec: OperationObject = {
  responses: {
    '201': {
      description: 'User created',
      content: {
        'application/json': {
          schema: {
            'x-ts-type': UserRegisterResponse,
          },
        },
      },
    },
  },
};

export const PostLoginSpec: OperationObject = {
  responses: {
    '201': {
      description: 'User created',
      content: {
        'application/json': {
          schema: {
            'x-ts-type': UserLoginResponse,
          },
        },
      },
    },
  },
};
