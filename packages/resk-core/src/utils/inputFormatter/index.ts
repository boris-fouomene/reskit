import stringify from "@utils/stringify";
import { IInputFormatterNumberMaskOptions, IInputFormatterMask, IInputFormatterMaskArray, IInputFormatterMaskOptions, IInputFormatterOptions, IInputFormatterResult, IInputFormatterMaskResult, IInputFormatterDateTimeMaskOptions } from "../../types";
import { DEFAULT_DATE_FORMATS, formatDate, isDateObj, isValidDate } from "../date";
import defaultStr from "../defaultStr";
import isNonNullString from "../isNonNullString";

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
        formattedValue = formatDate(value, dateFormat || typeText === "time" ? DEFAULT_DATE_FORMATS.time : typeText === "date" ? DEFAULT_DATE_FORMATS.dateTime : DEFAULT_DATE_FORMATS.date);
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
    return parseFloat(value.replaceAll(" ", ''));
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
   *   maskAutoComplete: true,
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
    const { value: customValue, mask, obfuscationCharacter = '*', maskAutoComplete = false } = options;
    const stValue = customValue === undefined ? "" : ["number", "boolean", "string"].includes(typeof customValue) ? customValue.toString() : stringify(customValue);
    const value = defaultStr(stValue);
    const mArray = typeof mask === 'function' ? mask({ ...options, value }) : mask;
    const maskArray = Array.isArray(mArray) ? mArray : [];
    // make sure it'll not break with null or undefined inputs
    if (!maskArray.length || !value) {
      return {
        masked: value,
        unmasked: value,
        obfuscated: value,
        maskArray,
      };
    }
    let masked = '';
    let obfuscated = '';
    let unmasked = '';
    let maskCharIndex = 0;
    let valueCharIndex = 0;

    while (true) {
      // if mask is ended, break.
      if (maskCharIndex === maskArray.length) {
        break;
      }
      let maskChar = maskArray[maskCharIndex];
      let valueChar = value[valueCharIndex];

      // if value is ended, break.
      if (valueCharIndex === value.length) {
        if (typeof maskChar === 'string' && maskAutoComplete) {
          masked += maskChar;
          obfuscated += maskChar;
          maskCharIndex += 1;
          continue;
        }
        break;
      }

      // value equals mask: add to masked result and advance on both mask and value indexes
      if (maskChar === valueChar) {
        masked += maskChar;
        obfuscated += maskChar;

        valueCharIndex += 1;
        maskCharIndex += 1;
        continue;
      }

      let unmaskedValueChar = value[valueCharIndex];

      // it's a regex maskChar: let's advance on value index and validate the value within the regex
      if (typeof maskChar === 'object') {
        // advance on value index
        valueCharIndex += 1;
        const shouldObsfucateChar = Array.isArray(maskChar);
        const maskCharRegex = Array.isArray(maskChar) ? maskChar[0] : maskChar;
        const matchRegex = RegExp(maskCharRegex).test(valueChar);
        // value match regex: add to masked and unmasked result and advance on mask index too
        if (matchRegex) {
          masked += valueChar;
          obfuscated += shouldObsfucateChar ? obfuscationCharacter : valueChar;
          unmasked += unmaskedValueChar;
          maskCharIndex += 1;
        }
        continue;
      } else {
        // it's a fixed maskChar: add to maskedResult and advance on mask index
        masked += maskChar;
        obfuscated += maskChar;
        maskCharIndex += 1;
        continue;
      }
    }
    return { masked, unmasked, obfuscated, maskArray };
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
  /**
   * Creates a date mask function.
   *
   * This method takes an optional date separator parameter and returns a function that takes an options object with a value.
   * The returned function returns a mask array for the date.
   *
   * @param dateSeparator The character to be used to separate date components (year, month, and day) in a date string.
   * @returns A function that takes an options object with a value, and returns a mask array for the date.
   *
   * @example
   * ```typescript
   * const dateMaskFunc = createDateMaskFunc('/');
   * const mask = dateMaskFunc({ value: '20241018' });
   * console.log(mask);
   * // Output:
   * // [/[0-3]/, /[1-9]/, '/', /[0-1]/, /[012]/, '/', /\d/, /\d/, /\d/, /\d/]
   * ```
   */
  static createDateMaskFunc(dateSeparator?: IInputFormatterDateTimeMaskOptions["dateSeparator"]): IInputFormatterMask {
    dateSeparator = defaultStr(dateSeparator, "/");
    return ({ value }) => {
      const cleanText = defaultStr(value).replace(/\D+/g, '');
      let secondDigitDayMask = /\d/;
      if (cleanText.charAt(0) === '0') {
        secondDigitDayMask = /[1-9]/;
      }
      if (cleanText.charAt(0) === '3') {
        secondDigitDayMask = /[01]/;
      }
      let secondDigitMonthMask = /\d/;
      if (cleanText.charAt(2) === '0') {
        secondDigitMonthMask = /[1-9]/;
      }
      if (cleanText.charAt(2) === '1') {
        secondDigitMonthMask = /[012]/;
      }
      return [
        /[0-3]/,
        secondDigitDayMask,
        '/',
        /[0-1]/,
        secondDigitMonthMask,
        dateSeparator,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ];
    }
  }
  /**
  * Predefined masks for common input formats.
  *
  * This object contains a set of predefined masks for common input formats such as date, time, date-time, and credit card numbers.
  * Each mask is an array of regular expressions or strings that define the expected format of the input value.
  *
  * @example
  * ```typescript
  * const dateMask = MASKS.DATE;
  * console.log(dateMask);
  * // Output:
  * // [
  * //   /^[0-9]$/, // 'y' - First digit (0-9)
  * //   /^[0-9]$/, // 'y' - Second digit (0-9)
  * //   /^[0-9]$/, // 'y' - Third digit (0-9)
  * //   /^[0-9]$/, // 'y' - Fourth digit (0-9)
  * //   /^[-/.]$/, // Separator: Can be "-", "/", or "."
  * //   /^[0-1]$/, // 'm' - First digit: 0-1 (valid month range 01-12)
  * //   /^[0-9]$/, // 'm' - Second digit: 0-9
  * //   /^[-/.]$/, // Separator: Can be "-", "/", or "."
  * //   /^[0-3]$/, // 'd' - First digit: 0-3 (valid day range 01-31)
  * //   /^[0-9]$/  // 'd' - Second digit: 0-9
  * // ]
  * ```
  */
  static MASKS = {
    /**
     * Mask for date input format.
     *
     * This mask expects the input value to be in the format of `YYYY-MM-DD` or `YYYY/MM/DD` or `YYYY.MM.DD`.
     */
    DATE: [
      /^[0-9]$/, // 'y' - First digit (0-9)
      /^[0-9]$/, // 'y' - Second digit (0-9)
      /^[0-9]$/, // 'y' - Third digit (0-9)
      /^[0-9]$/, // 'y' - Fourth digit (0-9)
      /^[-/.]$/, // Separator: Can be "-", "/", or "."
      /^[0-1]$/, // 'm' - First digit: 0-1 (valid month range 01-12)
      /^[0-9]$/, // 'm' - Second digit: 0-9
      /^[-/.]$/, // Separator: Can be "-", "/", or "."
      /^[0-3]$/, // 'd' - First digit: 0-3 (valid day range 01-31)
      /^[0-9]$/  // 'd' - Second digit: 0-9
    ],
    /**
     * Mask for time input format.
     *
     * This mask expects the input value to be in the format of `HH:MM:SS` or `HHHMMSS`.
     */
    TIME: [
      /^[0-2]$/,   // 'h' - First digit: 0-2 (to cover 00-23)
      /^[0-9]$/,   // 'h' - Second digit: 0-9 (valid range handled later)
      /^[:H. ]$/,   // Separator: Can be ":", "H", or "."
      /^[0-5]$/,   // 'm' - First digit: 0-5 (valid minute range 00-59)
      /^[0-9]$/,   // 'm' - Second digit: 0-9
      /^[:H.]$/,   // Separator: Can be ":", "H", or "."
      /^[0-5]$/,   // 's' - First digit: 0-5 (valid second range 00-59)
      /^[0-9]$/    // 's' - Second digit: 0-9
    ],

    CREDIT_CARD: [
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
  }
};


/**
* Mask for date-time input format.
*
* This mask expects the input value to be in the format of `YYYY-MM-DD HH:MM:SS` or `YYYY/MM/DD HH:MM:SS` or `YYYY.MM.DD HH:MM:SS`.
*/
(InputFormatter.MASKS as any).DATE_TIME = [
  ...InputFormatter.MASKS.DATE,
  /^\s$/,    // Space separator between date and time
  ...InputFormatter.MASKS.TIME,
];