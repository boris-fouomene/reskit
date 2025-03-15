/**
 * @module TypeMergeUtilities
 * @description Utility types for merging TypeScript interfaces with uniqueness constraints
 */

/**
 * Identifies common keys that exist in both T and U types.
 * 
 * @template T The first type
 * @template U The second type
 * @returns A union type containing all keys that exist in both T and U
 * 
 * @example
 * ```typescript
 * interface Person { name: string; age: number; email: string; }
 * interface Contact { phone: string; email: string; address: string; }
 * 
 * // Results in type: 'email'
 * type DuplicateKeys = ICommonKeys<Person, Contact>;
 * ```
 */
export type ICommonKeys<T, U> = keyof T & keyof U;

/**
 * Extracts all keys from type U that don't exist in type T.
 * 
 * @template T The type whose keys should be excluded
 * @template U The type from which to extract unique keys
 * @returns A union type containing keys from U that don't exist in T
 * 
 * @example
 * ```typescript
 * interface Person { name: string; age: number; }
 * interface Employee { name: string; jobTitle: string; salary: number; }
 * 
 * // Results in type: 'jobTitle' | 'salary'
 * type UniqueEmployeeKeys = IExcludeCommonKeys<Person, Employee>;
 * ```
 */
export type IExcludeCommonKeys<T, U> = Exclude<keyof U, keyof T>;

/**
 * Creates a new type from U by removing all properties that already exist in T.
 * 
 * @template T The type whose keys should be excluded
 * @template U The type to filter
 * @returns A type containing only properties from U that don't exist in T
 * 
 * @example
 * ```typescript
 * interface Person { name: string; age: number; email: string; }
 * interface Contact { phone: string; email: string; address: string; }
 * 
 * // Results in type: { phone: string; address: string; }
 * type UniqueContactProps = IOmitCommonKeys<Person, Contact>;
 * ```
 */
export type IOmitCommonKeys<T, U> = {
    [K in IExcludeCommonKeys<T, U>]: U[K]
};

/**
 * Merges two types T and U, giving priority to properties in T when duplicates exist.
 * This prevents duplicate property errors while providing a clean merged interface.
 * 
 * @template T The primary type (properties from this type take precedence)
 * @template U The secondary type (only non-duplicate properties are included)
 * @returns A merged type containing all properties from T and unique properties from U
 * 
 * @example
 * ```typescript
 * interface Person {
 *   name: string;
 *   age: number;
 *   email: string; // This will be kept in the merged type
 * }
 * 
 * interface Employee {
 *   employeeId: string;
 *   department: string;
 *   email: string; // This will be ignored in the merged type
 *   salary: number;
 * }
 * 
 * // Results in:
 * // {
 * //   name: string;
 * //   age: number;
 * //   email: string; // From Person
 * //   employeeId: string;
 * //   department: string;
 * //   salary: number;
 * // }
 * type EmployeeRecord = IMergeWithoutDuplicates<Person, Employee>;
 * ```
 */
export type IMergeWithoutDuplicates<T, U> = T & IOmitCommonKeys<T, U>;

/**
 * Detects if there are any duplicate properties between types T and U.
 * Returns 'never' if no duplicates exist, otherwise returns a union of the duplicate keys.
 * 
 * @template T The first type
 * @template U The second type
 * @returns 'never' if no duplicates, otherwise a union of duplicate keys
 * 
 * @example
 * ```typescript
 * interface User { id: number; username: string; }
 * interface Profile { avatar: string; bio: string; }
 * 
 * // Results in: never (no duplicates)
 * type UserProfileConflicts = IHasDuplicates<User, Profile>;
 * 
 * interface Auth { username: string; password: string; }
 * 
 * // Results in: 'username' (duplicate property)
 * type UserAuthConflicts = IHasDuplicates<User, Auth>;
 * ```
 */
export type IHasDuplicates<T, U> = ICommonKeys<T, U> extends never ? never : ICommonKeys<T, U>;

/**
 * A stricter merge utility that triggers a TypeScript error if any duplicate properties exist.
 * This is useful during development to ensure you're not accidentally overriding properties.
 * 
 * @template T The first type
 * @template U The second type
 * @returns A merged type if no duplicates exist, otherwise results in a type error
 * 
 * @example
 * ```typescript
 * interface User { id: number; name: string; }
 * interface Settings { theme: string; language: string; }
 * 
 * // Works fine because there are no duplicates
 * type UserSettings = IStrictMerge<User, Settings>;
 * 
 * interface Profile { name: string; bio: string; }
 * 
 * // Error: Type 'name' is present in both types and cannot be merged
 * type UserProfile = IStrictMerge<User, Profile>;
 * ```
 */
export type IStrictMerge<T, U> = IHasDuplicates<T, U> extends never
    ? T & U
    : never;