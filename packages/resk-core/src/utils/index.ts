import { isNumber } from "./isNumber";

export * from "./numbers";
export * from "./json";
export { isRegExp as isRegex } from "./isRegex";
export { uniqid } from "./uniqid";
export * from "./dom";
export { defaultStr } from "./defaultStr";
export { isNonNullString } from "./isNonNullString";
export * from "./date";
export { isPromise } from "./isPromise";
export { stringify } from "./stringify";
export { defaultVal } from "./defaultVal";
export { defaultBool } from "./defaultBool";
export * from "./image";
export * from "./date";
export * from "./sort";
export * from "./defaultArray";
export * from "./object";
export * from "./isNumber";
export * from "./debounce";
export { debounce } from "./debounce";
export * from "./uri";

export * from "./string";
export * from "./uri";
export * from "./isValidEmail";
export { isPrimitive } from "./isPrimitive";
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

export { isClass } from "./isClass";

export { isEmpty } from "./isEmpty";
export { areEquals } from "./areEquals";
