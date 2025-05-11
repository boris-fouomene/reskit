"use client";
import { useEffect, useCallback, useRef } from "react";

/***
 * A custom hook that keeps track of whether a component is currently mounted.
 * 
 * This hook returns a function that can be called to determine if the component 
 * is still mounted. This is useful for preventing memory leaks and ensuring that 
 * state updates or callbacks are only executed when the component is mounted.
 * 
 * @returns {() => boolean} A callback function that returns `true` if the 
 * component is mounted, and `false` otherwise.
 */
export default function useIsMounted() {
    const ref = useRef(true);

    useEffect(() => {
        // Set the ref to false when the component is unmounted
        return () => { ref.current = false; };
    }, []);

    // Return a callback that returns the current mounted state
    return useCallback(() => ref.current, []);
}
