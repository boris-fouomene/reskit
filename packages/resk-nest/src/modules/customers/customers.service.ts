import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository, ResourceRepository } from '../data-source';
import { Customer } from './entities/customer.entity';
import { ResourceService } from '../resource';

@Injectable()
export class CustomersService extends ResourceService<Customer> {
  constructor(@InjectRepository(Customer) protected resourceRepository: ResourceRepository<Customer>) {
    super(resourceRepository);
  }
}
