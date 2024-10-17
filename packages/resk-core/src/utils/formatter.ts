import { IFieldFormatValueOptions, IFieldFormatValueResult } from "../types";
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT, DEFAULT_TIME_FORMAT, formatDate, isDateObj, isValidDate } from "./date";

/***
 * formatte une valeur passée en paramètre dans les options de l'interface IFormatValueOptions
 * @param options les options ideme à l'interface IFormatValueOptions
 * @param {boolean} returnObject Optional, si l'objet sera retourné en lieu et place de la chaine de caractère
*/
export const formatValue = ({ value, type, format, dateFormat, ...rest }: IFieldFormatValueOptions, returnObject: boolean = false): string | IFieldFormatValueResult => {
    const canValueBeDecimal = type && ['decimal', 'numeric', 'number'].includes(String(type).toLowerCase());;
    let parsedValue = value;
    value = value === undefined || value === null || !value ? "" : value;
    if (!value) {
        parsedValue = canValueBeDecimal ? 0 : '';
    }
    if (canValueBeDecimal) {
        parsedValue = parseDecimal(value);
    }
    let formattedValue = undefined;
    if (typeof format === 'function') {
        formattedValue = format({ ...rest, type, value });
    } else {
        const typeText = String(type).toLowerCase();
        if ((isDateObj(value) && (dateFormat || (["time", "date", "datetime"].includes(typeText) && isValidDate(value))))) {
            formattedValue = formatDate(value, dateFormat || typeText === "time" ? DEFAULT_TIME_FORMAT : typeText === "date" ? DEFAULT_DATE_FORMAT : DEFAULT_DATE_TIME_FORMAT);
        } if (typeof parsedValue == 'number') {
            if (typeof (Number.prototype)[format as keyof Number] === 'function') {
                formattedValue = (parsedValue as number)[format as keyof Number]();
            } else {
                formattedValue = (parsedValue as number).formatNumber();
            }
        } else {
            formattedValue = typeof value == 'string' ? value : value?.toString() || '';
        }
    }
    return returnObject ? {
        formattedValue,
        isDecimalType: canValueBeDecimal,
        value,
        format,
        parsedValue,
        decimalValue: typeof parsedValue == 'number' ? parsedValue : 0,
    } : formattedValue;
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



