"use client";
import { isNextJs } from '@platform/isNext';
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
export function useHydrationStatus() {
    const [hydrated, setHydrated] = useState(getInitialHydrationStatus() ? true : false);
    useEffect(() => {
        if(!hydrated){
            setHydrated(true);
        }
    }, []);
    return hydrated;
}

/**
 * Determines the initial hydration status of the application.
 *
 * This function checks if the code is running in a browser environment (i.e., `window` is defined and truthy)
 * and not within a Next.js environment (as determined by `isNextJs()`).
 * Returns `true` if hydration should be considered complete, otherwise `false`.
 *
 * @returns {boolean} `true` if running in a browser and not in Next.js, otherwise `false`.
 */
export const getInitialHydrationStatus = ()=>typeof window !== 'undefined' && window && !isNextJs() ? true : false;
