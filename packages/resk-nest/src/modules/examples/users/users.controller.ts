import { Controller, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResourceController } from '../../resource';
import { User } from './entities/user.entity';
import { IClassConstructor } from '@resk/core';

@Controller('users')
export class UsersController extends ResourceController<User, UsersService> {
  getCreateDtoClass(): IClassConstructor<Partial<User>> {
    return User;
  }
  getUpdateDtoClass(): IClassConstructor<Partial<User>> {
    return User;
  }
  constructor(protected readonly resourceService: UsersService) {
    super(resourceService);
  }
}

declare module "@resk/core" {
  interface IResourcesMap {
    users: UsersController;
  }
}
