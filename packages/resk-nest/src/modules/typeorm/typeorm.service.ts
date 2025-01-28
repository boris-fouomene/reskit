import { IClassConstructor, IResourceData, IResourceDataService, IResourcePrimaryKey } from "@resk/core";
import { ResourceService } from "../resource";
import { TypeOrmDataService } from "./typeorm.data.service";
import { DataSource } from "typeorm";

export class TypeOrmResourceService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends ResourceService<DataType, PrimaryKeyType> {
    readonly dataService: TypeOrmDataService<DataType, PrimaryKeyType>;
    getDataService(): IResourceDataService<DataType, IResourcePrimaryKey> {
        return this.dataService;
    }
    constructor(protected readonly dataSource: DataSource, protected readonly entity: IClassConstructor<DataType>) {
        super();
        this.dataService = new TypeOrmDataService(dataSource, this.entity);
    }
}