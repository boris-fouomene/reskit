import { IDict, IPrimitive } from "../types";
import isPrimitive from "./isPrimitive";
import isDateObj from "./date/isDateObj";
import isRegExp from "./isRegex";
import { isDOMElement } from "./dom";

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
  if (obj === null || typeof obj !== 'object' || isDOMElement(obj) || isDateObj(obj) || isRegExp(obj) || isPrimitive(obj)) {
    return false;
  }

  // Get the prototype of the value
  const proto = Object.getPrototypeOf(obj);

  // Objects with null prototype are plain objects
  if (proto === null) {
    return true;
  }

  // Check if the constructor is Object and has the default prototype chain
  // This handles browser environments where Object.prototype might have been modified
  const Ctor = proto.constructor;
  if (typeof Ctor !== 'function') {
    return false;
  }
  // Check if it's the object constructor
  if (Ctor === Object) {
    return true;
  }
  const protoCtor = Ctor.prototype;
  if (typeof protoCtor !== 'object') {
    return false;
  }
  if (protoCtor === Object.prototype) {
    return true;
  }
  // Test if proto has its own isPrototypeOf method
  // This is important to detect objects from iframes or different execution contexts
  return typeof proto.hasOwnProperty === 'function' &&
    proto.hasOwnProperty('isPrototypeOf') &&
    typeof proto.isPrototypeOf === 'function';
};

/**
 * Clones a source object by returning a non-reference copy of the object.
 *
 * This function creates a deep copy of the provided object.
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
  if (Array.isArray(source)) {
    const clone = [];
    for (var i = 0; i < source.length; i++) {
      clone[i] = cloneObject(source[i]);
    }
    return clone;
  } else if (isPlainObj(source)) {
    const clone: IDict = {};
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        clone[prop] = cloneObject(source[prop]);
      }
    }
    return clone;
  } else {
    return source;
  }
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
  return isPlainObj(obj);
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
 * @template T - The type of the object to return.
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
export function defaultObj<T extends object = any>(...args: any[]): T {
  /**
   * If there is only one argument, return it if it's an object, or an empty object if it's not.
   */
  if (args.length === 1) return isObj(args[0]) ? args[0] : {} as T;

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

    /**
    * Flattens a nested object structure into a single-level object with dot/bracket notation keys.
    * Handles various data structures including Arrays, Sets, Maps, and plain objects.
    * Skips non-primitive values like functions, class instances.
    * 
    * @param {any} obj - The object to flatten
    * @param {string} [prefix=''] - The prefix to use for nested keys
    * @returns {Record<string, Primitive>} A flattened object with primitive values
    * 
    * @example
    * // Basic object flattening
    * _flattenObject({
    *   a: {
    *     b: 'value',
    *     c: 42
    *   }
    * })
    * // Returns: { 'a.b': 'value', 'a.c': 42 }
    * 
    * @example
    * // Array handling
    * _flattenObject({
    *   items: ['a', 'b', { nested: 'value' }]
    * })
    * // Returns: { 'items[0]': 'a', 'items[1]': 'b', 'items[2].nested': 'value' }
    * 
    * @example
    * // Map handling
    * _flattenObject({
    *   map: new Map([
    *     ['key1', 'value1'],
    *     ['key2', { nested: 'value2' }]
    *   ])
    * })
    * // Returns: { 'map[key1]': 'value1', 'map[key2].nested': 'value2' }
    * 
    * @example
    * // Complex nested structure
    * _flattenObject({
    *   array: [1, { a: 2 }],
    *   set: new Set(['x', { b: 'y' }]),
    *   map: new Map([['k', { c: 'v' }]]),
    *   obj: { 
    *     deep: { 
    *       nested: 'value',
    *       fn: () => {}, // Will be skipped
    *       date: new Date() // Will be skipped
    *     }
    *   }
    * })
    * // Returns: {
    * //   'array[0]': 1,
    * //   'array[1].a': 2,
    * //   'set[0]': 'x',
    * //   'set[1].b': 'y',
    * //   'map[k].c': 'v',
    * //   'obj.deep.nested': 'value'
    * // }
    * 
    * @throws {Error} Will not throw errors, but silently skips non-primitive values
    * 
    * @category Utilities
    * @since 1.0.0
    */
    flatten(obj: any): Record<string, IPrimitive>
  }
}


/**
 * Extends an object by merging properties from one or more source objects.
 *
 * This function takes a target object and one or more source objects, merging the properties
 * from the source objects into the target object. If a property exists in both the target
 * and a source object, the value from the source object will overwrite the target's value.
 * For arrays, the function merges the contents of the arrays, preserving the original order of the elements.
 *@template T - The type of the target object.
 * @param {T} target - The object to extend. It will receive the new properties.
 * @param {...any[]} sources - The source objects to merge into the target. These objects will not be modified.
 * @returns {T} The extended target object, which contains properties from the source objects.
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
 * Merges the contents of two or more objects together into the first object.
 * Similar to jQuery's $.extend function. 
 * @remarks
 * This function is used to merge the contents of multiple objects into a single object. It takes an optional target object as the first argument and one or more source objects as additional arguments. The function returns the merged object, which is a new object that contains all the properties from the source objects.
 * 
 * If the target object is not provided or is not a plain object, an empty object is returned.
 * 
 * If the target object is a plain object, the function iterates over the sources and copies the properties from each source object to the target object. If a property with the same name already exists in the target object, it is overwritten with the corresponding value from the source object.
 * 
 * If the target object is a plain object, the function iterates over the sources and copies the properties from each source object to the target object. If a property with the same name already exists in the target object, it is overwritten with the corresponding value from the source object.
 * For arrays, The function replaces the contents of the arrays, preserving the original order of the elements.
 * Empty values like null, undefined, and empty strings are ignored.
 */
export function extendObj<T extends Record<string, any> = any>(target: any, ...sources: any[]): T {
  const isTargetArray = Array.isArray(target);
  const isTargetObj = isPlainObj(target);
  // Return if no target provided
  if (target == null || (!isTargetArray && !isTargetObj)) {
    target = {};
  }
  // For each source object
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    // Skip null/undefined sources
    if (source == null) {
      continue;
    }
    const isSourceObj = isPlainObj(source);
    const isSourceArr = Array.isArray(source);
    //We only merge plain objects and arrays
    if (!isSourceObj && !isSourceArr) {
      continue;
    }
    if (isTargetArray) {
      if (isSourceArr) {
        mergeTwoArray(target, source);
      } else {//preserving the type
        //target.push(source);
      }
      continue;
    } else if (isSourceArr) {
      //we only merge same type
      continue;
    }
    //We are sure that target is a plain object and source is a plain object
    // Extend the target with source properties
    for (let j in source) {
      const srcValue = (source as any)[j];

      // Skip undefined values
      if (srcValue === undefined || srcValue === null) {
        continue;
      }
      if (srcValue === source) {
        (target as any)[j] = target; // Point to the target itself
        continue;
      }
      const targetValue = (target as any)[j];
      const isTargetValueArr = Array.isArray(targetValue);
      const isSrcArr = Array.isArray(srcValue);
      if (isTargetValueArr) {
        if (isSrcArr) {
          mergeTwoArray(target[j], srcValue);
        } else {
          (target as any)[j] = srcValue;
        }
        continue;
      } else if (!isPlainObj(targetValue)) {
        (target as any)[j] = srcValue;
        continue;
      }
      //here targetValue is a plain object
      if (isSrcArr || !isPlainObj(srcValue)) {
        (target as any)[j] = srcValue;
        continue;
      }
      //here targetValue is a plain object and srcValue is an object, recursively extend them
      (target as any)[j] = extendObj({}, targetValue, srcValue);
    }
  }
  return target as T;
}

const mergeTwoArray = (target: any[], source: any[]) => {
  const sourceLength = source.length;
  let indexCounter = 0;
  for (let k = 0; k < target.length; k++) {
    const targetK = target[k];
    const sourceK = source[k];
    if (k < sourceLength) {
      const isTkArray = Array.isArray(targetK), isSkArray = Array.isArray(sourceK);
      const isTObj = isPlainObj(targetK), isSObj = isPlainObj(sourceK);
      if ((isTkArray && isSkArray) || (isTObj && isSObj)) {
        target[indexCounter] = extendObj(isTkArray ? [] : {}, targetK, sourceK);
        indexCounter++;
      } else {
        if (sourceK !== undefined && sourceK !== null) {
          target[indexCounter] = sourceK;
          indexCounter++;
        } else if (targetK !== undefined && targetK !== null) {
          target[indexCounter] = targetK;
          indexCounter++;
        }
      }
    }
  }
  for (let k = target.length; k < sourceLength; k++) {
    if (source[k] !== undefined && source[k] !== null) {
      target.push(source[k]);
    }
  }
  return target;
}

/**
     * Flattens a nested object structure into a single-level object with dot/bracket notation keys.
     * Handles various data structures including Arrays, Sets, Maps, and plain objects.
     * Skips non-primitive values like functions, class instances.
     * 
     * @param {any} obj - The object to flatten
     * @param {string} [prefix=''] - The prefix to use for nested keys
     * @returns {Record<string, Primitive>} A flattened object with primitive values
     * 
     * @example
     * // Basic object flattening
     * _flattenObject({
     *   a: {
     *     b: 'value',
     *     c: 42
     *   }
     * })
     * // Returns: { 'a.b': 'value', 'a.c': 42 }
     * 
     * @example
     * // Array handling
     * _flattenObject({
     *   items: ['a', 'b', { nested: 'value' }]
     * })
     * // Returns: { 'items[0]': 'a', 'items[1]': 'b', 'items[2].nested': 'value' }
     * 
     * @example
     * // Map handling
     * _flattenObject({
     *   map: new Map([
     *     ['key1', 'value1'],
     *     ['key2', { nested: 'value2' }]
     *   ])
     * })
     * // Returns: { 'map[key1]': 'value1', 'map[key2].nested': 'value2' }
     * 
     * @example
     * // Complex nested structure
     * _flattenObject({
     *   array: [1, { a: 2 }],
     *   set: new Set(['x', { b: 'y' }]),
     *   map: new Map([['k', { c: 'v' }]]),
     *   obj: { 
     *     deep: { 
     *       nested: 'value',
     *       fn: () => {}, // Will be skipped
     *       date: new Date() // Will be skipped
     *     }
     *   }
     * })
     * // Returns: {
     * //   'array[0]': 1,
     * //   'array[1].a': 2,
     * //   'set[0]': 'x',
     * //   'set[1].b': 'y',
     * //   'map[k].c': 'v',
     * //   'obj.deep.nested': 'value'
     * // }
     * 
     * @throws {Error} Will not throw errors, but silently skips non-primitive values
     * 
     * @category Utilities
     * @since 1.0.0
     */
export function flattenObject(obj: any): Record<string, any> {
  return _flattenObject(obj);
}
function _flattenObject(obj: any, prefix: string = '', flattened: Record<string, any> = {}): Record<string, IPrimitive> {
  flattened = isObj(flattened) ? flattened : {};
  // Handle null/undefined early
  if (isPrimitive(obj) || isDateObj(obj) || isRegExp(obj)) {
    if (prefix) {
      flattened[prefix] = obj;
    }
    return flattened;
  }

  // Skip if it's a function or a class instance (but not a plain object)
  if (typeof obj === 'function' || (typeof obj === 'object' && !isObj(obj) && !isIterableStructure(obj))) {
    return flattened;
  }

  // Handle Map and WeakMap
  if (obj instanceof Map || obj instanceof WeakMap) {
    Array.from((obj as Map<any, any>).entries()).forEach(([mapKey, value]) => {
      const newKey = prefix
        ? `${prefix}[${String(mapKey)}]`
        : String(mapKey);
      _flattenObject(value, newKey, flattened);
    });
    return flattened;
  }

  // Handle Array, Set, and WeakSet
  if (Array.isArray(obj) || obj instanceof Set || obj instanceof WeakSet) {
    const array = Array.isArray(obj) ? obj : Array.from(obj as any);
    array.forEach((value, index) => {
      const newKey = prefix
        ? `${prefix}[${index}]`
        : String(index);
      _flattenObject(value, newKey, flattened);
    });
    return flattened;
  }

  // Handle plain objects
  if (isObj(obj)) {
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];
      const newKey = prefix
        ? (prefix.endsWith(']') ? `${prefix}.${key}` : `${prefix}.${key}`)
        : key;
      _flattenObject(value, newKey, flattened);
    }
  }
  return flattened;
}

/**
 * Checks if a value is an iterable data structure (Array, Set, Map, WeakMap, WeakSet).
 * 
 * @param {any} value - The value to check
 * @returns {boolean} True if the value is an iterable structure, false otherwise
 * 
 * @example
 * isIterableStructure([1, 2, 3])           // returns true
 * isIterableStructure(new Set([1, 2, 3]))  // returns true
 * isIterableStructure(new Map())           // returns true
 * isIterableStructure({})                  // returns false
 */
export function isIterableStructure(value: any): boolean {
  return (
    Array.isArray(value) ||
    value instanceof Set ||
    value instanceof Map ||
    value instanceof WeakMap ||
    value instanceof WeakSet
  );
}


Object.flatten = flattenObject;
Object.clone = cloneObject;
