import { isDate } from "lodash";
import defaultStr from "./defaultStr";

function escapeString(str: string): string {
  return defaultStr(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\v/g, '\\v')
    .replace(/[\b]/g, '\\b')
    .replace(/\f/g, '\\f')
}

function isType(obj: any, type: string): boolean {
  var t = Object.prototype.toString.call(obj)
  return t === '[object ' + type + ']'
}

/**
 * Converts a variable to a string representation.
 *
 * This function takes a variable as input and returns a string representation of it.
 * It works similarly to the JSON.stringify function, but with additional options.
 *
 * @param {any} obj The variable to convert to a string.
 * @param {{parenthesis: boolean}} [options] Additional options.
 * @param {boolean} [options.parenthesis=false] Whether to wrap the result in parentheses.
 * @returns {string} The string representation of the variable.
 * @example
 * ```typescript
 * console.log(stringify({ a: 1, b: 2 })); // Output: "{a:1,b:2}"
 * console.log(stringify({ a: 1, b: 2 }, { parenthesis: true })); // Output: "({a:1,b:2})"
 * console.log(stringify(null)); // Output: "null"
 * console.log(stringify(undefined)); // Output: "undefined"
 * ```
 */
export default function stringify(obj: any, options?: { parenthesis: boolean }): string {
  if (["string", "boolean", "undefined"].includes(typeof obj) || obj === null) {
    return String(obj);
  }
  /**
   * If the input is a number, return its string representation using the formatNumber method.
   */
  if (typeof obj === 'number') {
    return (obj as number).formatNumber();
  }
  if (isDate(obj)) {
    return (obj as Date).toFormat();
  }
  /**
   * If the input is an Error object, return its string representation.
   */
  if (obj instanceof Error) {
    return obj?.toString();
  }

  /**
   * Extract the parenthesis option from the options object.
   */
  const { parenthesis } = Object.assign({}, options);
  const openParen = parenthesis ? '(' : '';
  const closeParen = parenthesis ? ')' : '';
  /**
   * If the input is a RegExp, Number, or Boolean object, return its string representation.
   */
  if (isType(obj, 'RegExp') || isType(obj, 'Number') || isType(obj, 'Boolean')) {
    return obj.toString();
  }

  /**
   * If the input is a function, return its string representation wrapped in parentheses if specified.
   */
  if (typeof obj === 'function') {
    return openParen + obj.toString() + closeParen;
  }

  /**
   * If the input is a string, return its string representation wrapped in single quotes.
   */
  if (typeof obj === 'string') {
    return "'" + escapeString(obj) + "'";
  }

  /**
   * If the input is a Date object, return its string representation as a new Date object.
   */
  if (isType(obj, 'Date')) {
    return 'new Date(' + obj.getTime() + ')';
  }

  /**
   * If the input is an array, return its string representation as a comma-separated list of string representations.
   */
  if (Array.isArray(obj)) {
    return '[' + obj.map(v => stringify(v)).join(',') + ']';
  }

  /**
   * If the input is an object, return its string representation as a comma-separated list of key-value pairs.
   */
  if (typeof obj === 'object') {
    return openParen + '{' + Object.keys(obj).map(k => {
      var v = obj[k];
      return stringify(k) + ':' + stringify(v);
    }).join(',') + '}' + closeParen;
  }

  /**
   * If the input is not an object, return its string representation using the toString method.
   */
  if (!obj) return String(obj);
  return typeof obj?.toString == "function" ? obj?.toString() : String(obj);
}
