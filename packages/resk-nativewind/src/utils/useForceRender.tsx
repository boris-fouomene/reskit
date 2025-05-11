"use client";
import { useState } from "react";
import useIsMounted from "./useIsMounted";

/***
 * A custom hook that forces a component to re-render.
 * 
 * This hook can be useful in situations where a component needs to 
 * be updated or re-rendered in response to an external change or 
 * event that is not directly tied to its props or state.
 * 
 * @returns {() => void} A function that, when called, will trigger 
 * a re-render of the component if it is still mounted.
 */
export default function useForceRender() {
    const isMounted = useIsMounted();
    const [, dispatch] = useState(Object.create(null));
    return () => {
        if (isMounted()) {
            dispatch(Object.create(null)); // Trigger a re-render by updating state
        }
    };
}