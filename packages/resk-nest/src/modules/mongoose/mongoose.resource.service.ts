import { IResourceData, IResourceDataService, IResourcePrimaryKey } from "@resk/core";
import { MongooseDataService } from "./mongoose.data.service";
import { ObjectId, Schema, Connection } from "mongoose";
import { ResourceService } from "../resource";

export class MongooseResourceService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = ObjectId> extends ResourceService<DataType, PrimaryKeyType> {
    readonly dataService: MongooseDataService<DataType, PrimaryKeyType>;
    getDataService(): IResourceDataService<DataType, IResourcePrimaryKey> {
        return this.dataService;
    }
    constructor(protected readonly connection: Connection, protected readonly schemaName: string, protected readonly schema: Schema) {
        super();
        this.dataService = new MongooseDataService(connection, schemaName, schema);
    }
}