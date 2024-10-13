import session from "@session/index";
import currencies,{ICurrency, isValidCurrency} from "./currencies";
import isNotEmptyString from "@utils/isNotEmptyString";

/**
 * The default format for displaying currency values.
 * 
 * This format string is used to display currency values in the format "value symbol" (e.g., "123.45 USD").
 * 
 * Example: `%v %s`
 */
export const defaultCurrencyFormat = "%v %s";

/**
 * Retrieves the persisted currency format from the session storage.
 * 
 * @param force If true, returns the default currency format if the persisted format is not available.
 * @returns The persisted currency format if available, otherwise an empty string or the default format.
 */
export const getCurrencyFormat = (force?: boolean): string => {
  /**
   * Retrieve the currency format from the session storage.
   */
  const r = session.get("currencyFormat");

  /**
   * If the retrieved format is a string and includes "%v", return it.
   * Otherwise, if force is true, return the default currency format.
   * Otherwise, return an empty string.
   */
  return r && typeof r === "string" && r.includes("%v") ? r : force !== false ? defaultCurrencyFormat : "";
}

/**
 * Persists the currency format in the session storage.
 * 
 * @param format The currency format to persist.
 * @returns The result of setting the currency format in the session storage.
 * 
 * Example:
 * ```ts
 * setCurrencyFormat("%v %s"); // Persists the currency format in the session storage
 * setCurrencyFormat("   %v %s   "); // Trims the format string and persists it in the session storage
 * setCurrencyFormat(null); // Sets an empty string as the currency format in the session storage
 * ```
 */
export const setCurrencyFormat = (format: string): any => {
  /**
   * Trim the format string to remove any unnecessary whitespace.
   * If the format is not a string, set it to an empty string.
   */
  format = format && typeof format === "string" ? format.trim() : "";

  /**
   * Set the currency format in the session storage.
   */
  return session.set("currencyFormat", format);
}

/**
 * Persists the current currency in the database.
 * 
 * @param {ICurrency | string} currency The currency to persist, either as an ICurrency object or a string representing the currency code.
 * @returns {Promise<void>} A promise that resolves when the currency has been persisted.
 * 
 * Example:
 * ```ts
 * setCurrency("USD"); // Persists the USD currency in the database
 * setCurrency({ code: "EUR", symbol: "€" }); // Persists the EUR currency in the database
 * ```
 */
export const setCurrency =  (currency: ICurrency | string): ICurrency => {
  /**
   * Check if the provided currency is valid.
   */
  if (!isValidCurrency(currency)) {
    /**
     * If the currency is not valid, try to extract the currency code from the provided value.
     */
    let cCode = typeof currency === "object" && currency && !Array.isArray(currency) ? currency.code : typeof currency === "string" ? currency : undefined;
    if (cCode) {
      /**
       * Trim and uppercase the currency code.
       */
      cCode = cCode.trim().toUpperCase();
    }

    /**
     * If the currency code is valid, use the corresponding currency object.
     */
    if (cCode && isValidCurrency(currencies[cCode])) {
      currency = currencies[cCode];
    } else if (typeof currency === "string") {
      /**
       * If the provided value is a string, try to use it as a currency code.
       */
      cCode = currency.trim().toUpperCase();
      if (isValidCurrency(currencies[cCode])) {
        currency = currencies[cCode];
      }
    }
  }

  /**
   * Create a copy of the currency object to avoid modifying the original.
   */
  const currencyObject: ICurrency = Object.assign({}, currency) as ICurrency;

  /**
   * Get the current currency format.
   */
  const format = getCurrencyFormat();

  /**
   * If a format is found, set it on the currency object.
   */
  if (format) {
    currencyObject.format = format;
  }

  /**
   * Persist the currency object in the session.
   */
  session.set("appConfigCurrency", currencyObject);
  return currencyObject as ICurrency;
}

/**
 * Retrieves the currently persisted currency from the session variables.
 * 
 * @returns {ICurrency} The currently persisted currency.
 * 
 * Example:
 * ```ts
 * const currentCurrency = getCurrency(); // Retrieves the currently persisted currency
 * console.log(currentCurrency); // Output: ICurrency object with current currency values
 * ```
 */
export const getCurrency: () => ICurrency = (): ICurrency => {
  /**
   * Get the currency object from the session.
   */
  let currency = Object.assign({}, session.get("appConfigCurrency"));

  /**
   * Get the currency code from the session.
   */
  const currencyCode = session.get("currencyCode");

  /**
   * If the currency code is valid, merge the corresponding currency object with the existing currency object.
   */
  if (isNotEmptyString(currencyCode) && isValidCurrency(currencies[currencyCode.trim().toUpperCase()])) {
    currency = { ...currencies[currencyCode.trim().toUpperCase()], ...currency };
  }

  /**
   * Get the current currency format.
   */
  const format = getCurrencyFormat(false);

  /**
   * If a format is found and includes the %v placeholder, set it on the currency object.
   */
  if (isNotEmptyString(format) && format.includes("%v")) {
    currency.format = format;
  }

  /**
   * Return the currency object with default values.
   * 
   * The default values are:
   * - symbol: "FCFA"
   * - format: "%v %s"
   * - decimalSeparator: "."
   * - thousandSeparator: " "
   * - decimalDigits: 0
   */
  return {
    symbol: "FCFA", // default currency symbol
    format: "%v %s", // default format
    decimalSeparator: ".", // default decimal separator
    thousandSeparator: " ", // default thousands separator
    decimalDigits: 0, // default decimal digits
    ...currency,
  } as ICurrency;
}

export default {
    getFormat : getCurrencyFormat,
    setFormat : setCurrencyFormat,
    set : setCurrency,
    get : getCurrency
}