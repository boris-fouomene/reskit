import Logger from "@resk/core/logger";
import { ViewStyle } from "react-native";

/**
 * This function is a copy of the implementation found in react-native-paper. 
 * @see : https://github.com/callstack/react-native-paper/blob/main/src/utils/splitStyles.ts
 * 
 * Utility function to split a style object into separate objects based on the provided filters. It splits a `ViewStyle` object into multiple parts based on filters provided.
 * 
 * The function iterates through the properties of a style object and splits them
 * into multiple groups, each corresponding to a provided filter function. The filters
 * determine which style properties belong to which group. A final "rest" group contains
 * all the styles that do not match any of the filters.
 * 
 * @template Tuple - A tuple of filter functions used to split the styles.
 * 
 * @param {ViewStyle} styles - The style object containing various style properties.
 * @param {...Tuple} filters - A set of filter functions. Each filter function takes
 * a style property name as a string and returns a boolean indicating whether the property
 * should belong to the corresponding group.
 * 
 * @returns {[ViewStyle, ...MappedTuple<Tuple>]} - An array of filtered style objects where each element is a `ViewStyle`.
 * - The first style object contains the properties that didn't match any filter.
 * - After that, there will be a style object for each filter you passed in the same order as the matching filters.
 * - A style property will exist in a single style object, the first filter it matched.
 * 
 * @example
 * ```typescript
 * const styles = {
 *   color: 'red',
 *   backgroundColor: 'blue',
 *   width: 100,
 *   height: 200,
 * };
 * 
 * // Filters to separate color-related properties and size-related properties.
 * const isColor = (prop: string) => prop === 'color' || prop === 'backgroundColor';
 * const isSize = (prop: string) => prop === 'width' || prop === 'height';
 * 
 * const [restStyles, colorStyles, sizeStyles] = splitStyles(styles, isColor, isSize);
 * 
 * console.log(restStyles); // Outputs: {}
 * console.log(colorStyles); // Outputs: { color: 'red', backgroundColor: 'blue' }
 * console.log(sizeStyles); // Outputs: { width: 100, height: 200 }
 * ```
 * @example
 * const styles = {
 *   color: 'red',
 *   fontSize: 16,
 *   fontWeight: 'bold',
 *   padding: 10,
 * };
 *
 * const filters = [
 *   (property) => property === 'color' || property === 'fontSize',
 *   (property) => property === 'fontWeight',
 * ];
 *
 * const split = splitStyles(styles, ...filters);
 * console.log(split);
 * // Output:
 * // [
 * //   { padding: 10 },
 * //   { color: 'red', fontSize: 16 },
 * //   { fontWeight: 'bold' },
 * // ]
 */
export function splitStyles<Tuple extends FiltersArray>(
    styles: ViewStyle,
    ...filters: Tuple
) {
    // Log an error in development mode if no filters are provided
    if (process.env.NODE_ENV !== 'production' && filters.length === 0) {
        Logger.error('No filters were passed when calling splitStyles');
    }

    /**
     * An array to temporarily store the style properties that match each filter.
     * 
     * Each index in `newStyles` corresponds to a filter in the `filters` array. Initially,
     * these arrays are empty.
     */
    const newStyles = filters.map(() => [] as Entry[]);

    /**
     * This array holds any style properties that do not match any of the provided filters.
     */
    const rest: Entry[] = [];

    /**
     * Iterate over each property in the `styles` object.
     * 
     * The object is transformed into an array of entries using `Object.entries`.
     */
    outer: for (const item of Object.entries(styles) as Entry[]) {
        // Check each filter function to determine if the current style property matches
        for (let i = 0; i < filters.length; i++) {
            if (filters[i](item[0])) {
                // If a filter matches, add the style property to the corresponding filtered styles array
                newStyles[i].push(item);
                continue outer; // Skip to the next style property after a match is found
            }
        }

        // If no filters match, add the style property to the `rest` array
        rest.push(item);
    }

    // Add the unmatched styles (stored in `rest`) to the beginning of the filtered styles array
    newStyles.unshift(rest);

    /**
     * Convert the arrays of style entries back into objects and return the result.
     * 
     * The `newStyles` array, which holds entries, is transformed into style objects
     * using `Object.fromEntries`.
     */
    return newStyles.map((styles) => Object.fromEntries(styles)) as unknown as [
        ViewStyle,
        ...MappedTuple<Tuple>
    ];
}



/**
 * @interface
 * A type representing an array of filter functions.
 * Each filter function takes a style property key and returns a boolean indicating
 * whether the property matches the filter criteria.
 */
type FiltersArray = readonly ((style: keyof ViewStyle) => boolean)[];

/**
 * @interface
 * A type representing the style of a ViewStyle object.
 * This type extracts the values of the ViewStyle properties.
 */
type Style = ViewStyle[keyof ViewStyle];

/**
 * @interface
 * A type representing a key-value pair of a style property.
 * The first element is the key (property name) of the style,
 * and the second element is the corresponding value of that property.
 */
type Entry = [keyof ViewStyle, Style];

/**
 * @interface
 * A mapped type that creates an array of ViewStyle objects based on the provided FiltersArray.
 * Each index in the mapped tuple corresponds to a filter, and the length of the tuple
 * matches the length of the FiltersArray.
 *
 * @template Tuple - A tuple type that extends FiltersArray.
 */
type MappedTuple<Tuple extends FiltersArray> = {
    [Index in keyof Tuple]: ViewStyle; // Maps each index to a ViewStyle object.
} & { length: Tuple['length'] }; // Ensures the length property matches the original tuple length.