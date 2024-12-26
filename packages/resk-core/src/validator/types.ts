/**
 * @interface IValidatorRule
 * Represents a validation  rule that can be used within the validation system.
 * This type can either be a function that implements custom validation logic or a string
 * that specifies a predefined validation rule.
 * 
 * A validation rule can be one of the following:
 * 
 * - A string: For example, `"minLength[1]|required"` specifies multiple rules to apply for validation,
 *   where the `|` character separates different rules.
 * 
 * - A function: A function that takes an object with the value to validate and returns either:
 *   - A boolean indicating success (`true`) or failure (`false`).
 *   - A string containing an error message if the validation fails.
 *   - An exception can also be thrown if the validation is not effective.
 *   Example:
 *   ```typescript
 *   ({ value }) => {
 *       return value?.includes("a") || "This field is invalid";
 *   }
 *   ```
 * 
 * - An array of validation rules: This can include a mix of strings and functions.
 *   Example:
 *   ```typescript
 *   [
 *       "required",
 *       "maxLength[50]",
 *       "minLength[10]",
 *       ({ value }) => boolean | string | Promise<IValidatorResult>
 *   ]
 *   ```
 * 
 * @template ParamType The type of the parameters that the rule function accepts.
 * ### Examples:
 * 
 * - Multiple rules defined as a string:
 *   ```typescript
 *   const rule: IValidatorRule = "required|minLength[2]|maxLength[10]";
 *   ```
 * 
 * - A validation rule defined as a function:
 *   ```typescript
 *   const rule: IValidatorRule = ({ value }) => {
 *       return value?.length === 2 || "This field must have exactly two characters";
 *   };
 *   ```
 * 
 * - An array of rules:
 *   ```typescript
 *   const rules: IValidatorRule = [
 *       "required",
 *       "minLength[2]",
 *       "maxLength[10]",
 *       ({ value }) => value?.length === 2 || "This field must have exactly two characters"
 *   ];
 *   ```
 * 
 * Note: When a function is used as a validation rule, it can either return a string specifying the error message,
 * or it can throw an exception of type string or return an object of the form `{ message: string }`.
 */

export type IValidatorRule<ParamType = Array<any>> = IValidatorRuleFunction<ParamType> | string;


/**
 * @typedef IValidatorRuleFunction
 * 
 * Represents a validation rule function that is used within the validation system.
 * This function takes a set of options and performs validation on a given value,
 * returning the result of the validation process.
 * 
 * @template ParamType The type of the parameters that the rule function accepts.
 * 
 * ### Structure:
 * - The function accepts a single parameter:
 *   - `options` (IValidatorRuleOptions): An object containing the necessary parameters for validation.
 * 
 * ### Parameters:
 * - **options**: An object of type `IValidatorRuleOptions` which includes:
 *   - `rules`: A collection of validation rules to apply. This can be a single rule or an array of rules.
 *   - `rule`: An optional specific validation rule to apply, overriding the rules defined in the `rules` property.
 *   - `value`: The actual value that needs to be validated against the specified rules.
 *   - `ruleParams`: Optional parameters that may be required for specific validation rules.
 * 
 * ### Return Value:
 * - The function returns an `IValidatorResult`, which can be one of the following:
 *   - A `Promise<boolean | string>`: Indicates asynchronous validation. If resolved to `true`, the validation has succeeded; if resolved to a `string`, it represents an error message indicating a validation failure.
 *   - A `string`: Represents an invalid validation result, where the string contains an error message.
 *   - A `boolean`: Indicates the success (`true`) or failure (`false`) of the validation.
 * 
 * ### Example Usage:
 * ```typescript
 * const validateEmail: IValidatorRuleFunction = ({ value }) => {
 *     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 *     if (!emailPattern.test(value)) {
 *         return "Invalid email format."; // Invalid validation
 *     }
 *     return true; // Valid validation
 * };
 * 
 * // Example of using the validation function
 * const result = validateEmail({ value: "test@example.com" });
 * if (typeof result === "string") {
 *     console.error(result); // Output: "Invalid email format." if validation fails
 * } else {
 *     console.log("Validation passed."); // Output: "Validation passed." if validation succeeds
 * }
 * ```
 * 
 * ### Notes:
 * - This type is essential for defining custom validation logic in forms, allowing developers to create reusable and flexible validation rules.
 * - The function can be synchronous or asynchronous, depending on the validation logic implemented.
 */
export type IValidatorRuleFunction<ParamType = Array<any>> = (options: IValidatorRuleOptions<ParamType>) => IValidatorResult;

/**
 * @interface IValidatorRuleName
 * Represents the name of a validation rule as defined in the `IValidatorRuleMap`.
 * 
 * The `IValidatorRuleName` type is a union of string literal types that correspond to the keys
 * of the `IValidatorRuleMap` interface. This allows for type-safe access to the names of
 * validation rules, ensuring that only valid rule names can be used in contexts where a rule name
 * is required.
 * 
 * ### Structure:
 * - The type is derived from the keys of the `IValidatorRuleMap`, meaning it will include
 *   all the rule names defined in that map.
 * 
 * ### Example:
 * 
 * ```typescript
 * const ruleName: IValidatorRuleName = "required"; // Valid
 * const anotherRuleName: IValidatorRuleName = "minLength"; // Valid
 * 
 * // Usage in a function that accepts a rule name
 * function getValidationRule(ruleName: IValidatorRuleName) {
 *     return validationRules[ruleName];
 * }
 * 
 * const rule = getValidationRule("maxLength"); // Valid usage
 * // const invalidRule = getValidationRule("unknownRule"); // TypeScript will throw an error
 * ```
 * 
 * This type enhances type safety in your code by ensuring that only valid validation rule names
 * can be used, reducing the risk of runtime errors due to typos or invalid rule names.
 */
export type IValidatorRuleName = keyof IValidatorRuleMap;

/**
 * Represents a mapping of validation rule names to their corresponding validation rules.
 * 
 * The `IValidatorRuleMap` interface defines an object where each key is a string
 * representing the name of a validation rule, and the value is the corresponding validation rule
 * of type `IValidatorRule`. This allows for easy retrieval and management of validation rules
 * by name.
 * 
 * ### Structure:
 * - **Key**: A string representing the name of the validation rule.
 * - **Value**: An `IValidatorRule`, which can be a string, a function, or an array of rules.
 * 
 * ### Example:
 * 
 * ```typescript
 * const validationRules: IValidatorRuleMap = {
 *     required: "required",
 *     minLength: ({ value }) => value.length >= 5 || "Minimum length is 5 characters.",
 *     maxLength: ({ value }) => value.length <= 10 || "Maximum length is 10 characters.",
 * };
 * 
 * // Usage
 * const requiredRule = validationRules["required"]; // "required"
 * const minLengthRule = validationRules["minLength"]; // Function for min length validation
 * ```
 * 
 * This interface is useful for organizing and managing validation rules in a structured way,
 * making it easier to apply and reference them in  validation scenarios.
 */
export interface IValidatorRuleMap {
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
    numberLessThanOrEquals: IValidatorRuleFunction;

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
    numberLessThan: IValidatorRuleFunction;

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
     *     console.error(error); // Output: "Entrez un nombre supérieure ou égal à 5" if validation fails
     * });
     * ```
     * 
     * ### Notes:
     * - This rule is useful for scenarios where you need to ensure that a numeric input meets or exceeds a specified limit.
     * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
     */
    numberGreaterThanOrEquals: IValidatorRuleFunction;

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
     *     console.error(error); // Output: "Entrez un nombre supérieure à 10" if validation fails
     * });
     * ```
     * 
     * ### Notes:
     * - This rule is useful for scenarios where you need to ensure that a numeric input exceeds a specified limit.
     * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
     */
    numberGreaterThan: IValidatorRuleFunction;

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
     *     console.error(error); // Output: "Entrez un nombre égal à 10" if validation fails
     * });
     * ```
     * 
     * ### Notes:
     * - This rule is useful for scenarios where you need to ensure that a numeric input matches a specified value exactly.
     * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
     */
    numberEquals: IValidatorRuleFunction;

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
    numberNotEquals: IValidatorRuleFunction;

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
    required: IValidatorRuleFunction;

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
     * console.log(result2); // Output: "Ce champ doit avoir une longueur comprise entre 3 et 10 caractere(s)"
     * 
     * const result3 = length({ value: "Test", ruleParams: [4] });
     * console.log(result3); // Output: true (valid length)
     * 
     * const result4 = length({ value: "Test", ruleParams: [5] });
     * console.log(result4); // Output: "ce champ doit avoir 5 caractere(s)"
     * ```
     * 
     * ### Notes:
     * - This rule is useful for validating user input in forms, ensuring that the input meets specific length requirements.
     * - The error messages can be customized based on the parameters provided, allowing for clear feedback to users.
     * - The `defaultStr` utility function is used to ensure that the value is treated as a string, even if it is `null` or `undefined`.
     */
    length: IValidatorRuleFunction;

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
     * console.log(result2); // Output: "Ce champ doit avoir au minimum 3 caractère(s)"
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
    minLength: IValidatorRuleFunction;

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
     * console.log(result2); // Output: "Ce champ doit avoir au maximum 10 caractère(s)"
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
    maxLength: IValidatorRuleFunction;

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
    email: IValidatorRuleFunction;

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
    url: IValidatorRuleFunction;

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
     * console.log(result2); // Output: "Veuillez entrer une nom de fichier valide" (invalid characters)
     * 
     * const result3 = fileName({ value: ".hiddenFile" });
     * console.log(result3); // Output: "Veuillez entrer une nom de fichier valide" (starts with dot)
     * 
     * const result4 = fileName({ value: "nul" });
     * console.log(result4); // Output: "Veuillez entrer une nom de fichier valide" (reserved name)
     * ```
     * 
     * ### Notes:
     * - This rule is essential for validating file names in forms, ensuring that users provide valid and acceptable file names.
     * - The error message can be customized as needed.
     * - The `isNonNullString` utility function is used to check that the value is a non-null string before performing further validation.
     */
    fileName: IValidatorRuleFunction;
}

/**
 * @interface IValidatorRulesOptions
 * Represents a collection of validation rules for  fields.
 * 
 * The `IValidatorRulesOptions` type can be either a single validation rule or an array of validation rules.
 * This allows for flexible validation configurations, enabling developers to define multiple rules
 * for a single form field or to use a single rule as needed.
 * 
 * ### Possible Values:
 * 
 * - A single validation rule of type `IValidatorRule`, which can be:
 *   - A string representing a validation rule (e.g., `"required"`).
 *   - A function that performs validation and returns a result.
 * 
 * - An array of validation rules, where each element can be of type `IValidatorRule`.
 * 
 * @template ParamType The type of the parameters that the rule function accepts.
 * ### Examples:
 * 
 * - A single validation rule:
 *   ```typescript
 *   const rules: IValidatorRulesOptions = "required";
 *   ```
 * 
 * - An array of validation rules:
 *   ```typescript
 *   const rules: IValidatorRulesOptions = [
 *       "required",
 *       "minLength[5]",
 *       ({ value }) => value?.length <= 10 || "Value must be 10 characters or less"
 *   ];
 *   ```
 * 
 * This type provides a convenient way to manage validation logic in forms, allowing for both simple and complex validation scenarios.
 */
export type IValidatorRulesOptions<ParamType = Array<any>> = IValidatorRule<ParamType> | IValidatorRule<ParamType>[];


/**
 * @interface IValidatorRuleOptions
 * Represents the result of a form validation.
 * 
 * The validation result can be one of the following:
 * 
 * - A `Promise<boolean | string>`: Indicates that the validation is asynchronous. 
 *   - If resolved to `true`, the validation has succeeded.
 *   - If resolved to a `string`, it represents an error message indicating a validation failure.
 * - A `string`: Represents an invalid validation result, where the string contains an error message.
 * - A `boolean`: Indicates the success or failure of the validation. 
 *   - If `true`, the validation has succeeded.
 *   - If `false`, the validation has failed.
 * 
 * ### Usage:
 * - When a validation function returns a string, it signifies that the validation has failed,
 *   and the string should be treated as an error message.
 * - When a validation function returns `true`, it indicates that the validation has passed.
 * - When a validation function returns a `Promise`, it should be awaited to determine the validation result.
 * 
 * @example
 * ```typescript
 * // Example of a synchronous validation function
 * function validateUsername(username: string): IValidatorResult {
 *     if (username.length < 5) {
 *         return "Username must be at least 5 characters long."; // Invalid validation
 *     }
 *     return true; // Valid validation
 * }
 * 
 * // Example of an asynchronous validation function
 * async function validatePassword(password: string): IValidatorResult {
 *     const isValid = await checkPasswordStrength(password);
 *     if (!isValid) {
 *         return "Password must contain at least one uppercase letter."; // Invalid validation
 *     }
 *     return true; // Valid validation
 * }
 * 
 * // Example of handling the validation result
 * const result = validateUsername("Jo");
 * if (typeof result === "string") {
 *     console.error(result); // Output: "Username must be at least 5 characters long."
 * } else if (result === true) {
 *     console.log("Validation passed.");
 * }
 * ```
 */
export type IValidatorResult = Promise<boolean | string> | string | boolean;


/**
 * @interface IValidatorRuleOptions
 * Represents the options for defining a form validation rule.
 * 
 * This interface is used to specify the rules and parameters for validating a form field.
 * It includes the validation rules to apply, the value to validate, and any additional parameters
 * needed for specific rules.
 * 
 * 
 * @template ParamType The type of the parameters that the rule function accepts.
 */
export interface IValidatorRuleOptions<ParamType = Array<any>> {
    /** 
     * The list of validation rules to apply.
     * This should conform to the `IValidatorRulesOptions` type, which defines the available rules.
     * 
     * @example
     * ```typescript
     * const options: IValidatorRuleOptions = {
     *     rules: {
     *         required: true,
     *         minLength: 5,
     *     },
     *     value: "example",
     * };
     * ```
     */
    rules?: IValidatorRulesOptions;

    /**
     * An optional specific validation rule to apply.
     * This can be used to override or specify a particular rule from the `rules` property.
     * 
     * @example
     * ```typescript
     * const options: IValidatorRuleOptions = {
     *     rules: { required: true },
     *     rule: 'minLength',
     *     value: "test",
     * };
     * ```
     */
    rule?: IValidatorRule;

    /** 
     * The value to use for performing the validation.
     * This is the actual data that will be validated against the specified rules.
     * 
     * @example
     * ```typescript
     * const options: IValidatorRuleOptions = {
     *     rules: { required: true },
     *     value: "some input",
     * };
     * ```
     */
    value: any;

    /** 
     * Parameters related to the definition of the rule.
     * For example, for the rule `numberGreaterThan[0]`, `ruleParams` would be `[0]`.
     * This allows for dynamic rule definitions based on specific criteria.
     * 
     * @example
     * ```typescript
     * const options: IValidatorRuleOptions = {
     *     rules: { numberGreaterThan: true },
     *     value: 10,
     *     ruleParams: [5], // Validates if the value is greater than 5
     * };
     * ```
     */
    ruleParams?: ParamType;

    /**
    * The error message to display in case of validation failure.
    * 
    * This optional property allows for custom error messages to be provided
    * when validation does not pass, enhancing user feedback and experience.
    * 
    * @type {string}
    * 
    * @example
    * const options: IFormFieldValidatorOptions = {
    *     message: 'Please enter a valid email address.',
    * };
    * 
    * // Use the message in validation logic
    * if (!isValidEmail(options.context.value)) {
    *     console.log(options.message);
    * }
    */
    message?: string;
}

/**
 * @interface IValidatorRuleSeparator
 * Represents the separator used to define multiple validation rules in a string format.
 * 
 * The `IValidatorRuleSeparator` type is a string literal type that specifies the character
 * used to separate different validation rules when they are defined as a single string.
 * 
 * In this case, the separator is the pipe character (`|`), which allows for the specification
 * of multiple rules in a concise format.
 * 
 * ### Example:
 * 
 * When defining validation rules as a string, you can use the separator to combine multiple rules:
 * ```typescript
 * const validationRules: string = `required|minLength[5]|maxLength[10]`;
 * ```
 * 
 * In this example, the rules `required`, `minLength[5]`, and `maxLength[10]` are separated by the `|` character,
 * indicating that all these rules should be applied for validation.
 */
export type IValidatorRuleSeparator = "|";