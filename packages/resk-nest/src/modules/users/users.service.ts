import { Get, Injectable } from '@nestjs/common';
import { ResourceService } from '../resource';
import { User } from './entities/user.entity';
import { InjectDataService, ResourceDataService } from '../data-source';
import { Repository } from 'typeorm';
import { Resource } from '@resk/core';
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
export class UsersService extends ResourceService<User, string, Repository<User>> {
  constructor(
    @InjectDataService(User)
    dataService: ResourceDataService<User, string>
  ) {
    super(dataService);
  }
  @Get('me')
  getMe() {
    return "me";
  }
}
