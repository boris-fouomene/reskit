import $session from "../session";
import { IDict } from "../types";
import { isObj, parseJSON, isNonNullString } from "../utils";
import { IAuthSessionStorage, IAuthUser } from "./types";
import events from "./events";
import CryptoJS from "crypto-js";

const encrypt = CryptoJS.AES.encrypt;

const decrypt = CryptoJS.AES.decrypt;


type ILocalUserRef = {
    current: IAuthUser | null;
}
const localUserRef: ILocalUserRef = { current: null };
const SESSION_ENCRYPT_KEY = "auth-decrypted-key";

const USER_SESSION_KEY = "user-session";




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
export const getSignedUser = (): IAuthUser | null => {
    if (localUserRef.current) return localUserRef.current;
    const encrypted = $session.get(USER_SESSION_KEY);
    if ((encrypted)) {
        try {
            const ded = decrypt(encrypted, SESSION_ENCRYPT_KEY);
            if (ded && typeof ded?.toString == 'function') {
                const decoded = ded.toString(CryptoJS.enc.Utf8);
                localUserRef.current = parseJSON(decoded) as IAuthUser;
                return localUserRef.current;
            }
        } catch (e) {
            console.log("getting local user ", e);
        }
    }
    return null;
};

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
export const setSignedUser = (u: IAuthUser | null, triggerEvent?: boolean) => {
    localUserRef.current = u;
    const uToSave = u as IAuthUser;
    let encrypted = null;
    try {
        if (isObj(uToSave)) {
            uToSave.authSessionCreatedAt = new Date().getTime();
        }
        encrypted = uToSave ? encrypt(JSON.stringify(uToSave), SESSION_ENCRYPT_KEY).toString() : null;
    } catch (e) {
        localUserRef.current = null;
        console.log(e, " setting local user");
    }
    if (triggerEvent) {
        const event = isObj(uToSave) && isObj(encrypted) ? "SIGN_IN" : "SIGN_OUT";
        events.trigger(event, uToSave);
    }
    return $session.set(USER_SESSION_KEY, encrypted)
}


export default class Session {
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
        return this.getData(sessionName)[key as string];
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
        let data = this.getData(sessionName);
        if (isNonNullString(key)) {
            data[key as string] = value;
        } else if (isObj(key)) {
            data = key as IDict;
        }
        $session.set(this.getKey(sessionName), data);
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
        return `auth-${getSignedUser()?.id || ""}-${sessionName || ""}`;
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
        return getSignedUser()?.token;
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
        setSignedUser(Object.assign({}, getSignedUser(), { token }));
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
                return this.get(sessionName, key);
            },
            set: (key?: string | IDict, value?: any) => {
                return this.set(sessionName, key, value);
            },
            getData: (): IDict => {
                return this.getData(sessionName);
            },
            getKey: () => {
                return this.getKey(sessionName);
            },
        };
    }
}
