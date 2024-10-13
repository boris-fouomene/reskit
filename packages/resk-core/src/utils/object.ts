import { IDict } from "../types";
import { isPlainObject,merge } from "lodash";

/**
 * Checks if the given variable is a plain object.
 *
 * @param {any} obj The variable to check.
 * @returns {boolean} True if the variable is a plain object, false otherwise.
 * @example
 * ```ts
 *   isPlainObj("hello") => false;
 *   isPlainObj({a:true}) => true;
 *   isPlainObj(()=>true) => false;
 * ```
 */
export const isPlainObj = function (obj: any): boolean {
    return isPlainObject(obj);
};


/**
 * Clones a source object by returning a non-reference copy of the object.
 *
 * @param {any} source The object to clone.
 * @returns {IDict | Array<any>} The cloned object.
 */
export function cloneObject(source: any): IDict | Array<any> {
    /**
     * If the source is an array, clone each element recursively.
     */
    if (Array.isArray(source)) {
      const clone: any[] = [];
      for (var i = 0; i < source.length; i++) {
        clone[i] = cloneObject(source[i]);
      }
      return clone;
    }
    /**
     * If the source is a plain object, clone each property recursively.
     */
    else if (isPlainObj(source)) {
      const clone: IDict = {};
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          clone[prop] = cloneObject(source[prop]);
        }
      }
      return clone;
    }
    /**
     * If the source is not an array or plain object, return the original value.
     */
    else {
      return source;
    }
};

/**
 * Determines if the given variable is an object or not.
 *
 * @param {any} obj The variable to check.
 * @returns {boolean} True if the variable is an object, false otherwise.
 */
export function isObj(obj: any): boolean {
    return isPlainObject(obj);
};


/**
 * Determines the size of an object or array.
 *
 * @param {any} obj The object or array to determine the size of.
 * @param {boolean} [breakonFirstElementFound=false] Whether to return immediately after the first element is found.
 * @returns {number} The size of the object or array.
 */
export const objectSize = Object.size = function (obj: any, breakonFirstElementFound: boolean = false): number {
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
     * Ensure breakonFirstElementFound is a boolean.
     */
    if (typeof breakonFirstElementFound !== 'boolean') {
      breakonFirstElementFound = false;
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
         * If breakonFirstElementFound is true, return the size immediately.
         */
        if (breakonFirstElementFound === true) return size;
      }
    }
  
    /**
     * Return the final size.
     */
    return size;
};


/**
 * Returns the first object in the list of arguments that is not empty.
 *
 * @param {...any[]} args The list of arguments to search for an object.
 * @returns {object} The first non-empty object in the list, or an empty object if none is found.
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
        if (Object.size(x, true) > 0) return x;
  
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
 * @param {any} source The object to clone.
 * @returns {IDict | Array<any>} The cloned object.
 */
        clone: (obj: any) => any;

        /**
 * Determines the size of an object or array.
 *
 * @param {any} obj The object or array to determine the size of.
 * @param {boolean} [breakonFirstElementFound=false] Whether to return immediately after the first element is found.
 * @returns {number} The size of the object or array.
 */
        size: (obj: any, breakonFirstElementFound?: boolean) => number;
    }
}

/**
 * Extends an object by merging properties from one or more source objects.
 *
 * @param {any} target The object to extend.
 * @param {...any[]} sources The source objects to merge into the target.
 * @returns {any} The extended target object.
 */
export function extendObj(target: any, ...sources: any[]): any {
    return merge(target,...sources);
};

Object.clone = cloneObject;
