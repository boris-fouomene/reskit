/**
 * Represents the result of a validation rule.
 * Can be boolean (success/failure), string (error message), or a Promise resolving to either.
 */
export type IValidatorResult = boolean | string | Promise<boolean | string>;
import { IInputFormatterResult } from "@/inputFormatter/types";

export type IValidatorRule<
  ParamType extends Array<any> = Array<any>,
  Context = unknown,
> =
  | IValidatorRuleFunction<ParamType, Context>
  | IValidatorRuleName
  | `${IValidatorRuleName}[${string}]`
  | {
      [K in IValidatorRuleName]: IValidatorRules[K];
    };

/**
 * @typedef IValidatorSanitizedRule
 * Represents a sanitized validation rule.
 *
 * This type can either be a validation rule function or an object that contains
 * detailed information about a validation rule, including its name, parameters,
 * and the function that implements the validation logic.
 *
 * @example
 * // Example of a validation rule function
 * const minLengthRule: IValidatorSanitizedRule = ({ value }) => {
 *     return value.length >= 5 || "Minimum length is 5 characters.";
 * };
 *
 * // Example of a sanitized rule object
 * const sanitizedRule: IValidatorSanitizedRule = {
 *     ruleName: "minLength",
 *     params: [5],
 *     ruleFunction: minLengthRule,
 * };
 */
export type IValidatorSanitizedRule<
  ParamType extends Array<any> = Array<any>,
  Context = unknown,
> =
  | IValidatorRuleFunction<ParamType, Context>
  | {
      /**
       * The name of the validation rule.
       *
       * This property specifies the rule's identifier, which can be used
       * to reference the rule in validation scenarios.
       *
       * @type {IValidatorRuleName}
       * @example
       * const ruleName = sanitizedRule.ruleName; // 'minLength'
       */
      ruleName: IValidatorRuleName;

      /**
       * The parameters required for the validation rule.
       *
       * This array contains the values that are necessary for the rule's
       * execution, such as minimum or maximum lengths, or other criteria.
       *
       * @type {ParamType}
       * @example
       * const params = sanitizedRule.params; // [5]
       */
      params: ParamType;

      /**
       * The function that implements the validation logic.
       *
       * This function is called to perform the actual validation based on
       * the provided parameters and the value being validated.
       *
       * @type {IValidatorRuleFunction}
       * @example
       * const ruleFunction = ``sanitizedRule``.ruleFunction; // Function reference
       */
      ruleFunction: IValidatorRuleFunction<ParamType, Context>;

      /***
       * The rule with parameters.
       * it represents the rule with parameters, for example "minLength[5]" that has been passed to the validator.
       */
      rawRuleName: string;
    };

/**
 * @typedef IValidatorSanitizedRules
 * Represents an array of sanitized validation rules.
 *
 * This type is a collection of sanitized rules, allowing for multiple
 * validation rules to be applied in a structured manner.
 *
 * @example
 * const sanitizedRules: IValidatorSanitizedRules = [
 *     {
 *         ruleName: "required",
 *         params: [],
 *         ruleFunction: ({ value }) => !!value || "This field is required.",
 *     },
 *     {
 *         ruleName: "minLength",
 *         params: [5],
 *         ruleFunction: ({ value }) => value.length >= 5 || "Minimum length is 5 characters.",
 *     },
 * ];
 */
export type IValidatorSanitizedRules = IValidatorSanitizedRule[];

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
 *   - `options` (IValidatorValidateOptions): An object containing the necessary parameters for validation.
 *
 * ### Parameters:
 * - **options**: An object of type `IValidatorValidateOptions` which includes:
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
export type IValidatorRuleFunction<
  ParamType extends Array<any> = Array<any>,
  Context = unknown,
> = (
  options: IValidatorValidateOptions<ParamType, Context>
) => IValidatorResult;

/**
 * @interface IValidatorRuleName
 * Represents the name of a validation rule as defined in the `IValidatorRules`.
 *
 * The `IValidatorRuleName` type is a union of string literal types that correspond to the keys
 * of the `IValidatorRules` interface. This allows for type-safe access to the names of
 * validation rules, ensuring that only valid rule names can be used in contexts where a rule name
 * is required.
 *
 * ### Structure:
 * - The type is derived from the keys of the `IValidatorRules`, meaning it will include
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
export type IValidatorRuleName = {
  [K in keyof IValidatorRules]: IValidatorRules[K] extends IValidatorRuleFunction
    ? K
    : never;
}[keyof IValidatorRules];

/**
 * Represents a mapping of validation rule names to their corresponding validation rules.
 *
 * The `IValidatorRules` interface defines an object where each key is a string
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
 * const validationRules: IValidatorRules = {
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
export interface IValidatorRules<
  ParamType extends Array<any> = Array<any>,
  Context = unknown,
> {
  /**
   * Validator rule that checks if a number is less than or equals a specified value.
   */
  NumberLessThanOrEquals: IValidatorRuleFunction<[number], Context>;

  /**
   * Validator rule that checks if a number is less than a specified value.
   */
  NumberLessThan: IValidatorRuleFunction<[number], Context>;

  /**
   * Validator rule that checks if a number is greater than or equals a specified value.
   */
  NumberGreaterThanOrEquals: IValidatorRuleFunction<[number], Context>;

  /**
   * Validator rule that checks if a number is greater than a specified value.
   */
  NumberGreaterThan: IValidatorRuleFunction<[number], Context>;

  /**
   * Validator rule that checks if a number is equal to a specified value.
   */
  NumberEquals: IValidatorRuleFunction<[number], Context>;

  /**
   * Validator rule that checks if a number is different from a specified value.
   */
  NumberIsDifferentFrom: IValidatorRuleFunction<[number], Context>;

  /**
   * Validator rule that checks if a value is present and not empty.
   */
  Required: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that validates the length of a string.
   */
  Length: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that checks if a string meets a minimum length requirement.
   */
  MinLength: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that checks if a string does not exceed a maximum length.
   */
  MaxLength: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that checks if a value is a valid email address format.
   */
  Email: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that checks if a value is a valid URL format.
   */
  Url: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that checks if a value is a valid file name.
   */
  FileName: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that checks if a value is a number.
   */
  Number: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that checks if a value is a non-null string.
   */
  NonNullString: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that checks if a value is a valid phone number.
   */
  PhoneNumber: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that checks if a value is a valid email or phone number.
   */
  EmailOrPhoneNumber: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that marks a field as allowing empty strings (validation skipped if "").
   */
  Empty: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that marks a field as nullable (validation skipped if null or undefined).
   */
  Nullable: IValidatorRuleFunction<ParamType, Context>;

  /**
   * Validator rule that marks a field as sometimes validated (validation skipped if undefined).
   */
  Sometimes: IValidatorRuleFunction<ParamType, Context>;
}

/**
 * @interface IValidatorValidateOptions
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
/**
 * Represents a mapping of validation rule names to their corresponding validation rules.
 *
 * The `IValidatorRules` interface defines an object where each key is a PascalCase string
 * representing the name of a validation rule, and the value is the corresponding validation rule
 * of type `IValidatorRule`. This allows for easy retrieval and management of validation rules
 * by name.
 *
 * ### Structure:
 * - **Key**: A PascalCase string representing the name of the validation rule.
 * - **Value**: An `IValidatorRule`, which can be a string, a function, or an array of rules.
 *
 * ### Example:
 *
 * ```typescript
 * const validationRules: IValidatorRules = {
 *     Required: "Required",
 *     MinLength: ({ value }) => value.length >= 5 || "Minimum length is 5 characters.",
 *     MaxLength: ({ value }) => value.length <= 10 || "Maximum length is 10 characters.",
 * };
 *
 * // Usage
 * const rule = validationRules.Required;
 * const minLengthRule = validationRules.MinLength;
 * const maxLengthRule = validationRules.MaxLength;
 * ```
 */

/**
 * @interface IValidatorValidateOptions
 * @extends Partial<IInputFormatterResult>
 * Represents the options that are passed to the `Validator.validate` method.
 *
 * This interface is used to specify the rules and parameters for validating a form field.
 * It includes the validation rules to apply, the value to validate, and any additional parameters
 * needed for specific rules.
 *
 *
 * @template ParamType The type of the parameters that the rule function accepts.
 * @template Context The type of the context that the rule function accepts.
 */
export interface IValidatorValidateOptions<
  ParamType extends Array<any> = Array<any>,
  Context = unknown,
> extends Omit<Partial<IInputFormatterResult>, "value">,
    BaseData<Context> {
  /**
   * The list of validation rules to apply that have been passed through the `Validator.validate` method.
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *     rules: {
   *         required: true,
   *         minLength: 5,
   *     },
   *     value: "example",
   * };
   * ```
   */
  rules?: IValidatorRule[];

  sanitizedRules?: IValidatorSanitizedRules;

  /**
   * The current validation rule to apply.
   * This can be used to override or specify a particular rule from the `rules` property.
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *     rules: { required: true },
   *     rule: 'minLength',
   *     value: "test",
   * };
   * ```
   */
  rule?: IValidatorRule<ParamType, Context>;

  /**
   * Parameters related to the definition of the rule.
   * For example, for the rule `numberGreaterThan[0]`, `ruleParams` would be `[0]`.
   * This allows for dynamic rule definitions based on specific criteria.
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *     rules: { numberGreaterThan: true },
   *     value: 10,
   *     ruleParams: [5], // Validates if the value is greater than 5
   * };
   * ```
   */
  ruleParams?: ParamType;

  /***
   * The rule name.
   * it represents the rule name, for example "minLength" that has been passed to the validator.
   */
  ruleName?: IValidatorRuleName;

  /**
   * The raw rule name.
   * it represents the raw rule name, for example "minLength[5]" that has been passed to the validator.
   */
  rawRuleName?: string;

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

  /***
   * The name of the field associated with the error.
   * This property is used to identify the field in the form or data structure.
   * It is typically used to provide more context for the error message.
   */
  fieldName?: string;

  /***
   * Alias for fieldName
   * The name of the property associated with the error.
   * This property is the property that is being validated.
   * It is used to identify the property in the form or data structure.
   * It is typically used to provide more context for the error message.
   */
  propertyName?: string;

  /***
   * The translated value of the propertyName
   * This property is the property that is being validated.
   * This property is populated by the translateTarget method.
   * It is used to provide a clearer error message for the property.
   */
  translatedPropertyName?: string;
}

/**
 * ## Validation Result Types (Either Pattern)
 *
 * Uses the Either<L, R> pattern where Left represents failure and Right represents success.
 * This provides strong type safety and prevents accessing wrong properties based on the result state.
 */

// Base error interface for validation failures
export interface IValidatorValidationError {
  /** Always 'error' for failures */
  status: "error";

  name: "ValidatorValidationError";

  /** The property name that failed validation (required) */
  fieldName?: string;

  /** Alias for fieldName (required) */
  propertyName?: string;

  /** The validation error message (required) */
  message: string;

  /** Localized field name for user-facing messages */
  translatedPropertyName?: string;

  /** The specific rule that failed */
  ruleName?: IValidatorRuleName;

  /** Parameters passed to the failing rule */
  ruleParams?: any[];

  /** The value that failed validation */
  value?: any;

  /** Raw rule name with parameters (e.g., "minLength[5]") */
  rawRuleName?: string;

  /** Error code for programmatic handling */
  code?: string;

  /** Error severity level */
  severity?: "error" | "warning" | "info";

  /** When the validation failed */
  timestamp?: Date;

  /** Additional error metadata */
  metadata?: Record<string, any>;
}

// Single value validation (reuse base types directly)
export interface IValidatorValidateSuccess<Context = unknown> extends BaseData {
  /** Discriminant for type narrowing */
  success: true;

  /** When validation completed successfully */
  validatedAt?: Date;

  /** How long validation took (in milliseconds) */
  duration?: number;
}
interface BaseData<Context = unknown> {
  /**
   * The value to use for performing the validation.
   * This is the actual data that will be validated against the specified rules.
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *     rules: { required: true },
   *     value: "some input",
   * };
   * ```
   */
  value: any;

  /**
   * Optional data for context
   * This property is used to provide additional context for the validation rule.
   * It can be used to pass any additional data that might be needed for validation,
   * such as form data or other relevant information.
   */
  data?: Record<string, any>;

  context?: Context;
}
export interface IValidatorValidateFailure<Context = unknown>
  extends BaseData<Context> {
  /** Discriminant for type narrowing */
  success: false;

  /** The validation error details */
  error: IValidatorValidationError;

  /** When validation failed */
  failedAt?: Date;

  /** How long validation took before failing (in milliseconds) */
  duration?: number;
}

export type IValidatorValidateResult<Context = unknown> =
  | IValidatorValidateSuccess<Context>
  | IValidatorValidateFailure<Context>;

/**
 * ## Validate Target Result Types
 *
 * Types for class-based validation using decorators.
 * Supports accumulation of multiple field errors.
 */

// Target validation failure result (specialized for multiple field errors)
export interface IValidatorValidateTargetFailure<
  T = unknown,
  Context = unknown,
> {
  /** Discriminant - always false for failures */
  success: false;

  /** Summary message for all failures */
  message: string;

  /** Array of validation errors for each failed field */
  errors: IValidatorValidationError[];

  /** Number of fields that failed validation */
  failureCount: number;

  /** Always "error" for failures */
  status: "error";

  /** When validation failed */
  failedAt?: Date;

  /** How long validation took before failing (in milliseconds) */
  duration?: number;

  context?: Context;
}

// Main Either type for class target validation results
export type IValidatorValidateTargetResult<T = unknown, E = unknown> =
  | Omit<IValidatorValidateSuccess<T>, "value">
  | Omit<IValidatorValidateTargetFailure<E>, "value">;
