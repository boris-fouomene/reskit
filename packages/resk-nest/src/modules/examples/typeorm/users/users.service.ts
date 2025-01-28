import { Get, Inject, Injectable } from '@nestjs/common';
import { TypeOrmResourceService } from 'src/modules/typeorm';
import { User } from './entities/user.entity';
import { Resource } from '@resk/core';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../database.module';
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
export class UsersService extends TypeOrmResourceService<User, string> {
  constructor(@Inject(DatabaseModule.name) protected dataSource: DataSource) {
    super(dataSource, User);
  }
  @Get('me')
  getMe() {
    return "me";
  }
}
