import { isNumber, isObj } from '@resk/core/utils';
import { INativewindBaseProps } from '@src/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import variantsAll from '@variants/all';
import { computeElevationStyle } from './elevations-styles';
/**
 * A function that takes in any number of class names and returns a single class name string
 * that can be used in a React component's className prop. This function is useful for
 * conditionally applying class names, as it will only include the class names that are
 * truthy.
 *
 * @param {...ClassValue} inputs - Any number of class names to be merged
 * @returns {string} A single class name string that can be used in a React component's
 *                  className prop
 *
 * @example
 * import { cn } from '@resk/nativewind'
import { StyleSheet } from 'react-native';
 *
 * const MyComponent = ({ isDisabled }) => {
 *   return (
 *     <div className={cn('bg-red-500', isDisabled && 'opacity-50')}>
 *       My Component
 *     </div>
 *   )
 * }
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Normalizes component props by merging and formatting the className property.
 *
 * This utility function accepts an object of props that extend the INativewindBaseProps 
 * interface and returns a new object with all original props, but with the className 
 * property processed to ensure a consistent format. The className is merged using 
 * the `cn` function to handle conditional classNames.
 *
 * @template T - The type extending INativewindBaseProps, defaulting to any.
 * 
 * @param {T} props - The component props including an optional className.
 * @param {T} [defaultProps] - An optional object of default props to use if the input props are undefined.
 * @returns {Omit<T, "className"> & { className: string }} - A new props object with 
 *          a normalized className string.
 *
 * @example
 * const props = { className: "text-lg", disabled: true };
 * const normalizedProps = normalizeProps(props);
 * // normalizedProps.className will be a string formatted by `cn` function
 */

export function normalizeProps<T extends INativewindBaseProps = any>({ className, ...props }: T, defaultProps?: T): Omit<T, "className"> & { className: string } {
    defaultProps = isObj(defaultProps) ? defaultProps : {} as T;
    const { elevation } = props as any;
    if (isNumber(elevation) && elevation > 0) {
        (props as any).style = computeElevationStyle(props as any);
    }
    return {
        ...defaultProps, ...props,
        className: cn(defaultProps.className,
            variantsAll({ disabled: !!((props as any).disabled || (defaultProps as any)?.disabled) }),
            variantsAll({ readOnly: !!((props as any).readonly || (defaultProps as any)?.readonly) }),
            className
        )
    }
}
