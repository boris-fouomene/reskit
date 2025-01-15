import { IResourcePrimaryKey } from "@resk/core";


export class ResourceDto<PrimaryKeyType extends IResourcePrimaryKey = any> {
  id?: PrimaryKeyType;
}
