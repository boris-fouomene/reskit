import Currency from "../currency";
import { ICurrency, ICurrencyFormatterKey, ICurrencyFormatters } from "../currency/types";
import { isNumber } from "./isNumber";

const { currencies } = Currency;

/**
 * Extends the Number interface with additional methods for formatting and abbreviating numbers.
 */
declare global {
  interface Number extends ICurrencyFormatters {
    /**
     * Counts the number of decimal places in the number.
     * @returns {number} The number of decimal places.
     */
    countDecimals: () => number;

    /**
     * Formats the number as a currency string.
     * @param {ICurrency | string} [symbol] The currency symbol to use (optional).
     * @param {number} [decimalDigits] The number of decimal places to display (optional).
     * @param {string} [thousandSeparator] The separator to use for thousands (optional).
     * @param {string} [decimalSeparator] The separator to use for decimals (optional).
     * @param {string} [format] The format to use for the currency string (optional).
     * @returns {string} The formatted currency string.
     * @example
     * ```ts
     * (12).formatMoney(); // Output: "12 FCFA"
     * (12000).formatMoney(); // Output: "12 000 FCFA"
     * ```
     */
    formatMoney: (symbol?: ICurrency | string, decimalDigits?: number, thousandSeparator?: string, decimalSeparator?: string, format?: string) => string;

    /**
     * Formats the number using the specified formatter.
     * @param {string} [formatter] The formatter to use (optional).
     * @param {boolean} [abreviate] Whether to abbreviate the number (optional).
     * @returns {string} The formatted string.
     * @example
     * ```ts
     * (12).format("moneyCAD"); // Output: "CA$12"
     * ```
     */
    format: (formatter?: string, abreviate?: boolean) => string;

    /**
     * Formats the number as a formatted number string with thousands separators.
     * @param {ICurrency | number} [optionsOrDecimalDigits] The options or decimal digits to use (optional).
     * @param {string} [thousandSeparator] The separator to use for thousands (optional).
     * @param {string} [decimalSeparator] The separator to use for decimals (optional).
     * @returns {string} The formatted number string.
     */
    formatNumber: (optionsOrDecimalDigits?: ICurrency | number, thousandSeparator?: string, decimalSeparator?: string) => string;

    /**
     * Abbreviates the number to a shorter format (e.g. "1K", "1M", etc.).
     * @returns {string} The abbreviated string.
     */
    abreviate: () => string;

    /**
     * Abbreviates the number and formats it as a currency string.
     * @param {ICurrency | string} [symbol] The currency symbol to use (optional).
     * @param {number} [decimalDigits] The number of decimal places to display (optional).
     * @param {string} [thousandSeparator] The separator to use for thousands (optional).
     * @param {string} [decimalSeparator] The separator to use for decimals (optional).
     * @param {string} [format] The format to use for the currency string (optional).
     * @returns {string} The formatted and abbreviated currency string.
     */
    abreviate2FormatMoney: (symbol?: ICurrency | string, decimalDigits?: number, thousandSeparator?: string, decimalSeparator?: string, format?: string) => string;
  }
}



/**
 * Counts the number of decimal places in a number.
 *
 * @returns {number} The number of decimal places in the number.
 */
Number.prototype.countDecimals = function (): number {
  /**
   * Use a regular expression to match the decimal part of the number.
   */
  const match = String(this.toString()).match(/\.(\d+)/);

  /**
   * If there is no decimal part, return 0.
   */
  if (!match) {
    return 0;
  }

  /**
   * The number of decimal places is the length of the matched decimal part.
   */
  return match[1].length;
};

/**
 * Formats a number as a string with the specified options.
 *
 * @param {ICurrency | number} optionsOrDecimalDigits The options or decimal digits to use for formatting.
 * @param {string} thousandSeparator The thousand separator to use.
 * @param {string} decimalSeparator The decimal separator to use.
 * @returns {string} The formatted number as a string.
 */
Number.prototype.formatNumber = function (optionsOrDecimalDigits?: ICurrency | number, thousandSeparator?: string, decimalSeparator?: string): string {
  /**
   * Call the formatNumber function with the current number value and the specified options.
   */
  return Currency.formatNumber(this.valueOf(), optionsOrDecimalDigits, thousandSeparator, decimalSeparator);
};

/**
 * Formats a number as a monetary value with the specified options.
 *
 * @param {ICurrency | string} symbol The symbol to use for the currency.
 * @param {number} decimalDigits The number of decimal digits to use.
 * @param {string} thousandSeparator The thousand separator to use.
 * @param {string} decimalSeparator The decimal separator to use.
 * @param {string} format The format to use for the currency.
 * @returns {string} The formatted number as a monetary value.
 */
Number.prototype.formatMoney = function (symbol?: ICurrency | string, decimalDigits?: number, thousandSeparator?: string, decimalSeparator?: string, format?: string): string {
  /**
   * Call the formatMoney function with the current number value and the specified options.
   */
  return Currency.formatMoney(this.valueOf(), symbol, decimalDigits, thousandSeparator, decimalSeparator, format);
};

/**
 * Represents the result of abbreviating a number.
 */
export type IAbreviateNumberResult = {
  /**
   * The abbreviated result.
   */
  result: string;

  /**
   * The original value that was abbreviated.
   */
  value: number;

  /**
   * The format used for abbreviation.
   */
  format: string;

  /**
   * The suffix used for abbreviation (e.g. "K", "M", etc.).
   */
  suffix: string;

  /**
   * The formatted value.
   */
  formattedValue: string;
};


/**
 * Abbreviates a number to a shorter form (e.g. 1000 -> 1K).
 *@see : https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn 
 * @param {number} num The number to abbreviate.
 * @param {boolean} [returnObject=false] Whether to return an object with additional information.
 * @returns {string | IAbreviateNumberResult} The abbreviated number or an object with additional information.
 */
export const _abreviateNumber = (num: number, returnObject: boolean = false): string | IAbreviateNumberResult => {
  /**
   * If the number is null or not a number, return early.
   */
  if (num === null || typeof num !== 'number') {
    return returnObject === true ? {} as IAbreviateNumberResult : "";
  }

  /**
   * Get the number of decimal places in the number.
   */
  const decimals = num.countDecimals();

  /**
   * Determine the number of decimal places to show.
   */
  let fixed = Math.min(decimals, 5);
  fixed = (!fixed || fixed < 0) ? 0 : fixed;

  /**
   * If the number is 0, return it as is.
   */
  if (num === 0) {
    num = num !== 0 ? parseFloat((num as number).toFixed(0 + fixed)) || 0 : 0;
    const nString = num.toString();
    if (returnObject) {
      return {
        result: nString,
        value: num as number,
        format: '',
        suffix: '',
        formattedValue: nString,
      } as IAbreviateNumberResult;
    }
    return nString;
  }

  /**
   * Get the power of the number.
   */
  let b: string[] = (num).toPrecision(2).split("e");

  /**
   * Determine the suffix to use (e.g. K, M, B, T).
   */
  const k: number = b.length === 1 ? 0 : Math.floor(Math.min(parseFloat(String(b[1]).slice(1)), 14) / 3);

  /**
   * Divide the number by the power.
   */
  const c: number = k < 1 ? parseFloat(num.toFixed(0 + fixed)) : parseFloat((num / Math.pow(10, k * 3)).toFixed(1 + fixed));

  /**
   * Enforce -0 is 0.
   */
  const d = c < 0 ? c : Math.abs(c);

  /**
   * Append the power to the number.
   */
  const e = d;

  /**
   * Get the suffix to use.
   */
  const suffix = ['', 'K', 'M', 'B', 'T'][k];

  /**
   * Get the original value.
   */
  const value = e || 0;

  /**
   * If returning an object, create the object with additional information.
   */
  if (returnObject === true) {
    return {
      formattedValue: String(e),
      value,
      suffix,
      format: suffix,
      result: e + suffix,
    };
  }

  /**
   * Return the abbreviated number.
   */
  return (value).formatNumber() + suffix;
};


/**
 * Abbreviates a number to a shorter form (e.g. 1000 -> 1K).
 *
 * @param {number} num The number to abbreviate.
 * @returns {string} The abbreviated number.
 */
export const abreviateNumber = (num: number): string => {
  /**
   * Call the _abreviateNumber function with the number and return a string.
   */
  return _abreviateNumber(num, false) as string;
};

/**
 * Abbreviates a number to a shorter form (e.g. 1000 -> 1K).
 *
 * @returns {string} The abbreviated number.
 */
Number.prototype.abreviate = function (): string {
  /**
   * Call the abreviateNumber function with the current number value and return a string.
   */
  return abreviateNumber(this.valueOf()) as string;
};

/**
 * Abbreviates a number and formats it as a monetary value.
 *
 * @param {number} number The number to abbreviate and format.
 * @param {ICurrency | string} [symbol] The currency symbol or name.
 * @param {number} [decimalDigits] The number of decimal digits to use.
 * @param {string} [thousandSeparator] The thousand separator to use.
 * @param {string} [decimalSeparator] The decimal separator to use.
 * @param {string} [format] The format string to use.
 * @returns {string} The abbreviated and formatted monetary value.
 */
export const abreviate2FormatMoney = (
  number: number,
  symbol?: ICurrency | string,
  decimalDigits?: number,
  thousandSeparator?: string,
  decimalSeparator?: string,
  format?: string
): string => {
  /**
   * Get the abbreviated number and format information.
   */
  const { value, format: fStr, formattedValue } = _abreviateNumber(number, true) as IAbreviateNumberResult;

  /**
   * If the value is not a number, return the formatted value as is.
   */
  if (typeof value !== 'number') return formattedValue;

  /**
   * Format the number as a monetary value.
   */
  const { formattedValue: fVal } = Currency.formatMoneyAsObject(value, symbol, decimalDigits, thousandSeparator, decimalSeparator, format);

  /**
   * Replace the placeholder in the format string with the formatted number.
   */
  return fVal.replace('%v', Math.abs(value).formatNumber(Currency.isValidCurrency(symbol) ? symbol as ICurrency : decimalDigits, thousandSeparator, decimalSeparator) + fStr);
};

/**
* Abbreviates a number and formats it as a monetary value.
* @description Abbreviates a number and formats it as a monetary value, using a currency symbol or name, decimal digits, and separators.
* @param {number} number The number to abbreviate and format.
* @param {ICurrency | string} [symbol] The currency symbol or name.
* @param {number} [decimalDigits] The number of decimal digits to use.
* @param {string} [thousandSeparator] The thousand separator to use.
* @param {string} [decimalSeparator] The decimal separator to use.
* @param {string} [format] The format string to use.
* @returns {string} The abbreviated and formatted monetary value.
*/
Number.prototype.abreviate2FormatMoney = function (
  symbol?: ICurrency | string,
  decimalDigits?: number,
  thousandSeparator?: string,
  decimalSeparator?: string,
  format?: string
): string {
  return abreviate2FormatMoney(this.valueOf(), symbol, decimalDigits, thousandSeparator, decimalSeparator, format);
}

/**
 * Returns the first non-zero number from a list of arguments, or 0 if no such number exists.
 * 
 * This function iterates over the arguments and returns the first one that is a non-zero number.
 * If no such number is found, it returns 0.
 * 
 * @param args A list of arguments to check.
 * @returns The first non-zero number, or 0 if no such number exists.
 */
export function defaultNumber(...args: any[]): number {
  for (const arg of args) {
    if (isNumber(arg) && arg !== 0) return arg;
  }
  return 0;
}

// Step 3: Dynamically add formatter methods to Number.prototype
Object.keys(currencies).forEach((currencyKey) => {
  const currency: ICurrency = currencies[currencyKey as keyof typeof currencies];
  const functionName: ICurrencyFormatterKey = `format${currencyKey}` as ICurrencyFormatterKey;
  (Number.prototype)[functionName] = function (decimalDigits?: number, thousandSeparator?: string, decimalSeparator?: string, format?: string): string {
    /**
     * Call the formatMoney function with the current number value and the specified options.
    */
    return Currency.formatMoney(this.valueOf(), currency, decimalDigits, thousandSeparator, decimalSeparator, format);
  };
});
