import { Platform } from "../platform";
import { JsonHelper } from "../utils/json";
import { IClassConstructor, IDict } from '../types/index';
import isNonNullString from '../utils/isNonNullString';



class Manager {
  static readonly sessionStorageMetaData = Symbol("sessionStorage");
  /**
   * The storage object used by the session manager.
   * 
   * This property is initialized lazily when the `storage` getter is called.
   */
  private static _storage: ISessionStorage | undefined;

  /**
   * The prefix to use for all keys in the session storage.
   * 
   * This property is optional and can be set using the `allKeyPrefix` setter.
   */
  private static _allKeyPrefix?: string = undefined;

  /**
   * Gets the storage object used by the session manager.
   * 
   * If the storage object has not been initialized, it will be initialized using the `window.localStorage` object if available.
   * 
   * If the storage object is not available, it will be initialized using an in-memory storage.
   * 
   * @returns {ISessionStorage} The storage object used by the session manager.
   */
  public static get storage(): ISessionStorage {
    const storage = Reflect.getMetadata(Manager.sessionStorageMetaData, Manager);
    if (isValidStorage(storage)) {
      this._storage = storage;
    }
    if (this._storage) return this._storage;
    if (Platform.isClientSide() && typeof window !== 'undefined' && window.localStorage && window.localStorage?.getItem) {
      this._storage = {
        get: (key: string) => window.localStorage.getItem(key),
        set: (key: string, value: any) => window.localStorage.setItem(key, value),
        remove: (key: string) => window.localStorage.removeItem(key),
        removeAll: () => window.localStorage.clear()
      };
    } else {
      //in memory storage. When there is not a localStorage, we use an in memory storage
      let InMemoryStorage: IDict = {};
      this._storage = {
        get: (key: string) => InMemoryStorage[key],
        set: (key: string, value: any) => InMemoryStorage[key] = value,
        remove: (key: string) => delete InMemoryStorage[key],
        removeAll: () => InMemoryStorage = {},
      };
    }
    return this._storage as ISessionStorage;
  }

  /**
   * Sets the storage object used by the session manager.
   * 
   * The provided storage object must be valid and have the required methods.
   * 
   * @param {ISessionStorage} storage - The storage object to use.
   */
  public static set storage(storage: ISessionStorage) {
    if (isValidStorage(storage)) {
      Reflect.defineMetadata(Manager.sessionStorageMetaData, storage, Manager);
    }
  }

  /**
   * Gets the prefix to use for all keys in the session storage.
   * 
   * If the prefix is not set, an empty string will be returned.
   * 
   * @returns {string} The prefix to use for all keys in the session storage.
   */
  public static get allKeyPrefix(): string {
    return this._allKeyPrefix && isNonNullString(this._allKeyPrefix) ? this._allKeyPrefix : "";
  }

  public static set allKeyPrefix(prefix: string) {
    if (isNonNullString(prefix)) {
      this._allKeyPrefix = prefix;
    }
  }

  /**
   * Sanitizes a key by trimming and removing whitespace, and adding the prefix if set.
   * 
   * @param {string} [key] - The key to sanitize.
   * @returns {string} The sanitized key.
   */
  public static sanitizeKey(key?: string): string {
    if (!key || !isNonNullString(key)) return "";
    key = key.trim().replace(/\s+/g, "").replace(/ /gi, "");
    const keyPrefix = isNonNullString(this.allKeyPrefix) && this._allKeyPrefix || "";
    if (keyPrefix) return `${keyPrefix}-${key}`;
    return key;
  }
}


/**
 * Sanitizes a string for session storage.
 * 
 * This function trims and removes whitespace from the key, and adds the prefix if set.
 * \nExample
 * ```typescript
    Manager.allKeyPrefix = "my-prefix-";
    const prefixedKey = sanitizeKey("my-key");
    console.log(prefixedKey); // "my-prefix-my-key"
 * ````
 * @param {string} key - The key to sanitize.
 * @returns {string} The sanitized key.
 */
function sanitizeKey(key: string): string {
  return Manager.sanitizeKey(key);
}

/***
 * sanitize session value for persistance purposes
 * @param {any} value to sanitize
 * @param {boolean} {decycle=true} whether to decycle the value 
 * @return {string} sanitized value 
 */
const handleSetValue = (value: any, decycle?: boolean) => {
  value = value ? JsonHelper.stringify(value, decycle) : value;
  if (value === null || value === undefined) value = "";
  return value;
}
/***
 * parse retrived value from session and return it
 * @param {any} value retrived value from session
 * @return {any} parsed value
 */
const handleGetValue: any = (value: any) => {
  if (value !== null && value !== undefined) {
    return JsonHelper.parse(value);
  }
  return undefined;
}

/***
 * Set the value to session key ${key}
 */
const set: any = (key: string, value: any, decycle: boolean = true) => {
  Manager?.storage?.set(key, handleSetValue(value, decycle));
}

/**
 * Gets a session value from a key.
 * 
 * This function sanitizes the key, retrieves the value from the session storage, and handles the value accordingly.
 * 
 * @param {string} key - The key to retrieve the value for.
 * @returns {any} The retrieved value, or undefined if the key is invalid or the value is not found.
 */
const get = (key: string) => {
  /**
   * Sanitize the key to ensure it's valid for session storage.
   */
  key = sanitizeKey(key);

  /**
   * Check if the session storage is available and the key is valid.
   */
  if (Manager.storage && key && typeof key === 'string') {
    /**
     * Retrieve the value from the session storage using the sanitized key.
     */
    const value = Manager.storage.get(key);

    /**
     * Handle the retrieved value accordingly.
     */
    return handleGetValue(value);
  }

  /**
   * If the key is invalid or the value is not found, return undefined.
   */
  return undefined;
};
/**
 * Removes a key from the session storage.
 * 
 * This function sanitizes the key and removes the corresponding value from the session storage.
 * 
 * @param {string} key - The key to remove from the session storage.
 * @returns {any} The removed value, or undefined if the key is invalid or the value is not found.
 */
const remove = (key: string) => {
  /**
   * Sanitize the key to ensure it's valid for session storage.
   */
  key = sanitizeKey(key);

  /**
   * Check if the session storage is available and the key is valid.
   */
  if (Manager.storage && key && typeof key === 'string') {
    /**
     * Remove the value from the session storage using the sanitized key.
     */
    return Manager.storage.remove(key);
  }

  /**
   * If the key is invalid or the value is not found, return undefined.
   */
  return undefined;
};

/**
 * Removes all values from the session storage.
 * 
 * This function removes all values from the session storage.
 * 
 * @returns {any} The result of removing all values, or undefined if the key is invalid or the session storage is not available.
 */
const removeAll = () => {
  /**
   * Check if the session storage is available and the key is valid.
   */
  if (Manager.storage) {
    /**
     * Remove all values from the session storage.
     */
    return Manager.storage.removeAll();
  }

  /**
   * If the key is invalid or the session storage is not available, return undefined.
   */
  return undefined;
};


/**
 * Interface for a session storage object.
 * 
 * This interface defines the methods for setting, getting, and removing values from a session storage object.
 */
export interface ISessionStorage {
  /**
   * Sets a value in the session storage object.
   * 
   * @param {string} key - The key to set the value for.
   * @param {any} value - The value to set.
   * @param {boolean} [decycle] - Optional parameter to decycle the value.
   * @returns {any} The set value.
   */
  set: (key: string, value: any, decycle?: boolean) => any;

  /**
   * Gets a value from the session storage object.
   * 
   * @param {string} key - The key to get the value for.
   * @returns {any} The value associated with the key.
   */
  get: (key: string) => any;

  /**
   * Removes a value from the session storage object.
   * 
   * @param {string} key - The key to remove the value for.
   * @returns {any} The removed value.
   */
  remove: (key: string) => any;

  /**
   * Removes all values from the session storage object.
   * 
   */
  removeAll: () => any;
};

/**
 * Checks if the given storage object is valid.
 * 
 * A storage object is considered valid if it has the following methods:
 * - `get`
 * - `set`
 * - `remove`
 * 
 * @param {ISessionStorage} storage - The storage object to check.
 * @returns {boolean} `true` if the storage object is valid, `false` otherwise.
 */
const isValidStorage = (storage?: ISessionStorage): boolean => {
  /**
   * Check if the storage object is null or undefined.
   * If so, return false immediately.
   */
  if (!storage) return false;

  try {
    /**
     * Check if the storage object has the required methods.
     * If any of these checks fail, the storage object is not valid.
     */
    return ["get", "set", "remove", "removeAll"].every((value) => typeof (storage as IDict)[value] === "function");
  } catch {
    /**
     * If an error occurs during the checks, return false.
     */
    return false;
  }
};

export const Session = { get, set, remove, handleGetValue, sanitizeKey, handleSetValue, isValidStorage, Manager, removeAll }


/**
 * Decorator to set the session storage object.
 * 
 * This decorator is used to set the session storage object for the Manager.
 * It creates a new instance of the target class and assigns it to the Manager's storage property.
 * 
 * @example
 * ```typescript
 * @SessionStorage()
 * class MySessionStorage implements ISessionStorage {
    set (key: string, value: any, decycle?: boolean) {
      console.log("set", key, value);
    }
    get (key: string){
      return "get";
    }
    remove(key: string) {
      console.log("remove", key);
    }
    removeAll(){
      console.log("removeAll");
    }
  }
 * ```
 * 
 * @param target The target class that implements the ISessionStorage interface.
 * @throws {Error} If an error occurs while creating a new instance of the target class.
 */
export function SessionStorage() {
  return function (target: IClassConstructor<ISessionStorage>) {
    try {
      const storage = new target();
      if (!isValidStorage(storage)) {
        return;
      }
      Manager.storage = storage;
    } catch (error) {
      console.error(error, " registering session storage");
    }
  };
}