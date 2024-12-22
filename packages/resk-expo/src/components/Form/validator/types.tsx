/**
 * @interface IFormValidationRule
 * Represents a validation rule for form fields.
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
 *       ({ value }) => boolean | string | Promise<IFormValidationResult>
 *   ]
 *   ```
 * 
 * ### Examples:
 * 
 * - Multiple rules defined as a string:
 *   ```typescript
 *   const rule: IFormValidationRule = "required|minLength[2]|maxLength[10]";
 *   ```
 * 
 * - A validation rule defined as a function:
 *   ```typescript
 *   const rule: IFormValidationRule = ({ value }) => {
 *       return value?.length === 2 || "This field must have exactly two characters";
 *   };
 *   ```
 * 
 * - An array of rules:
 *   ```typescript
 *   const rules: IFormValidationRule = [
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
export type IFormValidationRule = ((options: IFormValidationRuleOptions) => IFormValidationResult) | string;


/**
 * @interface IFormValidationRules
 * Represents a collection of validation rules for form fields.
 * 
 * The `IFormValidationRules` type can be either a single validation rule or an array of validation rules.
 * This allows for flexible validation configurations, enabling developers to define multiple rules
 * for a single form field or to use a single rule as needed.
 * 
 * ### Possible Values:
 * 
 * - A single validation rule of type `IFormValidationRule`, which can be:
 *   - A string representing a validation rule (e.g., `"required"`).
 *   - A function that performs validation and returns a result.
 * 
 * - An array of validation rules, where each element can be of type `IFormValidationRule`.
 * 
 * ### Examples:
 * 
 * - A single validation rule:
 *   ```typescript
 *   const rules: IFormValidationRules = "required";
 *   ```
 * 
 * - An array of validation rules:
 *   ```typescript
 *   const rules: IFormValidationRules = [
 *       "required",
 *       "minLength[5]",
 *       ({ value }) => value?.length <= 10 || "Value must be 10 characters or less"
 *   ];
 *   ```
 * 
 * This type provides a convenient way to manage validation logic in forms, allowing for both simple and complex validation scenarios.
 */
export type IFormValidationRules = IFormValidationRule | IFormValidationRule[];


/**
 * @interface IFormValidationRuleOptions
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
 * function validateUsername(username: string): IFormValidationResult {
 *     if (username.length < 5) {
 *         return "Username must be at least 5 characters long."; // Invalid validation
 *     }
 *     return true; // Valid validation
 * }
 * 
 * // Example of an asynchronous validation function
 * async function validatePassword(password: string): IFormValidationResult {
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
export type IFormValidationResult = Promise<boolean | string> | string | boolean;


/**
 * @interface IFormValidationRuleOptions
 * Represents the options for defining a form validation rule.
 * 
 * This interface is used to specify the rules and parameters for validating a form field.
 * It includes the validation rules to apply, the value to validate, and any additional parameters
 * needed for specific rules.
 */
export interface IFormValidationRuleOptions {
    /** 
     * The list of validation rules to apply.
     * This should conform to the `IFormValidationRules` type, which defines the available rules.
     * 
     * @example
     * ```typescript
     * const options: IFormValidationRuleOptions = {
     *     rules: {
     *         required: true,
     *         minLength: 5,
     *     },
     *     value: "example",
     * };
     * ```
     */
    rules: IFormValidationRules;

    /**
     * An optional specific validation rule to apply.
     * This can be used to override or specify a particular rule from the `rules` property.
     * 
     * @example
     * ```typescript
     * const options: IFormValidationRuleOptions = {
     *     rules: { required: true },
     *     rule: 'minLength',
     *     value: "test",
     * };
     * ```
     */
    rule?: IFormValidationRule;

    /** 
     * The value to use for performing the validation.
     * This is the actual data that will be validated against the specified rules.
     * 
     * @example
     * ```typescript
     * const options: IFormValidationRuleOptions = {
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
     * const options: IFormValidationRuleOptions = {
     *     rules: { numberGreaterThan: true },
     *     value: 10,
     *     ruleParams: [5], // Validates if the value is greater than 5
     * };
     * ```
     */
    ruleParams?: any[];
}

/**
 * @interface IFormValidationRuleSeparator
 * Represents the separator used to define multiple validation rules in a string format.
 * 
 * The `IFormValidationRuleSeparator` type is a string literal type that specifies the character
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
export type IFormValidationRuleSeparator = "|";