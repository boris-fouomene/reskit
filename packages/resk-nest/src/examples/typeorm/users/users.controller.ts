import { Body, Controller, ExecutionContext, Get, Injectable, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResourceController, ValidatorPipe } from '@resource';
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceInterceptor } from '@resource/interceptors';

@Injectable()
class UsersInterceptor extends ResourceInterceptor<UsersController> {
  async afterGetMany(result: User[], context: ExecutionContext) {
    console.log("afterGetMany ", result);
    return result;
  }
  beforeGetMany(context: ExecutionContext): void {
    console.log("beforeGetMany ", this.getRequest().params);
  }
}
@Controller('users')
@UseInterceptors(UsersInterceptor)
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
  /***
   * Example of intercepted request
   */
  getMany(): Promise<User[]> {
    return super.getMany();
  }
}

declare module "@resk/core" {
  interface IResourcesMap {
    users: UsersController;
  }
}
