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
 * // Valid examples of IFilterScalarValue
 * const stringValue: IFilterScalarValue = "Hello, World!";
 * const numberValue: IFilterScalarValue = 100;
 * const booleanValue: IFilterScalarValue = true;
 * const nullValue: IFilterScalarValue = null;
 * const dateValue: IFilterScalarValue = new Date();
 */
type IFilterScalarValue = string | number | boolean | null | Date;

/**
 * Represents a value that can be used in filtering operations.
 * 
 * This type can be a single scalar value, an array of scalar values, or an object.
 * 
 * @example
 * // Valid examples of IFilterValue
 * const singleValue: IFilterValue = "example";
 * const arrayValue: IFilterValue = [1, 2, 3];
 * const objectValue: IFilterValue = { key: "value" };
 */
export type IFilterValue = IFilterScalarValue | IFilterScalarValue[] | object;

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
 * // Example of using IFilterRegexOptions
 * const regexOptions: IFilterRegexOptions = {
 *     $regex: "^test.*",
 *     $options: "i" // Case insensitive match
 * };
 */
export interface IFilterRegexOptions {
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
 * // Example of using IFilterComparisonOperators
 * const filter: IFilterComparisonOperators = {
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
export interface IFilterComparisonOperators {
    $eq?: IFilterValue;              // equals
    $ne?: IFilterValue;              // not equals
    $gt?: IFilterValue;              // greater than
    $gte?: IFilterValue;             // greater than or equal
    $lt?: IFilterValue;              // less than
    $lte?: IFilterValue;             // less than or equal
    $in?: IFilterValue[];            // in array
    $nin?: IFilterValue[];           // not in array
    $exists?: boolean;               // field exists
    $type?: string;                  // type check
    $regex?: string | IFilterRegexOptions; // regular expression
    $size?: number;                  // array size
    $mod?: [number, number];         // modulo
    $all?: IFilterValue[];           // array contains all
    $elemMatch?: IFilterSelector;    // element match
}

/**
 * Interface representing logical operators for filtering operations.
 * 
 * This interface allows you to combine multiple filter conditions using logical
 * operators. It provides a way to create complex queries by specifying how
 * different conditions relate to each other.
 * 
 * @example
 * // Example of using IFilterLogicalOperator
 * const filter: IFilterLogicalOperator = {
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
export interface IFilterLogicalOperator {
    $and?: IFilterSelector[]; // An array of filter selectors that must all match
    $or?: IFilterSelector[];  // An array of filter selectors where at least one must match
    $nor?: IFilterSelector[]; // An array of filter selectors where none must match
    $not?: IFilterSelector | IFilterComparisonOperators; // A filter selector or comparison operator that must not match
}

/**
 * Interface representing array operators for filtering operations.
 * 
 * This interface allows you to specify conditions for querying data that involves
 * arrays. It provides options to match documents based on the contents of arrays
 * and their elements.
 * 
 * @example
 * // Example of using IFilterArrayOperators
 * const filter: IFilterArrayOperators = {
 *     $all: [1, 2, 3], // Matches documents where the array contains all specified values
 *     $elemMatch: {    // Matches documents where at least one element in the array matches the criteria
 *         field: { $gt: 10 } // At least one element must be greater than 10
 *     }
 * };
 */
export interface IFilterArrayOperators {
    $all?: IFilterValue[];       // Matches documents where the array contains all specified values
    $elemMatch?: IFilterSelector; // Matches documents where at least one element in the array matches the criteria
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
 * // Example of using IFilterSelector
 * const filter: IFilterSelector = {
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
export type IFilterSelector = {
    [field: string]:
    | IFilterValue
    | IFilterComparisonOperators
    | IFilterLogicalOperator
    | IFilterArrayOperators
    & { [field: string]: IFilterSelector }; // Allows nesting of filter selectors
} & Partial<IFilterLogicalOperator>; // Allows inclusion of logical operators

/**
 * Type representing the direction of sorting operations.
 * 
 * This type can be either 'asc' for ascending order or 'desc' for descending order.
 * 
 * @example
 * // Valid examples of IFilterSortDirection
 * const ascending: IFilterSortDirection = 'asc';  // Ascending order
 * const descending: IFilterSortDirection = 'desc'; // Descending order
 */
export type IFilterSortDirection = 'asc' | 'desc';

/**
 * Type representing the sorting criteria for filtering operations.
 * 
 * This type can be a string representing a single field to sort by, an object
 * where each key is a field name and the value is the sort direction, or an array
 * of such objects for multiple sorting criteria.
 * 
 * @example
 * // Valid examples of IFilterSort
 * const singleFieldSort: IFilterSort = 'name'; // Sort by the 'name' field
 * const objectSort: IFilterSort = { age: 'asc', name: 'desc' }; // Sort by 'age' ascending and 'name' descending
 * const arraySort: IFilterSort = [{ age: 'asc' }, { name: 'desc' }]; // Sort by 'age' ascending and 'name' descending using an array
 */
export type IFilterSort = string | { [field: string]: IFilterSortDirection } | Array<{ [field: string]: IFilterSortDirection }>;

/**
 * Interface representing a filter query for data retrieval operations.
 * 
 * This interface defines the structure of a query that can be used to filter,
 * sort, and limit the results returned from a data source. It allows for
 * flexible querying based on various criteria.
 * 
 * @example
 * // Example of using IFilterQuery
 * const query: IFilterQuery = {
 *     selector: {
 *         age: { $gte: 18 }, // Filter for documents where age is greater than or equal to 18
 *         status: { $in: ["active", "pending"] }, // Filter for documents with status "active" or "pending"
 *     },
 *     fields: ["name", "age"], // Specify which fields to return in the results
 *     sort: { age: 'asc', name: 'desc' }, // Sort results by age ascending and name descending
 *     limit: 10, // Limit the results to 10 documents
 *     skip: 5 // Skip the first 5 documents in the results
 * };
 * @example
 * const exampleQuery: MangoQuery = {
  selector: {
    $and: [
      {
        status: { $eq: "active" },
        age: { $gte: 21 },
        tags: { $all: ["premium", "verified"] },
        "address.country": { $in: ["USA", "Canada"] },
        location: {
          $near: {
            $geometry: { lon: -122.27652, lat: 37.80574 },
            $maxDistance: 5000
          }
        }
      },
      {
        $or: [
          { premium: { $exists: true } },
          { referrals: { $size: 5 } }
        ]
      }
    ]
  },
  fields: ["_id", "name", "email", "status"],
  sort: [
    { created_at: "desc" },
    { name: "asc" }
  ],
  limit: 20,
  skip: 0,
};
 */
export interface IFilterQuery {
    selector: IFilterSelector; // The filter criteria to apply to the query
    fields?: string[];         // Optional array of fields to include in the results
    sort?: IFilterSort;        // Optional sorting criteria for the results
    limit?: number;            // Optional limit on the number of results to return
    skip?: number;             // Optional number of results to skip before returning
}