/***
 * A helper class to handle json
 * 
 */
export class JsonHelper {
  /**
  * Decycles an object by removing all properties of type function.
  *
  * @param {any} obj The object to decycle.
  * @param {Array<any>} [stack=[]] The stack of objects being processed.
  * @returns {object|undefined} The decycled object, or undefined if the object is a function.
  */
  static decycle(obj: any, stack: Array<any> = []): any {
    /**
     * If the object is a function, return undefined.
     */
    if (typeof obj === 'function') {
      return undefined;
    }

    /**
     * If the object is not an object, return it as is.
     */
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    /**
     * If the object is already in the stack, return null to avoid infinite recursion.
     */
    if (stack.includes(obj)) {
      return null;
    }

    /**
     * Create a new stack by concatenating the current stack with the current object.
     */
    let s = stack.concat([obj]);

    /**
     * If the object is an array, decycle each element recursively.
     */
    if (Array.isArray(obj)) {
      return obj.map(x => JsonHelper.decycle(x, s));
    }

    /**
     * If the object is an object, decycle each property recursively.
     */
    return Object.fromEntries(
      Object.entries(obj)
        .map(([k, v]) => [k, JsonHelper.decycle(v, s)])
    );
  };

  /**
  * Stringifies an object or any value.
  *
  * @param {any} jsonObj The object to stringify.
  * @param {boolean} [decylcleVal=false] Whether to decycle the object before stringifying.
  * @returns {string} The stringified object.
  */
  static stringify(jsonObj: any, decylcleVal: boolean = false): string {
    /**
     * If the object is already a JSON string, return it as is.
     */
    if (JsonHelper.isJSON(jsonObj)) {
      return jsonObj;
    }

    /**
     * Decycle the object if requested, then stringify it.
     */
    return JSON.stringify(decylcleVal !== false ? JsonHelper.decycle(jsonObj) : jsonObj);
  };

  /**
   * Checks if a string is a valid JSON string.
   *
   * @param {any} json_string The string to check.
   * @returns {boolean} True if the string is a valid JSON string, false otherwise.
   */
  static isJSON(json_string: any): boolean {
    /**
     * If the string is not a string, return false.
     */
    if (!json_string || typeof json_string != 'string') {
      return false;
    }

    /**
     * Remove all double-quoted strings from the string.
     */
    var text = json_string;
    return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, '')));
  };

  /**
   * Parses a JSON string recursively.
   *
   * @param {any} jsonStr The JSON string to parse.
   * @param reviver A function that transforms the results. This function is called for each member of the object.
   * If a member contains nested objects, the nested objects are transformed before the parent object is.
   * @returns {object|null} The parsed object, or null if the string is not a valid JSON string.
   */
  static parse(jsonStr: any, reviver?: (this: any, key: string, value: any) => any): any {
    /**
     * If the string is not a valid JSON string, return it as is.
     */
    if (!JsonHelper.isJSON(jsonStr)) {
      /**
       * If the value is an object, recursively parse each property.
       */
      if (jsonStr && typeof (jsonStr) == 'object') {
        for (var i in jsonStr) {
          jsonStr[i] = JsonHelper.parse(jsonStr[i], reviver);
        }
      }
      return jsonStr;
    }

    /**
     * Try to parse the JSON string.
     */
    try {
      jsonStr = JSON.parse(jsonStr, reviver);

      /**
       * If the parsed value is an object, recursively parse each property.
       */
      if (jsonStr && typeof (jsonStr) == 'object') {
        for (var i in jsonStr) {
          jsonStr[i] = JsonHelper.parse(jsonStr[i], reviver);
        }
      }
    } catch (e) {
      /**
       * If parsing fails, return the original string.
       */
      return jsonStr;
    }
    /**
     * Return the parsed object.
     */
    return jsonStr;
  };
}