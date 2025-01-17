import { Injectable } from '@nestjs/common';
import { ResourceService } from '../resource';
import { User } from './entities/user.entity';
import { InjectDataService, ResourceDataService } from '../data-source';

@Injectable()
export class UsersService extends ResourceService<User, string> {
  constructor(
    @InjectDataService(User)
    dataService: ResourceDataService<User, string>
  ) {
    super(dataService);
  }
}
