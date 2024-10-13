import { isElement} from "react-is";
import { IDict } from "../types";
import {isDateObj } from "./date";
import isRegExp from "./isRegex";

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
    /**
     * If the object is null, a primitive value, or a date, return false.
     */
    if (!obj || typeof obj === 'boolean' || typeof obj === 'number' || typeof obj === 'string' || isDateObj(obj)) {
      return false;
    }
  
    /**
     * If the object is an element, return false.
     */
    if (isElement(obj)) {
      return false;
    }
  
    /**
     * Get the string representation of the object's type.
     */
    const tStr = Object.prototype.toString.call(obj);
  
    /**
     * If the object's type is not "[object Object]" or if it's the global object or window, return false.
     */
    if (tStr !== "[object Object]" || obj === global || obj === window || isRegExp(obj)) {
      return false;
    }
  
    /**
     * Get the object's prototype.
     */
    let proto = Object.getPrototypeOf(obj);
  
    /**
     * If the object has no prototype, it's a plain object.
     */
    if (!proto) {
      return true;
    }
  
    /**
     * Get the hasOwnProperty function and the Object function's string representation.
     */
    const hasOwn = Object.prototype.hasOwnProperty;
    const fnToString = hasOwn.toString;
    const ObjectFunctionString = fnToString.call(Object);
  
    /**
     * Get the object's constructor.
     */
    const Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  
    /**
     * Check if the object's constructor is a function and if its string representation matches the Object function's string representation.
     */
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
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
    /**
     * If the object is null or undefined, return false.
     */
    if (!obj) return false;
  
    /**
     * Check if the object is an instance of Object and not an instance of RegExp.
     */
    return obj && Object.prototype.toString.call(obj) === '[object Object]' && !(obj instanceof RegExp);
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
    /**
     * If there are no source objects, return the target object as is.
     */
    if (!sources.length) return target;
  
    /**
     * Get the first source object.
     */
    const source = sources.shift();
  
    /**
     * If both the target and source objects are plain objects, merge their properties.
     */
    if (isPlainObj(target) && isPlainObj(source)) {
      /**
       * Iterate over the source object's properties.
       */
      for (const key in source) {
        /**
         * If the source property is a plain object, recursively extend the target object's property.
         */
        if (isPlainObj(source[key])) {
          /**
           * If the target object doesn't have the property, create it as an empty object.
           */
          if (!target[key]) Object.assign(target, { [key]: {} });
          /**
           * Recursively extend the target object's property.
           */
          extendObj(target[key], source[key]);
        } else {
          /**
           * Otherwise, simply assign the source property to the target object.
           */
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  
    /**
     * Recursively extend the target object with the remaining source objects.
     */
    return extendObj(target, ...sources);
};

Object.clone = cloneObject;
