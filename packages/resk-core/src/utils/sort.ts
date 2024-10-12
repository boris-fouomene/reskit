import { isObj } from "./object";
import isEmpty from "./isEmpty";

/**
 * Type alias for the sort direction.
 * 
 * Represents the direction of sorting, either ascending (`"asc"`) or descending (`"desc"`).
 * 
 * @example
 * const sortDirection: ISortDirection = "asc";
 */
export type ISortDirection = "asc" | "desc";

/**
 * Type alias for a sortable column.
 * 
 * Represents a column that can be used for sorting, which can be a key of the object being sorted (`keyof T`), 
 * a string, a number, or a symbol.
 * 
 * @typeparam T The type of the object being sorted.
 * 
 * @example
 * interface User {
 *   name: string;
 *   age: number;
 * }
 * 
 * const sortableColumn: ISortColumn<User> = "name"; // or keyof User, or a string, or a number, or a symbol
 */
export type ISortColumn<T> = keyof T | string | number | symbol;

/**
 * Options for configuring the `getValue` function to be applied on a given item.
 * 
 * Provides configuration options for the `getValue` function, which is used to extract the value from an item 
 * for sorting purposes.
 * 
 * @typeparam T The type of the item.
 * 
 * @property {T} item - The item to be processed.
 * @property {ISortColumn<T>} column - The column to be used for sorting.
 * 
 * @extends {ISortByConfig<T>}
 * 
 * @example
 * interface User {
 *   name: string;
 *   age: number;
 * }
 * 
 * const options: ISortByGetItemOptions<User> = {
 *   item: { name: "John", age: 30 },
 *   column: "name",
 *   // other config options from ISortByConfig<User>
 * };
 */
export type ISortByGetItemOptions<T = any> = {
  /**
   * The item to be processed.
   */
  item: T;

  /**
   * The column to be used for sorting.
   */
  column: ISortColumn<T>;
} & ISortByConfig<T>;

/**
 * Example:
 * ```ts
 * interface User {
 *   name: string;
 *   age: number;
 * }
 * 
 * const options: ISortByGetItemOptions<User> = {
 *   item: { name: "John", age: 30 },
 *   column: "name",
 *   // ... other ISortByConfig options ...
 * };
 * ```
 * Configuration options for sorting items.
 * 
 * @typeparam T The type of the item being sorted.
 */
export type ISortByConfig<T = any> = {
  /**
   * The direction of the sort.
   * 
   * Represents the direction of sorting, either ascending (`"asc"`) or descending (`"desc"`).
   * 
   * @default undefined
   * @example
   * const config: ISortByConfig<User> = {
   *   dir: "asc",
   *   // ...
   * };
   */
  dir?: ISortDirection;

  /**
   * The column to use for sorting if the item is an array.
   * 
   * Represents a column that can be used for sorting, which can be a key of the object being sorted (`keyof T`), 
   * a string, a number, or a symbol.
   * 
   * @default undefined
   * @example
   * const config: ISortByConfig<User> = {
   *   column: "name",
   *   // ...
   * };
   */
  column?: ISortColumn<T>;

  /**
   * Whether to ignore case when sorting.
   * 
   * If `true`, the sort will ignore the case of the values being sorted.
   * 
   * @default false
   * @example
   * const config: ISortByConfig<User> = {
   *   ignoreCase: true,
   *   // ...
   * };
   */
  ignoreCase?: boolean;

  /**
   * The name of the unique key for each item.
   * 
   * Represents the name of the key that uniquely identifies each item.
   * 
   * @default undefined
   * @example
   * const config: ISortByConfig<User> = {
   *   keyName: "id",
   *   // ...
   * };
   */
  keyName?: string;

  /**
   * A function to retrieve the value to use for sorting an item.
   * 
   * This function takes an `ISortByGetItemOptions` object as an argument and returns the value to use for sorting.
   * 
   * @default undefined
   * @example
   * const config: ISortByConfig<User> = {
   *   getValue: (options) => options.item.name,
   *   // ...
   * };
   */
  getValue?: (options: ISortByGetItemOptions<T>) => any;
};

/**
 * Sorts an array of elements of type T.
 * 
 * @typeparam T The type of data to be sorted.
 * @param {Array<T>} array The collection to be sorted.
 * @param {ISortByConfig<T>} config The configuration options.
 * 
 * @example
 * ```ts
 * sortBy([{ test: 'b' }, { test: 'b' }], { getValue: ({ item, column }) => item[column], dir: 'asc', ignoreCase: false })
 * ```
 * 
 * The `config` object can have the following properties:
 * 
 * - `dir`: The direction of the sort. Can be either "asc" or "desc". Defaults to "asc".
 * - `column`: The name of the column to use for sorting.
 * - `ignoreCase`: Whether to ignore case when sorting strings. Defaults to false.
 * - `getValue`: A function that takes an item and a column, and returns the value to be used for sorting.
 * 
 * If `getValue` is not provided, it defaults to a function that returns the value of the specified column from the item.
 */
export function sortBy<T = any>(array: Array<T>, config: ISortByConfig<T>): Array<T> {
  // Check if config is an object, if not, create an empty object
  if (!isObj(config)) config = {} as ISortByConfig<T>;

  // Check if array is an array, if not, return an empty array
  if (!Array.isArray(array)) {
    return [];
  }

  // Set default direction to "asc" if not provided
  if (!config.dir || !["asc", "desc"].includes(config.dir)) {
    config.dir = "asc";
  }

  // Extract ignoreCase from config
  const { ignoreCase } = config;

  // Determine the multiplier based on the direction
  const multiplicater = !!(config.dir === "desc") ? -1 : 1;

  // Define the getValue function
  const getValue = typeof config.getValue === "function" 
    ? config.getValue 
    : ({ column, item }: ISortByGetItemOptions<T>) => 
      (isObj(item) && column in (item as object) ? item[column as keyof typeof item] : item);

  // Define the compare function
  const compare = function (itemA: T, itemB: T) {
    // Get the values for itemA and itemB using the getValue function
    let a: any = getValue({ ...config, item: itemA, column: config.column as keyof T | string });
    if (isEmpty(a)) a = "";
    let b: any = getValue({ ...config, item: itemB, column: config.column as keyof T | string });
    if (isEmpty(b)) b = "";

    // Check if the values are strings or booleans
    const isStringCompare = [typeof a, typeof b].includes("string");
    if (isStringCompare || [typeof a, typeof b].includes("boolean")) {
      // Convert values to strings if necessary
      a = a?.toString() ?? "";
      b = b?.toString() ?? "";

      // Ignore case if specified
      if (ignoreCase !== false) {
        a = a.toLowerCase();
        b = b.toLowerCase();
      }
    }

    // Return the comparison result
    return multiplicater * (a < b ? -1 : +(a > b));
  };

  // Sort the array using the compare function
  return array.sort(compare);
  // Alternatively, use merge sort
  // return mergeSort(array, compare);
}
