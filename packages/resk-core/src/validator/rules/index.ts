
import { isNumber } from "lodash";
import { IValidatorResult, IValidatorRuleOptions } from "../types";
import { defaultStr, isEmpty, isNonNullString, isValidUrl, isValidEmail } from "@utils/index";
import { Validator } from "../validator";
import { i18n } from "../../i18n";


/**
 * @function compareNumer
 * 
 * Compares a numeric value against a specified value using a comparison function.
 * This function returns a promise that resolves if the comparison is valid and rejects with an error message if it is not.
 * 
 * ### Parameters:
 * - **compare**: `(value: any, toCompare: any) => boolean` - A comparison function that defines the comparison logic.
 * - **message**: `string` - The error message to return if the validation fails.
 * - **options**: `IValidatorRuleOptions` - An object containing the value to validate and any rule parameters.
 * 
 * ### Return Value:
 * - `IValidatorResult`: A promise that resolves to `true` if the comparison is valid, or rejects with an error message if it is not.
 * 
 * ### Example Usage:
 * ```typescript
 * compareNumer((value, toCompare) => value < toCompare, "Value must be less than", { value: 5, ruleParams: [10] })
 *     .then(result => console.log(result)) // Output: true
 *     .catch(error => console.error(error)); // Output: "Value must be less than 10"
 * ```
 */
function compareNumer(compare: (value: any, toCompare: any) => boolean, translateKey: string, { value, ruleParams, ...rest }: IValidatorRuleOptions): IValidatorResult {
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    const rParams = ruleParams ? ruleParams : [];
    translateKey = defaultStr(translateKey);
    const message = i18n.t(translateKey, { ...rest, value, ruleParams });
    value = typeof value === 'number' ? value : parseFloat(value);
    return new Promise((resolve, reject) => {
        if (isNaN(value) || rParams[0] === undefined) {
            return resolve(message);
        }
        const toCompare = typeof rParams[0] === 'number' ? rParams[0] : parseFloat(rParams[0]);
        if (isNaN(toCompare)) {
            return reject(message);
        }
        if (compare(value, toCompare)) {
            return resolve(true);
        }
        reject(message);
    })
}

/**
 * @function numberLessThanOrEquals
 * 
 * Validator rule that checks if a number is less than or equal to a specified value.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - Contains the value to validate and the rule parameters.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is less than or equal to the specified value, otherwise rejects with an error message.
 * 
 * ### Example Usage:
 * ```typescript
 * ```
 */
Validator.registerRule("numberLessThanOrEquals", function numberLessThanOrEquals(options) {
    return compareNumer((value, toCompare) => {
        return value <= toCompare;
    }, 'validator.numberLessThanOrEquals', options)
});


/**
 * @function numberLessThan
 * 
 * Validator rule that checks if a given number is less than a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is less than the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * 
 * // Example of using the validation rule
 * const result = numberLessThan({ value: 5, ruleParams: [10] });
 * result.then(() => {
 *     console.log("Validation passed."); // Output: "Validation passed."
 * }).catch(error => {
 *     console.error(error); // Output: "Entrez un nombre inférieure 10" if validation fails
 * });
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input is strictly less than a specified limit.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
Validator.registerRule("numberLessThan", function numberLessThan(options) {
    return compareNumer((value, toCompare) => {
        return value < toCompare;
    }, "validator.numberLessThan", options);
});

/**
 * @function numberGreaterThanOrEquals
 * 
 * Validator rule that checks if a given number is greater than or equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is greater than or equal to the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * 
 * // Example of using the validation rule
 * const result = numberGreaterThanOrEquals({ value: 10, ruleParams: [5] });
 * result.then(() => {
 *     console.log("Validation passed."); // Output: "Validation passed."
 * }).catch(error => {
 *     console.error(error); // Output: "Enter a number greater than or equal to 5" if validation fails
 * });
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input meets or exceeds a specified limit.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
Validator.registerRule("numberGreaterThanOrEquals", function numberGreaterThanOrEquals(options) {
    return compareNumer((value, toCompare) => {
        return value >= toCompare;
    }, "validator.numberGreaterThanOrEquals", options)
});

/**
 * @function numberGreaterThan
 * 
 * Validator rule that checks if a given number is greater than a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is greater than the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * // Example of using the validation rule
 * const result = numberGreaterThan({ value: 15, ruleParams: [10] });
 * result.then(() => {
 *     console.log("Validation passed."); // Output: "Validation passed."
 * }).catch(error => {
 *     console.error(error); // Output: "Enter a number greater than 10" if validation fails
 * });
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input exceeds a specified limit.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
Validator.registerRule("numberGreaterThan", function numberGreaterThan(options) {
    return compareNumer((value, toCompare) => {
        return value > toCompare;
    }, "validator.numberGreaterThan", options)
});

/**
 * @function numberEquals
 * 
 * Validator rule that checks if a given number is equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is equal to the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * 
 * // Example of using the validation rule
 * const result = numberEquals({ value: 10, ruleParams: [10] });
 * result.then(() => {
 *     console.log("Validation passed."); // Output: "Validation passed."
 * }).catch(error => {
 *     console.error(error); // Output: "Enter a number equal to 10" if validation fails
 * });
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input matches a specified value exactly.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
Validator.registerRule("numberEquals", function numberEqualsTo(options) {
    return compareNumer((value, toCompare) => {
        return value === toCompare;
    }, "validator.numberEquals", options)
});

/**
 * @function numberNotEquals
 * 
 * Validator rule that checks if a given number is not equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is not equal to the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * 
 * // Example of using the validation rule
 * const result = numberNotEquals({ value: 5, ruleParams: [10] });
 * result.then(() => {
 *     console.log("Validation passed."); // Output: "Validation passed."
 * }).catch(error => {
 *     console.error(error); // Output: "Entrez un différent de 10" if validation fails
 * });
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input does not match a specified value.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
Validator.registerRule("numberNotEquals", function numberNotEqualsTo(options) {
    return compareNumer((value, toCompare) => {
        return value !== toCompare;
    }, "validator.numberNotEquals", options)
});


/**
 * @function required
 * 
 * Validator rule that checks if a value is present and not empty.
 * This rule ensures that a field is filled out before submission.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The value to validate for presence.
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the value is not empty; otherwise, returns an error message indicating that the field is required.
 * 
 * ### Example Usage:
 * ```typescript
 * 
 * // Example of using the validation rule
 * const result = required({ value: "" });
 * console.log(result); // Output: "This field is required." if the value is empty
 * 
 * const result2 = required({ value: "Hello" });
 * console.log(result2); // Output: true if the value is not empty
 * ```
 * 
 * ### Notes:
 * - This rule is essential for form validation, ensuring that users provide necessary information before proceeding.
 * - The error message can be customized by modifying the translation key used in `i18n.t`.
 * - The `isEmpty` utility function is used to check for empty values, which may include `null`, `undefined`, or empty strings.
 */
Validator.registerRule("required", function required(options) {
    const value = options?.value;
    return !isEmpty(value) || i18n.t("validator.required");
});

/**
 * @function length
 * 
 * Validator rule that validates the length of a string. This rule checks if the length of the input string
 * falls within a specified range or matches a specific length.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The string value to validate.
 *   - `ruleParams`: An array where:
 *     - The first element specifies the minimum length (optional).
 *     - The second element specifies the maximum length (optional).
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the string length is valid according to the specified rules; 
 *   otherwise, returns an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * 
 * // Example of using the validation rule
 * const result1 = length({ value: "Hello", ruleParams: [3, 10] });
 * console.log(result1); // Output: true (valid length)
 * 
 * const result2 = length({ value: "Hi", ruleParams: [3, 10] });
 * console.log(result2); // Output: "This field must be between 3 and 10 characters long"
 * 
 * const result3 = length({ value: "Test", ruleParams: [4] });
 * console.log(result3); // Output: true (valid length)
 * 
 * const result4 = length({ value: "Test", ruleParams: [5] });
 * console.log(result4); // Output: "This field must be exactly 5 characters long"
 * ```
 * 
 * ### Notes:
 * - This rule is useful for validating user input in forms, ensuring that the input meets specific length requirements.
 * - The error messages can be customized based on the parameters provided, allowing for clear feedback to users.
 * - The `defaultStr` utility function is used to ensure that the value is treated as a string, even if it is `null` or `undefined`.
 */
Validator.registerRule("length", function length({ value, ruleParams }) {
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    value = defaultStr(value);
    let v0 = null, v1 = null;
    if (ruleParams[0]) {
        v0 = parseInt(ruleParams[0]) || null;
    }
    if (ruleParams[1]) {
        v1 = parseInt(ruleParams[1]) || null;
    }
    const i18nParams = { value, minLength: v0, maxLength: v1, length: v1 };
    const message = (typeof ruleParams[0] === "number" && typeof ruleParams[1] === "number") ?
        i18n.t("validator.lengthRange", i18nParams) : i18n.t("validator.length", i18nParams);
    if (isNumber(v0) && isNumber(v1)) {
        return (value.length >= v0 && value.length <= v1) || message;
    }
    if (isNumber(v0)) {
        ///on valide la longueur
        return value.trim().length == v0 || message;
    }
    return true;
});

/**
 * @function email
 * 
 * Validator rule that checks if a given value is a valid email address format.
 * This rule utilizes the `isValidEmail` utility function to perform the validation.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The value to validate as an email address.
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the value is not provided or is not a string; 
 *   otherwise, returns `true` if the email format is valid, or an error message indicating that the email is invalid.
 * 
 * ### Example Usage:
 * ```typescript
 * 
 * // Example of using the validation rule
 * const result1 = email({ value: "test@example.com" });
 * console.log(result1); // Output: true (valid email)
 * 
 * const result2 = email({ value: "invalid-email" });
 * console.log(result2); // Output: "Invalid email format." if the translation key is set up correctly
 * 
 * const result3 = email({ value: null });
 * console.log(result3); // Output: true (no validation needed)
 * ```
 * 
 * ### Notes:
 * - This rule is essential for validating email input in forms, ensuring that users provide a correctly formatted email address.
 * - The error message can be customized by modifying the translation key used in `i18n.t`.
 * - The rule allows for `null` or non-string values to pass through without validation, which can be useful for optional email fields.
 */
Validator.registerRule("email", function email(options) {
    const value = options?.value;
    if (!value || typeof value !== "string") {
        return true;
    }
    return isValidEmail(value) || i18n.t("validator.email", options);
});


/**
 * @function url
 * 
 * Validator rule that checks if a given value is a valid URL format.
 * This rule utilizes the `isValidUrl` utility function to perform the validation.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The value to validate as a URL.
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the value is not provided or is not a string; 
 *   otherwise, returns `true` if the URL format is valid, or an error message indicating that the URL is invalid.
 * 
 * ### Example Usage:
 * ```typescript
 * // Example of using the validation rule
 * const result1 = url({ value: "https://example.com" });
 * console.log(result1); // Output: true (valid URL)
 * 
 * const result2 = url({ value: "invalid-url" });
 * console.log(result2); // Output: "Invalid URL format." if the translation key is set up correctly
 * 
 * const result3 = url({ value: null });
 * console.log(result3); // Output: true (no validation needed)
 * ```
 * 
 * ### Notes:
 * - This rule is essential for validating URL input in forms, ensuring that users provide a correctly formatted URL.
 * - The error message can be customized by modifying the translation key used in `i18n.t`.
 * - The rule allows for `null` or non-string values to pass through without validation, which can be useful for optional URL fields.
 */
Validator.registerRule("url", function url(options) {
    const value = options?.value;
    return !value || typeof value !== "string" ? true : isValidUrl(value) || i18n.t("validator.url", options);
});

/**
 * @function minLength
 * 
 * Validator rule that checks if a given string meets a minimum length requirement.
 * This rule ensures that the input string has at least the specified number of characters.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The string value to validate.
 *   - `ruleParams`: An array where the first element specifies the minimum length required.
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the value is empty or meets the minimum length requirement; 
 *   otherwise, returns an error message indicating that the minimum length is not met.
 * 
 * ### Example Usage:
 * ```typescript
 * 
 * // Example of using the validation rule
 * const result1 = minLength({ value: "Hello", ruleParams: [3] });
 * console.log(result1); // Output: true (valid length)
 * 
 * const result2 = minLength({ value: "Hi", ruleParams: [3] });
 * console.log(result2); // Output: "This field must have a minimum of 3 characters"
 * 
 * const result3 = minLength({ value: "", ruleParams: [3] });
 * console.log(result3); // Output: true (no validation needed for empty value)
 * ```
 * 
 * ### Notes:
 * - This rule is useful for validating user input in forms, ensuring that the input meets a minimum length requirement.
 * - The error message can be customized based on the parameters provided, allowing for clear feedback to users.
 * - The `isEmpty` utility function is used to check for empty values, which may include `null`, `undefined`, or empty strings.
 */
Validator.registerRule("minLength", function minLength(options) {
    let { value, ruleParams } = options;
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    const mLength = parseFloat(ruleParams[0]) || 0;
    const message = i18n.t("validator.minLength", { ...options, minLength: mLength });
    return isEmpty(value) || value && typeof value === "string" && String(value).length >= mLength || message;
});


/**
 * @function maxLength
 * 
 * Validator rule that checks if a given string does not exceed a maximum length.
 * This rule ensures that the input string has at most the specified number of characters.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The string value to validate.
 *   - `ruleParams`: An array where the first element specifies the maximum length allowed.
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the value is empty or meets the maximum length requirement; 
 *   otherwise, returns an error message indicating that the maximum length is exceeded.
 * 
 * ### Example Usage:
 * ```typescript
 * // Example of using the validation rule
 * const result1 = maxLength({ value: "Hello", ruleParams: [10] });
 * console.log(result1); // Output: true (valid length)
 * 
 * const result2 = maxLength({ value: "Hello, World!", ruleParams: [10] });
 * console.log(result2); // Output: "This field must have a maximum of 10 characters"
 * 
 * const result3 = maxLength({ value: "", ruleParams: [10] });
 * console.log(result3); // Output: true (no validation needed for empty value)
 * ```
 * 
 * ### Notes:
 * - This rule is useful for validating user input in forms, ensuring that the input does not exceed a specified length.
 * - The error message can be customized based on the parameters provided, allowing for clear feedback to users.
 * - The `isEmpty` utility function is used to check for empty values, which may include `null`, `undefined`, or empty strings.
 */
Validator.registerRule("maxLength", function maxLength(options) {
    let { value, ruleParams } = options;
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    const mLength = parseFloat(ruleParams[0]) || 0;
    const message = i18n.t("validator.maxLength", { ...options, maxLength: mLength });
    return isEmpty(value) || value && typeof value === "string" && String(value).length <= mLength || message;
});

/**
 * @function fileName
 * 
 * Validator rule that checks if a given value is a valid file name.
 * This rule ensures that the file name does not contain forbidden characters, 
 * does not start with a dot, and is not a reserved file name.
 * 
 * ### Parameters:
 * - **options**: `IValidatorRuleOptions` - An object containing:
 *   - `value`: The file name to validate.
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the file name is valid; 
 *   otherwise, returns an error message indicating that the file name is invalid.
 * 
 * ### Example Usage:
 * ```typescript
 * 
 * // Example of using the validation rule
 * const result1 = fileName({ value: "validFileName.txt" });
 * console.log(result1); // Output: true (valid file name)
 * 
 * const result2 = fileName({ value: "invalid/file:name.txt" });
 * console.log(result2); // Output: "Please enter a valid file name" (invalid characters)
 * 
 * const result3 = fileName({ value: ".hiddenFile" });
 * console.log(result3); // Output: "Please enter a valid file name" (starts with dot)
 * 
 * const result4 = fileName({ value: "nul" });
 * console.log(result4); // Output: "Please enter a valid file name" (reserved name)
 * ```
 * 
 * ### Notes:
 * - This rule is essential for validating file names in forms, ensuring that users provide valid and acceptable file names.
 * - The error message can be customized as needed.
 * - The `isNonNullString` utility function is used to check that the value is a non-null string before performing further validation.
 */
Validator.registerRule("fileName", function fileName(options) {
    const { value } = options;
    const message = i18n.t("validator.fileName", options);
    if (!isNonNullString(value)) return message;
    const rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    const rg2 = /^\./; // cannot start with dot (.)
    const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
    return rg1.test(String(value)) && !rg2.test(value) && !rg3.test(value) || message;
});