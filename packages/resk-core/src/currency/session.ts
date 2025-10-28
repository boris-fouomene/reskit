import { defaultStr } from "@utils/defaultStr";
import { i18n } from "../i18n";
import { Session } from "../session";
import { isNonNullString } from "../utils/isNonNullString";
import { currencies } from "./currencies";
import { ICurrency, ICurrencyCode } from "./types";
import { isValidCurrency } from "./utils";

/**
 * The default format for displaying currency values.
 *
 * This format string is used to display currency values in the format "value symbol" (e.g., "123.45 USD").
 *
 * Example: `%v %s`
 */
const defaultCurrencyFormat = "%v %s";

/**
 * Retrieves the persisted currency format from the Session storage.
 *
 * @param force If true, returns the default currency format if the persisted format is not available.
 * @returns The persisted currency format if available, otherwise an empty string or the default format.
 */
const getCurrencyFormat = (force?: boolean): string => {
  /**
   * Retrieve the currency format from the Session storage.
   */
  const r = Session.get("currencyFormat");

  /**
   * If the retrieved format is a string and includes "%v", return it.
   * Otherwise, if force is true, return the default currency format.
   * Otherwise, return an empty string.
   */
  return r && typeof r === "string" && r.includes("%v")
    ? r
    : force !== false
      ? defaultCurrencyFormat
      : "";
};

/**
 * Persists the currency format in the Session storage.
 *
 * @param format The currency format to persist.
 * @returns The result of setting the currency format in the Session storage.
 *
 * Example:
 * ```ts
 * setCurrencyFormat("%v %s"); // Persists the currency format in the Session storage
 * setCurrencyFormat("   %v %s   "); // Trims the format string and persists it in the Session storage
 * setCurrencyFormat(null); // Sets an empty string as the currency format in the Session storage
 * ```
 */
const setCurrencyFormat = (format: string): any => {
  /**
   * Trim the format string to remove any unnecessary whitespace.
   * If the format is not a string, set it to an empty string.
   */
  format = format && typeof format === "string" ? format.trim() : "";

  /**
   * Set the currency format in the Session storage.
   */
  return Session.set("currencyFormat", format);
};

/**
 * Persists the current currency in the database.
 *
 * @param {ICurrency | ICurrencyCode} currency The currency to persist, either as an ICurrency object or a string representing the currency code.
 * @returns {Promise<void>} A promise that resolves when the currency has been persisted.
 *
 * Example:
 * ```ts
 * setCurrency("USD"); // Persists the USD currency in the database
 * setCurrency({ code: "EUR", symbol: "€" }); // Persists the EUR currency in the database
 * ```
 */
const setCurrency = (currency: ICurrency | ICurrencyCode): ICurrency => {
  /**
   * Check if the provided currency is valid.
   */
  if (!isValidCurrency(currency)) {
    /**
     * If the currency is not valid, try to extract the currency code from the provided value.
     */
    let cCode =
      typeof currency === "object" && currency && !Array.isArray(currency)
        ? defaultStr((currency as any).code, (currency as any).name)
        : typeof currency === "string"
          ? currency
          : undefined;
    if (cCode) {
      /**
       * Trim and uppercase the currency code.
       */
      cCode = cCode.trim().toUpperCase();
    }

    /**
     * If the currency code is valid, use the corresponding currency object.
     */
    if (
      cCode &&
      isValidCurrency(currencies[cCode as keyof typeof currencies])
    ) {
      currency = currencies[cCode as keyof typeof currencies];
    } else if (typeof currency === "string") {
      /**
       * If the provided value is a string, try to use it as a currency code.
       */
      cCode = currency.trim().toUpperCase();
      if (isValidCurrency(currencies[cCode as keyof typeof currencies])) {
        currency = currencies[cCode as keyof typeof currencies];
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
   * Persist the currency object in the Session.
   */
  Session.set("appConfigCurrency", currencyObject);
  return currencyObject as ICurrency;
};

/**
 * Retrieves the currently persisted currency from the Session variables.
 *
 * @returns {ICurrency} The currently persisted currency.
 *
 * Example:
 * ```ts
 * const currentCurrency = getCurrency(); // Retrieves the currently persisted currency
 * console.log(currentCurrency); // Output: ICurrency object with current currency values
 * ```
 */
const getCurrency: () => ICurrency = (): ICurrency => {
  /**
   * Get the currency object from the Session.
   */
  let currency = Object.assign({}, Session.get("appConfigCurrency"));

  /**
   * Get the currency code from the Session.
   */
  const currencyCode = Session.get("currencyCode");

  /**
   * If the currency code is valid, merge the corresponding currency object with the existing currency object.
   */
  if (
    isNonNullString(currencyCode) &&
    isValidCurrency(
      currencies[currencyCode.trim().toUpperCase() as keyof typeof currencies]
    )
  ) {
    currency = {
      ...currencies[
        currencyCode.trim().toUpperCase() as keyof typeof currencies
      ],
      ...currency,
    };
  }

  /**
   * Get the current currency format.
   */
  const format = getCurrencyFormat(false);
  if (isNonNullString(format) && format.includes("%v")) {
    currency.format = format;
  }
  const defaultCode: ICurrencyCode = "USD";
  const defaultCurrency = currencies[defaultCode];
  return {
    symbol: defaultCurrency.symbol, // default currency symbol
    format: defaultCurrency.format ?? "%v %s", // default format
    decimalSeparator: defaultCurrency.decimalSeparator ?? ".", // default decimal separator
    thousandSeparator: defaultCurrency.thousandSeparator ?? ",", // default thousands separator
    decimalDigits: defaultCurrency.decimalDigits ?? 0, // default decimal digits
    ...Object.assign({}, i18n.getNestedTranslation("currencies") as ICurrency),
    ...currency,
  } as ICurrency;
};

export default {
  getFormat: getCurrencyFormat,
  setFormat: setCurrencyFormat,
  setCurrency: setCurrency,
  getCurrency: getCurrency,
  defaultCurrencyFormat,
};
