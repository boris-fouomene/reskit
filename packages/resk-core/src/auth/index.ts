

import { isObj } from "@utils/object";
import Session, { getSignedUser, setSignedUser } from "./session";
import { i18n } from "../i18n";
import { IAuthUser } from "./types";

export { Session, getSignedUser, setSignedUser };

export * from "./perms";

export { default as events } from "./events";

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
export const signIn = (user: IAuthUser, triggerEvent: boolean = true): Promise<IAuthUser> => {
    return new Promise((resolve, reject) => {
        if (!isObj(user)) {
            reject(new Error(i18n.t("auth.invalidSignInUser")));
            return;
        }
        setSignedUser(user, triggerEvent);
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
export const signOut = (triggerEvent: boolean = true): Promise<void> => {
    return new Promise((resolve, reject) => {
        setSignedUser(null, triggerEvent);
        resolve();
    });
}
