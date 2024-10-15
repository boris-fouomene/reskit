import { IFieldBase } from "@resk/core";

declare module "@resk/core" {
    interface IResourcesNamesMap {
        users?:string;
    }
    interface IFieldMap {
        select : IFieldBase<"select"> & {
            items : string[]
        }
    }
}