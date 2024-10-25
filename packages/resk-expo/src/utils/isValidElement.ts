import * as ReactIs from "react-is";
import React, { ReactNode } from "react";
/**
 * Checks if the provided element is a valid React element.
 *
 * @param {any} element - The element to check.
 * @param {boolean} [includeStrOrText=false] - Indicates whether strings, 
 *   numbers, or booleans should be considered in the check.
 * @returns {boolean} `true` if the element is a valid React element or if
 *   it is a string, number, or boolean when `includeStrOrText` is true; otherwise, `false`.
 */
export default function isValidElement(element: any, includeStrOrText: boolean = false): boolean {
    if (element === null || ReactIs.isElement(element)) return true;
    if (includeStrOrText && (typeof element === "string" || typeof element === "number" || typeof element === 'boolean')) {
        return true;
    }
    if (Array.isArray(element)) {
        if (!element.length) return true;
        return element.every((el) => isValidElement(el, includeStrOrText));
    }
    return false;
}