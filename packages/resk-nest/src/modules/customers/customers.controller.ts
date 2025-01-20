import { Controller } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ResourceController } from '../resource';
import { Customer } from './entities/customer.entity';
import { IClassConstructor } from '@resk/core';

@Controller('customers')
export class CustomersController extends ResourceController<Customer, CustomersService> {
  getCreateDtoClass(): IClassConstructor<Partial<Customer>> {
    return Customer;
  }
  getUpdateDtoClass(): IClassConstructor<Partial<Customer>> {
    return Customer;
  }

  constructor(resourceService: CustomersService) {
    super(resourceService);
  }
}
