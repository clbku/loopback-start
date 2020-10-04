import {Entity, model, property} from '@loopback/repository';
import {securityId} from '@loopback/security';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'user',
    },
  },
})
export class User extends Entity {
  [securityId]: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'first_name',
    },
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'last_name',
    },
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: false,
  })
  password?: string;

  @property({
    type: 'date',
    default: '$now',
    postgresql: {
      columnName: 'created_at',
    },
  })
  createdAt?: string;

  @property({
    type: 'date',
    default: '$now',
    postgresql: {
      columnName: 'updated_at',
    },
  })
  updatedAt?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
