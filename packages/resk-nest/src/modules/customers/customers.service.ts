import { Injectable } from '@nestjs/common';
import { InjectDataService, ResourceDataService } from '../data-source';
import { Customer } from './entities/customer.entity';
import { ResourceService } from '../resource';

@Injectable()
export class CustomersService extends ResourceService<Customer, "string"> {
  constructor(@InjectDataService(Customer) protected dataService: ResourceDataService<Customer, "string">) {
    super(dataService);
  }
}
