import { IResourcePrimaryKey } from "@resk/core";


/**
 * Data Transfer Object (DTO) for a resource.
 *
 * This class represents the structure of a resource DTO, which includes an optional
 * identifier (ID) of the resource. It can be extended to include additional properties
 * specific to the resource.
 *
 * @template PrimaryKeyType - The type of the primary key for the resource. Defaults to `IResourcePrimaryKey`.
 *
 * @example
 * // Example of extending the ResourceDto for a specific resource
 * import { ResourceDto } from './resource.dto';
 *
 * export class UserDto extends ResourceDto<number> {
 *     username?: string;
 *     email?: string;
 * }
 */
export class ResourceDto<PrimaryKeyType extends IResourcePrimaryKey = any> {
  id?: PrimaryKeyType;
}
