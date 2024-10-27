import { ReactNode } from "react";
import { Platform } from "react-native";
import Constants from 'expo-constants';
import isValidElement from "./isValidElement";
import { defaultStr, isObj } from "@resk/core";
export { default as useStableMemo } from "./useStableMemo";
export { default as isValidElement } from "./isValidElement";
export { default as usePrevious } from "./usePrevious";
export * from "./mergeRefs";
export { default as getTextContent } from "./getTextContent";
export { default as ObservableComponent } from "./ObservableComponent";
export { default as useIsMounted } from "./useIsMounted";
export * from "./provider";
export { default as useStateCallback } from "./stateCallback";
export { default as Component } from "./Component";
export * from "./key";
export { default as useForceRender } from "./useForceRender";
export { default as setRef } from "./setRef";
export * from "./i18nManager";

/***
    vérifie si la variable node est un élément reactNode
*/
export function isReactNode(node: any): node is ReactNode {
  if (node === null || node === undefined) {
    return true;
  }
  if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
    return true;
  }
  if (Array.isArray(node) && node.every(isReactNode)) {
    return true;
  }
  if (isValidElement(node)) {
    return true;
  }
  return false;
}

/**
 * The name of the package as defined in the application's manifest or expoConfig.
 * 
 * This constant checks the `manifest` or `expoConfig` properties from Expo's `Constants` module 
 * to retrieve the application name from `expoConfig` file. 
 *
 * @example
 * ```ts
 * const packageName = Constants.expoConfig?.name;
 * console.log(packageName); // "MyApp" or undefined if not found
 * ```
 * 
 * @returns {string | undefined} The name of the app from the manifest or expoConfig, or `undefined` if not found.
 */
export const packageName = defaultStr(Constants.expoConfig?.name);