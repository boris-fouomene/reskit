import { Body, Controller, ExecutionContext, Get, HttpException, HttpStatus, Injectable, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ParseRequest, ResourceController, ValidatorPipe } from '@resource';
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceInterceptor } from '@resource/interceptors';
import { IResourcePaginatedResult, IResourceQueryOptions } from '@resk/core';

@Injectable()
class UsersInterceptor extends ResourceInterceptor<UsersController> {
  async afterGetMany(result: User[] | IResourcePaginatedResult<User>, context: ExecutionContext) {
    if (Array.isArray(result)) {
      return {
        data: result,
        success: true,
      }
    }
    return result;
  }
  async beforeGetMany(context: ExecutionContext) {
    console.log("beforeGetMany ", this.getRequest().params);
  }
}
@Controller('users')
@UseInterceptors(UsersInterceptor)
export class UsersController extends ResourceController<User, UsersService> {
  @Post()
  //@UsePipes(new ValidatorPipe(CreateUserDto))
  //@UseValidatorParam(CreateUserDto)
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
  @Get()
  getMany(@ParseRequest("queryOptions") queryOptions: IResourceQueryOptions<User>): Promise<User[]> {
    return super.getMany(queryOptions);
  }
}

declare module "@resk/core" {
  interface IResourcesMap {
    users: UsersController;
  }
}
