import { isObj } from "./object";
import isEmpty from "./isEmpty";

/**
 * Type alias for the sort direction.
 */
export type ISortDirection = "asc" | "desc";

/**
 * Type alias for a sortable column.
 * 
 * @typeparam T The type of the object being sorted.
 */
export type ISortColumn<T> = keyof T | string | number | symbol;

/**
 * Options for configuring the `getValue` function to be applied on a given item.
 * 
 * @typeparam T The type of the item.
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
 */
export type ISortByConfig<T = any> = {
  /** la direction du trie */
  dir?: ISortDirection;
  /** le nom de la colonne à utiliser pour le trie si c'est un tableu */
  column?: IsortColumn<T>;
  /** si la casse sera ignorée lors du trie */
  ignoreCase?: boolean;
  /** le nom de la clé unique à chaque item */
  keyName?: string;

  /***
   * la fonction permettant de récupérer à l'instant t la valeur à utiliser pour le trie de l'item item
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
