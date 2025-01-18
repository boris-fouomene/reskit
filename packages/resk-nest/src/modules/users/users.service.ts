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
