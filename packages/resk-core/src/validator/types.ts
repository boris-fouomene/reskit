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
 * ## Validation Options for Single-Value Validation
 *
 * Configuration object passed to {@link Validator.validate} to specify how a single value
 * should be validated. Includes rules, parameters, context, and metadata.
 *
 * ### Overview
 * The `IValidatorValidateOptions` interface encapsulates all the parameters needed to perform
 * validation on a single value. It combines rule specifications, validation parameters, context,
 * error handling, and field identification.
 *
 * ### Key Properties
 * - **rules**: Array of validation rules to apply
 * - **value**: The value being validated (from BaseData)
 * - **context**: Optional validation context
 * - **message**: Custom error message override
 * - **fieldName/propertyName**: Field identification
 * - **ruleParams**: Parameters passed to the rule function
 *
 * ### Usage Example
 * ```typescript
 * const options: IValidatorValidateOptions = {
 *   value: "user@example.com",
 *   rules: [
 *     { ruleName: "Required" },
 *     { ruleName: "Email" }
 *   ],
 *   fieldName: "email_input",
 *   propertyName: "email",
 *   message: "Please enter a valid email address",
 *   context: { userId: 123 }
 * };
 *
 * const result = await Validator.validate(options);
 * ```
 *
 * ### With Rule Parameters
 * ```typescript
 * const options: IValidatorValidateOptions = {
 *   value: "test123",
 *   rules: [
 *     { ruleName: "MinLength", params: [6] }
 *   ],
 *   ruleParams: [6],
 *   propertyName: "password"
 * };
 *
 * const result = await Validator.validate(options);
 * ```
 *
 * ### Context Usage
 * ```typescript
 * interface ValidationContext {
 *   userId: number;
 *   userRole: string;
 * }
 *
 * const options: IValidatorValidateOptions<any, ValidationContext> = {
 *   value: someValue,
 *   rules: ["Required"],
 *   context: {
 *     userId: 42,
 *     userRole: "admin"
 *   }
 * };
 * ```
 *
 * @template ParamType - The type of parameters that the validation rule accepts (default: Array<any>)
 * @template Context - The type of the optional validation context
 *
 * @public
 * @since 1.0.0
 * @see {@link Validator.validate} - Method that accepts these options
 * @see {@link IValidatorRule} - Rule interface
 * @see {@link BaseData} - Base properties (value, data, context)
 */
export interface IValidatorValidateOptions<
  ParamType extends Array<any> = Array<any>,
  Context = unknown,
> extends Omit<Partial<IInputFormatterResult>, "value">,
    BaseData<Context> {
  /**
   * The list of validation rules to apply
   *
   * Array of rules that will be executed in sequence against the value.
   * Each rule can have its own parameters and configuration.
   *
   * @type {IValidatorRule[]}
   * @optional
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *   value: "example@test.com",
   *   rules: [
   *     { ruleName: "Required" },
   *     { ruleName: "Email" },
   *     { ruleName: "MaxLength", params: [100] }
   *   ]
   * };
   * ```
   *
   * @see {@link IValidatorRule}
   */
  rules?: IValidatorRule[];

  /**
   * Internal: Sanitized rules after preprocessing
   *
   * This property is used internally by the validator after rules have been
   * parsed and sanitized. Users typically do not need to set this manually.
   *
   * @type {IValidatorSanitizedRules}
   * @internal
   * @optional
   */
  sanitizedRules?: IValidatorSanitizedRules;

  /**
   * The current/primary validation rule being applied
   *
   * Specifies the specific rule to apply. Can be used to override or specify
   * a particular rule from the `rules` array, or to apply a single rule directly.
   *
   * @type {IValidatorRule<ParamType, Context>}
   * @optional
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *   value: "test",
   *   rule: { ruleName: "Required" },
   *   propertyName: "username"
   * };
   * ```
   *
   * @see {@link IValidatorRule}
   */
  rule?: IValidatorRule<ParamType, Context>;

  /**
   * Parameters passed to the validation rule
   *
   * Contains the parameters required by the current rule. For example, for a
   * MinLength rule, this would be `[5]` to require minimum 5 characters.
   * These are typically extracted from raw rule names like "MinLength[5]".
   *
   * @type {ParamType}
   * @optional
   *
   * @example
   * ```typescript
   * // For MinLength rule
   * const options: IValidatorValidateOptions = {
   *   value: "password123",
   *   rule: { ruleName: "MinLength" },
   *   ruleParams: [8],  // Minimum 8 characters
   *   propertyName: "password"
   * };
   *
   * // For NumberBetween rule
   * const options2: IValidatorValidateOptions = {
   *   value: 50,
   *   rule: { ruleName: "NumberBetween" },
   *   ruleParams: [0, 100],  // Between 0 and 100
   *   propertyName: "percentage"
   * };
   * ```
   */
  ruleParams?: ParamType;

  /**
   * The name of the validation rule
   *
   * Identifies which validation rule is being applied. Examples include:
   * "Required", "Email", "MinLength", "MaxLength", "Regex", "Custom", etc.
   *
   * @type {IValidatorRuleName}
   * @optional
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *   value: "user@example.com",
   *   ruleName: "Email",
   *   propertyName: "email"
   * };
   * ```
   *
   * @see {@link IValidatorRuleName}
   */
  ruleName?: IValidatorRuleName;

  /**
   * The raw rule name as originally specified (before parsing)
   *
   * The unparsed rule name including any parameters in brackets.
   * For example, "MinLength[5]" or "NumberGreaterThan[0]" before the name
   * and parameters are extracted into `ruleName` and `ruleParams`.
   *
   * @type {string}
   * @optional
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *   value: "test",
   *   rawRuleName: "MinLength[5]",        // Raw form
   *   ruleName: "MinLength",               // Parsed name
   *   ruleParams: [5],                     // Parsed params
   *   propertyName: "username"
   * };
   * ```
   */
  rawRuleName?: string;

  /**
   * Custom error message for validation failure
   *
   * Allows specifying a custom error message to display when validation fails.
   * If provided, this message will be used instead of the default rule-generated message.
   * Supports i18n translations and dynamic content.
   *
   * @type {string}
   * @optional
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *   value: "invalid-email",
   *   rules: ["Email"],
   *   message: "Please enter a valid email address (e.g., user@example.com)",
   *   propertyName: "email"
   * };
   *
   * // Custom message for specific context
   * const options2: IValidatorValidateOptions = {
   *   value: "short",
   *   rule: { ruleName: "MinLength" },
   *   ruleParams: [8],
   *   message: "Your password must be at least 8 characters for security",
   *   propertyName: "password"
   * };
   * ```
   */
  message?: string;

  /**
   * The form field name/identifier
   *
   * Identifies the field in a form or data structure. Typically used for
   * form attributes like `name="field_name"` or `id="field_id"`.
   * Used to map errors back to UI elements or log error context.
   *
   * @type {string}
   * @optional
   *
   * @example
   * ```typescript
   * const options: IValidatorValidateOptions = {
   *   value: "invalid@",
   *   rules: ["Email"],
   *   fieldName: "email_input",         // HTML form field ID
   *   propertyName: "email",            // JS object property name
   *   message: "Invalid email format"
   * };
   * ```
   */
  fieldName?: string;

  /**
   * The object property name being validated
   *
   * Identifies the property on the object/class being validated.
   * This is typically the actual property name on your data class.
   * Used for error reporting and mapping validation errors back to properties.
   *
   * @type {string}
   * @optional
   *
   * @example
   * ```typescript
   * class UserData {
   *   email: string;
   *   password: string;
   * }
   *
   * const options: IValidatorValidateOptions = {
   *   value: "invalid-email",
   *   rules: ["Email"],
   *   propertyName: "email",  // Maps to UserData.email
   *   fieldName: "email_field", // HTML field identifier
   *   message: "Invalid email"
   * };
   * ```
   */
  propertyName?: string;

  /**
   * The translated/localized property name
   *
   * A user-friendly or localized version of the property name for display in
   * error messages. For example, if `propertyName` is "user_birth_date",
   * `translatedPropertyName` might be "Date of Birth" in English or
   * "Date de Naissance" in French.
   *
   * This property is typically populated by the validator's translation system.
   *
   * @type {string}
   * @optional
   *
   * @example
   * ```typescript
   * // Before translation
   * const options: IValidatorValidateOptions = {
   *   value: "invalid",
   *   rules: ["Required"],
   *   propertyName: "user_phone_number"
   * };
   *
   * // After translation (populated by validator)
   * // options.translatedPropertyName = "Phone Number"
   * // options.message = "[Phone Number]: Must not be empty"
   * ```
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
/**
 * ## Single Value Validation Success Result
 *
 * Represents a successful validation result for a single value.
 * This type is used as the success branch of the {@link IValidatorValidateResult} discriminated union.
 *
 * ### Type Guard
 * Can be narrowed using {@link Validator.isSuccess}:
 * ```typescript
 * if (Validator.isSuccess(result)) {
 *   // TypeScript knows: result satisfies IValidatorValidateSuccess
 *   // Can safely access result.value, result.validatedAt, result.duration
 * }
 * ```
 *
 * ### Properties
 * - **success**: Literal `true` for type discrimination
 * - **value**: The original value that passed validation
 * - **validatedAt**: ISO timestamp indicating when validation completed
 * - **duration**: Duration in milliseconds from validation start to completion
 * - **error**: Explicitly `undefined` for success (aids type narrowing)
 * - **failedAt**: Explicitly `undefined` for success (aids type narrowing)
 * - **data**: Optional context data (inherited from BaseData)
 * - **context**: Optional validation context (inherited from BaseData)
 *
 * ### Example
 * ```typescript
 * const result = await Validator.validate({
 *   value: "user@example.com",
 *   rules: ["Required", "Email"],
 * });
 *
 * if (result.success) {
 *   // result is IValidatorValidateSuccess
 *   console.log("Validated:", result.value);
 *   console.log("Took:", result.duration, "ms");
 *   console.log("Completed at:", result.validatedAt.toISOString());
 * }
 * ```
 *
 * @template Context - Type of the optional validation context
 *
 * @public
 * @since 1.0.0
 * @see {@link IValidatorValidateResult}
 * @see {@link IValidatorValidateFailure}
 * @see {@link Validator.validate}
 * @see {@link Validator.isSuccess}
 */
export interface IValidatorValidateSuccess<Context = unknown>
  extends BaseData<Context> {
  /** Discriminant for type narrowing - always `true` for success */
  success: true;

  /**
   * ISO timestamp indicating when validation completed successfully
   * @example "2024-11-08T10:30:45.123Z"
   */
  validatedAt?: Date;

  /**
   * Duration of validation in milliseconds (from start to completion)
   * @example 15 (milliseconds)
   */
  duration?: number;

  /** Always undefined for success results (type narrowing aid) */
  error?: undefined;

  /** Always undefined for success results (type narrowing aid) */
  failedAt?: undefined;
}
/**
 * ## Base Data Structure
 *
 * Shared data structure for both validation success and failure results.
 * Contains the core properties that exist in all validation outcomes.
 *
 * ### Purpose
 * Provides a common interface for passing data through the validation pipeline
 * and in the result objects. Used by both {@link IValidatorValidateSuccess}
 * and {@link IValidatorValidateFailure}.
 *
 * ### Properties
 * - **value**: The actual value being validated (required)
 * - **data**: Optional contextual data available to validation rules
 * - **context**: Optional typed context object for advanced validations
 *
 * ### Usage in Validation Results
 * ```typescript
 * // In IValidatorValidateSuccess
 * const successResult: IValidatorValidateSuccess = {
 *   success: true,
 *   value: "user@example.com",  // Original validated value
 *   data: { userId: 123 },      // Additional context
 *   context: { ... },           // Typed context object
 *   validatedAt: new Date(),
 *   duration: 5,
 * };
 *
 * // In IValidatorValidateFailure
 * const failureResult: IValidatorValidateFailure = {
 *   success: false,
 *   value: "invalid-email",     // Value that failed
 *   data: { userId: 123 },      // Available during failure too
 *   context: { ... },           // Context from validation request
 *   error: { ... },
 *   failedAt: new Date(),
 *   duration: 2,
 * };
 * ```
 *
 * @template Context - Type parameter for optional typed context object
 *
 * @public
 * @since 1.0.0
 * @see {@link IValidatorValidateOptions} - Options passed to validation
 * @see {@link IValidatorValidateSuccess} - Success result type
 * @see {@link IValidatorValidateFailure} - Failure result type
 */
interface BaseData<Context = unknown> {
  /**
   * The value to use for performing the validation.
   * This is the actual data that will be validated against the specified rules.
   *
   * @type {any}
   *
   * @example
   * ```typescript
   * const result = await Validator.validate({
   *   value: "user@example.com",  // This is the value being validated
   *   rules: ["Required", "Email"],
   * });
   * ```
   *
   * @remarks
   * - This is the core data being validated
   * - Type can be any JavaScript value: string, number, object, array, etc.
   * - Available in both success and failure results
   */
  value: any;

  /**
   * Optional data object providing contextual information for validation rules.
   *
   * This property is used to provide additional context for the validation rule.
   * It can be used to pass any additional data that might be needed for validation,
   * such as form data, related field values, or other contextual information.
   *
   * @type {Record<string, any> | undefined}
   *
   * @example
   * ```typescript
   * const result = await Validator.validate({
   *   value: "test@example.com",
   *   rules: ["Required", "Email"],
   *   data: {
   *     userId: 123,
   *     formId: "user_form",
   *   },
   * });
   * ```
   *
   * @remarks
   * - Optional property (not required)
   * - Passed to validation rule functions via options.data
   * - Useful for multi-field validation scenarios
   * - Commonly used for form data context in validateTarget
   */
  data?: Record<string, any>;

  /**
   * Optional typed context object for validation.
   *
   * Provides a typed context that can be passed to validation rules for
   * advanced validation scenarios requiring external data or permissions.
   *
   * @template Context - Type of the context object
   *
   * @example
   * ```typescript
   * interface UserContext {
   *   userId: number;
   *   permissions: string[];
   *   isAdmin: boolean;
   * }
   *
   * const result = await Validator.validate<UserContext>({
   *   value: "admin_action",
   *   rules: ["Required"],
   *   context: {
   *     userId: 123,
   *     permissions: ["read", "write", "admin"],
   *     isAdmin: true,
   *   },
   * });
   * ```
   *
   * @remarks
   * - Optional property (not required)
   * - Type is defined by the Context generic parameter
   * - Passed to all validation rule functions
   * - Enables context-aware validation rules
   * - Commonly used for permission-based or user-specific validations
   */
  context?: Context;
}
/**
 * ## Single Value Validation Failure Result
 *
 * Represents a failed validation result for a single value.
 * This type is used as the failure branch of the {@link IValidatorValidateResult} discriminated union.
 *
 * ### Type Guard
 * Can be narrowed using {@link Validator.isFailure}:
 * ```typescript
 * if (Validator.isFailure(result)) {
 *   // TypeScript knows: result satisfies IValidatorValidateFailure
 *   // Can safely access result.error, result.failedAt, result.duration
 * }
 * ```
 *
 * ### Properties
 * - **success**: Literal `false` for type discrimination
 * - **error**: Validation error details (name, message, rule info)
 * - **failedAt**: ISO timestamp indicating when validation failed
 * - **duration**: Duration in milliseconds until failure
 * - **validatedAt**: Explicitly `undefined` for failure (aids type narrowing)
 * - **value**: The original value that failed validation
 * - **data**: Optional context data (inherited from BaseData)
 * - **context**: Optional validation context (inherited from BaseData)
 *
 * ### Error Object Structure
 * The `error` property contains:
 * ```typescript
 * {
 *   name: "ValidatorValidationError",
 *   message: "Error message (translated if available)",
 *   ruleName: "Email",              // Name of failing rule
 *   ruleParams: [],                 // Parameters passed to rule
 *   rawRuleName: "Email",           // Original rule specification
 *   fieldName: "email_field",       // Optional field identifier
 *   propertyName: "email",          // Optional property name
 *   translatedPropertyName?: "Email Address", // Translated name
 *   value: "invalid@",              // Value that failed
 * }
 * ```
 *
 * ### Example
 * ```typescript
 * const result = await Validator.validate({
 *   value: "not-an-email",
 *   rules: ["Required", "Email"],
 * });
 *
 * if (!result.success) {
 *   // result is IValidatorValidateFailure
 *   console.error("Validation failed:");
 *   console.error("  Value:", result.value);
 *   console.error("  Error:", result.error.message);
 *   console.error("  Rule:", result.error.ruleName);
 *   console.error("  Failed at:", result.failedAt.toISOString());
 *   console.error("  Duration:", result.duration, "ms");
 * }
 * ```
 *
 * @template Context - Type of the optional validation context
 *
 * @public
 * @since 1.0.0
 * @see {@link IValidatorValidateResult}
 * @see {@link IValidatorValidateSuccess}
 * @see {@link IValidatorValidationError}
 * @see {@link Validator.validate}
 * @see {@link Validator.isFailure}
 */
export interface IValidatorValidateFailure<Context = unknown>
  extends BaseData<Context> {
  /** Discriminant for type narrowing - always `false` for failure */
  success: false;

  /**
   * The validation error details
   *
   * Contains complete information about what validation rule failed
   * and why, including the rule name, parameters, and error message.
   *
   * @type {IValidatorValidationError}
   * @see {@link IValidatorValidationError}
   */
  error: IValidatorValidationError;

  /**
   * ISO timestamp indicating when validation failed
   * @example "2024-11-08T10:30:45.118Z"
   */
  failedAt?: Date;

  /**
   * Duration of validation before failure in milliseconds
   * @example 2 (milliseconds - failed quickly on first rule)
   */
  duration?: number;

  /** Always undefined for failure results (type narrowing aid) */
  validatedAt?: undefined;
}

/**
 * ## Validation Result Type (Discriminated Union)
 *
 * Represents the result of a single-value validation operation.
 * This is a discriminated union that can be narrowed to either success or failure.
 *
 * ### Type Narrowing Strategies
 *
 * #### Approach 1: Check the `success` property
 * ```typescript
 * const result = await Validator.validate({ value: "...", rules: [...] });
 *
 * if (result.success) {
 *   // TypeScript knows: IValidatorValidateSuccess
 *   console.log(result.value);      // ✓ Available
 *   console.log(result.validatedAt); // ✓ Available
 *   console.log(result.error);      // ✗ Type error (undefined for success)
 * } else {
 *   // TypeScript knows: IValidatorValidateFailure
 *   console.log(result.value);      // ✓ Available
 *   console.log(result.error);      // ✓ Available
 *   console.log(result.validatedAt); // ✗ Type error (undefined for failure)
 * }
 * ```
 *
 * #### Approach 2: Use type guard functions
 * ```typescript
 * const result = await Validator.validate({ value: "...", rules: [...] });
 *
 * if (Validator.isSuccess(result)) {
 *   // result is IValidatorValidateSuccess<Context>
 *   console.log(result.value);
 *   console.log(result.validatedAt);
 * } else if (Validator.isFailure(result)) {
 *   // result is IValidatorValidateFailure<Context>
 *   console.log(result.error.message);
 *   console.log(result.error.ruleName);
 * }
 * ```
 *
 * #### Approach 3: Use switch on discriminant
 * ```typescript
 * const result = await Validator.validate({ value: "...", rules: [...] });
 *
 * switch (result.success) {
 *   case true:
 *     console.log("Validated:", result.value);
 *     break;
 *   case false:
 *     console.error("Failed:", result.error.message);
 *     break;
 * }
 * ```
 *
 * ### Union Members
 * - {@link IValidatorValidateSuccess} - When validation passes (success: true)
 * - {@link IValidatorValidateFailure} - When validation fails (success: false)
 *
 * @template Context - Type of the optional validation context
 *
 * @example
 * ```typescript
 * interface MyContext {
 *   userId: number;
 * }
 *
 * const result: IValidatorValidateResult<MyContext> = await Validator.validate({
 *   value: "test@example.com",
 *   rules: ["Required", "Email"],
 *   context: { userId: 123 },
 * });
 * ```
 *
 * @public
 * @since 1.0.0
 * @see {@link IValidatorValidateSuccess} - Success variant
 * @see {@link IValidatorValidateFailure} - Failure variant
 * @see {@link Validator.validate} - Main validation method
 * @see {@link Validator.isSuccess} - Type guard for success
 * @see {@link Validator.isFailure} - Type guard for failure
 */
export type IValidatorValidateResult<Context = unknown> =
  | IValidatorValidateSuccess<Context>
  | IValidatorValidateFailure<Context>;

/**
 * ## Validate Target Result Types
 *
 * Types for class-based validation using decorators.
 * Supports accumulation of multiple field errors across all decorated properties.
 *
 * ### Key Differences from Single-Value Validation
 * - **Multiple Errors**: Collects errors from all fields that fail validation
 * - **Parallel Validation**: All fields are validated concurrently
 * - **Error Aggregation**: Returns array of errors with field-level details
 * - **Class-Based**: Works with decorated class properties rather than single values
 * - **Field Mapping**: Maps validated data back to class structure with proper typing
 */

/**
 * ## Class Validation Failure Result
 *
 * Represents a failed multi-field validation result when using {@link Validator.validateTarget}.
 * Unlike single-value validation, this accumulates errors from all fields that fail.
 *
 * ### Type Guard
 * Can be narrowed by checking the `success` property:
 * ```typescript
 * const result = await Validator.validateTarget(UserForm, data);
 *
 * if (!result.success) {
 *   // result is IValidatorValidateTargetFailure
 *   console.log(result.errors);      // Array of field errors
 *   console.log(result.failureCount); // Number of failed fields
 *   console.log(result.message);     // Summary message
 * }
 * ```
 *
 * ### Properties
 * - **success**: Literal `false` for type discrimination
 * - **errors**: Array of IValidatorValidationError, one per failed field
 * - **failureCount**: Number of fields that failed validation
 * - **message**: Summary message (e.g., "Validation failed for 3 fields")
 * - **status**: Always "error" for consistency
 * - **failedAt**: ISO timestamp of when validation failed
 * - **duration**: Milliseconds elapsed during validation
 * - **data**: Always `undefined` for target failures
 * - **value**: Always `undefined` for target (use `errors` instead)
 * - **context**: Optional validation context provided
 *
 * ### Error Array Structure
 * Each error in the `errors` array contains:
 * ```typescript
 * {
 *   name: "ValidatorValidationError",
 *   status: "error",
 *   fieldName: "email_field",       // Form field identifier
 *   propertyName: "email",          // Class property name
 *   message: "[Email]: Must be valid email",  // Formatted error message
 *   ruleName: "Email",              // Name of failing rule
 *   ruleParams: [],                 // Rule parameters
 *   value: "invalid@",              // Value that failed
 * }
 * ```
 *
 * ### Example
 * ```typescript
 * class UserForm {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   @IsRequired
 *   @MinLength([3])
 *   name: string;
 * }
 *
 * const result = await Validator.validateTarget(UserForm, {
 *   email: "invalid-email",
 *   name: "ab",  // Too short
 * });
 *
 * if (!result.success) {
 *   // result.failureCount === 2
 *   // result.errors.length === 2
 *   result.errors.forEach(error => {
 *     console.error(`${error.propertyName}: ${error.message}`);
 *   });
 * }
 * ```
 *
 * @template T - Type of the data being validated (usually a class instance)
 * @template Context - Type of the optional validation context
 *
 * @public
 * @since 1.0.0
 * @see {@link IValidatorValidateTargetResult}
 * @see {@link IValidatorValidationError}
 * @see {@link Validator.validateTarget}
 */
export interface IValidatorValidateTargetFailure<T = unknown, Context = unknown>
  extends Omit<BaseData<Context>, "value"> {
  /** Discriminant for type narrowing - always `false` for failures */
  success: false;

  /**
   * Summary message describing the failure
   *
   * Typically formatted as "Validation failed for N fields" where N is the number of failures.
   * Can be customized via i18n translations.
   *
   * @type {string}
   * @example "Validation failed for 3 fields"
   */
  message: string;

  /**
   * Array of validation errors for each field that failed
   *
   * Contains one error object per field that failed validation.
   * Each error includes the field name, error message, rule name, and value.
   *
   * @type {IValidatorValidationError[]}
   * @see {@link IValidatorValidationError}
   */
  errors: IValidatorValidationError[];

  /**
   * Number of fields that failed validation
   *
   * Equal to errors.length. Provided for convenience.
   *
   * @type {number}
   * @example 3
   */
  failureCount: number;

  /**
   * Status indicator for this result
   *
   * Always "error" for failures. Provided for consistency with HTTP and API conventions.
   *
   * @type {"error"}
   */
  status: "error";

  /**
   * ISO timestamp of when validation failed
   *
   * Indicates the exact time validation completed with failures.
   *
   * @type {Date | undefined}
   * @example new Date("2024-11-08T10:30:45.523Z")
   */
  failedAt?: Date;

  /**
   * Duration of validation in milliseconds
   *
   * Measures time from validation start until failures were detected.
   * Note: All fields are validated in parallel, so this is not the sum of individual field times.
   *
   * @type {number | undefined}
   * @example 45 (milliseconds)
   */
  duration?: number;

  /** Validation context (if provided) */
  context?: Context;

  /** Always `undefined` for target failures (type narrowing aid) */
  validatedAt?: undefined;
}

/**
 * ## Class Validation Success Result
 *
 * Represents a successful multi-field validation result when using {@link Validator.validateTarget}.
 * All decorated fields passed their respective validation rules.
 *
 * ### Type Guard
 * Can be narrowed by checking the `success` property:
 * ```typescript
 * const result = await Validator.validateTarget(UserForm, data);
 *
 * if (result.success) {
 *   // result is IValidatorValidateTargetSuccess
 *   console.log(result.data);        // Validated instance of T
 *   console.log(result.validatedAt); // Timestamp of validation
 * }
 * ```
 *
 * ### Properties vs Single-Value Success
 * Unlike {@link IValidatorValidateSuccess}, target success uses:
 * - **data**: The validated class instance (not `value`)
 * - **value**: Always `undefined` (type narrowing aid)
 * - **errors**: Always `undefined` (type narrowing aid)
 *
 * ### Data Property
 * The `data` property contains the fully validated class instance with type `T`.
 * This is the instance you pass after decoration is complete.
 *
 * ```typescript
 * class UserForm {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   @IsRequired
 *   @MinLength([3])
 *   name: string;
 * }
 *
 * const result = await Validator.validateTarget(UserForm, {
 *   email: "user@example.com",
 *   name: "John",
 * });
 *
 * if (result.success) {
 *   // result.data is UserForm instance
 *   console.log(result.data.email); // "user@example.com"
 *   console.log(result.data.name);  // "John"
 *
 *   // Timing information
 *   console.log(result.validatedAt); // ISO timestamp
 *   console.log(result.duration);    // Milliseconds (approximately)
 * }
 * ```
 *
 * ### Comparison with Single-Value Success
 * | Aspect | Single-Value | Target |
 * |--------|-------------|--------|
 * | Property | `value` | `data` |
 * | Validates | One value | Multiple fields |
 * | Returns | Original value | Class instance |
 * | Error accumulation | Not applicable | Multiple errors collected |
 * | Use case | Single field | Entire form/object |
 *
 * ### Practical Usage
 * ```typescript
 * const form = new UserForm();
 * form.email = "user@example.com";
 * form.name = "John";
 *
 * const result = await Validator.validateTarget(UserForm, form);
 *
 * if (result.success) {
 *   // Safe to use result.data
 *   await saveUser(result.data);
 *   console.log(`Validation took ${result.duration}ms`);
 * }
 * ```
 *
 * @template T - Type of the validated data (usually a class type)
 * @template Context - Type of the optional validation context
 *
 * @public
 * @since 1.0.0
 * @see {@link IValidatorValidateTargetResult}
 * @see {@link IValidatorValidateSuccess} - Single-value equivalent
 * @see {@link Validator.validateTarget}
 */
export interface IValidatorValidateTargetSuccess<
  T = unknown,
  Context = unknown,
> {
  /** Discriminant for type narrowing - always `true` for success */
  success: true;

  /**
   * The validated data - the class instance with all fields passing validation
   *
   * This is the instance you pass to validateTarget with all decorated fields
   * having passed their validation rules.
   *
   * @type {T}
   */
  data: T;

  /**
   * Status indicator for this result
   *
   * Always "success" for successful validations. Provided for consistency with HTTP
   * and API conventions.
   *
   * @type {"success"}
   */
  status: "success";

  /**
   * ISO timestamp of when validation succeeded
   *
   * Indicates the exact time validation completed successfully.
   *
   * @type {Date | undefined}
   * @example new Date("2024-11-08T10:30:45.123Z")
   */
  validatedAt?: Date;

  /**
   * Duration of validation in milliseconds
   *
   * Measures time from validation start until all fields completed validation.
   * Note: All fields are validated in parallel, so this is not the sum of individual field times.
   *
   * @type {number | undefined}
   * @example 23 (milliseconds)
   */
  duration?: number;

  /** Validation context (if provided) */
  context?: Context;

  /** Always `undefined` for target success (type narrowing aid) */
  value?: undefined;

  /** Always `undefined` for target success (type narrowing aid) */
  errors?: undefined;
}

/**
 * ## Class Validation Result Type (Discriminated Union)
 *
 * Discriminated union type representing the result of a {@link Validator.validateTarget} operation.
 * Can be either {@link IValidatorValidateTargetSuccess} or {@link IValidatorValidateTargetFailure}.
 *
 * ### Type Narrowing Strategies
 *
 * **Strategy 1: Check `success` property**
 * ```typescript
 * const result = await Validator.validateTarget(UserForm, data);
 *
 * if (result.success) {
 *   // result is IValidatorValidateTargetSuccess<T>
 *   console.log(result.data);        // Class instance with all fields valid
 *   console.log(result.validatedAt); // Validation timestamp
 * } else {
 *   // result is IValidatorValidateTargetFailure
 *   console.log(result.errors);      // Array of field-level errors
 *   console.log(result.failureCount); // Number of failed fields
 * }
 * ```
 *
 * **Strategy 2: Use switch statement**
 * ```typescript
 * switch (result.status) {
 *   case "success":
 *     // result is IValidatorValidateTargetSuccess
 *     await saveToDatabase(result.data);
 *     break;
 *   case "error":
 *     // result is IValidatorValidateTargetFailure
 *     logErrors(result.errors);
 *     break;
 * }
 * ```
 *
 * **Strategy 3: Use type guard helper**
 * ```typescript
 * if (Validator.isSuccess(result)) {
 *   // result is IValidatorValidateTargetSuccess
 *   return result.data;
 * }
 * // result is IValidatorValidateTargetFailure
 * throw new Error(result.message);
 * ```
 *
 * ### Comparison with Single-Value Result
 * | Aspect | Single-Value | Target |
 * |--------|-------------|--------|
 * | Success Property | `value` | `data` |
 * | On Failure | Single error | Array of errors |
 * | Type Param | One generic | Two generics (T, Context) |
 * | Use Case | Single field validation | Multiple field validation |
 *
 * ### Real-World Example
 * ```typescript
 * class RegistrationForm {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   @IsRequired
 *   @MinLength([8])
 *   password: string;
 *
 *   @IsRequired
 *   @Equals([{{ value: "password" }}])
 *   confirmPassword: string;
 * }
 *
 * const result = await Validator.validateTarget(RegistrationForm, {
 *   email: "user@example.com",
 *   password: "SecurePass123",
 *   confirmPassword: "SecurePass123",
 * });
 *
 * if (result.success) {
 *   // All validations passed
 *   console.log("Ready to register:", result.data);
 * } else {
 *   // Display field-level errors to user
 *   result.errors.forEach(error => {
 *     console.error(`[${error.propertyName}]: ${error.message}`);
 *   });
 * }
 * ```
 *
 * ### Union Members
 * - {@link IValidatorValidateTargetSuccess} - When all fields pass (success: true)
 * - {@link IValidatorValidateTargetFailure} - When one or more fields fail (success: false)
 *
 * @template T - Type of the validated data/class being validated
 * @template Context - Type of the optional validation context
 *
 * @public
 * @since 1.0.0
 * @see {@link IValidatorValidateTargetSuccess} - Success variant
 * @see {@link IValidatorValidateTargetFailure} - Failure variant
 * @see {@link Validator.validateTarget} - Main target validation method
 * @see {@link Validator.isSuccess} - Type guard for success
 * @see {@link Validator.isFailure} - Type guard for failure
 * @see {@link IValidatorValidateResult} - Single-value equivalent
 */
export type IValidatorValidateTargetResult<T = unknown, Context = unknown> =
  | IValidatorValidateTargetSuccess<T, Context>
  | IValidatorValidateTargetFailure<T, Context>;
