import { ObjectId } from "typeorm";
import { CatDto } from "./cats.dto";
import { MongooseResourceService } from "@resk/nest";
import { CatSchema } from "./cats.schema";
import { Connection } from "mongoose";
import { Inject } from "@nestjs/common";

export class CatsService extends MongooseResourceService<CatDto, ObjectId> {
    constructor(@Inject("connection") connection: Connection) {
        super(connection, "Cat", CatSchema)
    }
}