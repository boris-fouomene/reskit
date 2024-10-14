import { IReactRef } from "../types";

/**
 * Associates the provided value with the given reference.
 * 
 * This function allows you to set a value to a reference that can be 
 * either a function or an object with a `current` property. It also 
 * optionally invokes a callback function with the associated value.
 * 
 * @template T - The type of the value to be associated with the reference.
 * @param ref - The reference to which the value should be associated. 
 *              This can be a function or a mutable reference object.
 * @param value - The value to be associated with the reference.
 * @param cb - An optional callback function that will be called with the associated value.
 * 
 * @returns The reference that was passed in.
 * 
 * ### Usage Example:
 * ```typescript
 * const myRef = useRef<number | null>(null);
 * 
 * setRef(myRef, 42, (value) => {
 *   console.log('The ref has been updated to:', value);
 * });
 * 
 * console.log(myRef.current); // Outputs: 42
 * ```
 */
export default function setRef<T extends unknown = unknown>(ref: IReactRef<T>, value: T, cb?: React.RefCallback<T>) {
    if (typeof ref == "function") {
        ref(value); // If ref is a function, call it with the value.
    } else if (ref && typeof ref == "object" && "current" in ref) {
        (ref as React.MutableRefObject<any>).current = value; // If ref is an object with a current property, set it to the value.
    }
    if (typeof cb === 'function') {
        cb(value); // If a callback is provided, invoke it with the value.
    }
    return ref; // Return the reference.
}
