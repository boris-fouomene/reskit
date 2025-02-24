
import { isNumber } from "lodash";
import { IValidatorResult, IValidatorValidateOptions } from "../types";
import { defaultStr, isEmpty, isNonNullString, isValidUrl, isValidEmail, isStringNumber } from "@utils/index";
import { Validator } from "../validator";
import { i18n } from "../../i18n";
import { InputFormatter } from "@utils/inputFormatter";

/**
 * @function compareNumer
 * 
 * Compares a numeric value against a specified value using a comparison function.
 * This function returns a promise that resolves if the comparison is valid and rejects with an error message if it is not.
 * 
 * ### Parameters:
 * - **compare**: `(value: any, toCompare: any) => boolean` - A comparison function that defines the comparison logic.
 * - **message**: `string` - The error message to return if the validation fails.
 * - **options**: `IValidatorValidateOptions` - An object containing the value to validate and any rule parameters.
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
function compareNumer(compare: (value: any, toCompare: any) => boolean, translateKey: string, { value, ruleParams, ...rest }: IValidatorValidateOptions): IValidatorResult {
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    const rParams = ruleParams ? ruleParams : [];
    translateKey = defaultStr(translateKey);
    const message = i18n.t(translateKey, { ...rest, value, ruleParams });
    value = typeof value === 'number' ? value : isStringNumber(value) ? parseFloat(value) : NaN;
    return new Promise((resolve, reject) => {
        if (isNaN(value) || rParams[0] === undefined) {
            return resolve(message);
        }
        const toCompare = typeof rParams[0] === 'number' ? rParams[0] : isStringNumber(rParams[0]) ? parseFloat(rParams[0]) : NaN;
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
 * - **options**: `IValidatorValidateOptions` - Contains the value to validate and the rule parameters.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is less than or equal to the specified value, otherwise rejects with an error message.
 * 
 * ### Example Usage:
 * ```typescript
 * ```
 */
function numberLessThanOrEquals(options: IValidatorValidateOptions) {
    return compareNumer((value, toCompare) => {
        return value <= toCompare;
    }, 'validator.numberLessThanOrEquals', options)
}


Validator.registerRule("numberLessThanOrEquals", numberLessThanOrEquals);
/**
 * @decorator ValidatorIsNumberLestThanOrEquals
 * 
 * Validator rule that checks if a number is less than or equal to a specified value.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - Contains the value to validate and the rule parameters.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is less than or equal to the specified value, otherwise rejects with an error message.
 * 
 * ### Example Usage:
 * ```typescript
 *  class MyClass {
 *      @ValidatorIsNumberLestThanOrEquals([5])
 *      myNumber: number;
 *  }
 * ```
 */
export const ValidatorIsNumberLestThanOrEquals = Validator.createDecorator<[param: number]>(numberLessThanOrEquals);



/**
 * @function numberLessThan
 * 
 * Validator rule that checks if a given number is less than a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
function numberLessThan(options: IValidatorValidateOptions) {
    return compareNumer((value, toCompare) => {
        return value < toCompare;
    }, "validator.numberLessThan", options);
}
Validator.registerRule("numberLessThan", numberLessThan);

/**
 * @decorator ValidatorIsNumberLessThan
 * 
 * Validator rule that checks if a given number is less than a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is less than the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @ValidatorIsNumberLessThan([10])
 *     myNumber: number;    
 * }
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input is strictly less than a specified limit.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
export const ValidatorIsNumberLessThan = Validator.createDecorator<[param: number]>(numberLessThan);

/**
 * @function numberGreaterThanOrEquals
 * 
 * Validator rule that checks if a given number is greater than or equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
function numberGreaterThanOrEquals(options: IValidatorValidateOptions) {
    return compareNumer((value, toCompare) => {
        return value >= toCompare;
    }, "validator.numberGreaterThanOrEquals", options)
}
Validator.registerRule("numberGreaterThanOrEquals", numberGreaterThanOrEquals);

/**
 * @decorator ValidatorIsNumberGreaterThanOrEquals
 * 
 * Validator rule that checks if a given number is greater than or equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is greater than or equal to the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @ValidatorIsNumberGreaterThanOrEquals([5])
 *     myNumber: number;
 * }
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input meets or exceeds a specified limit.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
export const ValidatorIsNumberGreaterThanOrEquals = Validator.createDecorator<[param: number]>(numberGreaterThanOrEquals);

/**
 * @function numberGreaterThan
 * 
 * Validator rule that checks if a given number is greater than a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
function numberGreaterThan(options: IValidatorValidateOptions) {
    return compareNumer((value, toCompare) => {
        return value > toCompare;
    }, "validator.numberGreaterThan", options)
}
Validator.registerRule("numberGreaterThan", numberGreaterThan);

/**
 * @decorator ValidatorIsNumberGreaterThan
 * 
 * Validator rule that checks if a given number is greater than a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is greater than the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @ValidatorIsNumberGreaterThan([10])
 *     myNumber: number;
 * }
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input exceeds a specified limit.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
export const ValidatorIsNumberGreaterThan = Validator.createDecorator<[param: number]>(numberGreaterThan);

/**
 * @function numberEquals
 * 
 * Validator rule that checks if a given number is equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
function numberEqualsTo(options: IValidatorValidateOptions) {
    return compareNumer((value, toCompare) => {
        return value === toCompare;
    }, "validator.numberEquals", options)
}
Validator.registerRule("numberEquals", numberEqualsTo);

/**
 * @decorator ValidatorIsNumberEquals
 * 
 * Validator rule that checks if a given number is equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is equal to the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @ValidatorIsNumberEquals([10])
 *     myNumber: number;
 * }
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input matches a specified value exactly.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
export const ValidatorIsNumberEquals = Validator.createDecorator<[param: number]>(numberEqualsTo);

/**
 * @function numberIsDifferentFrom
 * 
 * Validator rule that checks if a given number is not equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
 * const result = numberIsDifferentFrom({ value: 5, ruleParams: [10] });
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
function numberIsDifferentFromTo(options: IValidatorValidateOptions) {
    return compareNumer((value, toCompare) => {
        return value !== toCompare;
    }, "validator.numberIsDifferentFrom", options)
}
Validator.registerRule("numberIsDifferentFrom", numberIsDifferentFromTo);


/**
 * @decorator ValidatorNumberIsDifferentFrom
 * 
 * Validator rule that checks if a given number is not equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 * 
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is not equal to the specified comparison value, 
 *   otherwise rejects with an error message indicating the validation failure.
 * 
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @ValidatorNumberIsDifferentFrom([10])
 *     myNumber: number;
 * }
 * ```
 * 
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input does not match a specified value.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */

export const ValidatorNumberIsDifferentFrom = Validator.createDecorator<[param: number]>(numberIsDifferentFromTo)


/**
 * @function required
 * 
 * Validator rule that checks if a value is present and not empty.
 * This rule ensures that a field is filled out before submission.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
function numberHasLength({ value, ruleParams }: IValidatorValidateOptions) {
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    value = defaultStr(value);
    const minLength = isNumber(ruleParams[0]) ? ruleParams[0] : isStringNumber(ruleParams[0]) ? parseFloat(ruleParams[0]) : undefined;
    const maxLength = isNumber(ruleParams[1]) ? ruleParams[1] : isStringNumber(ruleParams[1]) ? parseFloat(ruleParams[1]) : undefined;
    const i18nParams = { value, minLength, maxLength, length: minLength };
    const message = (isNumber(minLength) && isNumber(maxLength)) ?
        i18n.t("validator.lengthRange", i18nParams) : i18n.t("validator.length", i18nParams);
    if (isNumber(minLength) && isNumber(maxLength)) {
        return (value.length >= minLength && value.length <= maxLength) || message;
    }
    if (isNumber(minLength)) {
        ///on valide la longueur
        return String(value).trim().length == minLength || message;
    }
    return true;
}
Validator.registerRule("length", numberHasLength);

/**
 * @decorator ValidatorHasLength
 * 
 * Validator rule that validates the length of a string. This rule checks if the length of the input string
 * falls within a specified range or matches a specific length.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
 * class MyClass {
 *     @ValidatorHasLength([3, 10]) //"This field must be between 3 and 10 characters long"
 *     myString: string;
 * }
 * 
 * class MyClass {
 *     @ValidatorHasLength([4]) //"This field must be exactly 4 characters long"
 *     myString: string;
 * }
 * ```
 * 
 * ### Notes:
 * - This rule is useful for validating user input in forms, ensuring that the input meets specific length requirements.
 * - The error messages can be customized based on the parameters provided, allowing for clear feedback to users.
 * - The `defaultStr` utility function is used to ensure that the value is treated as a string, even if it is `null` or `undefined`.
 */
export const ValidatorHasLength = Validator.createDecorator<[minOrLength: number, maxLength?: number]>(numberHasLength);

/**
 * @function email
 * 
 * Validator rule that checks if a given value is a valid email address format.
 * This rule utilizes the `isValidEmail` utility function to perform the validation.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
function minLength(options: IValidatorValidateOptions) {
    let { value, ruleParams } = options;
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    const mLength = parseFloat(ruleParams[0]) || 0;
    const message = i18n.t("validator.minLength", { ...options, minLength: mLength });
    return isEmpty(value) || value && typeof value === "string" && String(value).length >= mLength || message;
}
Validator.registerRule("minLength", minLength);

/**
 * @decorator ValidatorHasMinLength
 * 
 * Validator rule that checks if a given string meets a minimum length requirement.
 * This rule ensures that the input string has at least the specified number of characters.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The string value to validate.
 *   - `ruleParams`: An array where the first element specifies the minimum length required.
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the value is empty or meets the minimum length requirement; 
 *   otherwise, returns an error message indicating that the minimum length is not met.
 * 
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @ValidatorHasMinLength([3]) //"This field must have a minimum of 3 characters"
 *     myString: string;
 * }
 * ```
 * 
 * ### Notes:
 * - This rule is useful for validating user input in forms, ensuring that the input meets a minimum length requirement.
 * - The error message can be customized based on the parameters provided, allowing for clear feedback to users.
 * - The `isEmpty` utility function is used to check for empty values, which may include `null`, `undefined`, or empty strings.
 */
export const ValidatorHasMinLength = Validator.createDecorator<[minLength: string]>(minLength);


/**
 * @function maxLength
 * 
 * Validator rule that checks if a given string does not exceed a maximum length.
 * This rule ensures that the input string has at most the specified number of characters.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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
function maxLength(options: IValidatorValidateOptions) {
    let { value, ruleParams } = options;
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    const mLength = parseFloat(ruleParams[0]) || 0;
    const message = i18n.t("validator.maxLength", { ...options, maxLength: mLength });
    return isEmpty(value) || value && typeof value === "string" && String(value).length <= mLength || message;
}
Validator.registerRule("maxLength", maxLength);


/**
 * @decorator ValidatorHasMaxLength
 * 
 * Validator rule that checks if a given string does not exceed a maximum length.
 * This rule ensures that the input string has at most the specified number of characters.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The string value to validate.
 *   - `ruleParams`: An array where the first element specifies the maximum length allowed.
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the value is empty or meets the maximum length requirement; 
 *   otherwise, returns an error message indicating that the maximum length is exceeded.
 * 
 * ### Example Usage:
 * ```typescript
    import { ValidatorHasMaxLength } from '@resk/core';
    class MyClass {
        @ValidatorHasMaxLength([10])
        myProperty: string;
    }
 * ```
 * 
 * ### Notes:
 * - This rule is useful for validating user input in forms, ensuring that the input does not exceed a specified length.
 * - The error message can be customized based on the parameters provided, allowing for clear feedback to users.
 * - The `isEmpty` utility function is used to check for empty values, which may include `null`, `undefined`, or empty strings.
 */
export const ValidatorHasMaxLength = Validator.createDecorator<[maxLength: number]>(maxLength);

/**
 * @function fileName
 * 
 * Validator rule that checks if a given value is a valid file name.
 * This rule ensures that the file name does not contain forbidden characters, 
 * does not start with a dot, and is not a reserved file name.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
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

Validator.registerRule("number", function number(options) {
    const { value } = options;
    return typeof value === "number" || i18n.t("validator.isNumber", options);
});

Validator.registerRule("nonNullString", function nonNullString(options) {
    const { value } = options;
    return isNonNullString(value) || i18n.t("validator.isNonNullString", options);
});


function phoneNumber(options: IValidatorValidateOptions) {
    const { value } = options;
    return InputFormatter.isValidPhoneNumber(value) || i18n.t("validator.phoneNumber", options);
}
Validator.registerRule("phoneNumber", phoneNumber);

/**
 * A validator decorator to check if a phone number is valid.
 * 
 * @param phoneNumber The phone number to validate.
 * @returns A validator decorator that checks if the phone number is valid.
 * @example
 * ```typescript
 * class User {
 *   @ValidatorIsPhoneNumber
 *   phoneNumber: string;
 * }
 * ```
 */
export const ValidatorIsPhoneNumber = Validator.createPropertyDecorator("phoneNumber");



function emailOrPhoneNumber(options: IValidatorValidateOptions) {
    const { value } = options;
    return isValidEmail(value) || InputFormatter.isValidPhoneNumber(value) || i18n.t("validator.emailOrPhoneNumber", options);
}
Validator.registerRule("emailOrPhoneNumber", emailOrPhoneNumber);

/**
 * A validator decorator to check if value is a valid email or phone number.
 * 
 * @param value The email or phone number to validate.
 * @returns A validator decorator that checks if the email or phone number is valid.
 * @example
 * ```typescript
 * class User {
 *   @ValidatorIsEmailOrPhoneNumber
 *   emailOrPhoneNumber : string;
 * }
 * ```
 */
export const ValidatorIsEmailOrPhoneNumber = Validator.createPropertyDecorator("emailOrPhoneNumber");