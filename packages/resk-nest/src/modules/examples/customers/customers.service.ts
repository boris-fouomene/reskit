import { Injectable } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { TypeOrmService } from 'src/modules/resource';

@Injectable()
export class CustomersService extends TypeOrmService<Customer, string> {

}
