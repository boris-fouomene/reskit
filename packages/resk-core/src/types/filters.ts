/**
 * Interface representing various comparison operators for filtering operations.
 * 
 * This interface allows you to specify conditions for querying data based on
 * different comparison criteria. Each property corresponds to a specific
 * comparison operation that can be applied to filter results.
 * 
 * @example
 * // Example of using IMongoComparisonOperators
 * const filter: IMongoComparisonOperators = {
 *     $eq: "example",          // Matches documents where the field equals "example"
 *     $ne: 42,                 // Matches documents where the field is not equal to 42
 *     $gt: 100,                // Matches documents where the field is greater than 100
 *     $gte: 50,                // Matches documents where the field is greater than or equal to 50
 *     $lt: 10,                 // Matches documents where the field is less than 10
 *     $lte: 5,                 // Matches documents where the field is less than or equal to 5
 *     $in: ["apple", "banana"], // Matches documents where the field is in the specified array
 *     $nin: [1, 2, 3],         // Matches documents where the field is not in the specified array
 *     $exists: true,           // Matches documents where the field exists
 *     $type: "string",         // Matches documents where the field is of type string
 *     $regex: "^test.*",
 *     $options: "i"       // Case insensitive match
 *     $size: 3,                // Matches documents where the field is an array of size 3
 *     $mod: [2, 0],            // Matches documents where the field modulo 2 equals 0
 *     $all: [1, 2],            // Matches documents where the array contains all specified values
 *     $elemMatch: {            // Matches documents where at least one element in the array matches the criteria
 *         field: { $gt: 10 }
 *     }
 * };
 */
export interface IMongoComparisonOperators<T = any> extends IMongoArrayOperators<T> {
  $eq?: T;              // equals
  $ne?: T;              // not equals
  $gt?: T;              // greater than
  $gte?: T;             // greater than or equal
  $lt?: T;              // less than
  $lte?: T;             // less than or equal
  $exists?: boolean;               // field exists
  $type?: string;                  // type check
  $regex?: string | RegExp;  // regular expression
  $options?: string;             // regex options
  $size?: number;                  // array size
};


/**
 * Interface representing logical operators for filtering operations.
 * 
 * This interface allows you to combine multiple filter conditions using logical
 * operators. It provides a way to create complex queries by specifying how
 * different conditions relate to each other.
 * 
 * @example
 * // Example of using IMongoLogicalOperators
 * const filter: IMongoLogicalOperators = {
 *     $and: [
 *         { age: { $gte: 18 } }, // Must be 18 or older
 *         { status: "active" }   // Must be active
 *     ],
 *     $or: [
 *         { role: "admin" },     // Either role is admin
 *         { role: "editor" }     // Or role is editor
 *     ],
 *     $nor: [
 *         { deleted: true }      // Must not be deleted
 *     ],
 *     $not: {                  // Must not match this condition
 *         status: "inactive"   // Must not be inactive
 *     }
 * };
 */
export interface IMongoLogicalOperators<T = any> {
  $and?: IMongoQuery<T>[]; // An array of filter selectors that must all match
  $or?: IMongoQuery<T>[];  // An array of filter selectors where at least one must match
  $nor?: IMongoQuery<T>[]; // An array of filter selectors where none must match
  $not?: IMongoQuery<T>; // A filter selector or comparison operator that must not match
}

/**
 * A type that represents the depth limit for recursion in MongoDB queries.
 * 
 * This type is used to limit the depth of nested objects in a query, preventing infinite recursion.
 * 
 * @typedef {number[]} IMongoQueryDepth
 * @example
 * // Example usage of IMongoQueryDepth
 * const depthLimit: IMongoQueryDepth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 */
type IMongoQueryDepth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * A type that generates dot notation paths with a depth limit.
 * 
 * This type is used to create a list of possible dot notation paths in a MongoDB query, taking into account the depth limit.
 * 
 * @typedef {object} IMongoCreateDotPaths
 * @template T - The type of the object being queried.
 * @template D - The depth limit for the query (default is 9).
 * @template Prefix - The prefix for the dot notation path (default is an empty string).
 * @property {string} [key] - A key in the object being queried.
 * @returns {string | never} - The dot notation path for the key, or never if the key is not a string or the depth limit is reached.
 * @example
 * // Example usage of IMongoCreateDotPaths
 * const paths: IMongoCreateDotPaths<{ a: { b: { c: string } } }> = {
 *   'a': 'a',
 *   'a.b': 'a.b',
 *   'a.b.c': 'a.b.c',
 * };
 */
type IMongoCreateDotPaths<T, D extends number = 9, Prefix extends string = ''> = D extends 0
  ? never
  : T extends object
  ? {
    [K in keyof T]: K extends string
    ? T[K] extends object
    ? `${Prefix}${K}` | IMongoCreateDotPaths<T[K], IMongoQueryDepth[D], `${Prefix}${K}.`>
    : `${Prefix}${K}`
    : never;
  }[keyof T]
  : never;


/**
 * A type that resolves the type of a value at a given path in an object.
 * 
 * This type is used to navigate through nested objects and retrieve the type of a value at a specific path.
 * 
 * @typedef {object} IMongoTypeAtPath
 * @template T - The type of the object being queried.
 * @template Path - The path to the value in the object (e.g. "a.b.c").
 * @template D - The depth limit for the query (default is 9).
 * @returns {T[Path] | never} - The type of the value at the given path, or never if the path is invalid or the depth limit is reached.
 * @example
 * // Example usage of IMongoTypeAtPath
 * const typeAtPath: IMongoTypeAtPath<{ a: { b: { c: string } } }, 'a.b.c'> = string;
 * 
 * // This would resolve to the type of the value at the path 'a.b.c' in the object.
 * 
 * @example
 * // Example usage of IMongoTypeAtPath with an invalid path
 * const invalidTypeAtPath: IMongoTypeAtPath<{ a: { b: { c: string } } }, 'a.b.d'> = never;
 * 
 * // This would resolve to never, because the path 'a.b.d' is invalid.
 */
type IMongoTypeAtPath<T, Path extends string, D extends number = 9> = D extends 0
  ? never
  : Path extends keyof T
  ? T[Path]
  : Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
  ? IMongoTypeAtPath<T[Key], Rest, IMongoQueryDepth[D]>
  : never
  : never;

/**
 * @interface IMongoQuery
 * A type that represents a MongoDB query.
 * 
 * This type is used to define a query that can be used to filter data in a MongoDB collection.
 * 
 * @typedef {object} IMongoQuery
 * @template T - The type of the data being queried (default is any).
 * @template D - The depth limit for the query (default is 9).
 * @property {string} [key] - A key in the data being queried.
 * @property {T[key]} [value] - The value of the key in the data being queried.
 * @property {IMongoComparisonOperators<T[key]>} [comparisonOperator] - A comparison operator to apply to the value.
 * @property {IMongoQuery<T[key], IMongoQueryDepth[D]>} [nestedQuery] - A nested query to apply to the value.
 * @property {IMongoLogicalOperators<T>} [logicalOperator] - A logical operator to apply to the query.
 * @returns {object} - The query object.
 * @example
 * // Example usage of IMongoQuery
 * ```typescript
 * interface TestDocument {
    name: string;
    age: number;
    address: {
      street: string;
      city: {
        name: string;
        country: {
          code: string;
          name: string;
        };
      };
    };
    tags: string[];
    scores: Array<{
      subject: string;
      value: number;
    }>;
  }

  // These should all work now
  const query1: IMongoQuery<TestDocument> = {
    'address.city.country.name': { $eq: 'France' },
    age: { $gt: 18 },
    tags: { $all: ['active', 'premium'] },
    scores: {
      $elemMatch: {
        subject: { $eq: 'math' },
        value: { $gte: 90 }
      }
    }
  };
  const query2: IMongoQuery<TestDocument> = {
    $or: [
      { 'address.city.country.code': 'FR' },
      { 
        $and: [
          { age: { $gte: 18 } },
          { tags: { $in: ['vip'] } }
        ]
      }
    ]
  };
 * 
 * // This would create a query that filters data where the name is 'John', the age is greater than 18, and the occupation is either 'Developer' or 'Engineer'.
 * ```	
 * @see {@link https://www.mongodb.com/docs/manual/reference/operator/query/} for more information on MongoDB query operators.
 * @see {@link IMongoArrayOperators} for more information on MongoDB array operators.
 * @see {@link IMongoComparisonOperators} for more information on MongoDB comparison operators.
 * @see {@link IMongoLogicalOperators} for more information on MongoDB logical operators.
 */
export type IMongoQuery<T = any, D extends number = 9> = D extends 0
  ? never
  : {
    [P in IMongoCreateDotPaths<T, D> | keyof T]?: P extends keyof T
    ? T[P] | IMongoComparisonOperators<T[P]> | (T[P] extends object ? IMongoQuery<T[P], IMongoQueryDepth[D]> : never)
    : P extends string
    ? IMongoTypeAtPath<T, P, D> | IMongoComparisonOperators<IMongoTypeAtPath<T, P, D>>
    : never;
  } & IMongoLogicalOperators<T>;

/**
 * Interface representing array operators for filtering operations.
 * 
 * This interface allows you to specify conditions for querying data that involves
 * arrays. It provides options to match documents based on the contents of arrays
 * and their elements.
 * 
 * @example
 * // Example of using IMongoArrayOperators
 * const filter: IMongoArrayOperators = {
 *     $all: [1, 2, 3], // Matches documents where the array contains all specified values
 *     $elemMatch: {    // Matches documents where at least one element in the array matches the criteria
 *         field: { $gt: 10 } // At least one element must be greater than 10
 *     }
 * };
 */
export interface IMongoArrayOperators<T = any> {
  $in?: T extends Array<any> ? T : T[];            // in array
  $nin?: T extends Array<any> ? T : T[];           // not in array
  $all?: T extends Array<any> ? T : T[];
  $elemMatch?: T extends Array<any> ? IMongoQuery<T[number]> : never;
}

/**
 * A type that represents the names of all available comparison operators
 * defined in the `IMongoComparisonOperators` interface.
 * 
 * This type is a union of the keys from the `IMongoComparisonOperators` interface,
 * allowing for a concise way to refer to any comparison operator name that can
 * be used in MongoDB queries. It ensures type safety and reduces the risk
 * of typos in operator names.
 * 
 * @type IMongoComparisonOperatorName
 * @example
 * // Example usage of IMongoComparisonOperatorName
 * const comparisonOperator1: IMongoComparisonOperatorName = "$eq"; // Valid, as $eq is a comparison operator
 * const comparisonOperator2: IMongoComparisonOperatorName = "$gt"; // Valid, as $gt is a comparison operator
 * 
 * // The following would cause a TypeScript error, as "$invalid" is not a defined comparison operator
 * // const invalidComparisonOperator: IMongoComparisonOperatorName = "$invalid"; // Error: Type '"$invalid"' is not assignable to type 'IMongoComparisonOperatorName'
 * 
 * @see {@link IMongoComparisonOperators} for a list of comparison operators.
 */
export type IMongoComparisonOperatorName = keyof IMongoComparisonOperators;

/**
 * @interface {IResourceQueryOptionsOrderByDirection}
 * Type representing the direction of sorting operations.
 * 
 * This type can be either 'asc' |'ASC' for ascending order or 'desc' | 'DESC' for descending order.
 * 
 * @example
 * // Valid examples of IResourceQueryOptionsOrderByDirection
 * const ascending: IResourceQueryOptionsOrderByDirection = 'asc';  // Ascending order
 * const descending: IResourceQueryOptionsOrderByDirection = 'desc'; // Descending order
 */
export type IResourceQueryOptionsOrderByDirection = 'asc' | 'desc';;

// Base type for a single order by field
type IResourceQueryOptionsOrderByField<DataType = any> = {
  [key in keyof DataType]: IResourceQueryOptionsOrderByDirection | IResourceQueryOptionsOrderByNestedField<DataType[key]>;
};

// Type for nested fields
type IResourceQueryOptionsOrderByNestedField<DataType = any> = Partial<{
  [key in keyof DataType]: IResourceQueryOptionsOrderByDirection | IResourceQueryOptionsOrderByNestedField<DataType[key]>;
}>;

/**
 * Represents an object with exactly one field derived from the keys of a given type `T`.
 *
 * This utility type ensures that:
 * - The resulting object has exactly one key-value pair.
 * - The key is one of the keys of `T`.
 * - The value corresponds to the type of the selected key in `T`.
 * - All other keys of `T` are explicitly disallowed by setting their types to `never`.
 *
 * @template T - The base type from which the single-field object is derived.
 *              Must be an object type with defined keys.
 *
 * @example
 * ```typescript
 * type ExampleType = { a: number; b: string; c: boolean };
 *
 * // Valid usage
 * const obj1: ISingleFieldOf<ExampleType> = { a: 42 }; // Single field 'a' with a number value
 * const obj2: ISingleFieldOf<ExampleType> = { b: "hello" }; // Single field 'b' with a string value
 * const obj3: ISingleFieldOf<ExampleType> = { c: true }; // Single field 'c' with a boolean value
 *
 * // Invalid usage
 * const invalidObj1: ISingleFieldOf<ExampleType> = { a: 42, b: "hello" }; // Error: More than one field
 * const invalidObj2: ISingleFieldOf<ExampleType> = {}; // Error: No fields
 * ```
 *
 * @remarks
 * This type is particularly useful when you need to enforce strict constraints on object structures,
 * such as in APIs or configuration objects where only one property can be specified at a time.
 *
 * It uses a mapped type combined with conditional logic to ensure that only one key is allowed.
 * Other keys are explicitly set to `never`, making them invalid if included in the object.
 */
export type ISingleFieldOf<T> = {
  /**
   * Iterates over each key `K` of `T` and constructs a union of objects with exactly one key-value pair.
   *
   * @template K - A key of `T`.
   * @template P - The current key being processed (same as `K`).
   *
   * @description
   * For each key `K` of `T`:
   * - `{ [P in K]: T[K] }` ensures that the object has a single key `K` with the corresponding value type from `T`.
   * - `{ [P in Exclude<keyof T, K>]?: never }` ensures that all other keys of `T` are disallowed by setting their types to `never`.
   *
   * @example
   * ```typescript
   * type ExampleType = { a: number; b: string; c: boolean };
   *
   * // For key 'a':
   * type FieldA = { a: number } & { b?: never; c?: never };
   * const validA: FieldA = { a: 42 }; // Valid
   * const invalidA: FieldA = { a: 42, b: "extra" }; // Error: 'b' is not allowed
   *
   * // For key 'b':
   * type FieldB = { b: string } & { a?: never; c?: never };
   * const validB: FieldB = { b: "hello" }; // Valid
   * const invalidB: FieldB = { b: "hello", c: true }; // Error: 'c' is not allowed
   * ```
   */
  [K in keyof T]: { [P in K]: T[K] } & { [P in Exclude<keyof T, K>]?: never };
}[keyof T];


/**
 * @interface IResourceQueryOptionsOrderBy
 * Represents the sorting options for a resource query.
 * 
 * The `IResourceQueryOptionsOrderBy` type allows specifying sorting criteria for a resource query.
 * It supports sorting by individual fields or nested fields within an object.
 * 
 * @template DataType - The type of the data being queried.
 * 
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   age: number;
 *   address: {
 *     city: string;
 *     country: string;
 *   };
 * }
 * 
 * const orderBy: IResourceQueryOptionsOrderBy<User> = [
 *   { name: "asc" }, // Sort by name in ascending order
 *   { age: "desc" }, // Sort by age in descending order
 *   { address: { city: "asc", country: "desc" } } // Nested sorting
 * ];
 * ```
 * 
 * @remarks
 * - Sorting direction can be `"asc"` (ascending) or `"desc"` (descending).
 * - Nested sorting is supported by specifying sorting directions for nested fields.
 * 
 * @see {@link IResourceQueryOptionsOrderByDirection} for sorting direction options.
 */
export type IResourceQueryOptionsOrderBy<DataType = any> = Array<
  ISingleFieldOf<IResourceQueryOptionsOrderByField<DataType>>
>;

/**
 * A collection of MongoDB operators categorized into logical, comparison, and array operators.
 * 
 * This constant provides a structured way to access various MongoDB operators that can be used
 * in queries. Each category contains a list of operator keys that correspond to their respective
 * types in MongoDB.
 * 
 * @constant
 * @type {Object}
 * @property {Array<keyof IMongoLogicalOperators>} LOGICAL - An array of logical operators.
 *   - **Example**: 
 *     - `$and`: Joins query clauses with a logical AND.
 *     - `$or`: Joins query clauses with a logical OR.
 *     - `$nor`: Joins query clauses with a logical NOR.
 *     - `$not`: Inverts the effect of a query expression.
 * 
 * @property {Array<keyof IMongoComparisonOperators>} COMPARATOR - An array of comparison operators.
 *   - **Example**: 
 *     - `$eq`: Matches values that are equal to a specified value.
 *     - `$ne`: Matches all values that are not equal to a specified value.
 *     - `$gt`: Matches values that are greater than a specified value.
 *     - `$gte`: Matches values that are greater than or equal to a specified value.
 *     - `$lt`: Matches values that are less than a specified value.
 *     - `$lte`: Matches values that are less than or equal to a specified value.
 *     - `$in`: Matches any of the values specified in an array.
 *     - `$nin`: Matches none of the values specified in an array.
 *     - `$exists`: Matches documents that have the specified field.
 *     - `$type`: Matches documents based on the type of the field.
 *     - `$regex`: Matches documents where the field value matches a specified regular expression.
 *     - `$size`: Matches any array with the number of elements specified.
 *     - `$mod`: Matches documents where the value of a field is equal to the specified value when divided by a specified divisor.
 *     - `$all`: Matches arrays that contain all elements specified in the query.
 *     - `$elemMatch`: Matches documents that contain an array field with at least one element that matches all the specified query criteria.
 * 
 * @property {Array<keyof IMongoArrayOperators>} ARRAY - An array of array operators.
 *   - **Example**: 
 *     - `$all`: Matches arrays that contain all elements specified in the query.
 *     - `$elemMatch`: Matches documents that contain an array field with at least one element that matches all the specified query criteria.
 *     - `$in`: Matches any of the values specified in an array.
 *     - `$nin`: Matches none of the values specified in an array.
 * 
 * @example
 * // Example usage of MANGO_OPERATORS in a MongoDB query
 * const query = {
 *   $or: [
 *     { age: { $gt: 18 } },
 *     { name: { $regex: /John/i } }
 *   ]
 * };
 * 
 * // This query will find documents where the age is greater than 18
 * // or the name matches the regex for "John".
 * 
 * @see {@link https://docs.mongodb.com/manual/reference/operator/|MongoDB Operators Documentation} for more details on each operator.
 */
export const MANGO_OPERATORS: {
  LOGICAL: (keyof IMongoLogicalOperators)[],
  COMPARATOR: (keyof IMongoComparisonOperators)[],
  ARRAY: (keyof IMongoArrayOperators)[],
} = {
  LOGICAL: ["$and", "$or", "$nor", "$not"] as (keyof IMongoLogicalOperators)[],
  COMPARATOR: ["$eq", "$ne", "$gt", "$gte", "$lt", "$lte", "$in", "$nin", "$exists", "$type", "$regex", "$size", "$mod", "$all", "$elemMatch"] as (keyof IMongoComparisonOperators)[],
  ARRAY: ["$all", "$elemMatch", "$in", "$nin"] as (keyof IMongoArrayOperators)[],
}