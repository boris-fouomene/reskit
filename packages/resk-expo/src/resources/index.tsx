import { isObj, ResourceBase as _ResourceBase } from "@resk/core";
import { IResourceActionButton } from "./types";

declare module "@resk/core" {
    interface ResourceInstance<DataType = any> {
        actions: Record<string, IResourceActionButton>;
        getActions(): Record<string, IResourceActionButton>;
        isAllowed(perm?: any, user?: any): boolean;
    }
}

export class ResourceBase<DataType = any> extends _ResourceBase<DataType> {

    isAllowed(perm?: any, user?: any): boolean {
        return true;
    }
}  