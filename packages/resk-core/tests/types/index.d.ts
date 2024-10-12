import { IFieldBase } from "@types";

declare module "../../src/types" {
    type IResourcesNamesExtends = "users" | "resource2" | "resource3";
    interface IFieldMapExtends {
        select : IFieldBase<"select"> & {
            items : string[]
        };
    }
}