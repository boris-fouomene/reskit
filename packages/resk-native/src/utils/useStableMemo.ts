import stableHash from 'stable-hash';
import { useMemo } from 'react';

/***
 * A custom hook that memoizes a value using the stable-hash function.
 * This hook ensures that the memoized value is recomputed only when
 * the dependencies change, providing stable references for complex objects.
 * 
 * @param factory A function that returns the value to be memoized.
 * @param deps An array of dependencies that determine when the memoized
 * value should be recalculated. The stable-hash of the dependencies is used
 * to check for changes.
 * @returns The memoized value.
 */
export default function useStableMemo(factory: () => unknown, deps: any): unknown {
    return useMemo(factory, [stableHash(deps)]);
}
