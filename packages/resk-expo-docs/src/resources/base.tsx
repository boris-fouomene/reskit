import { IResourceDataService, IResourcePrimaryKey, Resource as ResourceBaseCore } from "@resk/core";

export class Resource extends ResourceBaseCore {
    getDataService(): IResourceDataService<any, IResourcePrimaryKey> {
        throw "Method getDataService not implemented.";
    }
}