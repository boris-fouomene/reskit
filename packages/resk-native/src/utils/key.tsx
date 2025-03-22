import { defaultStr, isObj, isEmpty } from "@resk/core/utils";

/**
 * Retrieves the unique key(s) that can identify a React element based on the provided data.
 * The keys can be specified in a string (split by commas) or an array of strings.
 * 
 * If the keyField parameter is a string containing multiple keys separated by commas, 
 * the function will concatenate the values associated with these keys in the provided data 
 * object, using the specified concatSeparator.
 * 
 * @template T - The generic type of the data object.
 * @param {T} data - The object from which the React key will be retrieved.
 * @param {keyof T | keyof T[]} [keyField] - A single key (string) or an array of keys (string[]) 
 *   whose associated values will be used to determine the final key.
 * @param {string} [concatSeparator='/'] - A string used to concatenate multiple values when the object 
 *   contains multiple elements that make up the key. Defaults to '/'.
 * 
 * @returns {string} - A concatenated string of values from the data object corresponding to the 
 * specified keys, or an empty string if no valid key is found.
 * 
 * @example
 * interface Data {
 *   id: number;
 *   name: string;
 *   category?: string;
 * }
 * 
 * const data: Data = {
 *   id: 1,
 *   name: "Example",
 *   category: "Sample"
 * };
 * 
 * // Single key
 * const key1 = getReactKey(data, "id"); // Returns "1"
 * 
 * // Multiple keys as array
 * const key2 = getReactKey(data, ["name", "category"], "-"); // Returns "Example-Sample"
 * 
 * // Multiple keys as string
 * const key3 = getReactKey(data, "id,name", "/"); // Returns "1/Example"
 * 
 * // Key field not found
 * const key4 = getReactKey(data, "unknownField"); // Returns ""
 */
export const getReactKey = <T extends object = {}>(data: T, keyField?: keyof T | keyof T[], concatSeparator: string = "/"): string | number | symbol => {
    concatSeparator = defaultStr(concatSeparator, "/");
    const rKeys: (keyof T)[] = Array.isArray(keyField) ? keyField : [keyField as keyof T];
    if (isObj(data) && rKeys.length) {
        let rkVal = "";
        rKeys.map((keyField) => {
            if (isEmpty(keyField)) return;
            const v = data[keyField];
            if (isValidReactKey(v)) {
                rkVal += (rkVal ? concatSeparator : "") + v?.toString();
            }
        });
        if (rkVal) {
            return rkVal;
        }
    }
    return "";
}

/**
 * Checks if the provided key is a valid React key.
 * 
 * A valid React key can be of type `string`, `number`, or `symbol`, 
 * and it must not be empty. This function is useful for validating keys 
 * that will be used to identify elements in a React list or component 
 * to ensure that they adhere to React's key requirements.
 * 
 * @param {any} key - The key to be tested, can be of any type.
 * 
 * @returns {boolean} - A boolean value indicating whether the key is a valid React key.
 *   - Returns `true` if the key is of type `string`, `number`, or `symbol` and is not empty.
 *   - Returns `false` otherwise.
 * 
 * @example
 * const key1 = "uniqueKey"; // Valid key
 * const key2 = 42; // Valid key
 * const key3 = ""; // Invalid key
 * const key4 = null; // Invalid key
 * 
 * console.log(isValidReactKey(key1)); // Returns true
 * console.log(isValidReactKey(key2)); // Returns true
 * console.log(isValidReactKey(key3)); // Returns false
 * console.log(isValidReactKey(key4)); // Returns false
 */
export const isValidReactKey = (key: any): boolean => {
    return ["string", "number", "symbol"].includes(typeof key) && !isEmpty(key);
}
