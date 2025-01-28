import { Get, Inject, Injectable } from '@nestjs/common';
import { TypeOrmService } from '../../resource';
import { User } from './entities/user.entity';
import { Resource } from '@resk/core';
import { DataSource, Repository } from 'typeorm';
@Injectable()
@Resource({
  name: 'users',
  label: 'Users',
  controllerName: 'UsersController',
  apiDescription: {
    getOne: {
      summary: 'Get a user by id',
      description: 'Get a user by id',
      tags: ['Users'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The id of the user to get',
          schema: {
            type: 'string',
          },
        },
      ],
    },
    create: {
      summary: 'Create a user',
      description: 'Create a user',
      tags: ['Users'],
      requestBody: {
        description: 'The user to create',
        content: {
          'application/json': {
          },
        }
      },
    }
  }
})
export class UsersService extends TypeOrmService<User, string> {
  constructor(@Inject("database") protected dataSource: DataSource) {
    super(dataSource, User);
  }
  @Get('me')
  getMe() {
    return "me";
  }
}
