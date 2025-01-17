import { Global, Module } from "@nestjs/common";
import { DataServiceManager } from "./data-source";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";
import { CustomersModule } from './customers/customers.module';

@Global()
@Module({
    imports: [
        DataServiceManager.forRoot<TypeOrmModuleOptions>("typeorm", {
            type: "mysql",
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'admin123',
            database: 'xpose-ftc',
        }),
        CustomersModule
    ],
})
export class DatabaseModule { }