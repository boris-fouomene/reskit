import { Inject } from "@nestjs/common";
import { User } from "src/examples/typeorm/users/entities/user.entity";
import { TypeOrmResourceService } from "../../modules/typeorm/typeorm.service";
import { DataSource } from "typeorm";
import { DatabaseModule } from "../typeorm/database.module";

export class ProtectedService extends TypeOrmResourceService<User, number> {
    constructor(@Inject(DatabaseModule.name) protected dataSource: DataSource) {
        super(dataSource, User);
    }
}