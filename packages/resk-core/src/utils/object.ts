import { isPlainObject, merge, cloneDeep } from "lodash";

/**
 * Checks if the given variable is a plain object.
 *
 * A plain object is defined as an object that is created by the Object constructor
 * or one that inherits from `Object.prototype`. This function will return false for
 * instances of classes, arrays, and other non-plain objects.
 *
 * @param {any} obj - The variable to check for being a plain object.
 * 
 * @returns {boolean} Returns true if the variable is a plain object, false otherwise.
 *
 * @example
 * ```ts
 * // Example with a string
 * console.log(isPlainObj("hello")); // Outputs: false
 *
 * // Example with a plain object
 * console.log(isPlainObj({ a: true })); // Outputs: true
 *
 * // Example with a function
 * console.log(isPlainObj(() => true)); // Outputs: false
 *
 * // Example with an array
 * console.log(isPlainObj([1, 2, 3])); // Outputs: false
 *
 * // Example with a Date object
 * console.log(isPlainObj(new Date())); // Outputs: false
 *
 * // Example with a plain object created using Object.create
 * const obj = Object.create(null);
 * console.log(isPlainObj(obj)); // Outputs: true
 * ```
 */
export const isPlainObj = function (obj: any): boolean {
  return isPlainObject(obj);
};

/**
 * Clones a source object by returning a non-reference copy of the object.
 *
 * This function uses `cloneDeep` from lodash to create a deep copy of the provided object.
 * Any nested objects or arrays within the source will also be cloned, ensuring that the 
 * returned object does not reference the original object.
 *
 * @param {any} source - The object to clone. This can be any type, including arrays and nested objects.
 * 
 * @returns {IDict | Array<any>} A deep cloned copy of the source object. The return type can be
 * either an object or an array, depending on the input.
 *
 * @example
 * ```ts
 * // Example with a simple object
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = cloneObject(original);
 * console.log(cloned); // Outputs: { a: 1, b: { c: 2 } }
 * 
 * // Modifying the cloned object does not affect the original
 * cloned.b.c = 3;
 * console.log(original.b.c); // Outputs: 2 (original remains unchanged)
 * 
 * // Example with an array
 * const originalArray = [1, 2, { a: 3 }];
 * const clonedArray = cloneObject(originalArray);
 * console.log(clonedArray); // Outputs: [1, 2, { a: 3 }]
 * 
 * // Modifying the cloned array does not affect the original
 * clonedArray[2].a = 4;
 * console.log(originalArray[2].a); // Outputs: 3 (original remains unchanged)
 * 
 * // Example with a nested structure
 * const complexObject = { a: 1, b: [2, { c: 3 }] };
 * const clonedComplex = cloneObject(complexObject);
 * console.log(clonedComplex); // Outputs: { a: 1, b: [2, { c: 3 }] }
 * ```
 */
export function cloneObject(source: any): any {
  return cloneDeep(source);
};

/**
 * Determines if the given variable is a plain object.
 *
 * This function checks whether the provided variable is a plain object, which is defined as an object
 * created by the Object constructor or one that inherits from `Object.prototype`. It will return false
 * for instances of classes, arrays, and other non-plain objects.
 *
 * @param {any} obj - The variable to check for being an object.
 * 
 * @returns {boolean} Returns true if the variable is a plain object, false otherwise.
 *
 * @example
 * ```ts
 * // Example with a string
 * console.log(isObj("hello")); // Outputs: false
 *
 * // Example with a plain object
 * console.log(isObj({ a: true })); // Outputs: true
 *
 * // Example with an array
 * console.log(isObj([1, 2, 3])); // Outputs: false
 *
 * // Example with a function
 * console.log(isObj(() => true)); // Outputs: false
 *
 * // Example with a Date object
 * console.log(isObj(new Date())); // Outputs: false
 *
 * // Example with a plain object created using Object.create
 * const obj = Object.create(null);
 * console.log(isObj(obj)); // Outputs: true
 * ```
 */
export function isObj(obj: any): boolean {
  return isPlainObject(obj);
};


/**
 * Calculates the size of an object or array.
 *
 * This function returns the number of own properties of an object or the length of an array.
 * If the input is null or not an object, it returns 0.
 *
 * @param {any} obj - The object or array whose size is to be calculated.
 * @param {boolean} [breakOnFirstElementFound=false] - Optional flag to determine if the function should
 * return the size immediately upon finding the first property or element.
 * 
 * @returns {number} The size of the object or array. Returns 0 if the input is null or not an object.
 *
 * @example
 * // Example with an object
 * const exampleObject = { a: 1, b: 2, c: 3 };
 * const size = objectSize(exampleObject);
 * console.log(size); // Outputs: 3
 *
 * @example
 * // Example with an array
 * const exampleArray = [1, 2, 3, 4];
 * const arraySize = objectSize(exampleArray);
 * console.log(arraySize); // Outputs: 4
 *
 * @example
 * // Example with breakOnFirstElementFound
 * const earlyExitSize = objectSize(exampleObject, true);
 * console.log(earlyExitSize); // Outputs: 1, as it returns after the first property
 *
 * @example
 * // Example with a null input
 * const nullSize = objectSize(null);
 * console.log(nullSize); // Outputs: 0
 *
 * @example
 * // Example with a non-object input
 * const nonObjectSize = objectSize(42);
 * console.log(nonObjectSize); // Outputs: 0
 */
export const objectSize = Object.getSize = function (obj: any, breakOnFirstElementFound: boolean = false): number {
  /**
   * If the object is null or not an object, return 0.
   */
  if (!obj || typeof obj !== "object") return 0;

  /**
   * If the object is an array, return its length.
   */
  if (Array.isArray(obj)) {
    return obj.length;
  }

  /**
   * Ensure breakOnFirstElementFound is a boolean.
   */
  if (typeof breakOnFirstElementFound !== 'boolean') {
    breakOnFirstElementFound = false;
  }

  /**
   * Initialize the size to 0.
   */
  let size = 0;

  /**
   * Iterate over the object's properties.
   */
  for (let key in obj) {
    /**
     * If the property is the object's own property, increment the size.
     */
    if (obj.hasOwnProperty(key)) {
      size++;
      /**
       * If breakOnFirstElementFound is true, return the size immediately.
       */
      if (breakOnFirstElementFound === true) return size;
    }
  }

  /**
   * Return the final size.
   */
  return size;
};



/**
 * Returns a default object based on the provided arguments.
 *
 * This function takes multiple arguments and returns the first non-empty object found.
 * If only one argument is provided, it returns that argument if it is an object; otherwise, it returns an empty object.
 * If no valid object is found among the arguments, it returns an empty object.
 *
 * @param {...any[]} args - The arguments to check for objects.
 * 
 * @returns {object} The first non-empty object found among the arguments, or an empty object if none is found.
 *
 * @example
 * ```ts
 * // Example with one valid object
 * const result1 = defaultObj({ a: 1 });
 * console.log(result1); // Outputs: { a: 1 }
 *
 * // Example with one invalid argument
 * const result2 = defaultObj("not an object");
 * console.log(result2); // Outputs: {}
 *
 * // Example with multiple arguments, returning the first non-empty object
 * const result3 = defaultObj({}, { b: 2 }, { c: 3 });
 * console.log(result3); // Outputs: { b: 2 }
 *
 * // Example with multiple arguments, returning the last valid object
 * const result4 = defaultObj({}, {}, { d: 4 });
 * console.log(result4); // Outputs: { d: 4 }
 *
 * // Example with no valid objects
 * const result5 = defaultObj(null, undefined, "string");
 * console.log(result5); // Outputs: {}
 * ```
 */
export const defaultObj = function (...args: any[]): object {
  /**
   * If there is only one argument, return it if it's an object, or an empty object if it's not.
   */
  if (args.length === 1) return isObj(args[0]) ? args[0] : {};

  /**
   * Initialize the previous object to null.
   */
  let prevObj = null;

  /**
   * Iterate over the arguments.
   */
  for (var i in args) {
    const x = args[i];

    /**
     * If the current argument is an object, check if it's not empty.
     */
    if (isObj(x)) {
      /**
       * If the object is not empty, return it immediately.
       */
      if (Object.getSize(x, true) > 0) return x;

      /**
       * If the previous object is null, set it to the current object.
       */
      if (!prevObj) {
        prevObj = x;
      }
    }
  }
  /**
   * Return the previous object, or an empty object if none was found.
   */
  return prevObj || {};
};

/**
 * Declares a global interface extension for the built-in `Object` type.
 */
declare global {
  /**
   * Interface extension for the built-in `Object` type.
   */
  interface Object {
    /**
     * Clones a source object by returning a non-reference copy of the object.
     *
     * This method creates a deep clone of the provided object, ensuring that nested objects 
     * are also cloned, and modifications to the cloned object do not affect the original.
     *
     * @param {any} obj - The object to clone. This can be any type, including arrays and nested objects.
     * @returns {any} The cloned object, which can be an object or an array.
     *
     * @example
     * ```ts
     * const original = { a: 1, b: { c: 2 } };
     * const cloned = Object.clone(original);
     * console.log(cloned); // Outputs: { a: 1, b: { c: 2 } }
     * 
     * cloned.b.c = 3;
     * console.log(original.b.c); // Outputs: 2 (original remains unchanged)
     * ```
     */
    clone: (obj: any) => any;

    /**
     * Determines the size of an object or array.
     *
     * This method calculates the number of own enumerable properties in an object or 
     * the number of elements in an array. If the `breakOnFirstElementFound` parameter 
     * is set to true, it will return 1 immediately upon finding the first element or property.
     *
     * @param {any} obj - The object or array to determine the size of.
     * @param {boolean} [breakOnFirstElementFound=false] - Whether to return immediately after the first element is found.
     * @returns {number} The size of the object or array. Returns 0 if the input is not an object or array.
     *
     * @example
     * ```ts
     * const obj = { a: 1, b: 2, c: 3 };
     * const size = Object.getSize(obj);
     * console.log(size); // Outputs: 3
     * 
     * const arr = [1, 2, 3];
     * const arrSize = Object.getSize(arr);
     * console.log(arrSize); // Outputs: 3
     * 
     * const singleElementSize = Object.getSize(arr, true);
     * console.log(singleElementSize); // Outputs: 1 (returns immediately)
     * 
     * const emptyObjSize = Object.getSize({});
     * console.log(emptyObjSize); // Outputs: 0
     * ```
     */
    getSize: (obj: any, breakOnFirstElementFound?: boolean) => number;
  }
}

/**
 * Extends an object by merging properties from one or more source objects.
 *
 * This function takes a target object and one or more source objects, merging the properties
 * from the source objects into the target object. If a property exists in both the target
 * and a source object, the value from the source object will overwrite the target's value.
 *
 * @param {any} target - The object to extend. This object will be modified and returned.
 * @param {...any[]} sources - The source objects to merge into the target. These objects will not be modified.
 * @returns {any} The extended target object, which contains properties from the source objects.
 *
 * @example
 * ```ts
 * const target = { a: 1, b: 2 };
 * const source1 = { b: 3, c: 4 };
 * const source2 = { d: 5 };
 *
 * const extended = extendObj(target, source1, source2);
 * console.log(extended); // Outputs: { a: 1, b: 3, c: 4, d: 5 }
 * console.log(target);   // Outputs: { a: 1, b: 3 } (target is modified)
 * ```
 */
export function extendObj(target: any, ...sources: any[]): any {
  return merge(target, ...sources);
};

Object.clone = cloneObject;
