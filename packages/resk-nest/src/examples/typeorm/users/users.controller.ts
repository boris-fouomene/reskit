import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResourceController, ValidatorPipe } from '@resource';
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController extends ResourceController<User, UsersService> {
  @Post()
  //@UsePipes(new ValidatorPipe(CreateUserDto))
  //@UseValidatorPipe(CreateUserDto)
  create(@Body(new ValidatorPipe(CreateUserDto)) createUserDto: Partial<User>): Promise<User> {
    return super.create(createUserDto);
  }
  constructor(protected readonly resourceService: UsersService) {
    super(resourceService);
  }
  @Get('me')
  getMe() {
    return this.resourceService.getMe();
  }
}

declare module "@resk/core" {
  interface IResourcesMap {
    users: UsersController;
  }
}
