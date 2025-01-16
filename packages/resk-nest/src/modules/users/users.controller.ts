import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResourceController } from '../resource';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController extends ResourceController<User, UsersService> {
  constructor(protected readonly resourceService: UsersService) {
    super(resourceService);
  }
}
