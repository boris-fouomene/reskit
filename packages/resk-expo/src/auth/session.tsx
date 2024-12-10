import $session from "@session";
import { isObj, parseJSON, isNonNullString, IDict } from "@resk/core";
import { useMemo } from "react";
import CryptoES from 'crypto-es';
import { IAuthSessionStorage, IAuthUser } from "./types";


const encrypt = CryptoES.AES.encrypt;

const decrypt = CryptoES.AES.decrypt;


const tokenKey: string = 'auth-session-token';


type ILocalUserRef = {
    current: IAuthUser | null;
}
const localUserRef: ILocalUserRef = { current: null };
const SESSION_ENCRYPT_KEY = "auth-decrypted-key";

const USER_SESSION_KEY = "user-session";

/****
 * retourne le token de l'utilisateur connecté
 */
export function getToken(): string | undefined | null {
    return $session.get(tokenKey) as string | undefined | null;
}


export const setToken = (token: string | null): void => {
    $session.set(tokenKey, token);
}


export const getSignedUser = (): IAuthUser | null => {
    if (localUserRef.current) return localUserRef.current;
    const encrypted = $session.get(USER_SESSION_KEY);
    if ((encrypted)) {
        try {
            const ded = decrypt(encrypted, SESSION_ENCRYPT_KEY);
            if (ded && typeof ded?.toString == 'function') {
                const decoded = ded.toString(CryptoES.enc.Utf8);
                localUserRef.current = parseJSON(decoded) as IAuthUser;
                return localUserRef.current;
            }
        } catch (e) {
            console.log("getting local user ", e);
        }
    }
    return null;
};


export const setSignedUser = (u: IAuthUser | null) => {
    localUserRef.current = u;
    const uToSave = u as IAuthUser;
    let encrypted = null;
    try {
        if (uToSave) {
            uToSave.authSessionCreatedAt = new Date().getTime();
        }
        encrypted = uToSave ? encrypt(JSON.stringify(uToSave), SESSION_ENCRYPT_KEY).toString() : null;
    } catch (e) {
        localUserRef.current = null;
        console.log(e, " setting local user");
    }
    return $session.set(USER_SESSION_KEY, encrypted)
}


const getKey = (sessionName?: string) => `auth-${getSignedUser()?.id || ""}-${sessionName || ""}`;


const getData = (sessionName?: string): IDict => {
    if (!isNonNullString(sessionName)) return {};
    const key = getKey(sessionName);
    return Object.assign({}, $session.get(key));
};

const get = (sessionName?: string, key?: string): any => {
    if (!isNonNullString(key)) return undefined;
    return getData(sessionName)[key as string];
};

const set = (sessionName?: string, key?: string | IDict, value?: any): IDict => {
    let data = getData(sessionName);
    if (isNonNullString(key)) {
        data[key as string] = value;
    } else if (isObj(key)) {
        data = key as IDict;
    }
    $session.set(getKey(sessionName), data);
    return data;
};


export const getAuthSessionStorage = (sessionName?: string): IAuthSessionStorage => {
    return {
        sessionName,
        get: (key?: string) => {
            return get(sessionName, key);
        },
        set: (key?: string | IDict, value?: any) => {
            return set(sessionName, key, value);
        },
        getData: (): IDict => {
            return getData(sessionName);
        },
        getKey: () => {
            return getKey(sessionName);
        },
    };
};

export const useAuthSessionStorage = (sessionName?: string) => {
    return useMemo(() => {
        return getAuthSessionStorage(sessionName);
    }, [sessionName]);
};

export default { get, set, getKey, getData };
