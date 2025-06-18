"use client";
import { useState, useEffect } from 'react';

/**
 * Custom React hook that determines if the component has been hydrated on the client side.
 *
 * @returns {boolean} `true` if the component is hydrated (i.e., running in the browser), otherwise `false`.
 *
 * @remarks
 * - Initially checks if `window` is defined to determine if the code is running on the client.
 * - Ensures hydration state is set to `true` after the first render on the client.
 * - Useful for avoiding mismatches between server-side and client-side rendering.
 */
export function useHydrated() {
    const [hydrated, setHydrated] = useState(typeof window !== 'undefined' && window ? true : false);
    useEffect(() => {
        if(!hydrated){
            setHydrated(true);
        }
    }, []);
    return hydrated;
}
