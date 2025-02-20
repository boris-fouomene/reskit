import stringify from "@utils/stringify";
import { IInputFormatterNumberMaskOptions, IInputFormatterMask, IInputFormatterMaskArray, IInputFormatterMaskOptions, IInputFormatterOptions, IInputFormatterResult, IInputFormatterMaskResult, IInputFormatterMaskWithValidation } from "../../types";
import { DEFAULT_DATE_FORMATS, formatDate, isDateObj, isValidDate } from "../date";
import defaultStr from "../defaultStr";
import isNonNullString from "../isNonNullString";
import isRegExp from "../isRegex";
import moment from "moment";
import "../numbers";
import { AsYouType, CountryCode, getExampleNumber, Examples } from "libphonenumber-js";
import { isValidPhoneNumber } from "@utils/isValidPhoneNumber";
import examples from 'libphonenumber-js/mobile/examples';
import isEmpty from "@utils/isEmpty";

const DIGIT_REGEX = /\d/;
const LETTER_REGEX = /[a-zA-Z]/;

/***
    InputFormatter class is used to format the value to the desired format
*/
export class InputFormatter {
  /**
   * @description
   * Formats a value according to the provided options defined in the IInputFormatterOptions interface.
   *
   * This function takes an input value and formats it based on the specified type, format function, 
   * and other parameters. It returns an object containing the formatted value and other relevant 
   * information, such as whether the value can be a decimal.
   *
   * @param {IInputFormatterOptions} options - The options for formatting, adhering to the IInputFormatterOptions interface.
   * @param {boolean} returnObject - Optional. If true, the function will return an object instead of a formatted string.
   * 
   * @returns {IInputFormatterResult} - An object containing:
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
  static formatValueToObject({ value, type, format, dateFormat, ...rest }: IInputFormatterOptions): IInputFormatterResult {
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
      parsedValue = InputFormatter.parseDecimal(value);
    }

    let formattedValue = undefined;

    // If a format function is provided, use it to format the value.
    if (typeof format === 'function') {
      formattedValue = format({ ...rest, type, value });
    } else {
      const typeText = String(type).toLowerCase();

      // Format dates if the value is a valid date object.
      if (isDateObj(value) && (dateFormat || (["time", "date", "datetime"].includes(typeText) && isValidDate(value)))) {
        formattedValue = formatDate(value, dateFormat || typeText === "time" ? DEFAULT_DATE_FORMATS.time : typeText === "date" ? DEFAULT_DATE_FORMATS.date : DEFAULT_DATE_FORMATS.dateTime);
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
   * @param options - The options for formatting, adhering to the IInputFormatterOptions interface.
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
  static formatValue(options: IInputFormatterOptions): string {
    const { formattedValue, parsedValue } = InputFormatter.formatValueToObject(options);
    // Return the formatted value as a string.
    return formattedValue;
  }
  /***
   * Check if a given mask is valid or not
   * @param {IInputFormatterMask}, the input mask to check
   * @return {boolean} Wheather the mask is valid or not
   */
  static isValidMask(mask?: IInputFormatterMask) {
    return Array.isArray(mask) || typeof mask === "function";
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
  static parseDecimal = (value: any): number => {
    if (typeof value === 'number') return value;
    if (value == undefined || value == null || !value || typeof value !== 'string') {
      return 0;
    }
    value = String(value).trim();
    if (!value.includes(".")) {
      value = value.replace(",", ".");
    }
    const v = parseFloat(value.replaceAll(" ", ''));
    return typeof v === "number" && v || 0;
  }
  /**
   * Formats a value with a mask.
   *
   * This method takes an options object with a value, mask, and other settings, and returns an object with the masked, unmasked, and obfuscated values, as well as the original mask array.
   *
   * @param options The options object with the value, mask, and other settings.
   * @returns An object with the masked, unmasked, and obfuscated values, as well as the original mask array.
   *
   * @example
   * ```typescript
   * const options: IInputFormatterMaskOptions = {
   *   value: '12345',
   *   mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
   *   obfuscationCharacter: '*',
   * };
   * const result = formatWithMask(options);
   * console.log(result);
   * // Output:
   * ```
  * 
  * 
  * @license This code is adapted from [Original Repository Name] (https://github.com/CaioQuirinoMedeiros/react-native-mask-input).
  * 
  * Copyright (c) [2025] [CaioQuirinoMedeiros]
  * Licensed under the MIT License (https://github.com/CaioQuirinoMedeiros/react-native-mask-input/blob/main/LICENSE)
  * 
  */
  static formatWithMask(options: IInputFormatterMaskOptions): IInputFormatterMaskResult {
    options = Object.assign({}, options);
    const { value: customValue, placeholderCharacter: customPlaceholderCharacter, mask, validate, obfuscationCharacter,/* maskAutoComplete = false*/ } = options;
    const stValue = isEmpty(customValue) ? "" : customValue === undefined ? "" : ["number", "boolean", "string"].includes(typeof customValue) ? customValue.toString() : customValue === null ? "" : customValue?.toString() || String(customValue);
    const value = defaultStr(stValue);
    const mArray = typeof mask === 'function' ? mask({ ...options, value }) : mask;
    const maskArray = Array.isArray(mArray) ? mArray : [];
    const placeholderCharacter = defaultStr(customPlaceholderCharacter, "_").charAt(0);
    let placeholder = "";
    maskArray.map((mask) => {
      placeholder += String(isNonNullString(mask) ? mask : Array.isArray(mask) && isNonNullString(mask[1]) ? mask[1] : placeholderCharacter).charAt(0);
    });
    let isValid = true;
    const calValidate = (value: string) => typeof validate === 'function' ? validate(value) : true;
    // make sure it'll not break with null or undefined inputs
    if (!maskArray.length || !value) {
      return {
        maskHasObfuscation: false,
        masked: value,
        unmasked: value,
        obfuscated: value,
        maskArray,
        placeholder,
        isValid: isValid && calValidate(value),
      };
    }
    let masked = '';
    let obfuscated = '';
    let unmasked = '';
    let maskCharIndex = 0;
    let valueCharIndex = 0;
    let maskHasObfuscation = false;
    while (maskCharIndex < maskArray.length) {
      const maskChar = maskArray[maskCharIndex];
      const valueChar = value[valueCharIndex];
      if (valueCharIndex === value.length) {
        break;
      }
      const unmaskedValueChar = value[valueCharIndex];
      unmasked += unmaskedValueChar;
      // it's a regex maskChar: let's advance on value index and validate the value within the regex
      if (typeof maskChar === 'object') {
        const obfuscatedCharacter = defaultStr(Array.isArray(maskChar) ? maskChar[2] : undefined, obfuscationCharacter).charAt(0);
        // advance on value index
        const shouldObsfucateChar = Array.isArray(maskChar) && maskChar[2] !== false && obfuscatedCharacter;
        if (shouldObsfucateChar) {
          maskHasObfuscation = true;
        }
        const maskCharRegex = Array.isArray(maskChar) ? maskChar[0] : maskChar;
        const maskCharString = String(maskCharRegex);
        try {
          const isReg = isRegExp(maskCharRegex);
          const matchRegex = isReg ? RegExp(maskCharRegex).test(valueChar) : maskCharString === valueChar;
          const valToAdd = isReg ? valueChar : maskCharString;
          // value match regex: add to masked and unmasked result and advance on mask index too
          if (matchRegex) {
            masked += valToAdd;
            obfuscated += (shouldObsfucateChar ? obfuscatedCharacter : valToAdd);
          } else {
            isValid = false;
          }
        } catch (e) { }
      } else if (isNonNullString(maskChar)) {
        if (maskChar !== valueChar) {
          isValid = false;
        }
        // it's a fixed maskChar: add to maskedResult and advance on mask index
        masked += maskChar;
        obfuscated += maskChar;
      } else {
        isValid = false;
      }
      maskCharIndex += 1;
      valueCharIndex += 1;
    }
    return { masked, isValid: isValid && calValidate(value), maskHasObfuscation, placeholder, unmasked, obfuscated, maskArray };
  }

  /**
   * Creates a number mask.
   *
   * This method takes an options object with settings for the number mask, such as the delimiter, precision, prefix, and separator.
   * It returns a function that takes an options object with a value, and returns a mask array for the number.
   *
   * @param options The options object with settings for the number mask.
   * @returns A function that takes an options object with a value, and returns a mask array for the number.
   *
   * @example
   * ```typescript
   * const numberMask = createNumberMask({
   *   delimiter: '.',
   *   precision: 2,
   *   prefix: ['$', ' '],
   *   separator: ',',
   * });
   * const mask = numberMask({ value: '123456.78' });
   * console.log(mask);
   * // Output:
   * // ['$ ', '1', '2', '3', ',', '4', '5', '6', '.', '7', '8']
   * ```
   * @license This code is adapted from [Original Repository Name] (https://github.com/CaioQuirinoMedeiros/react-native-mask-input).
   * 
   * Copyright (c) [2025] [CaioQuirinoMedeiros]
   * Licensed under the MIT License (https://github.com/CaioQuirinoMedeiros/react-native-mask-input/blob/main/LICENSE) 
   */
  static createNumberMask(options?: IInputFormatterNumberMaskOptions): IInputFormatterMask {
    const { delimiter = '.', precision = 2, prefix = [], separator = ',' } = Object.assign({}, options);
    return ({ value }: IInputFormatterOptions) => {
      const numericValue = value?.replace(/\D+/g, '') || '';
      let mask: IInputFormatterMaskArray = numericValue.split('').map(() => /\d/);
      const shouldAddSeparatorOnMask = precision > 0 && !!separator;
      if (mask.length > precision && shouldAddSeparatorOnMask) {
        mask.splice(-precision, 0, separator);
      }
      const amountOfDelimiters = Math.ceil((numericValue.length - precision) / 3) - 1;
      if (delimiter) {
        for (let i = 0; i < amountOfDelimiters; i++) {
          const precisionOffset = precision;
          const separatorOffset = shouldAddSeparatorOnMask ? 1 : 0;
          const thousandOffset = 3 + (delimiter ? 1 : 0);
          const delimiterPosition =
            -precisionOffset - separatorOffset - i * thousandOffset - 3;

          mask.splice(delimiterPosition, 0, delimiter);
        }
      }
      return [...prefix, ...mask];
    };
  }
  /***
   * Predefined masks for common moment formats.
   * The keys of the object are the moment format strings, and the values are arrays of regular expressions or strings that define the expected format of the input value.
   */
  static MOMENT_MASKS_MAP = {
    // Year tokens
    YYYY: Array(4).fill([DIGIT_REGEX, 'Y']),
    YY: Array(2).fill([DIGIT_REGEX, 'Y']),

    // Month tokens
    MM: Array(2).fill([DIGIT_REGEX, 'M']),
    M: [[DIGIT_REGEX, 'M']],
    MMMM: Array(9).fill([LETTER_REGEX, 'M']), // Longest month name (September)
    MMM: Array(3).fill([LETTER_REGEX, 'M']),

    // Day tokens
    DD: Array(2).fill([DIGIT_REGEX, 'D']),
    D: [[DIGIT_REGEX, 'D']],

    // Hour tokens
    HH: Array(2).fill([DIGIT_REGEX, 'H']), // 24-hour
    H: [[DIGIT_REGEX, 'H']], // 24-hour
    hh: Array(2).fill([DIGIT_REGEX, 'h']), // 12-hour
    h: [[DIGIT_REGEX, 'h']], // 12-hour

    // Minute tokens
    mm: Array(2).fill([DIGIT_REGEX, 'm']),
    m: [[DIGIT_REGEX, 'm']],

    // Second tokens
    ss: Array(2).fill([DIGIT_REGEX, 's']),
    s: [[DIGIT_REGEX, 's']],

    // Millisecond token
    SSS: Array(3).fill([DIGIT_REGEX, 'S']),

    // Timezone tokens
    Z: [/[+-]/, DIGIT_REGEX, DIGIT_REGEX, DIGIT_REGEX, DIGIT_REGEX],
    ZZ: [/[+-]/, DIGIT_REGEX, DIGIT_REGEX, DIGIT_REGEX, DIGIT_REGEX],

    // AM/PM
    A: ['A', 'M'],
    a: ['a', 'm'],
  };
  /***
   * A map of moment separators and their corresponding characters.
   * The keys of the object are the separators, and the values are the corresponding characters.
   */
  static MOMENT_SEPARATOR_MAP = {
    '/': '/',
    '-': '-',
    '.': '.',
    ' ': ' ',
    ':': ':',
    'T': 'T',
  };
  /***
   * Creates a date mask, based on the specified moment format.
   * @param {string} momentDateFormat - The moment format string.
   * @returns {IInputFormatterMaskWithValidation}} - An object containing the mask and a validation function.
   */
  static createDateMask(momentDateFormat: string): IInputFormatterMaskWithValidation {

    momentDateFormat = defaultStr(momentDateFormat);

    const maskMap = InputFormatter.MOMENT_MASKS_MAP;
    const separatorMap = InputFormatter.MOMENT_SEPARATOR_MAP;

    let result: IInputFormatterMaskArray = [];
    let currentToken = '';
    let i: number = 0;
    while (i < momentDateFormat.length) {
      // Handle separators
      if (separatorMap[momentDateFormat[i] as keyof typeof separatorMap]) {
        if (currentToken) {
          result.push(...(maskMap[currentToken as keyof typeof maskMap] || []));
          currentToken = '';
        }
        result.push(separatorMap[momentDateFormat[i] as keyof typeof separatorMap]);
        i++;
        continue;
      }

      // Build token
      currentToken += momentDateFormat[i];

      // Check if we have a complete token
      if (maskMap[currentToken as keyof typeof maskMap]) {
        result.push(...maskMap[currentToken as keyof typeof maskMap]);
        currentToken = '';
        i++;
        continue;
      }

      // Check if adding next character would make an invalid token
      if (!Object.keys(maskMap).some(key => currentToken && key.startsWith(currentToken))) {
        if (currentToken) {
          // Handle unknown token as literal characters
          result.push(...currentToken.split(''));
          currentToken = '';
        }
        i++;
      } else {
        i++;
      }
    }

    // Handle any remaining token
    if (currentToken && maskMap[currentToken as keyof typeof maskMap]) {
      result.push(...maskMap[currentToken as keyof typeof maskMap]);
    }
    return {
      mask: result, validate: (value: string) => {
        if (!momentDateFormat || !isNonNullString(value)) {
          return false;
        }
        try {
          const date = moment(value, momentDateFormat, true);
          // Check if the parsed date matches the input exactly
          // This ensures that the input is not only valid but also logically correct
          return date.isValid() && date.format(momentDateFormat) === value;
        } catch (e) { }
        return false;
      }
    };
  };
  /****
   * The phone number examples, used to generate the phone number mask
   */
  static PHONE_NUMBER_EXAMPLES: Examples = Object.assign({}, examples) as Examples;
  /***
   * A mask for single facilitative space.
   * @description A mask for a single facilitative space.
   */
  static SINGLE_SPACE_MASK = ' ';//:[mask: RegExp, placeholderCharacter: string] = [/^ ?$/, ' '];
  /**
   * Generates a phone number mask based on the country code.
   * @param countryCode - The country code (e.g., "US", "FR", "IN").
   * @param numberExample - The number example to use for the mask. If not provided, the default example will be used.
   * @returns {IInputFormatterMaskWithValidation} The phone number mask, an array of mask elements (strings or regexes) representing the phone number format..
   */

  static createPhoneNumberMask(countryCode: CountryCode, numberExample?: string): IInputFormatterMaskWithValidation {
    // Get an example phone number for the given country code
    const exampleNumber = getExampleNumber(countryCode, InputFormatter.PHONE_NUMBER_EXAMPLES);
    if (!exampleNumber) {
      //throw new Error(`No example number found for country code: ${countryCode}`);
      return {
        mask: [],
        validate: (value: string) => false,
      }
    }

    // Format the example number using AsYouType
    const formatter = new AsYouType(countryCode);
    const formattedNumber = formatter.input(exampleNumber.nationalNumber);

    // Convert the formatted number into a mask
    const mask: IInputFormatterMaskArray = [];
    for (const char of formattedNumber) {
      if (/\d/.test(char)) {
        mask.push(/\d/); // Replace digits with a regex for digits
      } else if (char === ' ') {
        mask.push(InputFormatter.SINGLE_SPACE_MASK); // Replace spaces with a regex for spaces
      } else {
        mask.push(char); // Keep separators (e.g., spaces, parentheses, hyphens)
      }
    }
    return {
      mask, validate: (value: string) => {
        return isNonNullString(value) && !!isValidPhoneNumber(value, countryCode);
      }
    };
  }
  /**
   * Sanitize a phone number by ensuring a space after the closing bracket.
   *
   * @param {string} phoneNumber - The phone number as a string.
   * @returns The formatted phone number with a space after the closing bracket.
   */
  static sanitizePhoneNumber(phoneNumber: string): string {
    if (!isNonNullString(phoneNumber)) return "";
    return phoneNumber.replace(/\)\s*(\d)/, ") $1"); // Ensures exactly one space after ')'
  }
  /**
  * Predefined masks for common input formats.
  *
  * This object contains a set of predefined masks for common input formats such as date, time, date-time, and credit card numbers.
  * Each mask is an array of regular expressions or strings that define the expected format of the input value.
  * ```
  */
  static MASKS_WITH_VALIDATIONS = {
    /**
     * Mask for date input format.
     *
     * This mask expects the input value to be in the format of `YYYY-MM-DD` or `YYYY/MM/DD` or `YYYY.MM.DD`.
     */
    get DATE() {
      return InputFormatter.createDateMask(DEFAULT_DATE_FORMATS.date);
    },
    /**
     * Mask for time input format.
     *
     * This mask expects the input value to be in the format of `HH:MM:SS` or `HHHMMSS`.
     */
    get TIME() {
      return InputFormatter.createDateMask(DEFAULT_DATE_FORMATS.time);
    },
    get DATE_TIME() {
      return InputFormatter.createDateMask(DEFAULT_DATE_FORMATS.dateTime);
    },
    CREDIT_CARD: {
      mask: [
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        [/\d/],
        [/\d/],
        [/\d/],
        [/\d/],
        ' ',
        [/\d/],
        [/\d/],
        [/\d/],
        [/\d/],
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ] as IInputFormatterMaskArray,
      validate: (value: string) => true,
    }
  }
};