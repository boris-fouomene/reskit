import { TypeOrmModule } from "../../typeorm";
import { User } from "./users/entities/user.entity";

export const DatabaseModule = TypeOrmModule.forRoot({
    name: "database",
    type: "mysql",
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'admin123',
    database: 'xpose-ftc',
    entities: [User]
});