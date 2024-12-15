import { isNonNullString, isObj } from "../utils";
import { getSignedUser } from "./session";
import { IResourceActionName, IResourceName } from "../types";
import { IAuthPerm, IAuthPermAction, IAuthPerms, IAuthUser } from "./types";

/**
 * Checks if a user is allowed to perform a specific action based on the provided permission.
 * 
 * The `isAllowed` function evaluates whether a user has the necessary permissions 
 * to perform an action defined by the `perm` parameter. It takes into account 
 * various types of permissions, including boolean values, functions, and string 
 * representations of permissions.
 * 
 * ### Parameters
 * 
 * - `perm` (IAuthPerm): The permission to check, which can be a boolean, 
 *   a function, or a string in the format `[resource]:[action]`.
 * - `user` (IAuthUser , optional): The user object for whom the permission 
 *   check is being performed. If not provided, the function will attempt 
 *   to retrieve the signed user from the session.
 * 
 * ### Returns
 * 
 * - `boolean`: Returns `true` if the user is allowed to perform the action, 
 *   or `false` otherwise.
 * 
 * ### Example Usage
 * 
 * ```typescript
 * const user: IAuthUser  = { id: "user123", perms: { documents: ["read", "create"] } };
 * const canRead = isAllowed("documents:read", user); // true
 * const canDelete = isAllowed("documents:delete", user); // false
 * ```
 * @see {@link IAuthPerm} for the `IAuthPerm` type.
 * @see {@link IAuthPerms} for the `IAuthPerms` type.
 */
export const isAllowed = (perm?: IAuthPerm, user?: IAuthUser): boolean => {
  user = Object.assign({}, user || (getSignedUser() as IAuthUser));
  if (typeof perm === "boolean") return perm;
  if (isMasterAdmin(user)) return true;
  if (!perm) return true;
  if (typeof perm === "function") return !!perm(user);
  if (typeof perm === "string" && perm) {
    const split = String(perm).trim().split(":");
    return checkPermission(user?.perms || {}, split[0] as IResourceName, split[1] as IAuthPermAction);
  }
  return true;
};

/**
 * Checks if the user is a master admin.
 * 
 * The `isMasterAdmin` function determines whether the provided user 
 * has master admin privileges. If no user is provided, it will 
 * attempt to retrieve the signed user from the session.
 * 
 * ### Parameters
 * 
 * - `user` (IAuthUser , optional): The user object to check. If not 
 *   provided, the function will attempt to retrieve the signed user 
 *   from the session.
 * 
 * ### Returns
 * 
 * - `boolean`: Returns `true` if the user is a master admin, or `false` otherwise.
 * 
 * ### Example Usage
 * 
 * ```typescript
 * const user: IAuthUser  = { id: "admin123" };
 * const isAdmin = isMasterAdmin(user); // false (assuming the user is not a master admin)
 * ```
 * @see {@link IAuthUser} for the `IAuthUser` type.
 */
export const isMasterAdmin = (user?: IAuthUser): boolean => {
  user = user || (getSignedUser() as IAuthUser);
  return false;
};


/**
 * Checks if a user has permission to perform a specific action on a resource.
 * 
 * The `checkPermission` function evaluates whether the provided permissions 
 * allow the specified action on the given resource. It checks the user's 
 * permissions against the defined resource and action.
 * 
 * ### Parameters
 * 
 * - `perms` (IAuthPerms): An object representing the user's permissions, 
 *   mapping resource names to an array of actions.
 * - `resource` (IResourceName): The name of the resource for which 
 *   permission is being checked.
 * - `action` (IAuthPermAction, optional): The action to check for the 
 *   specified resource. Defaults to `"read"` if not provided.
 * 
 * ### Returns
 * 
 * - `boolean`: Returns `true` if the user has permission to perform the 
 *   specified action on the resource, or `false` otherwise.
 * 
 * ### Example Usage
 * 
 * ```typescript
 * const userPermissions: IAuthPerms = {
 *     documents: ["read", "create"],
 *     users: ["read", "delete"]
 * };
 * 
 * const canEditDocuments = checkPermission(userPermissions, "documents", "update"); // false
 * const canReadDocuments = checkPermission(userPermissions, "documents", "read"); // true
 * ```
 * @see {@link IAuthPerms} for the `IAuthPerms` type.
 * @see {@link IResourceName} for the `IResourceName` type.
 * @see {@link IAuthPermAction} for the `IAuthPermAction` type.
 * @see {@link isAllowedForAction} for the `isAllowedForAction` function.
 */
export function checkPermission(perms: IAuthPerms, resource: IResourceName, action: IAuthPermAction = "read") {
  perms = Object.assign({}, perms);
  resource = isNonNullString(resource) ? resource : "" as IResourceName;
  if (!isObj(perms) || !resource) {
    return false;
  }
  const resourceStr = String(resource).trim().toLowerCase();
  action = isNonNullString(action) ? action : "read";
  let userActions: IResourceActionName[] = [];
  for (let i in perms) {
    if (String(i).toLowerCase().trim() === resourceStr && Array.isArray(perms[i as keyof IAuthPerms])) {
      userActions = perms[i as keyof IAuthPerms];
      break;
    }
  }
  if (!Array.isArray(userActions) || !userActions.length) return false;
  if (userActions.includes("all")) {
    return true;
  }
  for (let i in userActions) {
    if (isAllowedForAction(userActions[i], action)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a specific permission allows for a given action.
 * 
 * The `isAllowedForAction` function determines whether a specific 
 * permission grants access to perform the specified action. It can 
 * handle both single actions and multiple actions separated by the 
 * `|` character.
 * 
 * ### Parameters
 * 
 * - `permission` (IResourceActionName): The permission to check.
 * - `action` (IAuthPermAction): The action to check against the 
 *   provided permission.
 * 
 * ### Returns
 * 
 * - `boolean`: Returns `true` if the permission allows the specified 
 *   action, or `false` otherwise.
 * 
 * ### Example Usage
 * 
 * ```typescript
 * const permission: IResourceActionName = "update";
 * const action: IAuthPermAction = "read|update";
 * 
 * const canUpdate = isAllowedForAction(permission, action); // true
 * const canDelete = isAllowedForAction(permission, "delete"); // false
 * ```
 * @see {@link IResourceActionName} for the `IResourceActionName` type.
 * @see {@link IAuthPermAction} for the `IAuthPermAction` type.
 * @see {@link isAllowed} for the `isAllowed` function.
 * @see {@link checkPermission} for the `checkPermission` function.
 */
export function isAllowedForAction(permission: IResourceActionName, action: IAuthPermAction) {
  if (!isNonNullString(action) || !isNonNullString(permission)) {
    return false;
  }
  const actionStr = String(action).trim().toLowerCase();
  const permissionStr = String(permission).trim().toLowerCase();
  if (actionStr === permissionStr) {
    return true;
  }
  const actionSplit = action.split("|"); //à supposer que plusieurs actions ont été proposées
  if (actionSplit.length > 1) {
    for (let s in actionSplit) {
      if (isAllowedForAction(permission, actionSplit[s] as IResourceActionName)) {
        return true;
      }
    }
    return false;
  }
  return false;
}
