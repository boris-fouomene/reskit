import { Controller, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { MainExceptionFilter, ResourceController } from '../resource';
import { User } from './entities/user.entity';

@Controller('users')
@UseFilters(MainExceptionFilter)
export class UsersController extends ResourceController<User, UsersService> {
  constructor(protected readonly resourceService: UsersService) {
    super(resourceService);
  }
}

declare module "@resk/core" {
  interface IResourcesMap {
    users: UsersController;
  }
}
