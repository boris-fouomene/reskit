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
   * The namespace prefix to use for all keys in the session storage.
   * 
   * This property is optional and can be set using the `keyNamespace` setter.
   */
  private static _keyNamespace?: string = undefined;

  /**
   * Retrieves or initializes the session storage implementation used by the Manager.
   * 
   * This getter implements a sophisticated storage initialization strategy with multiple fallback mechanisms
   * to ensure reliable session storage across different environments and platforms. The method follows
   * a priority-based approach to determine the most suitable storage implementation available.
   * 
   * ### Storage Priority Order:
   * 1. **Custom Attached Storage** - Storage registered via {@link AttachSessionStorage} decorator
   * 2. **Browser localStorage** - Native browser localStorage (client-side only)
   * 3. **In-Memory Storage** - Fallback dictionary-based storage (server-side or fallback)
   * 
   * ### Initialization Process:
   * The getter performs the following steps in order:
   * 1. Checks for custom storage registered via reflection metadata
   * 2. Validates the custom storage using {@link isValidStorage}
   * 3. Falls back to browser localStorage if available and valid
   * 4. Creates in-memory storage as the final fallback option
   * 5. Caches the initialized storage for subsequent calls
   * 
   * ### Platform Detection:
   * Uses {@link Platform.isClientSide} to detect the execution environment and choose
   * appropriate storage mechanisms. This ensures compatibility across:
   * - **Browser environments** - Uses localStorage when available
   * - **Server-side rendering** - Uses in-memory storage
   * - **Node.js environments** - Uses in-memory storage
   * - **React Native** - Can use custom storage implementations
   * 
   * @returns The active session storage implementation conforming to {@link ISessionStorage}
   * 
   * @example
   * ```typescript
   * // Basic usage - get the current storage
   * const storage = Manager.storage;
   * 
   * // Use storage directly
   * storage.set('userToken', 'abc123');
   * const token = storage.get('userToken');
   * storage.remove('userToken');
   * ```
   * 
   * @example
   * ```typescript
   * // Storage will automatically use localStorage in browser
   * if (Platform.isClientSide()) {
   *   const storage = Manager.storage; // Uses localStorage
   *   storage.set('preferences', { theme: 'dark', lang: 'en' });
   *   
   *   // Data persists across page reloads
   *   window.location.reload();
   *   const prefs = storage.get('preferences'); // Still available
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // Server-side usage automatically uses in-memory storage
   * import { Manager } from '@resk/core/session';
   * 
   * // In Node.js environment
   * const storage = Manager.storage; // Uses in-memory storage
   * storage.set('sessionData', { userId: 123 });
   * 
   * // Data only persists during application lifetime
   * const data = storage.get('sessionData');
   * console.log(data); // { userId: 123 }
   * ```
   * 
   * @example
   * ```typescript
   * // Custom storage integration example
   * @AttachSessionStorage()
   * class RedisStorage implements ISessionStorage {
   *   constructor(private redis: RedisClient) {}
   *   
   *   get(key: string): any {
   *     return this.redis.get(key);
   *   }
   *   
   *   set(key: string, value: any): any {
   *     this.redis.set(key, JSON.stringify(value));
   *     return value;
   *   }
   *   
   *   remove(key: string): any {
   *     const value = this.get(key);
   *     this.redis.del(key);
   *     return value;
   *   }
   *   
   *   removeAll(): any {
   *     this.redis.flushall();
   *   }
   * }
   * 
   * // Now Manager.storage will use Redis
   * const storage = Manager.storage; // Returns RedisStorage instance
   * ```
   * 
   * @example
   * ```typescript
   * // Storage with error handling
   * try {
   *   const storage = Manager.storage;
   *   
   *   // Attempt to store large object
   *   const largeData = new Array(1000000).fill('data');
   *   storage.set('largeObject', largeData);
   *   
   * } catch (error) {
   *   console.error('Storage quota exceeded:', error);
   *   
   *   // Fallback to essential data only
   *   const storage = Manager.storage;
   *   storage.set('essentialData', { id: 1 });
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // Checking storage capabilities
   * const storage = Manager.storage;
   * 
   * // Test if storage is persistent (localStorage) or temporary (in-memory)
   * storage.set('test', 'value');
   * 
   * if (Platform.isClientSide() && window.localStorage) {
   *   console.log('Using persistent localStorage');
   *   // Data will survive page reloads
   * } else {
   *   console.log('Using temporary in-memory storage');
   *   // Data will be lost on page reload
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // Advanced: Storage introspection
   * const storage = Manager.storage;
   * 
   * // Check which storage implementation is active
   * if ('localStorage' in storage.get.toString()) {
   *   console.log('Using browser localStorage');
   * } else if ('InMemoryStorage' in storage.get.toString()) {
   *   console.log('Using in-memory storage');
   * } else {
   *   console.log('Using custom storage implementation');
   * }
   * ```
   * 
   * @see {@link ISessionStorage} - Interface that all storage implementations must follow
   * @see {@link AttachSessionStorage} - Decorator for registering custom storage implementations
   * @see {@link isValidStorage} - Function used to validate storage implementations
   * @see {@link Platform.isClientSide} - Platform detection utility
   * @see {@link JsonHelper} - JSON serialization utilities used by storage
   * 
   * @since 1.0.0
   * @public
   * 
   * @remarks
   * **Important Behavior Notes:**
   * - The storage is initialized lazily on first access for optimal performance
   * - Once initialized, the same storage instance is reused for all subsequent calls
   * - Custom storage registered via {@link AttachSessionStorage} takes highest priority
   * - Browser localStorage is only used in client-side environments with proper window object
   * - In-memory storage is automatically garbage collected when the application ends
   * 
   * **Browser Compatibility:**
   * - Checks for `window.localStorage` availability before attempting to use it
   * - Gracefully degrades to in-memory storage if localStorage is disabled/unavailable
   * - Works in all major browsers including legacy versions
   * - Supports private/incognito browsing modes that may disable localStorage
   * 
   * **Performance Characteristics:**
   * - **localStorage**: Synchronous, persistent, ~5-10MB limit per origin
   * - **In-memory**: Synchronous, non-persistent, limited by available RAM
   * - **Custom storage**: Performance depends on implementation (can be async)
   * 
   * **Security Considerations:**
   * - localStorage data is accessible to all scripts on the same origin
   * - In-memory storage is more secure as it's not persistent
   * - Custom storage implementations should implement appropriate security measures
   * - Consider encryption for sensitive data regardless of storage type
   * 
   * **Thread Safety:**
   * - localStorage operations are synchronous and atomic
   * - In-memory storage access is synchronous but not thread-safe across workers
   * - Custom storage implementations should handle concurrency appropriately
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
  }  /**
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

  public static get keyNamespace(): string {
    return isNonNullString(this._keyNamespace) ? this._keyNamespace : "";
  }

  public static set keyNamespace(prefix: string) {
    if (isNonNullString(prefix)) {
      this._keyNamespace = prefix;
    }
  }


  public static sanitizeKey(key?: string): string {
    if (!key || !isNonNullString(key)) return "";
    key = key.trim().replace(/\s+/g, "").replace(/ /gi, "");
    const keyPrefix = isNonNullString(this.keyNamespace) && this._keyNamespace || "";
    if (keyPrefix) return `${keyPrefix}-${key}`;
    return key;
  }
}


/**
 * Sanitizes a string for session storage.
 * 
 * This function trims and removes whitespace from the key, and adds the namespace prefix if set.
 * \nExample
 * ```typescript
    Manager.keyNamespace = "my-prefix-";
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
 * Class decorator that attaches a custom session storage implementation to the global session Manager.
 * 
 * This decorator provides a clean and declarative way to register custom storage implementations
 * that will be used throughout the application for session management. When applied to a class,
 * it automatically instantiates the class and registers it as the global storage provider.
 * 
 * The decorator implements the Dependency Injection pattern for storage providers, allowing
 * applications to easily swap between different storage implementations (localStorage, 
 * sessionStorage, IndexedDB, in-memory storage, etc.) without changing the core session logic.
 * 
 * ### Features:
 * - **Automatic Registration**: Instantiates and registers the storage class automatically
 * - **Validation**: Ensures the storage implementation meets the required interface
 * - **Error Handling**: Gracefully handles instantiation failures
 * - **Type Safety**: Enforces ISessionStorage interface compliance at compile time
 * - **Global Scope**: Makes the storage available throughout the entire application
 * 
 * ### Storage Requirements:
 * The decorated class must implement the {@link ISessionStorage} interface with these methods:
 * - `get(key: string): any` - Retrieve a value by key
 * - `set(key: string, value: any, decycle?: boolean): any` - Store a value with optional decycling
 * - `remove(key: string): any` - Remove a value by key
 * - `removeAll(): any` - Clear all stored values
 * 
 * @decorator
 * @param target - The class constructor that implements {@link ISessionStorage}
 * 
 * @returns A class decorator function that registers the storage implementation
 * 
 * @throws {Error} Logs error to console if storage instantiation fails, but doesn't throw
 * 
 * @example
 * ```typescript
 * // Basic localStorage implementation
 * @AttachSessionStorage()
 * class LocalStorageProvider implements ISessionStorage {
 *   get(key: string): any {
 *     return localStorage.getItem(key);
 *   }
 *   
 *   set(key: string, value: any): any {
 *     localStorage.setItem(key, String(value));
 *     return value;
 *   }
 *   
 *   remove(key: string): any {
 *     const value = this.get(key);
 *     localStorage.removeItem(key);
 *     return value;
 *   }
 *   
 *   removeAll(): any {
 *     localStorage.clear();
 *   }
 * }
 * 
 * // Now Session.get(), Session.set(), etc. will use localStorage
 * Session.set('user', { id: 1, name: 'John' });
 * const user = Session.get('user'); // Retrieves from localStorage
 * ```
 * 
 * @example
 * ```typescript
 * // Custom encrypted storage implementation
 * @AttachSessionStorage()
 * class EncryptedStorageProvider implements ISessionStorage {
 *   private encrypt(value: string): string {
 *     // Your encryption logic here
 *     return btoa(value); // Simple base64 for demo
 *   }
 *   
 *   private decrypt(value: string): string {
 *     // Your decryption logic here
 *     return atob(value); // Simple base64 decode for demo
 *   }
 *   
 *   get(key: string): any {
 *     const encrypted = localStorage.getItem(key);
 *     return encrypted ? this.decrypt(encrypted) : null;
 *   }
 *   
 *   set(key: string, value: any): any {
 *     const encrypted = this.encrypt(String(value));
 *     localStorage.setItem(key, encrypted);
 *     return value;
 *   }
 *   
 *   remove(key: string): any {
 *     const value = this.get(key);
 *     localStorage.removeItem(key);
 *     return value;
 *   }
 *   
 *   removeAll(): any {
 *     localStorage.clear();
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // In-memory storage with expiration
 * @AttachSessionStorage()
 * class ExpiringMemoryStorage implements ISessionStorage {
 *   private storage = new Map<string, { value: any; expires: number }>();
 *   
 *   get(key: string): any {
 *     const item = this.storage.get(key);
 *     if (!item) return null;
 *     
 *     if (Date.now() > item.expires) {
 *       this.storage.delete(key);
 *       return null;
 *     }
 *     
 *     return item.value;
 *   }
 *   
 *   set(key: string, value: any, ttl: number = 3600000): any { // 1 hour default
 *     this.storage.set(key, {
 *       value,
 *       expires: Date.now() + ttl
 *     });
 *     return value;
 *   }
 *   
 *   remove(key: string): any {
 *     const item = this.storage.get(key);
 *     this.storage.delete(key);
 *     return item?.value;
 *   }
 *   
 *   removeAll(): any {
 *     this.storage.clear();
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Database-backed storage implementation
 * @AttachSessionStorage()
 * class DatabaseStorageProvider implements ISessionStorage {
 *   constructor(private db: Database) {}
 *   
 *   async get(key: string): Promise<any> {
 *     const result = await this.db.query('SELECT value FROM sessions WHERE key = ?', [key]);
 *     return result.length ? JSON.parse(result[0].value) : null;
 *   }
 *   
 *   async set(key: string, value: any): Promise<any> {
 *     const serialized = JSON.stringify(value);
 *     await this.db.query(
 *       'INSERT OR REPLACE INTO sessions (key, value) VALUES (?, ?)',
 *       [key, serialized]
 *     );
 *     return value;
 *   }
 *   
 *   async remove(key: string): Promise<any> {
 *     const value = await this.get(key);
 *     await this.db.query('DELETE FROM sessions WHERE key = ?', [key]);
 *     return value;
 *   }
 *   
 *   async removeAll(): Promise<any> {
 *     await this.db.query('DELETE FROM sessions');
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Testing with mock storage
 * @AttachSessionStorage()
 * class MockStorageProvider implements ISessionStorage {
 *   private mockData = new Map<string, any>();
 *   
 *   get(key: string): any {
 *     console.log(`[MOCK] Getting key: ${key}`);
 *     return this.mockData.get(key);
 *   }
 *   
 *   set(key: string, value: any): any {
 *     console.log(`[MOCK] Setting key: ${key}, value:`, value);
 *     this.mockData.set(key, value);
 *     return value;
 *   }
 *   
 *   remove(key: string): any {
 *     console.log(`[MOCK] Removing key: ${key}`);
 *     const value = this.mockData.get(key);
 *     this.mockData.delete(key);
 *     return value;
 *   }
 *   
 *   removeAll(): any {
 *     console.log(`[MOCK] Clearing all data`);
 *     this.mockData.clear();
 *   }
 * }
 * ```
 * 
 * @see {@link ISessionStorage} - The interface that storage implementations must implement
 * @see {@link Manager} - The session manager that uses the attached storage
 * @see {@link Session} - The exported session utilities that use the attached storage
 * @see {@link isValidStorage} - Function used to validate storage implementations
 * 
 * @since 1.0.0
 * @public
 * 
 * @remarks
 * **Important Notes:**
 * - Only one storage implementation can be active at a time
 * - The decorator should be applied before any session operations are performed
 * - Storage validation is performed automatically - invalid implementations are ignored
 * - If no custom storage is attached, the system falls back to localStorage or in-memory storage
 * - The storage instance is created immediately when the decorator is processed
 * 
 * **Best Practices:**
 * - Implement proper error handling in your storage methods
 * - Consider implementing data serialization/deserialization for complex objects
 * - Add logging for debugging purposes in development environments
 * - Use appropriate storage mechanisms based on your application's needs
 * - Test your storage implementation thoroughly, especially error scenarios
 * 
 * **Performance Considerations:**
 * - Storage operations should be fast as they're used frequently
 * - Consider implementing caching for expensive storage operations
 * - Be mindful of storage size limits (especially for localStorage)
 * - Implement cleanup strategies for temporary data
 */
export function AttachSessionStorage() {
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