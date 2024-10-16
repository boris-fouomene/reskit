import { useEffect, useRef } from "react";

/**
 * Creates a reference to a provider and invokes a callback with the current value.
 * 
 * This hook initializes a ref using `useRef` and sets up an effect using `useEffect`
 * to call the provided callback function whenever the ref's current value changes.
 * 
 * @template T - The type of the provider context.
 * @param cb - An optional callback function that receives the current context value.
 * 
 * @returns A mutable ref object containing the provider reference.
 * 
 * ### Usage Example:
 * ```typescript
 * const providerRef = createProviderRef((context) => {
 *   console.log('Provider context changed:', context);
 * });
 * ```
 */
export function createProviderRef<T>(cb?: (context: T | null) => any) {
    const ref = useRef<T | null>(null);
    useEffect(() => {
        if (typeof cb === 'function') {
            cb(ref.current);
        }
    }, [ref.current]);
    return ref;
}



/**
 * Retrieves a reference to a provider based on a comparison function.
 * 
 * This function checks whether the provided `innerProviderRef` is valid and meets the criteria 
 * defined by the `compare` function. If valid, it returns the reference as type T; 
 * otherwise, it returns null.
 * 
 * @template T - The expected type of the provider reference.
 * @param innerProviderRef - The reference to check and return.
 * @param compare - A function used to compare the reference value.
 * 
 * @returns The provider reference if it is valid; otherwise, returns null.
 * 
 * ### Usage Example:
 * ```typescript
 * const drawerRef = getProviderRef<MyDrawerType>(innerProviderRef, (value) => value?.isOpen);
 * if (drawerRef) {
 *   console.log('Drawer is open:', drawerRef.isOpen);
 * } else {
 *   console.log('No valid drawer reference found.');
 * }
 * ```
 */
export function getProviderRef<T>(innerProviderRef: any, compare: (value: any) => boolean): T | null {
    if (!innerProviderRef) return null; // Return null if innerProviderRef is not provided.
    if (compare(innerProviderRef)) { // Check if innerProviderRef meets the comparison criteria.
        return innerProviderRef as T; // Return innerProviderRef as type T if valid.
    }
    if (innerProviderRef?.current && compare(innerProviderRef.current)) { // Check current property if exists.
        return innerProviderRef.current as T; // Return the current property as type T if valid.
    }
    return null; // Return null if no valid reference is found.
}
