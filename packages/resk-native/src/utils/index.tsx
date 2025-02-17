import { ReactNode } from "react";
import isValidElement from "./isValidElement";
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


export * from "./hasTouchHandler";
export * from "./isComponent";