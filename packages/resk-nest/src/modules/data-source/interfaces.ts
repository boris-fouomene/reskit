import { IResourceName, IResourceDataProvider as RescoreDataProvider, IResourcePrimaryKey } from "@resk/core";

export interface IResourceDataProvider<DataType extends object = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends RescoreDataProvider<DataType, PrimaryKeyType> {

}

export interface IResourceDataSource {
    getDataProvider<DataType extends object = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey>(resourceName: IResourceName): IResourceDataProvider<DataType, PrimaryKeyType>;
    initialize(): Promise<void>;
}