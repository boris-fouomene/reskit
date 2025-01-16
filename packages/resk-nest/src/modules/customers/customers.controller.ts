import { Controller } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ResourceController } from '../resource';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomersController extends ResourceController<Customer, CustomersService> {
  constructor(resourceService: CustomersService) {
    super(resourceService);
  }
}
