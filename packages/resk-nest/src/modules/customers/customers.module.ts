import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { DataSourceManager } from '../data-source';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [
    CustomersController
  ],
  imports: [
    TypeOrmModule.forFeature([Customer]),
  ],
  providers: [
    ...DataSourceManager.get().createProviders(Customer),
    CustomersService],
})
export class CustomersModule { }
