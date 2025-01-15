/**
 * Represents a scalar value that can be used in filtering operations.
 * 
 * This type can be one of the following:
 * - A string (e.g., "example")
 * - A number (e.g., 42)
 * - A boolean (e.g., true or false)
 * - A null value (e.g., null)
 * - A Date object (e.g., new Date())
 * 
 * @example
 * // Valid examples of IMangoScalarValue
 * const stringValue: IMangoScalarValue = "Hello, World!";
 * const numberValue: IMangoScalarValue = 100;
 * const booleanValue: IMangoScalarValue = true;
 * const nullValue: IMangoScalarValue = null;
 * const dateValue: IMangoScalarValue = new Date();
 */
type IMangoScalarValue = string | number | boolean | null | Date;

/**
 * Represents a value that can be used in filtering operations.
 * 
 * This type can be a single scalar value, an array of scalar values, or an object.
 * 
 * @example
 * // Valid examples of IMangoValue
 * const singleValue: IMangoValue = "example";
 * const arrayValue: IMangoValue = [1, 2, 3];
 * const objectValue: IMangoValue = { key: "value" };
 */
export type IMangoValue = IMangoScalarValue | IMangoScalarValue[] | object;

/**
 * Options for regular expression filtering.
 * 
 * This interface allows you to specify a regular expression pattern and optional flags
 * to modify its behavior.
 * 
 * @property $regex - The regular expression pattern to match against.
 * @property $options - Optional flags to modify the regex behavior. Valid options include:
 * - 'i' for case insensitive matching
 * - 'm' for multiline matching
 * - 's' for dotall matching (allows '.' to match newline characters)
 * - 'x' for extended syntax (allows whitespace and comments in the regex)
 * 
 * @example
 * // Example of using IMangoRegexOptions
 * const regexOptions: IMangoRegexOptions = {
 *     $regex: "^test.*",
 *     $options: "i" // Case insensitive match
 * };
 */
export interface IMangoRegexOptions {
  $regex: string;
  $options?: string; // Valid options: 'i' (case insensitive), 'm' (multiline), 's' (dotall), 'x' (extended)
}

/**
 * Interface representing various comparison operators for filtering operations.
 * 
 * This interface allows you to specify conditions for querying data based on
 * different comparison criteria. Each property corresponds to a specific
 * comparison operation that can be applied to filter results.
 * 
 * @example
 * // Example of using IMangoComparisonOperators
 * const filter: IMangoComparisonOperators = {
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
 *     $regex: {                // Matches documents where the field matches the regex pattern
 *         $regex: "^test.*",
 *         $options: "i"       // Case insensitive match
 *     },
 *     $size: 3,                // Matches documents where the field is an array of size 3
 *     $mod: [2, 0],            // Matches documents where the field modulo 2 equals 0
 *     $all: [1, 2],            // Matches documents where the array contains all specified values
 *     $elemMatch: {            // Matches documents where at least one element in the array matches the criteria
 *         field: { $gt: 10 }
 *     }
 * };
 */
export interface IMangoComparisonOperators {
  $eq?: IMangoValue;              // equals
  $ne?: IMangoValue;              // not equals
  $gt?: IMangoValue;              // greater than
  $gte?: IMangoValue;             // greater than or equal
  $lt?: IMangoValue;              // less than
  $lte?: IMangoValue;             // less than or equal
  $in?: IMangoValue[];            // in array
  $nin?: IMangoValue[];           // not in array
  $exists?: boolean;               // field exists
  $type?: string;                  // type check
  $regex?: string | IMangoRegexOptions; // regular expression
  $size?: number;                  // array size
  $mod?: [number, number];         // modulo
  $all?: IMangoValue[];           // array contains all
  $elemMatch?: IMangoQuery;    // element match
}

/**
 * Interface representing logical operators for filtering operations.
 * 
 * This interface allows you to combine multiple filter conditions using logical
 * operators. It provides a way to create complex queries by specifying how
 * different conditions relate to each other.
 * 
 * @example
 * // Example of using IMangoLogicalOperator
 * const filter: IMangoLogicalOperator = {
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
export interface IMangoLogicalOperator {
  $and?: IMangoQuery[]; // An array of filter selectors that must all match
  $or?: IMangoQuery[];  // An array of filter selectors where at least one must match
  $nor?: IMangoQuery[]; // An array of filter selectors where none must match
  $not?: IMangoQuery | IMangoComparisonOperators; // A filter selector or comparison operator that must not match
}

/**
 * Interface representing array operators for filtering operations.
 * 
 * This interface allows you to specify conditions for querying data that involves
 * arrays. It provides options to match documents based on the contents of arrays
 * and their elements.
 * 
 * @example
 * // Example of using IMangoArrayOperators
 * const filter: IMangoArrayOperators = {
 *     $all: [1, 2, 3], // Matches documents where the array contains all specified values
 *     $elemMatch: {    // Matches documents where at least one element in the array matches the criteria
 *         field: { $gt: 10 } // At least one element must be greater than 10
 *     }
 * };
 */
export interface IMangoArrayOperators {
  $all?: IMangoValue[];       // Matches documents where the array contains all specified values
  $elemMatch?: IMangoQuery; // Matches documents where at least one element in the array matches the criteria
}

/**
 * Type representing a filter selector for querying data.
 * 
 * This type allows you to define a flexible structure for filter conditions,
 * where each field can be associated with various types of filter values or
 * operators. It supports scalar values, comparison operators, logical operators,
 * and array operators, enabling complex query constructions.
 * 
 * @example
 * // Example of using IMangoQuery
 * const filter: IMangoQuery = {
 *     name: { $eq: "John Doe" }, // Matches documents where the name equals "John Doe"
 *     age: { $gte: 18 },         // Matches documents where age is greater than or equal to 18
 *     status: { $in: ["active", "pending"] }, // Matches documents where status is either "active" or "pending"
 *     $or: [                     // Logical OR condition
 *         { role: { $eq: "admin" } }, // Matches documents where role is "admin"
 *         { role: { $eq: "editor" } } // Matches documents where role is "editor"
 *     ],
 *     tags: {                    // Array condition
 *         $all: ["urgent", "important"] // Matches documents where tags contain both "urgent" and "important"
 *     }
 * };
 */
export type IMangoQuery = {
  [field: string]:
  | IMangoValue
  | IMangoComparisonOperators
  | IMangoLogicalOperator
  | IMangoArrayOperators
  & { [field: string]: IMangoQuery }; // Allows nesting of filter selectors
} & Partial<IMangoLogicalOperator>; // Allows inclusion of logical operators

/**
 * Type representing the direction of sorting operations.
 * 
 * This type can be either 'asc' for ascending order or 'desc' for descending order.
 * 
 * @example
 * // Valid examples of IMangoOrderByDirection
 * const ascending: IMangoOrderByDirection = 'asc';  // Ascending order
 * const descending: IMangoOrderByDirection = 'desc'; // Descending order
 */
export type IMangoOrderByDirection = 'asc' | 'desc';

/**
 * Type representing the sorting criteria for filtering operations.
 * 
 * This type can be a string representing a single field to sort by, an object
 * where each key is a field name and the value is the sort direction, or an array
 * of such objects for multiple sorting criteria.
 * 
 * @example
 * // Valid examples of IMangoOrderBy
 * const singleFieldSort: IMangoOrderBy = 'name'; // Sort by the 'name' field
 * const objectSort: IMangoOrderBy = { age: 'asc', name: 'desc' }; // Sort by 'age' ascending and 'name' descending
 * const arraySort: IMangoOrderBy = [{ age: 'asc' }, { name: 'desc' }]; // Sort by 'age' ascending and 'name' descending using an array
 */
export type IMangoOrderBy = string | { [field: string]: IMangoOrderByDirection } | Array<{ [field: string]: IMangoOrderByDirection }>;
