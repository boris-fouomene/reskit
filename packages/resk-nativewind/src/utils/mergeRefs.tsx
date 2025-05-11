import {Ref,RefCallback} from "react";
import { useMemo } from "react";

/**
 * Merges multiple React refs into a single ref callback.
 * This utility function allows you to combine several refs into one, 
 * ensuring that each ref receives the same value.
 * 
 * @template T - The type of the element to which the refs are attached.
 * @param refs - An array of refs to be merged, which can be 
 *               either function refs or mutable refs.
 * @returns A ref callback that merges the provided refs.
 * 
 * ### Usage Example:
 * 
 * ```tsx
 * const ref1 = React.useRef(null);
 * const ref2 = React.useRef(null);
 * 
 * const mergedRef = mergeRefs(ref1, ref2);
 * 
 * return <div ref={mergedRef}>Hello World</div>;
 * ```
 */
export function mergeRefs<T = any>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (value) => {
    const refCallbacks : Array<Function> = [];
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        const r = ref(value);
        if(typeof r === 'function') {
          refCallbacks.push(r);
        }
      } else if (ref != null) {
        (ref as any).current = value;
      }
    });
    return (...args: any[]) => {
      refCallbacks.forEach((refCallback) => {
        refCallback(...args);
      });
    }
  };
}

/**
 * A hook that implements the mergeRefs functionality in a React hook context.
 * It allows you to merge multiple refs while keeping track of the memoized 
 * callback reference.
 * 
 * @template T - The type of the element to which the refs are attached.
 * @param refs - An array of refs to be merged, which can be 
 *               mutable refs or legacy refs.
 * @returns A ref callback that merges the provided refs.
 * 
 * ### Usage Example:
 * 
 * ```tsx
 * const ref1 = React.useRef<HTMLDivElement>(null);
 * const ref2 = React.useRef<HTMLDivElement>(null);
 * 
 * const mergedRef = useMergeRefs(ref1, ref2);
 * 
 * return <div ref={mergedRef}>Hello World</div>;
 * ```
 */
export function useMergeRefs<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return useMemo(() => mergeRefs<T>(...refs), [...refs]);
}
