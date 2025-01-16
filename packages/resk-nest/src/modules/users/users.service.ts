import { Injectable } from '@nestjs/common';
import { ResourceService } from '../resource';
import { User } from './entities/user.entity';
import { InjectRepository, ResourceRepository } from '../data-source';

@Injectable()
export class UsersService extends ResourceService<User> {
  constructor(
    @InjectRepository(User)
    resourceRepository: ResourceRepository<User>
  ) {
    super(resourceRepository);
  }
}
