import { IResourceData, IResourceDataService, IResourcePrimaryKey } from "@resk/core";
import { MongooseDataService } from "./mongoose.data.service";
import { ObjectId, Schema, Connection, ClientSession } from "mongoose";
import { ResourceService } from "../resource";

/**
 * A resource service class that uses Mongoose for data access.
 * Provides a data service instance and a constructor that initializes the data service.
 *
 * @template DataType The type of resource data.
 * @template PrimaryKeyType The type of primary key for the resource.
 */
export class MongooseResourceService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = ObjectId> extends ResourceService<DataType, PrimaryKeyType> {
    /**
     * The data service instance used by this resource service.
     */
    readonly dataService: MongooseDataService<DataType, PrimaryKeyType>;

    /**
     * Returns the data service instance used by this resource service.
     *
     * @returns The data service instance.
     */
    getDataService(): MongooseDataService<DataType, IResourcePrimaryKey> {
        return this.dataService;
    }

    /**
     * Constructor for the MongooseResourceService class.
     * Initializes the data service instance with the provided connection, schema name, and schema.
     *
     * @param connection The Mongoose connection instance.
     * @param schemaName The name of the schema.
     * @param schema The Mongoose schema instance.
     */
    constructor(protected readonly connection: Connection, protected readonly schemaName: string, protected readonly schema: Schema) {
        super();
        this.dataService = new MongooseDataService(connection, schemaName, schema);
    }

    async executeInTransaction<ReturnType>(callback: (session: ClientSession) => Promise<ReturnType>): Promise<ReturnType> {
        return await this.getDataService().executeInTransaction(callback);
    }
}