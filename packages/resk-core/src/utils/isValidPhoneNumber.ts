import { parsePhoneNumberFromString, isValidPhoneNumber as googleIsValidPhoneNumber } from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js/types';
import isNonNullString from './isNonNullString';
import { isObj } from './object';
/**
 * Validates a phone number using the libphonenumber-js library.
 * 
 * @param {string} phoneNumber The phone number to validate.
 * @param {CountryCode | { defaultCountry?: CountryCode, defaultCallingCode?: string }} [countryCode] The country code to use for validation. If not provided, the default country code will be used.
 * @returns True if the phone number is valid, false otherwise.
 * @throws Error if there's an issue parsing the phone number.
 * @example
 * ```typescript
 * const isValid = isValidPhoneNumber ('+1 202 555 0144');
 * console.log(isValid); // Output: true
 * ```
 */
export function isValidPhoneNumber(phoneNumber: string, countryCode?: CountryCode | { defaultCountry?: CountryCode, defaultCallingCode?: string }): phoneNumber is string {
    /**
     * Attempts to parse the phone number from the input string.
     * 
     * @throws Error if there's an issue parsing the phone number.
     */
    try {
        /* if (isNonNullString(countryCode) || isObj(countryCode) && isNonNullString(countryCode?.defaultCountry)) {
            return googleIsValidPhoneNumber(phoneNumber, countryCode);
        } */
        /**
         * Parsed phone number object.
         */
        const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode);

        /**
         * Checks if the parsed phone number is valid.
         * 
         * @returns True if the phone number is valid, false otherwise.
         */
        if (parsedNumber && googleIsValidPhoneNumber(parsedNumber.number, countryCode)) {
            return true;
        }
    } catch (error) {
        /**
         * Logs any errors that occur during phone number parsing.
         * 
         * @param error The error that occurred.
         */
        console.error('Error parsing phone number:', error);
    }
    return false;
}