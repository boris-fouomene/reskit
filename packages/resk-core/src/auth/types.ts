import { IDict, IResourceName, IResourceActionName } from "../types";
/**
 * @interface IAuthUser
 * Represents an authenticated user in the application.
 * 
 * The `IAuthUser ` interface defines the structure for an authenticated 
 * user object, which includes an identifier, an optional timestamp 
 * for when the authentication session was created, and an optional 
 * permissions map that specifies the actions the user can perform 
 * on various resources.
 * 
 * ### Properties
 * 
 * - `id` (string | number): A unique identifier for the user. This 
 *   can be either a string or a number, depending on the implementation.
 * 
 * - `authSessionCreatedAt` (number, optional): An optional property 
 *   that stores the timestamp (in milliseconds) of when the 
 *   authentication session was created. This can be useful for 
 *   tracking session duration or expiration.
 * 
 * - `perms` (IAuthPerms , optional): 
 *   An optional property that maps resource names to an array of 
 *   actions that the user is permitted to perform on those resources. 
 *   This allows for fine-grained control over user permissions within 
 *   the application.
 * 
 * ### Example Usage
 * 
 * Here is an example of how the `IAuthUser ` interface can be used:
 * 
 * ```typescript
 * const user: IAuthUser  = {
 *     id: "user123",
 *     authSessionCreatedAt: Date.now(),
 *     perms: {
 *         documents: ["read", "create", "update"],
 *         users: ["read", "delete"]
 *     }
 * };
 * 
 * // Function to check if a user has permission to perform an action
 * function hasPermission(user: IAuthUser , resource: IResourceName, action: IResourceActionName): boolean {
 *     return user.perms?.[resource]?.includes(action) ?? false;
 * }
 * 
 * // Example of checking permissions
 * const canReadDocuments = hasPermission(user, "documents", "read"); // true
 * const canDeleteUsers = hasPermission(user, "users", "delete"); // true
 * ```
 * 
 * In this example, the `IAuthUser ` interface is used to define a user 
 * object with an ID, session creation timestamp, and a permissions map. 
 * The `hasPermission` function checks if the user has the specified 
 * permission for a given resource, demonstrating how the `perms` 
 * property can be utilized in permission management.
 * @see {@link IResourceName} for the `IResourceName` type.
 * @see {@link IResourceActionName} for the `IResourceActionName` type.
 * @see {@link IAuthPerms} for the `IAuthPerms` type.
 */
export interface IAuthUser {
  id: string | number;
  authSessionCreatedAt?: number;
  perms?: IAuthPerms;
  /**
   * The authentication token associated with the user.
   */
  token?: string;
}

/**
* @interface IAuthSessionStorage
* Interface for managing authentication session storage.
* 
* The `IAuthSessionStorage` interface defines methods for storing and 
* retrieving session data associated with authenticated users. This 
* interface provides a structured way to manage session data, ensuring 
* that it can be easily accessed and manipulated.
* 
* ### Methods
* 
* - `get(key?: string): any`: Retrieves the value of the session 
*   associated with the specified key. If no key is provided, it 
*   returns the entire session value.
* 
*   @param {string} key - The key of the value to retrieve.
*   @returns {any} The value associated with the specified key, or 
*   undefined if the key does not exist.
* 
* - `set(key?: string | IDict, value?: any): any`: Persists a value 
*   in the session storage. This can either be a single key-value 
*   pair or an object containing multiple session data.
* 
*   @param {string | IDict} key - The key of the value to persist, or 
*   an object containing session data.
*   @param {any} value - The value to persist. This can be of any type.
* 
* - `getData(): IDict`: Retrieves all session data associated with 
*   the session name defined in the `sessionName` property.
* 
*   @returns {IDict} An object containing all session data.
* 
* - `getKey(): string`: Returns the key associated with the session 
*   name defined in the `sessionName` property.
* 
*   @returns {string} The session key.
* 
* ### Properties
* 
* - `sessionName` (string, optional): The name of the session used by 
*   the session manager. This can be used to identify the session 
*   context in which the storage operates.
*/
export interface IAuthSessionStorage {
  /**
   * Retrieves the value of the session associated with the specified key.
   * 
   * @param {string} key - The key of the value to retrieve.
   * @returns {any} The value associated with the specified key, or undefined if the key does not exist.
   */
  get: (key?: string) => any;

  /**
   * Persists a value in the session storage.
   * 
   * @param {string | IDict} key - The key of the value to persist, or an object containing session data.
   * @param {any} value - The value to persist. This can be of any type.
   * @returns {any} The result of the persistence operation.
   */
  set: (key?: string | IDict, value?: any) => any;

  /**
   * Retrieves all session data associated with the session name.
   * 
   * @returns {IDict} An object containing all session data.
   */
  getData: () => IDict;

  /**
   * Returns the key associated with the session name.
   * 
   * @returns {string} The session key.
   */
  getKey: () => string;

  /**
   * The name of the session used by the session manager.
   */
  sessionName?: string;
}


/**
 * @interface IAuthPerm
 * Represents the type associated with the `perm` property, used to evaluate 
 * whether a user has access to a resource.
 * 
 * The `IAuthPerm` type can take on different forms to define permissions 
 * for accessing resources in an application. This flexibility allows 
 * for both simple string-based permissions and more complex logic 
 * through functions.
 * 
 * ### Possible Values:
 * 
 * - **Template Literal String**: When `IAuthPerm` is a string, it must follow the format:
 *   ```
 *   [resource]:[action]
 *   ```
 *   where:
 *   - `resource` represents the name of the resource, defined by the 
 *     `IResourceName` type.
 *   - `action` represents the action that the user must have to gain 
 *     permission for the specified resource.
 * 
 *   The `action` can be defined in two ways:
 *   - A single action as a string (e.g., `"read"`).
 *   - Multiple actions separated by the `|` character (e.g., 
 *     `"read|update"`). In this case, permission is granted if 
 *     at least one of the specified actions is validated for the user. 
 *     For example, if either the `read` or `update` action is 
 *     validated for the user, permission will be granted for the 
 *     specified resource.
 * 
 * - **Function**: If `IAuthPerm` is a function, it must return a boolean 
 *   value that determines whether access to the resource should be 
 *   granted to the user. This allows for dynamic permission checks 
 *   based on custom logic.
 * 
 * - **False**: The value `false` indicates that no permission is 
 *   granted for the resource.
 * 
 * ### Example Usage:
 * 
 * Here are some examples of how the `IAuthPerm` type can be used:
 * 
 * ```typescript
 * // Example of a simple permission as a string
 * const readPermission: IAuthPerm = "documents:read";
 * 
 * // Example of multiple permissions
 * const editPermissions: IAuthPerm = "documents:update|delete";
 * 
 * // Example of a dynamic permission check using a function
 * const dynamicPermission: IAuthPerm = (user: IAuthUser) => {
 *     const userRole = getUserRole(user); // Assume this function retrieves the user's role
 *     return userRole === 'admin'; // Grant access if the user is an admin
 * };
 * 
 * // Example of no permission
 * const noPermission: IAuthPerm = false;
 * ```
 * 
 * In these examples, the `IAuthPerm` type is used to define various 
 * permissions for accessing resources, demonstrating its flexibility 
 * and utility in permission management.
 * @see {@link IResourceName} for the `IResourceName` type.
 */
export type IAuthPerm = IAuthPermStr | ((user: IAuthUser) => boolean) | false;


/**
 * @interface IAuthPerms
 * Represents a mapping of authentication permissions for resources.
 * 
 * The `IAuthPerms` type defines a structure that maps resource names 
 * to an array of actions that can be performed on those resources. 
 * This type is useful for managing user permissions in an application, 
 * allowing for fine-grained control over what actions users can take 
 * on various resources.
 * 
 * ### Structure
 * 
 * The `IAuthPerms` type is defined as a `Record` where:
 * - The keys are of type `IResourceName`, representing the names of 
 *   the resources (e.g., "documents", "users").
 * - The values are arrays of `IResourceActionName`, representing the 
 *   actions that can be performed on the corresponding resource (e.g., 
 *   ["read", "create", "update"]).
 * 
 * ### Example Usage
 * 
 * Here is an example of how the `IAuthPerms` type can be used:
 * 
 * ```typescript
 * // Example of defining user permissions using IAuthPerms
 * const userPermissions: IAuthPerms = {
 *     documents: ["read", "create", "update"],
 *     users: ["read", "delete"],
 *     posts: ["read", "create"]
 * };
 * 
 * // Function to check if a specific action is permitted on a resource
 * function isActionPermitted(perms: IAuthPerms, resource: IResourceName, action: IResourceActionName): boolean {
 *     return perms[resource]?.includes(action) ?? false;
 * }
 * 
 * // Example of checking permissions
 * const canUpdateDocuments = isActionPermitted(userPermissions, "documents", "update"); // true
 * const canDeleteUsers = isActionPermitted(userPermissions, "users", "delete"); // true
 * const canCreatePosts = isActionPermitted(userPermissions, "posts", "create"); // true
 * ```
 * 
 * In this example, the `IAuthPerms` type is used to define a permissions 
 * object for a user, mapping resources to the actions they are allowed 
 * to perform. The `isActionPermitted` function checks if a specific 
 * action is permitted on a given resource, demonstrating how the 
 * `IAuthPerms` type can be utilized in permission management.
 */
export type IAuthPerms = Record<IResourceName, IResourceActionName[]>;


/**
 * @interface IAuthPermStr
 * Represents the type for authentication permissions as a string.
 * 
 * The `IAuthPermStr` type is a template literal type that defines the 
 * structure of permission strings used in the authentication system. 
 * This type combines resource names with specific actions to create 
 * a comprehensive permission format.
 * 
 * ### Format
 * 
 * The `IAuthPermStr` type follows the format:
 * ```
 * [resource]:[action]
 * or [action], if the resource name will be inferred from the context.
 * ```
 * where:
 * - `resource` is defined by the `IResourceName` type, representing 
 *   the name of the resource for which permissions are being defined.
 * - `action` is defined by the `IAuthPermAction` type, which can be 
 *   a single action or a combination of actions that a user is allowed 
 *   to perform on the specified resource.
 * 
 * The `action` can include predefined string literals such as:
 * - `"read"`: Permission to read or view the resource.
 * - `"update"`: Permission to modify or update the resource.
 * - `"delete"`: Permission to remove or delete the resource.
 * - `"create"`: Permission to create a new instance of the resource.
 * - `"read|create|update"`: In this case, the permission is granted to user if one of the actions is validated.,
 * - Additionally, any other string can be used to represent custom 
 *   actions, providing flexibility for future extensions.
 * 
 * ### Example Usage
 * 
 * Here are some examples of how the `IAuthPermStr` type can be used:
 * 
 * ```typescript
 * // Example of a read permission for a document resource
 * const readDocumentPermission: IAuthPermStr = "documents:read";
 * 
 * // Example of an update permission for a user resource
 * const updateUser Permission: IAuthPermStr = "users:update";
 * 
 * // Example of a create permission for a post resource
 * const createPostPermission: IAuthPermStr = "posts:create";
 * 
 * // Example of a custom action permission
 * const customActionPermission: IAuthPermStr = "documents:archive";
 * ```
 * 
 * In these examples, the `IAuthPermStr` type is used to define various 
 * permissions for accessing resources, demonstrating its flexibility 
 * and utility in permission management.
 * 
 * @see {@link IResourceName} for the `IResourceName` type.
 * @see {@link IAuthPermAction} for the `IAuthPermAction` type.
 */
export type IAuthPermStr = `${IResourceName}:${IAuthPermAction}` | IAuthPermAction;


/**
 * Represents the type for authentication permission actions.
 * 
 * The `IAuthPermAction` type defines a structure for specifying 
 * authentication actions that can be associated with permissions. 
 * This type allows for flexibility in defining single or multiple 
 * actions that a user can perform on a resource, using a template 
 * literal format.
 * 
 * ### Structure
 * 
 * The `IAuthPermAction` type can take on several forms:
 * 
 * - **Single Action**: A single action represented by the 
 *   `${IResourceActionName}` template literal (e.g., `"read"`).
 * 
 * - **Multiple Actions**: A combination of actions separated by the 
 *   `|` character, allowing for up to six actions to be specified 
 *   together. For example:
 *   - Two actions: `${IResourceActionName}|${IResourceActionName}` (e.g., 
 *     `"read|update"`).
 *   - Three actions: `${IResourceActionName}|${IResourceActionName}|${IResourceActionName}` 
 *     (e.g., `"read|update|delete"`).
 *   - Four actions: `${IResourceActionName}|${IResourceActionName}|${IResourceActionName}|${IResourceActionName}` 
 *     (e.g., `"read|update|delete|create"`).
 *   - Five actions: `${IResourceActionName}|${IResourceActionName}|${IResourceActionName}|${IResourceActionName}|${IResourceActionName}` 
 *     (e.g., `"read|update|delete|create"`).
 *   - Six actions: `${IResourceActionName}|${IResourceActionName}|${IResourceActionName}|${IResourceActionName}|${IResourceActionName}|${IResourceActionName}` 
 *     (e.g., `"read|update|delete|create|archive"`).
 * 
 * This structure allows for a flexible definition of permissions, 
 * enabling developers to specify exactly which actions are allowed 
 * for a given resource.
 * 
 * ### Example Usage
 * 
 * Here are some examples of how the `IAuthPermAction` type can be used:
 * 
 * ```typescript
 * // Example of a single action
 * const singleAction: IAuthPermAction = "read";
 * 
 * // Example of two actions
 * const twoActions: IAuthPermAction = "read|update";
 * 
 * // Example of three actions
 * const threeActions: IAuthPermAction = "read|update|delete";
 * 
 * // Example of four actions
 * const fourActions: IAuthPermAction = "read|update|delete|create";
 * 
 * // Example of five actions
 * const fiveActions: IAuthPermAction = "read|update|delete|create";
 * 
 * // Example of six actions
 * const sixActions: IAuthPermAction = "read|update|delete|create|archive";
 * ```
 * 
 * In these examples, the `IAuthPermAction` type is used to define 
 * various combinations of actions, demonstrating its flexibility 
 * and utility in permission management.
 */
export type IAuthPermAction =
  | `${IResourceActionName}`
  | `${IResourceActionName}|${IResourceActionName}`
  | `${IResourceActionName}|${IResourceActionName}|${IResourceActionName}`
  | `${IResourceActionName}|${IResourceActionName}|${IResourceActionName}|${IResourceActionName}`
  | `${IResourceActionName}|${IResourceActionName}|${IResourceActionName}|${IResourceActionName}|${IResourceActionName}`;





/**
 * Interface representing a mapping of authentication-related events.
 * 
 * This interface defines the various events that can occur during the 
 * authentication process, allowing for event-driven handling of user 
 * authentication actions.
 * 
 * @example
 * // Example of using IAuthEventMap
 * const authEvents: IAuthEventMap = {
 *     SIGN_IN: 'User  has signed in.',
 *     SIGN_OUT: 'User  has signed out.',
 *     SIGN_UP: 'User  has signed up.'
 * };
 * 
 * // Triggering an event
 * function triggerAuthEvent(event: IAuthEvent) {
 *     console.log(authEvents[event]); // Outputs the corresponding event message
 * }
 * 
 * triggerAuthEvent('SIGN_IN'); // Outputs: User has signed in.
 * @example 
 * // Example of augmenting IAuthEventMap with additional events
 * declare module "@resk/core" {
 *     interface IAuthEventMap {
 *         SOME_OTHER_EVENT: string;
 *     }
 * }
   const testAuthEvent : IAuthEvent = 'SOME_OTHER_EVENT';
 */
export interface IAuthEventMap {
  /**
   * Event triggered when a user signs in.
   * 
   * This event is emitted when a user successfully logs into the system.
   * It can be used to trigger actions such as updating the user interface
   * or logging the sign-in activity.
   * 
   * @example
   * // Example of handling the SIGN_IN event
   * eventEmitter.on('SIGN_IN', () => {
   *     console.log('User  signed in, updating UI...');
   * });
   */
  SIGN_IN: string;

  /**
   * Event triggered when a user signs out.
   * 
   * This event is emitted when a user successfully logs out of the system.
   * It can be used to trigger actions such as clearing user data or 
   * redirecting to the login page.
   * 
   * @example
   * // Example of handling the SIGN_OUT event
   * eventEmitter.on('SIGN_OUT', () => {
   *     console.log('User  signed out, redirecting to login...');
   * });
   */
  SIGN_OUT: string;

  /**
   * Event triggered when a user signs up.
   * 
   * This event is emitted when a new user successfully registers for an account.
   * It can be used to trigger actions such as sending a welcome email or 
   * redirecting the user to a confirmation page.
   * 
   * @example
   * // Example of handling the SIGN_UP event
   * eventEmitter.on('SIGN_UP', () => {
   *     console.log('New user signed up, sending welcome email...');
   * });
   */
  SIGN_UP: string;
}

/**
* Type representing the keys of the IAuthEventMap interface.
* 
* This type is a union of string literals corresponding to the event names
* defined in the IAuthEventMap interface. It allows for type-safe handling
* of authentication events throughout the application.
* 
* @example
* // Example of using IAuthEvent
* function handleAuthEvent(event: IAuthEvent) {
*     switch (event) {
*         case 'SIGN_IN':
*             console.log('Handling sign-in event...');
*             break;
*         case 'SIGN_OUT':
*             console.log('Handling sign-out event...');
*             break;
*         case 'SIGN_UP':
*             console.log('Handling sign-up event...');
*             break;
*     }
* }
*/
export type IAuthEvent = keyof IAuthEventMap;

