
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
export * from "./inputFormatter";
export * from "./date";
export * from "./sort";
export * from "./defaultArray";
export * from "./object";
export * from "./isNumber";

export * from "./string";
export * from "./uri";
export * from "./isValidEmail";
export * from "./observable";
export { default as isPrimitive } from "./isPrimitive";
export { default as Global } from "./global";

/***
 * Cée un objet enum à partir d'un type union
 */
export function createEnum<T extends string>(...args: T[]): { [K in T]: K } {
  return args.reduce((acc, value) => {
    acc[value] = value;
    return acc;
  }, Object.create(null)) as { [K in T]: K };
}

/***
 * vérifie si la valeur passée en paramètre est un nombre entier
 */
export function isInteger(x: any) {
  return typeof x === "number" && isFinite(x) && Math.floor(x) === x;
}
export { default as isClass } from "./isClass";

export { default as isEmpty } from "./isEmpty";
export { default as areEquals } from "./areEquals";