import { IFormatValueOptions, IFormatValueResult } from "../types";
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT, DEFAULT_TIME_FORMAT, formatDate, isDateObj, isValidDate } from "./date";

/**
 * @description
 * Formats a value according to the provided options defined in the IFormatValueOptions interface.
 *
 * This function takes an input value and formats it based on the specified type, format function, 
 * and other parameters. It returns an object containing the formatted value and other relevant 
 * information, such as whether the value can be a decimal.
 *
 * @param {IFormatValueOptions} options - The options for formatting, adhering to the IFormatValueOptions interface.
 * @param {boolean} returnObject - Optional. If true, the function will return an object instead of a formatted string.
 * 
 * @returns {IFormatValueResult} - An object containing:
 *   - formattedValue: The formatted output based on the provided options.
 *   - isDecimalType: A boolean indicating if the value can be treated as a decimal.
 *   - value: The original input value.
 *   - format: The formatting function or type used.
 *   - parsedValue: The parsed numeric value.
 *   - decimalValue: The decimal representation of the value, defaulting to 0 if not applicable.
 *
 * Example:
 * ```typescript
 * const options = {
 *   value: "123.45",
 *   type: "decimal",
 *   format: (opts) => `${opts.value} formatted`,
 * };
 * const result = formatValueToObject(options);
 * console.log(result);
 * // Output: {
 * //   formattedValue: "123.45 formatted",
 * //   isDecimalType: true,
 * //   value: "123.45",
 * //   format: [Function],
 * //   parsedValue: 123.45,
 * //   decimalValue: 123.45
 * // }
 * ```
 */
export const formatValueToObject = ({ value, type, format, dateFormat, ...rest }: IFormatValueOptions): IFormatValueResult => {
    const canValueBeDecimal = type && ['decimal', 'numeric', 'number'].includes(String(type).toLowerCase());
    let parsedValue = value;

    // Normalize the value: if it's undefined, null, or empty, set it to an empty string.
    value = value === undefined || value === null || !value ? "" : value;
    if (!value) {
        // If the value is empty and can be decimal, set parsedValue to 0; otherwise, set it to an empty string.
        parsedValue = canValueBeDecimal ? 0 : '';
    }

    // If the value can be a decimal, parse it accordingly.
    if (canValueBeDecimal) {
        parsedValue = parseDecimal(value);
    }

    let formattedValue = undefined;

    // If a format function is provided, use it to format the value.
    if (typeof format === 'function') {
        formattedValue = format({ ...rest, type, value });
    } else {
        const typeText = String(type).toLowerCase();

        // Format dates if the value is a valid date object.
        if (isDateObj(value) && (dateFormat || (["time", "date", "datetime"].includes(typeText) && isValidDate(value)))) {
            formattedValue = formatDate(value, dateFormat || typeText === "time" ? DEFAULT_TIME_FORMAT : typeText === "date" ? DEFAULT_DATE_FORMAT : DEFAULT_DATE_TIME_FORMAT);
        }
        // Format numbers based on the specified format.
        else if (typeof parsedValue == 'number') {
            if (typeof (Number.prototype)[format as keyof Number] === 'function') {
                formattedValue = (parsedValue as number)[format as keyof Number]();
            } else {
                formattedValue = (parsedValue as number).formatNumber();
            }
        } else {
            // Convert non-string values to strings.
            formattedValue = typeof value == 'string' ? value : value?.toString() || '';
        }
    }

    // Return an object containing the formatted value and additional details.
    return {
        formattedValue,
        isDecimalType: canValueBeDecimal,
        value,
        format,
        parsedValue,
        decimalValue: typeof parsedValue == 'number' ? parsedValue : 0,
    };
}

/**
 * @description
 * Formats a value based on the provided options and returns the formatted string.
 *
 * This function serves as a simpler interface for formatting values. It internally calls 
 * the `formatValueToObject` function to obtain the formatted value and then returns it 
 * as a string. This is useful for scenarios where only the formatted string is needed.
 *
 * @param options - The options for formatting, adhering to the IFormatValueOptions interface.
 * @ param returnObject - Optional. If true, the function will return an object instead of a formatted string.
 * 
 * @returns {string} - The formatted value as a string.
 *
 * Example:
 * ```typescript
 * const options = {
 *   value: "123.45",
 *   type: "decimal",
 *   format: (opts) => `${opts.value} formatted`,
 * };
 * const formattedString = formatValue(options);
 * console.log(formattedString);
 * // Output: "123.45 formatted"
 * ```
 */
export const formatValue = (options: IFormatValueOptions, returnObject: boolean = false): string => {
    const { formattedValue, parsedValue } = formatValueToObject(options);
    // Return the formatted value as a string.
    return formattedValue;
}


/**
 * Parses a given value and converts it into a decimal number.
 *
 * This function takes a value as input and performs the following checks:
 * - If the value is already a number, it returns the value directly.
 * - If the value is undefined, null, or not a string, it returns 0.
 * - If the value is a string, it trims whitespace, replaces commas with periods,
 *   and removes any spaces before converting it to a float.
 *
 * ### Parameters:
 * - `value`: 
 *   - **Type**: `any`
 *   - The value to be parsed. This can be a number, string, or any other type. 
 *     The function will attempt to convert it to a decimal number.
 *
 * ### Returns:
 * - **Type**: `number`
 *   - The decimal representation of the input value. If the input is invalid 
 *     (e.g., undefined, null, or not a valid string), it returns 0.
 *
 * ### Example Usage:
 * ```typescript
 * const decimal1 = parseDecimal("1,234.56"); // Returns: 1234.56
 * const decimal2 = parseDecimal(789);         // Returns: 789
 * const decimal3 = parseDecimal(null);         // Returns: 0
 * const decimal4 = parseDecimal("invalid");    // Returns: 0
 * ```
 */
export const parseDecimal = (value: any): number => {
    if (typeof value === 'number') return value;
    if (value == undefined || value == null || !value || typeof value !== 'string') {
        return 0;
    }
    value = String(value).trim();
    if (!value.includes(".")) {
        value = value.replace(",", ".");
    }
    return parseFloat(value.replaceAll(" ", ''));
}



