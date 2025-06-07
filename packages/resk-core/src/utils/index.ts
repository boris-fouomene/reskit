import { isNumber } from "./isNumber";

export * from "./numbers";
export * from "./json";
export { default as isRegex } from "./isRegex";
export { default as uniqid } from "./uniqid";
export * from "./dom";
export { default as defaultStr } from "./defaultStr";
export { default as isNonNullString } from "./isNonNullString";
export * from "./date";
export { default as isPromise } from "./isPromise";
export { default as stringify } from "./stringify";
export { default as defaultVal } from "./defaultVal";
export { default as defaultBool } from "./defaultBool";
export * from "./image";
export * from "./date";
export * from "./sort";
export * from "./defaultArray";
export * from "./object";
export * from "./isNumber";
export * from "./debounce";
export { default as debounce } from "./debounce";
export * from "./uri";

export * from "./string";
export * from "./uri";
export * from "./isValidEmail";
export { default as isPrimitive } from "./isPrimitive";
export * from "./global";


/**
 * Checks if a value is an integer.
 * 
 * This function returns true if the value is a finite number and its floor value is equal to the value itself.
 * 
 * @param x The value to check.
 * @returns True if the value is an integer, false otherwise.
 */
export function isInteger(x: any): x is number {
  return isNumber(x) && isFinite(x) && Math.floor(x) === x;
}

export * from "./isNullable";

export { default as isClass } from "./isClass";

export { default as isEmpty } from "./isEmpty";
export { default as areEquals } from "./areEquals";