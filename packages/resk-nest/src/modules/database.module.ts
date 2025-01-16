import { Global, Module } from "@nestjs/common";
import { DataSourceManager } from "./data-source";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";

@Global()
@Module({
    imports: [
        DataSourceManager.forRoot<TypeOrmModuleOptions>("typeorm", {
            type: "mysql",
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'admin123',
            database: 'xpose-ftc',
        })
    ],
})
export class DatabaseModule { }