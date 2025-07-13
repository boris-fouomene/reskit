import { IResourceData, IResourceDataService, IResourcePrimaryKey } from "@resk/core/resources";
import { ResourceService } from "../resource";
import { TypeOrmDataService } from "./typeorm.data.service";
import { DataSource, QueryRunner } from "typeorm";
import { IClassConstructor } from "@resk/core/types";

export class TypeOrmResourceService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends ResourceService<DataType, PrimaryKeyType> {
    readonly dataService: TypeOrmDataService<DataType, PrimaryKeyType>;
    getDataService(): TypeOrmDataService<DataType, IResourcePrimaryKey> {
        return this.dataService;
    }
    constructor(protected readonly dataSource: DataSource, protected readonly entity: IClassConstructor<DataType>) {
        super();
        this.dataService = new TypeOrmDataService(dataSource, this.entity);
    }
    async executeInTransaction<ReturnType>(callback: (queryRunner: QueryRunner) => Promise<ReturnType>): Promise<ReturnType> {
        return await this.getDataService().executeInTransaction(callback);
    }
}