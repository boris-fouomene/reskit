import { useRef, useEffect } from "react";

const refEquality = (a: any, b: any) => a === b;

/***
 * A custom hook that retrieves the previous value of the given input value.
 * 
 * Upon initialization, the previous value returned is the same as the value 
 * passed to the hook at the time of initialization.
 * 
 * @param value The current value of type T.
 * @param compareFn An optional comparison function that determines if the 
 * previous value is the same as the current value. By default, a reference 
 * equality check is applied.
 * @returns The previous value of type T.
 */
export default function usePrevious<T>(value: T, compareFn?: (a: T, b: T) => boolean): T {
    const ref = useRef<T>(value);
    const fn = typeof compareFn === 'function' ? compareFn : refEquality;

    useEffect(() => {
        // Update the ref to the current value if it has changed
        if (!fn(ref.current, value)) {
            ref.current = value;
        }
    }, [value]); // Only re-run if value changes

    return ref.current as T; // Return the previous value
}

