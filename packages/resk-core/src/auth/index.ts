
import { i18n } from "../i18n";
import $session from "../session";
import { IDict, IResourceActionName, IResourceActionTupleArray, IResourceActionTupleObject, IResourceName } from "../types";
import { isObj, JsonHelper, isNonNullString } from "../utils";
import { IObservable, observable } from "@/observable";
import { IAuthSessionStorage, IAuthUser, IAuthPerm, IAuthPerms, IAuthEvent, IAuthRole } from "./types";
import "./types";
import CryptoJS from "crypto-js";
import Logger from "../logger";


export * from "./types";

const encrypt = CryptoJS.AES.encrypt;
const decrypt = CryptoJS.AES.decrypt;
const SESSION_ENCRYPT_KEY = "auth-decrypted-key";
const USER_SESSION_KEY = "user-session";

type ILocalUserRef = {
    current: IAuthUser | null;
}

/***
 * A class that provides methods for managing session data.
 * 
 */
class Session {
    /**
    * Retrieves a specific value from the session data based on the provided session name and key.
    * 
    * This function first checks if the provided key is a non-null string. If it is not, it returns undefined.
    * It then retrieves the session data using `getData` and returns the value associated with the specified key.
    * 
    * @param sessionName - An optional string that represents the name of the session.
    * @param key - A string representing the key of the value to retrieve from the session data.
    * 
    * @returns The value associated with the specified key in the session data, or undefined if the key is invalid.
    * 
    * @example
    * // Example of retrieving a specific value from session data
    * const value = get('mySession', 'userPreference'); // Returns: 'darkMode'
    * 
    * @example
    * // Example of trying to retrieve a value with an invalid key
    * const value = get('mySession', null); // Returns: undefined
    */
    static get(sessionName?: string, key?: string): any {
        if (!isNonNullString(key)) return undefined;
        return Session.getData(sessionName)[key as string];
    }
    /**
      * Sets a value or an object in the session data for a specific session name.
      * 
      * This function retrieves the current session data using `getData`. If a valid key is provided, it sets the 
      * corresponding value in the session data. If an object is provided as the key, it replaces the entire session data.
      * Finally, it saves the updated session data back to the session storage.
      * 
      * @param sessionName - An optional string that represents the name of the session.
      * @param key - A string representing the key to set a value for, or an object containing multiple key-value pairs.
      * @param value - The value to set for the specified key. This parameter is ignored if an object is provided as the key.
      * 
      * @returns The updated session data as an object.
      * 
      * @example
      * // Example of setting a single value in session data
      * const updatedData = set('mySession', 'userPreference', 'darkMode'); // Returns: { userPreference: 'darkMode' }
      * 
      * @example
      * // Example of replacing the entire session data with an object
      * const updatedData = set('mySession', { userPreference: 'lightMode', language: ' English' }); // Returns: { userPreference: 'lightMode', language: 'English' }
      */
    static set(sessionName?: string, key?: string | IDict, value?: any): IDict {
        let data = Session.getData(sessionName);
        if (isNonNullString(key)) {
            data[key as string] = value;
        } else if (isObj(key)) {
            data = key as IDict;
        }
        $session.set(Session.getKey(sessionName), data);
        return data;
    }
    /**
     * Generates a unique session key based on the authenticated user's ID and an optional session name.
     * 
     * The session key is constructed in the format: `auth-{userId}-{sessionName}`. If the user is not signed in,
     * the user ID will be an empty string. This key is used to store and retrieve session data.
     * 
     * @param sessionName - An optional string that represents the name of the session. If not provided, 
     *                      an empty string will be used in the key.
     * 
     * @returns A string representing the unique session key.
     * 
     * @example
     * // Example of generating a session key for a user with ID '12345'
     * const sessionKey = getKey('mySession'); // Returns: 'auth-12345-mySession'
     * 
     * @example
     * // Example of generating a session key when no user is signed in
     * const sessionKey = getKey(); // Returns: 'auth--'
     */
    static getKey(sessionName?: string) {
        return `auth-${Auth.getSignedUser()?.id || ""}-${sessionName || ""}`;
    }
    /**
     * Retrieves session data associated with a specific session name.
     * 
     * This function checks if the provided session name is a non-null string. If it is not, an empty object is returned.
     * Otherwise, it constructs a key using `getKey` and retrieves the corresponding data from the session storage.
     * 
     * @param sessionName - An optional string that represents the name of the session. If not provided or invalid,
     *                      an empty object will be returned.
     * 
     * @returns An object containing the session data associated with the specified session name. 
     *          If the session name is invalid, an empty object is returned.
     * 
     * @example
     * // Example of retrieving session data for a specific session name
     * const sessionData = getData('mySession'); // Returns: {  }
     * 
     * @example
     * // Example of retrieving session data with an invalid session name
     * const sessionData = getData(null); // Returns: {}
     */
    static getData(sessionName?: string): IDict {
        if (!isNonNullString(sessionName)) return {};
        const key = Session.getKey(sessionName);
        return Object.assign({}, $session.get(key));
    }

    /**
     * Retrieves the authentication token from the session storage.
     * 
     * This function checks the currently signed-in user and returns their token.
     * If the user is not signed in or if there is no token available, it will return
     * `undefined` or `null`.
     * 
     * @returns {string | undefined | null} The authentication token of the signed user, 
     * or `undefined` if the user is not signed in, or `null` if there is no token.
     * 
     * @example
     * const token = getToken();
     * if (token) {
     *     console.log("User  token:", token);
     * } else {
     *     console.log("No user is signed in or token is not available.");
     * }
     */
    static getToken(): string | undefined | null {
        return Auth.getSignedUser()?.token;
    }
    /**
     * Sets the authentication token in the session storage for the currently signed-in user.
     * 
     * This function updates the signed user's information by adding or updating the token
     * in the session storage. If the token is `null`, it will remove the token from the user's
     * session data.
     * 
     * @param {string | null} token - The token to be set for the signed user. 
     * If `null`, the token will be removed from the user's session data.
     * 
     * @returns {void} This function does not return a value.
     * 
     * @example
     * setToken("my-secret-token");
     * // To remove the token
     * setToken(null);
     */
    static setToken(token: string | null): void {
        Auth.setSignedUser(Object.assign({}, Auth.getSignedUser(), { token }));
    }
    /**
     * Retrieves a session storage object that provides methods for managing session data.
     * 
     * This function creates an object that allows you to interact with session storage
     * using a specified session name. It provides methods to get, set, and retrieve data
     * associated with the session, as well as to retrieve the session key.
     * 
     * @param sessionName - An optional string that represents the name of the session.
     *                      If provided, it will be used as a prefix for the keys stored
     *                      in session storage. If not provided, the session will be
     *                      treated as anonymous.
     * 
     * @returns An object implementing the `IAuthSessionStorage` interface, which includes
     *          methods for session management:
     *          - `get(key?: string): any`: Retrieves the value associated with the specified key.
     *          - `set(key?: string | IDict, value?: any): void`: Stores a value under the specified key.
     *          - `getData(): IDict`: Returns all data stored in the session as a dictionary.
     *          - `getKey(): string`: Returns the session key used for storage.
     * 
     * @example
     * // Create a session storage object with a specific session name
     * const session = getSessionStorage('userSession');
     * 
     * // Set a value in the session storage
     * session.set('token', 'abc123');
     * 
     * // Retrieve the value from session storage
     * const token = session.get('token'); // 'abc123'
     * 
     * // Get all data stored in the session
     * const allData = session.getData(); // { token: 'abc123' }
     * 
     * // Get the session key
     * const sessionKey = session.getKey(); // 'userSession'
     * 
     * @remarks
     * This function is particularly useful for managing user authentication sessions
     * in web applications. By using session storage, data persists across page reloads
     * but is cleared when the tab or browser is closed.
     * 
     * Ensure that the keys used for storing data are unique to avoid collisions with
     * other session data. Consider using a structured naming convention for keys.
     */
    static getStorage(sessionName?: string): IAuthSessionStorage {
        return {
            sessionName,
            get: (key?: string) => {
                return Session.get(sessionName, key);
            },
            set: (key?: string | IDict, value?: any) => {
                return Session.set(sessionName, key, value);
            },
            getData: (): IDict => {
                return Session.getData(sessionName);
            },
            getKey: () => {
                return Session.getKey(sessionName);
            },
        };
    }
}


export default class Auth {
    /**
    * Authentication event handler.
    * Initializes an observable event handler for authentication Auth.events.
    * 
    * This constant `events` is assigned an instance of `IObservable<IAuthEvent>`, which is used to manage 
    * authentication-related events in the application. The initialization checks if the global 
    * `Global.eventsResourcesObservableHandler` exists and is an object. If it does, it assigns it to 
    * `events`; otherwise, it defaults to an empty object cast as `IObservable<IAuthEvent>`.
    * 
    * This pattern allows for flexible handling of events, ensuring that the application can respond 
    * to authentication actions such as sign-in, sign-out, and sign-up.
    * 
    * @type {IObservable<IAuthEvent>}
    * 
    * @example
    * import {Auth} from '@resk/core';
    * Auth.events.on('SIGN_IN', (user) => {
    *     console.log(`User  signed in: ${user.username}`);
    * });
    * 
    * function userSignIn(user) {
    *     Auth.events.trigger('SIGN_IN', user);
    * }
    */
    static events: IObservable<IAuthEvent> = observable<IAuthEvent>({});
    private static localUserRef: ILocalUserRef = { current: null };
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
     * Auth.isMasterAdmin = (user)=>{
     *  return checkSomeCondition(user);
     * }; // false (assuming the user is not a master admin)
     * ```
     * @see {@link IAuthUser} for the `IAuthUser` type.
     */
    static isMasterAdmin?: ((user?: IAuthUser) => boolean);
    private static _isMasterAdmin(user?: IAuthUser): boolean {
        user = isObj(user) ? user : (Auth.getSignedUser() as IAuthUser);
        return typeof Auth.isMasterAdmin == "function" ? Auth.isMasterAdmin(user) : false;
    }
    /**
     * Retrieves the currently signed-in user from the session storage.
     * 
     * This function checks if the user data is already cached in `localUser Ref`. 
     * If not, it attempts to retrieve the encrypted user data from the session storage,
     * decrypts it, and parses it into an `IAuthUser ` object. If the decryption fails or
     * if there is no user data, it returns `null`.
     * 
     * @returns {IAuthUser  | null} The signed-in user object if available, or `null` if
     * the user is not signed in or if an error occurs during retrieval.
     * 
     * @example
     * const user = getSignedUser ();
     * if (user) {
     *     console.log("Signed in user:", user);
     * } else {
     *     console.log("No user is currently signed in.");
     * }
     * @see {@link IAuthUser} for the type definition of the user object.
     * @see {@link getToken} for retrieving the authentication token.
     */
    static getSignedUser(): IAuthUser | null {
        if (isObj(Auth.localUserRef.current)) return Auth.localUserRef.current;
        const encrypted = $session.get(USER_SESSION_KEY);
        if ((encrypted)) {
            try {
                const ded = decrypt(encrypted, SESSION_ENCRYPT_KEY);
                if (ded && typeof ded?.toString == 'function') {
                    const decoded = ded.toString(CryptoJS.enc.Utf8);
                    Auth.localUserRef.current = JsonHelper.parse(decoded) as IAuthUser;
                    return Auth.localUserRef.current;
                }
            } catch (e) {
                Logger.log("getting local user ", e);
            }
        }
        return null;
    }
    /**
     * Sets the signed user in the local storage and updates the session information.
     * 
     * This function takes an authenticated user object or null, updates the local reference,
     * and encrypts the user data before saving it to the session storage. If the user object
     * is valid, it also records the timestamp of when the authentication session was created.
     * 
     * @param u - The authenticated user object to be set. This can be an object conforming to the 
     *            `IAuthUser ` interface or `null` if there is no authenticated user.
     * @param triggerEvent - A boolean indicating whether to trigger the SIGN_IN|SING_OUT event depending on the value of u param. If set to true, the event will be triggered with the updated user object.
     * 
     * @returns A promise that resolves to the result of setting the encrypted user data in the session storage.
     *          If the user object is null, it will save a null value.
     * 
     * @throws {Error} Throws an error if the encryption process fails, and the local user reference is reset to null.
     * 
     * @example
     * // Example of setting a signed user
     * const user: IAuthUser  = {
     *     id: '12345',
     *     username: 'john_doe',
     *     email: 'john@example.com',
     * };
     * 
     * // Set the signed user
     * setSignedUser(user);
     * console.log('User  session set successfully:', result);
     * 
     * @example
     * // Example of clearing the signed user
     * setSignedUser (null);
    *  console.log('User  session cleared successfully:', result);
    * 
    * @remarks
    * - Ensure that the `SESSION_ENCRYPT_KEY` is defined and valid for the encryption to work.
    * - The function uses a local reference `localUser Ref` to keep track of the current user state.
    * - The `encrypt` function is assumed to be a utility function that handles the encryption of the user data.
    * - The `USER_SESSION_KEY` is a constant that defines the key under which the user session data is stored in session storage.
    */
    static setSignedUser(u: IAuthUser | null, triggerEvent?: boolean) {
        Auth.localUserRef.current = u;
        const uToSave = u as IAuthUser;
        let encrypted: any = null;
        try {
            if (isObj(uToSave)) {
                uToSave.authSessionCreatedAt = new Date().getTime();
            }
            encrypted = uToSave ? encrypt(JSON.stringify(uToSave), SESSION_ENCRYPT_KEY).toString() : null;
        } catch (e) {
            Auth.localUserRef.current = null;
            Logger.log(e, " setting local user");
        }
        if (triggerEvent) {
            const event = isObj(uToSave) && isObj(encrypted) ? "SIGN_IN" : "SIGN_OUT";
            Auth.events.trigger(event, uToSave);
        }
        return $session.set(USER_SESSION_KEY, encrypted)
    }

    /**
     * Signs in a user by setting the signed user in the session.
     * 
     * This function takes an authentication user object and an optional trigger event flag.
     * If the user object is valid, it sets the signed user and resolves the promise with the user object.
     * If the user object is invalid, it rejects the promise with an error message.
     * 
     * @param user - The user object that contains authentication details. 
     *               It should conform to the `IAuthUser ` interface.
     *               Example: 
     *               ```typescript
     *               const user: IAuthUser  = { id: "123", name: "John Doe", email: "john@example.com" };
     *               ```
     * @param triggerEvent - Optional flag to indicate whether to trigger the SIGN_IN event after signing in. 
     *                       Defaults to `true`.
     *                       Example: 
     *                       ```typescript
     *                       await signIn(user, true);
     *                       ```
     * 
     * @returns A promise that resolves with the signed-in user object if successful.
     *          If the user object is invalid, the promise is rejected with an error.
     * 
     * @throws {Error} If the user object is not valid.
     * 
     * @example
     * ```typescript
     * import {Auth, IAuthUser} from '@resk/core';
     *  Auth.signIn(user)
     *     .then(signedInUser  => {
     *         console.log("User  signed in:", signedInUser );
     *     })
     *     .catch(error => {
     *         console.error("Sign in failed:", error.message);
     *     });
     * ```
     */
    static signIn(user: IAuthUser, triggerEvent: boolean = true): Promise<IAuthUser> {
        return new Promise((resolve, reject) => {
            if (!isObj(user)) {
                reject(new Error(i18n.t("auth.invalidSignInUser")));
                return;
            }
            Auth.setSignedUser(user, triggerEvent);
            resolve(user);
        });
    }
    /**
     * Signs out the currently signed-in user by clearing the session.
     * 
     * This function does not take any parameters and will remove the signed user from the session.
     * It resolves the promise once the user has been successfully signed out.
     * 
     * @param triggerEvent - Optional flag to indicate whether to trigger the SIGN_OUT event after signing in. 
     *                       Defaults to `true`.
     *                       Example: 
     *                       ```typescript
     *                       await signIn(user, true);
     *                       ```
     * 
     * @returns A promise that resolves when the user has been signed out successfully.
     * 
     * @example
     * ```typescript
     * signOut()
     *     .then(() => {
     *         console.log("User  signed out successfully.");
     *     })
     *     .catch(error => {
     *         console.error("Sign out failed:", error.message);
     *     });
     * ```
     */
    static signOut(triggerEvent: boolean = true): Promise<void> {
        return new Promise((resolve, reject) => {
            Auth.setSignedUser(null, triggerEvent);
            resolve();
        });
    }

    static isResourceActionTupleArray<ResourceName extends IResourceName = IResourceName>(perm: IAuthPerm<ResourceName>): perm is IResourceActionTupleArray<ResourceName> {
        return Array.isArray(perm) && perm.length === 2 && isNonNullString(perm[0]) && isNonNullString(perm[1]);
    }
    static isResourceActionTupleObject<ResourceName extends IResourceName = IResourceName>(perm: IAuthPerm<ResourceName>): perm is IResourceActionTupleObject<ResourceName> {
        return !Array.isArray(perm) && typeof perm === "object" && isObj(perm) && isNonNullString(perm.resourceName) && isNonNullString(perm.action);
    }
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
     * const canRead = isAllowed(["documents", "read"], user); // true
     * const canDelete = isAllowed(["documents", "delete"], user); // false
     * const canReadDocs = isAllowed({ resourceName: "documents", action: "read" }, user); // true
     * ```
     * @see {@link IAuthPerm} for the `IAuthPerm` type.
     * @see {@link IAuthPerms} for the `IAuthPerms` type.
     * @see {@link IAuthUser} for the `IAuthUser` type.
     * @see {@link IResourceName} for the `IResourceName` type.
     * @see {@link IAuthPermAction} for the `IAuthPermAction` type.
     * @see {@link IAuthRole} for the `IAuthRole` type.
     */
    static isAllowed<ResourceName extends IResourceName = IResourceName>(perm: IAuthPerm<ResourceName>, user?: IAuthUser): boolean {
        user = Object.assign({}, user || (Auth.getSignedUser() as IAuthUser));
        if (typeof perm === "boolean") return perm;
        if (Auth._isMasterAdmin(user)) return true;
        if (!perm) return true;
        if (typeof perm === "function") return !!perm(user);
        if (Auth.isResourceActionTupleObject(perm)) {
            if (Auth.checkUserPermission(user, perm.resourceName, perm.action as IResourceActionName)) {
                return true;
            }
        } else if (Auth.isResourceActionTupleArray(perm)) {
            if (Auth.checkUserPermission(user, perm[0], perm[1] as IResourceActionName)) {
                return true;
            }
        } else if (Array.isArray(perm)) {
            for (let i in perm) {
                const p = perm[i] as IAuthPerm;
                if (Auth.isResourceActionTupleArray(p)) {
                    if (Auth.checkUserPermission(user, p[0], p[1])) {
                        return true;
                    }
                } else if (Auth.isResourceActionTupleObject(p)) {
                    if (Auth.checkUserPermission(user, p.resourceName, p.action)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    static checkUserPermission(user: IAuthUser, resource: IResourceName, action: IResourceActionName = "read") {
        if (!isObj(user) || !user) return false;
        if (isObj(user.perms) && user.perms && Auth.checkPermission(user.perms, resource, action)) {
            return true;
        }
        if (Array.isArray(user?.roles)) {
            for (let i in user.roles) {
                const role = user.roles[i];
                if (isObj(role) && isObj(role.perms) && Auth.checkPermission(role.perms, resource, action)) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

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
    static checkPermission(perms: IAuthPerms, resource: IResourceName, action: IResourceActionName = "read") {
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
                userActions = perms[i as keyof IAuthPerms] as IResourceActionName[];
                break;
            }
        }
        if (!Array.isArray(userActions) || !userActions.length) return false;
        if (userActions.includes("all")) {
            return true;
        }
        for (let i in userActions) {
            if (Auth.isAllowedForAction(userActions[i], action)) {
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
    static isAllowedForAction<ResourceName extends IResourceName = IResourceName>(permission: IResourceActionName<ResourceName>, action: IResourceActionName<ResourceName>) {
        if (!isNonNullString(action) || !isNonNullString(permission)) {
            return false;
        }
        return String(action).trim().toLowerCase() === String(permission).trim().toLowerCase();
    }
    static get Session() {
        return Session;
    }
}
