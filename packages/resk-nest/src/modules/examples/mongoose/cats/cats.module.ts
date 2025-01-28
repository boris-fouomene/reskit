import { Module } from "@nestjs/common";
import { ConnectionModule } from "../connection";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
    imports: [ConnectionModule],
    providers: [CatsService],
    exports: [CatsService, ConnectionModule],
    controllers: [CatsController],
})
export class CatsModule { }