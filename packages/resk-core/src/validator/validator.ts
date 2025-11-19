import { createPropertyDecorator, getDecoratedProperties } from "@/resources/decorators";
import { IClassConstructor, IDict, IMakeOptional } from "@/types";
import { defaultStr, isEmpty, isNonNullString, isObj, stringify } from "@utils/index";
import { I18n, i18n as defaultI18n } from "../i18n";
import { IValidatorRule, IValidatorRuleFunction, IValidatorRuleName, IValidatorRules, IValidatorRulesMap, IValidatorSanitizedRuleObject, IValidatorSanitizedRules, IValidatorValidateFailure, IValidatorValidateOptions, IValidatorValidateResult, IValidatorValidateSuccess, IValidatorValidateTargetResult, IValidatorValidationError } from "./types";

// Enhanced metadata keys with consistent naming convention
const VALIDATOR_TARGET_RULES_METADATA_KEY = Symbol("validatorTargetRules");
const VALIDATOR_TARGET_OPTIONS_METADATA_KEY = Symbol("validatorTargetOptions");

function createTargetFailureResult(
  message: string,
  errors: IValidatorValidationError[],
  startTime: number
): {
  success: false;
  message: string;
  errors: IValidatorValidationError[];
  failureCount: number;
  status: "error";
  failedAt: Date;
  duration: number;
} {
  return {
    success: false,
    message,
    errors,
    failureCount: errors.length,
    status: "error",
    failedAt: new Date(),
    duration: Date.now() - startTime,
  };
}

/**
 * # Validator Class
 *
 * A comprehensive validation system that provides flexible and powerful validation capabilities
 * for TypeScript/JavaScript applications. This class supports both synchronous and asynchronous
 * validation, decorator-based validation for classes, and a rich ecosystem of validation rules.
 *
 * ## Key Features
 * - **Type-Safe Validation**: Full TypeScript support with generic types
 * - **Decorator Support**: Class property validation using decorators
 * - **Async Validation**: Support for asynchronous validation rules
 * - **Internationalization**: Built-in i18n support for error messages
 * - **Extensible**: Easy to register custom validation rules
 * - **Rule Composition**: Combine multiple validation rules
 *
 * ## Basic Usage
 * ```typescript
 * // Register a custom validation rule
 * Validator.registerRule('CustomRule', ({ value }) => {
 *   return value > 10 || 'Value must be greater than 10';
 * });
 *
 * // Validate a single value
 * const result = await Validator.validate({
 *   value: 15,
 *   rules: ['Required', 'CustomRule']
 * });
 *
 * // Use with decorators
 * class User {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   @IsRequired
 *   @MinLength([3])
 *   name: string;
 * }
 *
 * const userData = { email: 'user@example.com', name: 'John' };
 * const validated = await Validator.validateTarget(User, userData);
 * ```
 *
 * ## Advanced Usage
 * ```typescript
 * // Complex validation with context
 * const validationOptions = {
 *   value: userData,
 *   rules: [
 *     'required',
 *     { minLength: [5] },
 *     async ({ value, context }) => {
 *       const exists = await checkIfUserExists(value);
 *       return !exists || 'User already exists';
 *     }
 *   ],
 *   context: { userId: 123 }
 * };
 *
 * try {
 *   const result = await Validator.validate(validationOptions);
 *   console.log('Validation passed!', result);
 * } catch (error) {
 *   console.error('Validation failed:', error.message);
 * }
 * ```
 *
 * @author Resk Framework Team
 * @since 1.0.0
 * @version 2.1.0
 * @see {@link https://docs.resk.dev/validation | Validation Documentation}
 * @public
 */
export class Validator {
  /**
   * ## Metadata Storage Key
   *
   * Private symbol used to store validation rules in metadata. This ensures
   * that the validation rules don't conflict with other metadata keys.
   *
   * @private
   * @readonly
   * @since 1.0.0
   */
  private static readonly RULES_METADATA_KEY = Symbol("validationRules");

  /**
   * ## Register Validation Rule
   *
   * Registers a new custom validation rule that can be used throughout the application.
   * This method provides type-safe registration of validation functions with proper
   * error handling and validation of input parameters.
   *
   * ### Type Parameters
   * - `ParamType` - Array type defining the parameters the rule function accepts
   * - `Context` - Type of the validation context object passed to the rule
   *
   * ### Rule Function Signature
   * ```typescript
   * type RuleFunction<ParamType, Context> = (options: {
   *   value: any;
   *   ruleParams: ParamType;
   *   context?: Context;
   *   fieldName?: string;
   *   translatedPropertyName?: string;
   * }) => boolean | string | Promise<boolean | string>;
   * ```
   *
   * ### Rule Return Values
   * - `true` - Validation passed
   * - `false` - Validation failed (uses default error message)
   * - `string` - Validation failed with custom error message
   * - `Promise<boolean|string>` - Async validation
   *
   * @example
   * ```typescript
   * // Simple synchronous rule
   * Validator.registerRule('MinValue', ({ value, ruleParams }) => {
   *   const [minValue] = ruleParams;
   *   return value >= minValue || `Value must be at least ${minValue}`;
   * });
   *
   * // Async rule with database check
   * Validator.registerRule('UniqueEmail', async ({ value, context }) => {
   *   const exists = await database.user.findByEmail(value);
   *   return !exists || 'Email address is already taken';
   * });
   *
   * // Rule with multiple parameters
   * Validator.registerRule('Between', ({ value, ruleParams }) => {
   *   const [min, max] = ruleParams;
   *   return (value >= min && value <= max) ||
   *          `Value must be between ${min} and ${max}`;
   * });
   *
   * // Rule with context
   * Validator.registerRule('DifferentFrom', ({ value, ruleParams, context }) => {
   *   const [fieldName] = ruleParams;
   *   const otherValue = context?.data?.[fieldName];
   *   return value !== otherValue ||
   *          `Must be different from ${fieldName}`;
   * });
   * ```
   *
   * @template ParamType - Array type for rule parameters
   * @template Context - Type for validation context
   *
   * @param ruleName - Unique identifier for the validation rule (must be non-empty string)
   * @param ruleHandler - Function that performs the validation logic
   *
   * @throws {Error} When ruleName is not a non-empty string
   * @throws {Error} When ruleHandler is not a function
   *
   * @since 1.0.0
   * @see {@link findRegisteredRule} - Find a registered rule
   * @see {@link getRules} - Get all registered rules
   * @public
   */
  static registerRule<ParamType extends Array<any> = Array<any>, Context = unknown>(ruleName: IValidatorRuleName, ruleHandler: IValidatorRuleFunction<ParamType, Context>): void {
    if (!isNonNullString(ruleName)) {
      throw new Error("Rule name must be a non-empty string");
    }

    if (typeof ruleHandler !== "function") {
      throw new Error("Rule handler must be a function");
    }

    const existingRules = Validator.getRules();
    const updatedRules = { ...existingRules, [ruleName]: ruleHandler };
    Reflect.defineMetadata(Validator.RULES_METADATA_KEY, updatedRules, Validator);
  }

  /**
   * ## Get All Registered Rules
   *
   * Retrieves an immutable copy of all currently registered validation rules.
   * This method returns a shallow copy to prevent external modification of
   * the internal rules registry while allowing inspection of available rules.
   *
   * ### Use Cases
   * - Debugging: Check what rules are available
   * - Rule Discovery: List all registered rules for documentation
   * - Testing: Verify rule registration in unit tests
   * - Introspection: Build dynamic validation UIs
   *
   * @example
   * ```typescript
   * // Get all registered rules
   * const allRules = Validator.getRules();
   * console.log('Available rules:', Object.keys(allRules));
   *
   * // Check if a specific rule exists
   * const hasEmailRule = 'Email' in Validator.getRules();
   *
   * // Get rule function directly (not recommended, use findRegisteredRule instead)
   * const emailRule = Validator.getRules()['Email'];
   * ```
   *
   * @returns An immutable copy of all registered validation rules
   *
   * @since 1.0.0
   * @see {@link registerRule} - Register a new rule
   * @see {@link findRegisteredRule} - Find a specific rule
   * @public
   */
  static getRules(): IValidatorRulesMap {
    const rules = Reflect.getMetadata(Validator.RULES_METADATA_KEY, Validator);
    return isObj(rules) ? { ...rules } : ({} as IValidatorRulesMap);
  }

  private static getI18n(options?: { i18n?: I18n }): I18n {
    const { i18n } = Object.assign({}, options);
    if (i18n instanceof I18n) {
      return i18n;
    }
    if (i18n && typeof (i18n as any)?.getLocale === "function" && typeof (i18n as any)?.translate === "function" && typeof (i18n as any)?.translateTarget === "function") {
      console.log("returning i18n found ", (i18n as any).getLocale(), " is locale getted");
      return i18n as I18n;
    }
    return defaultI18n;
  }

  /**
   * ## Get Error Message Separators
   *
   * Retrieves the configured separators used for formatting validation error messages.
   * These separators are internationalized and can be customized through the i18n system.
   * This method provides a centralized way to get consistent error message formatting.
   *
   * ### Separator Types
   * - `multiple` - Used when joining multiple error messages
   * - `single` - Used for single error message formatting
   *
   * ### Internationalization
   * The separators are loaded from the i18n translation system under the key
   * `validator.separators`. This allows different languages to use appropriate
   * punctuation and formatting conventions.
   *
   * @param customI18n - Optional custom I18n instance to use for translations
   * @example
   * ```typescript
   * // Get current separators
   * const separators = Validator.getErrorMessageSeparators();
   * console.log(separators); // { multiple: ", ", single: ", " }
   *
   * // Use separators for custom error formatting
   * const errors = ['Field is required', 'Must be an email', 'Too short'];
   * const errorMessage = errors.join(separators.multiple);
   * console.log(errorMessage); // "Field is required, Must be an email, Too short"
   *
   * // Custom error message builder
   * function buildErrorMessage(fieldName: string, errors: string[]) {
   *   const seps = Validator.getErrorMessageSeparators();
   *   return `${fieldName}: ${errors.join(seps.multiple)}`;
   * }
   * ```
   *
   * @returns Object containing separator strings for error message formatting
   * @returns returns.multiple - Separator for joining multiple error messages
   * @returns returns.single - Separator for single error message formatting
   *
   * @since 1.0.0
   * @see {@link validate} - Uses these separators for error formatting
   * @see {@link validateTarget} - Also uses these separators
   * @public
   */
  static getErrorMessageSeparators(customI18n?: I18n): {
    multiple: string;
    single: string;
  } {
    const i18n = this.getI18n({ i18n: customI18n });
    const translatedSeparator: IDict = Object.assign({}, i18n.getNestedTranslation("validator.separators")) as IDict;
    return {
      multiple: defaultStr(translatedSeparator.multiple, ", "),
      single: defaultStr(translatedSeparator.single, ", "),
    };
  }

  /**
   * ## Find Registered Rule
   *
   * Locates and returns a specific validation rule by its name. This method provides
   * type-safe access to registered validation rules with proper error handling for
   * invalid rule names. Returns undefined if the rule doesn't exist.
   *
   * ### Type Safety
   * This method is fully type-safe and will return the correctly typed rule function
   * based on the generic parameters provided. The rule function signature will match
   * the expected parameter and context types.
   *
   * @example
   * ```typescript
   * // Find a simple rule
   * const emailRule = Validator.findRegisteredRule('Email');
   * if (emailRule) {
   *   const result = await emailRule({
   *     value: 'test@example.com',
   *     ruleParams: []
   *   });
   * }
   *
   * // Find a rule with specific parameter types
   * const minLengthRule = Validator.findRegisteredRule<[number]>('MinLength');
   * if (minLengthRule) {
   *   const result = await minLengthRule({
   *     value: 'hello',
   *     ruleParams: [5]
   *   });
   * }
   *
   * // Find a rule with context
   * interface UserContext {
   *   userId: number;
   *   permissions: string[];
   * }
   *
   * const permissionRule = Validator.findRegisteredRule<string[], UserContext>('HasPermission');
   * if (permissionRule) {
   *   const result = await permissionRule({
   *     value: 'admin',
   *     ruleParams: ['admin', 'moderator'],
   *     context: { userId: 123, permissions: ['user', 'admin'] }
   *   });
   * }
   *
   * // Safe rule checking
   * const unknownRule = Validator.findRegisteredRule('NonExistentRule');
   * console.log(unknownRule); // undefined
   * ```
   *
   * @template ParamType - Array type specifying the rule parameter types
   * @template Context - Type of the validation context object
   *
   * @param ruleName - The name of the rule to find
   *
   * @returns The validation rule function if found, undefined otherwise
   *
   * @since 1.0.0
   * @see {@link registerRule} - Register a new rule
   * @see {@link getRules} - Get all rules
   * @public
   */
  static findRegisteredRule<ParamType extends Array<any> = Array<any>, Context = unknown>(ruleName: IValidatorRuleName): IValidatorRuleFunction<ParamType, Context> | undefined {
    if (!isNonNullString(ruleName)) return undefined;
    const rules = Validator.getRules();
    return rules[ruleName] as IValidatorRuleFunction<ParamType, Context> | undefined;
  }

  /**
   * ## Parse and Validate Rules
   *
   * Converts various input rule formats into a standardized, executable format while
   * identifying and reporting any invalid rules. This method handles the complex task
   * of normalizing different rule input formats into a consistent internal representation.
   *
   * ### Supported Input Formats
   *
   * #### 1. Function Rules
   * ```typescript
   * const functionRule = ({ value }) => value > 0 || 'Must be positive';
   * ```
   *
   * #### 2. String Rules
   * ```typescript
   * 'Required'                    // Simple rule
   * 'MinLength[5]'               // Rule with single parameter
   * 'Between[10,20]'             // Rule with multiple parameters
   * ```
   *
   * #### 3. Object Rules
   * ```typescript
   * { Required: [] }              // Rule without parameters
   * { MinLength: [5] }           // Rule with parameters
   * { Between: [10, 20] }        // Rule with multiple parameters
   * ```
   *
   * ### Processing Logic
   * 1. **Function Detection**: Direct function rules are passed through unchanged
   * 2. **String Parsing**: Extracts rule names and parameters from bracketed syntax
   * 3. **Object Processing**: Converts object notation to standardized format
   * 4. **Validation**: Verifies that all referenced rules are registered
   * 5. **Error Tracking**: Collects invalid rules for reporting
   *
   * @example
   * ```typescript
   * // Mixed rule formats
   * const mixedRules = [
   *   'Required',
   *   'MinLength[3]',
   *   { MaxLength: [50] },
   *   ({ value }) => value.includes('@') || 'Must contain @',
   *   'InvalidRule'  // This will be reported as invalid
   * ];
   *
   * const { sanitizedRules, invalidRules } = Validator.parseAndValidateRules(mixedRules);
   *
   * console.log('Valid rules:', sanitizedRules.length);        // 4
   * console.log('Invalid rules:', invalidRules);               // ['InvalidRule']
   *
   * // Empty or undefined input
   * const { sanitizedRules: empty } = Validator.parseAndValidateRules();
   * console.log(empty.length); // 0
   *
   * // Complex rule with parameters
   * const complexRules = [
   *   'Between[1,100]',
   *   { CustomRule: ['param1', 'param2'] }
   * ];
   *
   * const result = Validator.parseAndValidateRules(complexRules);
   * // Each sanitized rule will have: ruleName, params, ruleFunction, rawRuleName
   * ```
   *
   * @param inputRules - Array of validation rules in various formats, or undefined
   *
   * @returns Object containing processed results
   * @returns returns.sanitizedRules - Array of standardized, executable rule objects
   * @returns returns.invalidRules - Array of rules that couldn't be processed (unregistered)
   *
   * @since 1.22.0
   * @see {@link parseStringRule} - Internal string rule parser
   * @see {@link parseObjectRules} - Internal object rule parser
   * @see {@link validate} - Uses this method for rule processing
   * @public
   */
  static parseAndValidateRules<Context = unknown>(
    inputRules?: IValidatorValidateOptions<Array<any>, Context>["rules"]
  ): {
    sanitizedRules: IValidatorSanitizedRules<Context>;
    invalidRules: IValidatorRules<Context>[];
  } {
    const parsedRules: IValidatorSanitizedRules<Context> = [];
    const registeredRules = this.getRules();
    const invalidRules: IValidatorRules<Context>[] = [];

    const rulesToProcess = Array.isArray(inputRules) ? inputRules : [];

    for (const rule of rulesToProcess) {
      if (typeof rule === "function") {
        parsedRules.push(rule as IValidatorRuleFunction<Array<any>, Context>);
      } else if (isNonNullString(rule)) {
        const parsedRule = this.parseStringRule(rule, registeredRules);
        if (parsedRule) {
          parsedRules.push(parsedRule);
        } else {
          invalidRules.push(rule as any);
        }
      } else if (isObj(rule) && typeof rule === "object") {
        const parsedObjectRules = this.parseObjectRules(rule, registeredRules);
        parsedRules.push(...parsedObjectRules.valid);
        invalidRules.push(...parsedObjectRules.invalid);
      }
    }

    return { sanitizedRules: parsedRules, invalidRules };
  }

  /**
   * ## Parse String-Based Validation Rules
   *
   * Internal helper method that parses string-format validation rules into standardized
   * rule objects. Handles both simple rule names and rules with parameters using
   * bracket notation syntax.
   *
   * ### Supported String Formats
   * - `"ruleName"` - Simple rule without parameters
   * - `"ruleName[param]"` - Rule with single parameter
   * - `"ruleName[param1,param2,param3]"` - Rule with multiple parameters
   *
   * ### Parameter Parsing
   * - Parameters are extracted from content within square brackets
   * - Multiple parameters are separated by commas
   * - Leading/trailing whitespace is automatically trimmed
   * - All parameters are treated as strings (conversion happens in rule functions)
   *
   * @example
   * ```typescript
   * // These calls demonstrate the parsing logic (internal method)
   * // Simple rule
   * parseStringRule("Required", registeredRules)
   * // Returns: { ruleName: "Required", params: [], ruleFunction: fn, rawRuleName: "Required" }
   *
   * // Rule with single parameter
   * parseStringRule("MinLength[5]", registeredRules)
   * // Returns: { ruleName: "MinLength", params: ["5"], ruleFunction: fn, rawRuleName: "MinLength[5]" }
   *
   * // Rule with multiple parameters
   * parseStringRule("Between[10, 20]", registeredRules)
   * // Returns: { ruleName: "Between", params: ["10", "20"], ruleFunction: fn, rawRuleName: "Between[10, 20]" }
   * ```
   *
   * @internal
   * @param ruleString - The string representation of the rule to parse
   * @param registeredRules - Map of all currently registered validation rules
   *
   * @returns Parsed rule object with standardized structure, or null if rule not found
   * @returns returns.ruleName - The extracted rule name
   * @returns returns.params - Array of string parameters
   * @returns returns.ruleFunction - The actual validation function
   * @returns returns.rawRuleName - The original unparsed rule string
   *
   * @since 1.22.0
   * @see {@link parseAndValidateRules} - Public method that uses this parser
   * @private
   */
  private static parseStringRule(ruleString: string, registeredRules: IValidatorRulesMap): any {
    let ruleName = String(ruleString).trim();
    const ruleParameters: string[] = [];

    if (ruleName.indexOf("[") > -1) {
      const ruleParts = ruleName.rtrim("]").split("[");
      ruleName = ruleParts[0].trim();
      const parameterString = String(ruleParts[1]);
      const parameterSegments = parameterString.split(",");

      for (let index = 0; index < parameterSegments.length; index++) {
        ruleParameters.push(parameterSegments[index].replace("]", "").trim());
      }
    }

    const ruleFunction = registeredRules[ruleName as IValidatorRuleName];
    if (typeof ruleFunction === "function") {
      return {
        ruleName: ruleName as IValidatorRuleName,
        params: ruleParameters,
        ruleFunction: ruleFunction as IValidatorRuleFunction,
        rawRuleName: String(ruleString),
      };
    }

    return null;
  }

  /**
   * ## Parse Object-Based Validation Rules
   *
   * Internal helper method that processes object-format validation rules into standardized
   * rule objects. This method handles the conversion of key-value pair rules where the
   * key is the rule name and the value contains the parameters.
   *
   * @template Context - Type of the validation context object
   * ### Object Format Structure
   * ```typescript
   * {
   *   ruleName: parameters,           // parameters can be array or single value
   *   anotherRule: [param1, param2], // array of parameters
   *   simpleRule: []                  // no parameters
   * }
   * ```
   *
   * ### Processing Logic
   * 1. **Iteration**: Loops through each property in the rules object
   * 2. **Validation**: Checks if the rule name corresponds to a registered rule
   * 3. **Parameter Handling**: Ensures parameters are in array format
   * 4. **Categorization**: Separates valid rules from invalid ones
   * 5. **Standardization**: Converts to consistent internal format
   *
   * @example
   * ```typescript
   * // Object rules input
   * const objectRules = {
   *   Required: [],
   *   MinLength: [5],
   *   Between: [10, 20],
   *   CustomRule: 'singleParam',
   *   InvalidRule: []  // Will be marked as invalid if not registered
   * };
   *
   * const result = parseObjectRules(objectRules, registeredRules);
   * // result.valid contains standardized rule objects
   * // result.invalid contains ['InvalidRule'] if not registered
   * ```
   *
   * @internal
   * @param rulesObject - Object containing rule names as keys and parameters as values
   * @param registeredRules - Map of all currently registered validation rules
   *
   * @returns Object containing categorized rule processing results
   * @returns returns.valid - Array of successfully parsed and validated rule objects
   * @returns returns.invalid - Array of rule names that couldn't be processed
   *
   * @since 1.22.0
   * @see {@link parseAndValidateRules} - Public method that uses this parser
   * @private
   */
  private static parseObjectRules<Context = unknown>(
    rulesObject: Record<IValidatorRuleName, any>,
    registeredRules: IValidatorRulesMap<Context>
  ): {
    valid: any[];
    invalid: IValidatorRules<Context>[];
  } {
    const validRules: IValidatorSanitizedRuleObject<Array<any>, Context>[] = [];
    const invalidRules: IValidatorRules<Context>[] = [];

    for (const propertyKey in rulesObject) {
      if (Object.hasOwnProperty.call(rulesObject, propertyKey)) {
        const ruleParameters = rulesObject[propertyKey as IValidatorRuleName];
        const ruleFunction = registeredRules[propertyKey as IValidatorRuleName] as IValidatorRuleFunction;

        if (typeof ruleFunction === "function") {
          validRules.push({
            ruleName: propertyKey as IValidatorRuleName,
            params: Array.isArray(ruleParameters) ? ruleParameters : [],
            ruleFunction: ruleFunction,
            rawRuleName: String(propertyKey),
          });
        } else {
          invalidRules.push(propertyKey as any);
        }
      }
    }

    return { valid: validRules, invalid: invalidRules };
  }

  /**
   * ## Validate a Single Value
   *
   * Performs validation on a single value using a set of specified validation rules.
   * This is the main validation method for validating individual values outside of
   * class-based validation contexts.
   *
   * ### Key Features
   * - **Synchronous Rule Support**: Handles both synchronous and asynchronous validation rules
   * - **Multiple Rules**: Supports validation with multiple rules applied sequentially
   * - **Error Handling**: Never throws errors; returns a result object with success/failure status
   * - **Type Safe**: Full TypeScript support with generic typing for context
   * - **Nullable Handling**: Supports Empty, Nullable, and Optional rules for conditional validation
   * - **Performance**: Tracks validation duration and timestamps
   *
   * ### Return Type: IValidatorValidateResult
   * The method returns a discriminated union that can be narrowed:
   * ```typescript
   * type IValidatorValidateResult<Context> =
   *   | IValidatorValidateSuccess<Context>  // success: true
   *   | IValidatorValidateFailure<Context>  // success: false
   * ```
   *
   * #### Success Result (success: true)
   * - `success`: true
   * - `value`: The original value that was validated
   * - `validatedAt`: ISO timestamp when validation completed
   * - `duration`: Milliseconds elapsed during validation
   * - `data`: Optional context data passed to rules
   * - `context`: Optional validation context of type Context
   *
   * #### Failure Result (success: false)
   * - `success`: false
   * - `value`: The original value that failed validation
   * - `error`: IValidatorValidationError containing:
   *   - `message`: Error message (translated if i18n available)
   *   - `ruleName`: Name of the rule that failed
   *   - `ruleParams`: Parameters passed to the rule
   *   - `fieldName`: Optionally provided field identifier
   * - `failedAt`: ISO timestamp when validation failed
   * - `duration`: Milliseconds elapsed before failure
   *
   * ### Nullable Rules
   * Special handling for conditional validation rules:
   * - **Empty**: Skips validation if value is empty string ""
   * - **Nullable**: Skips validation if value is null or undefined
   * - **Optional**: Skips validation if value is undefined only
   *
   * Priority order: Empty > Nullable > Optional
   *
   * ### Examples
   *
   * #### Basic Single Rule Validation
   * ```typescript
   * const result = await Validator.validate({
   *   value: "user@example.com",
   *   rules: ["Required", "Email"],
   * });
   *
   * if (result.success) {
   *   console.log("Email is valid:", result.value);
   * } else {
   *   console.error("Validation failed:", result.error.message);
   * }
   * ```
   *
   * #### Validation with Parameters
   * ```typescript
   * const result = await Validator.validate({
   *   value: "hello",
   *   rules: [
   *     "Required",
   *     "MinLength[5]",  // Validates length >= 5
   *     "MaxLength[20]", // Validates length <= 20
   *   ],
   * });
   * ```
   *
   * #### Custom Error Messages with i18n
   * ```typescript
   * const result = await Validator.validate({
   *   value: "",
   *   rules: ["Required"],
   *   fieldName: "email",  // For context in error messages
   * });
   *
   * if (!result.success) {
   *   // Error message can include field name if i18n is configured
   *   console.error(result.error.message);
   * }
   * ```
   *
   * #### Async Rule with Context
   * ```typescript
   * interface MyContext {
   *   userId: number;
   *   permissions: string[];
   * }
   *
   * const result = await Validator.validate<MyContext>({
   *   value: "admin_action",
   *   rules: ["Required", "UniqueAction"],
   *   context: {
   *     userId: 123,
   *     permissions: ["admin"],
   *   },
   * });
   * ```
   *
   * #### Nullable Rule Examples
   * ```typescript
   * // Null is valid with Nullable rule
   * const result1 = await Validator.validate({
   *   value: null,
   *   rules: ["Nullable", "Required"],
   * });
   * // result1.success === true (skips Required check)
   *
   * // Empty string is valid with Empty rule
   * const result2 = await Validator.validate({
   *   value: "",
   *   rules: ["Empty", "Email"],
   * });
   * // result2.success === true (skips Email check)
   *
   * // Undefined is valid with Optional rule
   * const result3 = await Validator.validate({
   *   value: undefined,
   *   rules: ["Optional", "MinLength[5]"],
   * });
   * // result3.success === true (skips MinLength check)
   * ```
   *
   * #### Type Guards for Result Narrowing
   * ```typescript
   * const result = await Validator.validate({
   *   value: "test",
   *   rules: ["Required"],
   * });
   *
   * // Using type guards
   * if (Validator.isSuccess(result)) {
   *   // TypeScript knows result.success === true
   *   console.log("Valid value:", result.value);
   * } else if (Validator.isFailure(result)) {
   *   // TypeScript knows result.success === false
   *   console.error("Error:", result.error.message);
   * }
   * ```
   *
   * @template Context - Optional type for the validation context object
   *
   * @param options - Validation options (IMakeOptional<
    IValidatorValidateOptions<Array<any>, Context>,
    "i18n"
  >)
   * @param options.value - The value to validate (required)
   * @param options.rules - Array of validation rules to apply
   * @param options.context - Optional context object passed to rule functions
   * @param options.data - Optional data object for rule context
   * @param options.fieldName - Optional field identifier for error messages
   * @param options.propertyName - Optional property identifier for error messages
   * @param options.translatedPropertyName - Optional translated property name
   * @param options.message - Optional custom error message prefix
   *
   * @returns Promise resolving to IValidatorValidateResult<Context>
   *          - Success: object with success=true, value, validatedAt, duration
   *          - Failure: object with success=false, error, failedAt, duration
   *
   * @throws {Never} This method never throws. All errors are returned in the result object.
   *
   * @since 1.0.0
   * @see {@link validateTarget} - For class-based validation using decorators
   * @see {@link registerRule} - To register custom validation rules
   * @see {@link IValidatorValidateResult} - Result type documentation
   * @see {@link IValidatorValidationError} - Error details type
   *
   * @public
   * @async
   */
  static async validate<Context = unknown>({ rules, ...extra }: IMakeOptional<IValidatorValidateOptions<Array<any>, Context>, "i18n">): Promise<IValidatorValidateResult<Context>> {
    const i18n = this.getI18n(extra);
    const startTime = Date.now();
    const { sanitizedRules, invalidRules } = Validator.parseAndValidateRules<Context>(rules);
    const separators = Validator.getErrorMessageSeparators(i18n);
    const { value, context, data } = extra;
    const successOrErrorData = {
      context,
      value,
      data,
    };
    // Handle invalid rules - return failure result instead of rejecting
    if (invalidRules.length) {
      const message = invalidRules
        .map((rule) =>
          i18n.t("validator.invalidRule", {
            rule: isNonNullString(rule) ? rule : "unnamed rule",
          })
        )
        .join(separators.multiple);
      const error = createValidationError(message, {
        value,
        fieldName: extra.fieldName,
        propertyName: extra.propertyName,
        ruleParams: [],
      });
      return createFailureResult<Context>(error, successOrErrorData, startTime);
    }

    // No rules to validate - return success
    if (!sanitizedRules.length) {
      return createSuccessResult<Context>(successOrErrorData, startTime);
    }

    // Check for nullable rules - if value meets nullable conditions, skip validation
    let skipValidation = false;
    if (isEmpty(value)) {
      const nullableConditions = {
        Empty: (value: any) => value === "",
        Nullable: (value: any) => value === null || value === undefined,
        Optional: (value: any) => value === undefined,
      };
      for (const rule of sanitizedRules) {
        if (typeof rule === "function") continue;
        if (typeof rule === "object" && rule.ruleName) {
          const ruleName = rule.ruleName;
          if (ruleName in nullableConditions && nullableConditions[ruleName as keyof typeof nullableConditions](value)) {
            skipValidation = true;
            break;
          }
        }
      }
    }
    if (skipValidation) {
      // Value meets nullable conditions - validation succeeds
      return createSuccessResult<Context>(successOrErrorData, startTime);
    }

    extra.fieldName = extra.propertyName = defaultStr(extra.fieldName, extra.propertyName);
    const i18nRulesOptions = {
      ...extra,
      value,
      rules,
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        let index = -1;
        const rulesLength = sanitizedRules.length;
        const next = async function (): Promise<any> {
          index++;
          if (index >= rulesLength) {
            return resolve(createSuccessResult(successOrErrorData, startTime));
          }
          const rule = sanitizedRules[index];
          let ruleName = undefined;
          let rawRuleName: IValidatorRuleName | string | undefined = undefined;
          let ruleParams: any[] = [];
          let ruleFunc: IValidatorRuleFunction<Array<any>, Context> | undefined = typeof rule === "function" ? rule : undefined;
          if (typeof rule === "object" && isObj(rule)) {
            ruleFunc = rule.ruleFunction;
            ruleParams = Array.isArray(rule.params) ? rule.params : [];
            ruleName = rule.ruleName;
            rawRuleName = rule.rawRuleName;
          }

          const i18nRuleOptions = {
            ...i18nRulesOptions,
            rule: defaultStr(ruleName),
            ruleName,
            rawRuleName,
            ruleParams,
          };

          const handleResult = (result: any) => {
            result = typeof result === "string" ? (isNonNullString(result) ? result : i18n.t("validator.invalidMessage", i18nRuleOptions)) : result;
            if (result === false) {
              const error = createValidationError(i18n.t("validator.invalidMessage", i18nRuleOptions), {
                value,
                ruleName,
                rawRuleName,
                ruleParams,
                fieldName: extra.fieldName,
                propertyName: extra.propertyName,
                translatedPropertyName: extra.translatedPropertyName,
              });
              return resolve(createFailureResult(error, successOrErrorData, startTime));
            } else if (isNonNullString(result)) {
              const error = createValidationError(result, {
                value,
                ruleName,
                rawRuleName,
                ruleParams,
                fieldName: extra.fieldName,
                propertyName: extra.propertyName,
                translatedPropertyName: extra.translatedPropertyName,
              });
              return resolve(createFailureResult(error, successOrErrorData, startTime));
            } else if ((result as any) instanceof Error) {
              const error = createValidationError(stringify(result), {
                value,
                ruleName,
                rawRuleName,
                ruleParams,
                fieldName: extra.fieldName,
                propertyName: extra.propertyName,
                translatedPropertyName: extra.translatedPropertyName,
              });
              return resolve(createFailureResult(error, successOrErrorData, startTime));
            }
            return next();
          };

          if (typeof ruleFunc !== "function") {
            const error = createValidationError(i18n.t("validator.invalidRule", i18nRuleOptions), {
              value,
              ruleName,
              rawRuleName,
              ruleParams,
              fieldName: extra.fieldName,
              propertyName: extra.propertyName,
              translatedPropertyName: extra.translatedPropertyName,
            });
            return resolve(createFailureResult(error, successOrErrorData, startTime));
          }

          try {
            const result = await ruleFunc({
              ...extra,
              ruleName,
              rawRuleName,
              rules,
              ruleParams,
              value,
              i18n,
            } as any);
            return handleResult(result);
          } catch (e) {
            return handleResult(typeof e === "string" ? e : (e as any)?.message || e?.toString() || stringify(e));
          }
        };
        return next();
      }, 0);
    });
  }
  static isSuccess<Context = unknown>(result: IValidatorValidateResult<Context>): result is IValidatorValidateSuccess<Context> {
    return isObj(result) && result.success === true;
  }

  static isFailure<Context = unknown>(result: any): result is IValidatorValidateFailure<Context> {
    return isObj(result) && result.success === false && isObj(result.error) && result.error.name == "ValidatorValidationError";
  }

  /**
   * ## Validate Target - Class-Based Validation
   *
   * Performs validation on all decorated properties of a class instance using decorator-based rules.
   * This method supports complex, multi-field validation with field-level error accumulation.
   *
   * ### Key Features
   * - **Decorator Support**: Uses @IsEmail, @IsRequired, @MinLength, etc. decorators
   * - **Multi-Field Validation**: Validates all decorated properties in parallel
   * - **Error Accumulation**: Collects all field validation errors into a single result
   * - **Field Mapping**: Maps validated data back to original structure with proper types
   * - **Internationalization**: Supports translated property names and error messages
   * - **Custom Error Formatting**: Allows custom error message builders per field
   * - **Async Rules**: Supports both sync and async validation rules for each field
   * - **Type Safe**: Full TypeScript support with generic typing for class instances
   *
   * ### Return Type: IValidatorValidateTargetResult
   * Returns a discriminated union that can be narrowed:
   * ```typescript
   * type IValidatorValidateTargetResult<T> =
   *   | IValidatorValidateTargetSuccess<T>  // success: true
   *   | IValidatorValidateTargetFailure<T>  // success: false
   * ```
   *
   * #### Success Result (success: true)
   * - `success`: true
   * - `data`: Validated object data matching the class structure
   * - `value`: undefined for target validation
   * - `validatedAt`: ISO timestamp when validation completed
   * - `duration`: Milliseconds elapsed during validation
   * - `status`: "success"
   * - `context`: Optional validation context of type Context
   *
   * #### Failure Result (success: false)
   * - `success`: false
   * - `data`: undefined for target failures
   * - `errors`: Array of IValidatorValidationError objects, one per failed field
   * - `failureCount`: Number of fields that failed validation
   * - `message`: Summary message (e.g., "Validation failed for 3 fields")
   * - `failedAt`: ISO timestamp when validation failed
   * - `duration`: Milliseconds elapsed before failure
   * - `status`: "error"
   *
   * ### Supported Decorators
   * - `@IsRequired` / `@IsNullable` / `@IsEmpty` / `@IsOptional` - Conditional rules
   * - `@IsEmail` / `@IsUrl` / `@IsPhoneNumber()` - Format validators
   * - `@MinLength[n]` / `@MaxLength[n]` - Length validators
   * - `@IsNumber` / `@IsNonNullString` - Type validators
   * - `@ Length[n]` - Exact length validator
   * - Custom decorators created with `Validator.createPropertyDecorator()`
   *
   * ### Nullable Rule Behavior
   * - **@IsEmpty**: Skips remaining rules if value is empty string ""
   * - **@IsNullable**: Skips remaining rules if value is null or undefined
   * - **@IsOptional**: Skips remaining rules if value is undefined only
   * - **Skip if Absent**: @IsOptional fields can be omitted from data entirely
   *
   * ### Examples
   *
   * #### Basic Class Validation
   * ```typescript
   * class UserForm {
   *   @IsRequired
   *   @IsEmail
   *   email: string;
   *
   *   @IsRequired
   *   @MinLength([3])
   *   @MaxLength([50])
   *   name: string;
   *
   *   @IsNullable
   *   @IsNumber
   *   age?: number;
   * }
   *
   * const result = await Validator.validateTarget(UserForm, {
   *   email: "user@example.com",
   *   name: "John Doe",
   *   age: null,
   * });
   *
   * if (result.success) {
   *   console.log("Form is valid:", result.data);
   * } else {
   *   result.errors.forEach(error => {
   *     console.error(`${error.propertyName}: ${error.message}`);
   *   });
   * }
   * ```
   *
   * #### Complex Multi-Field Validation
   * ```typescript
   * class ProductForm {
   *   @IsRequired
   *   @MinLength([3])
   *   title: string;
   *
   *   @IsRequired
   *   @IsNumber
   *   @NumberGreaterThan([0])
   *   price: number;
   *
   *   @IsEmpty // Product description can be empty
   *   @MaxLength([1000])
   *   description?: string;
   *
   *   @IsOptional // Can be omitted entirely
   *   @IsUrl
   *   imageUrl?: string;
   * }
   *
   * const result = await Validator.validateTarget(ProductForm, {
   *   title: "Awesome Product",
   *   price: 29.99,
   *   description: "",
   *   // imageUrl omitted (valid with @IsOptional)
   * });
   * ```
   *
   * #### Custom Error Message Building
   * ```typescript
   * const result = await Validator.validateTarget(UserForm, data, {
   *   errorMessageBuilder: (translatedPropertyName, error, options) => {
   *     // Custom format: "Field Name (validation rule): error message"
   *     return `${translatedPropertyName} (${options.ruleName}): ${error}`;
   *   }
   * });
   * ```
   *
   * #### Validation with Context
   * ```typescript
   * interface AuthContext {
   *   userId: number;
   *   isAdmin: boolean;
   * }
   *
   * class AdminAction {
   *   @IsRequired
   *   action: string;
   *
   *   @IsRequired
   *   targetId: number;
   * }
   *
   * const result = await Validator.validateTarget<typeof AdminAction, AuthContext>(
   *   AdminAction,
   *   { action: "delete", targetId: 123 },
   *   { context: { userId: 1, isAdmin: true } }
   * );
   * ```
   *
   * #### Error Handling
   * ```typescript
   * const result = await Validator.validateTarget(UserForm, userData);
   *
   * if (!result.success) {
   *   // Access failure details
   *   console.log(`${result.failureCount} fields failed validation`);
   *   console.log(result.message); // "Validation failed for 2 fields"
   *
   *   result.errors.forEach(error => {
   *     console.error({
   *       field: error.propertyName,
   *       message: error.message,
   *       rule: error.ruleName,
   *       value: error.value,
   *     });
   *   });
   * }
   * ```
   *
   * #### Type Guards
   * ```typescript
   * const result = await Validator.validateTarget(UserForm, data);
   *
   * if (result.success) {
   *   // result.data is properly typed
   *   const validatedUser: Partial<UserForm> = result.data;
   * } else {
   *   // result.errors is available
   *   const errorCount = result.errors.length;
   * }
   * ```
   *
   * @template T - Class constructor type (extends IClassConstructor)
   * @template Context - Optional type for validation context passed to rules
   *
   * @param target - Class constructor decorated with validation decorators (e.g., UserForm)
   * @param data - Object containing property values to validate (can be partial)
   * @param options - Optional validation options
   * @param options.context - Optional context object passed to all validation rules
   * @param options.errorMessageBuilder - Optional custom error message formatter function
   *
   * @returns Promise resolving to IValidatorValidateTargetResult<T>
   *          - Success: object with success=true, data (validated object), validatedAt, duration
   *          - Failure: object with success=false, errors (array), failureCount, message, failedAt, duration
   *
   * @throws {Never} This method never throws. All errors are returned in the result object.
   *
   * @remarks
   * - Validation is performed in parallel for all fields using Promise.all()
   * - Fields decorated with @IsOptional can be omitted from input data
   * - Nullable/Empty rules prevent other rules from executing for that field
   * - Property names are translated using i18n if available
   * - Errors include field-specific information for precise error reporting
   *
   * @since 1.0.0
   * @see {@link validate} - For single-value validation
   * @see {@link createPropertyDecorator} - To create custom validation decorators
   * @see {@link registerRule} - To register custom validation rules
   * @see {@link IValidatorValidateTargetResult} - Result type documentation
   * @see {@link IValidatorValidationError} - Error details type
   *
   * @public
   * @async
   */
  static async validateTarget<T extends IClassConstructor = any, Context = unknown>(
    target: T,
    data: Partial<Record<keyof InstanceType<T>, any>>,
    options?: {
      context?: Context;
      i18n?: I18n;
      errorMessageBuilder?: (
        translatedPropertyName: string,
        error: string,
        builderOptions: IValidatorValidationError & {
          propertyName: keyof InstanceType<T> | string;
          translatedPropertyName: string;
          i18n: I18n;
          separators: {
            multiple: string;
            single: string;
          };
          data: Partial<Record<keyof InstanceType<T>, any>>;
        }
      ) => string;
    }
  ): Promise<IValidatorValidateTargetResult<Context>> {
    const startTime = Date.now();
    const targetRules = Validator.getTargetRules<T>(target);
    const { context, errorMessageBuilder, ...restOptions } = Object.assign({}, Validator.getValidateTargetOptions(target), options);
    data = Object.assign({}, data);
    const i18n = this.getI18n(options);
    const messageSeparators = Validator.getErrorMessageSeparators(i18n);
    const buildErrorMessage = typeof errorMessageBuilder === "function" ? errorMessageBuilder : (translatedPropertyName: string, error: string) => `[${String(translatedPropertyName)}] : ${error}`;

    const validationErrors: IValidatorValidationError[] = [];
    const validationPromises: Promise<IValidatorValidateResult<Context>>[] = [];
    let validatedFieldCount = 0;

    const translatedPropertyNames = i18n.translateTarget(target, { data });
    for (const propertyKey in targetRules) {
      const rules = targetRules[propertyKey];
      // Skip validation for Optional fields that are not present in data
      if (rules.includes("Optional") && !(propertyKey in data)) {
        continue;
      }
      const value = data[propertyKey];
      if ((value === "" || value === undefined || value === null) && ((rules.includes("Nullable") && (value === null || value === undefined)) || (rules.includes("Empty") && value === ""))) {
        // Skip validation for Nullable fields with null/undefined value
        continue;
      }
      const translatedPropertyName: string = defaultStr((translatedPropertyNames as any)[propertyKey], propertyKey);
      validationPromises.push(
        Validator.validate<Context>({
          context,
          ...restOptions,
          i18n,
          value,
          data,
          translatedPropertyName,
          fieldName: propertyKey,
          propertyName: propertyKey,
          rules: targetRules[propertyKey],
        }).then((validationResult) => {
          if (validationResult.success) {
            validatedFieldCount++;
          } else {
            const errorMessage = stringify(validationResult.error?.message);
            const formattedMessage = buildErrorMessage(translatedPropertyName, errorMessage, {
              ...Object.assign({}, validationResult.error),
              separators: messageSeparators,
              data,
              propertyName: propertyKey,
              translatedPropertyName: translatedPropertyName,
              i18n,
            });
            validationErrors.push({
              name: "ValidatorValidationError",
              status: "error" as const,
              fieldName: propertyKey,
              value: validationResult.value,
              propertyName: propertyKey,
              message: formattedMessage,
              ruleName: validationResult.error?.ruleName,
              ruleParams: validationResult.error?.ruleParams,
              rawRuleName: validationResult.error?.rawRuleName,
            });
          }
          return validationResult;
        })
      );
    }

    return new Promise<IValidatorValidateTargetResult<Context>>((resolve) => {
      return Promise.all(validationPromises).then(() => {
        const isValidationSuccessful = !validationErrors.length;

        if (isValidationSuccessful) {
          resolve(
            createSuccessResult<Context>(
              {
                data,
                value: undefined,
                context,
              },
              startTime
            ) as any
          );
        } else {
          const message = i18n.translate("validator.failedForNFields", {
            count: validationErrors.length,
          });
          resolve(createTargetFailureResult(message, validationErrors, startTime));
        }
      });
    });
  }

  /**
   * ## Extract Validation Rules from Class
   *
   * Retrieves all validation rules that have been applied to a class through property
   * decorators. This method introspects the class metadata to extract the complete
   * validation schema defined by decorators.
   *
   * ### Metadata Introspection
   * This method uses reflection to access metadata that was stored when validation
   * decorators were applied to class properties. It provides a programmatic way to
   * inspect the validation schema of any decorated class.
   *
   * ### Use Cases
   * - **Schema Inspection**: Understand what validation rules apply to a class
   * - **Dynamic Validation**: Build validation logic based on class structure
   * - **Documentation**: Generate validation documentation from code
   * - **Testing**: Verify that proper decorators are applied
   *
   * @example
   * ```typescript
   * class User {
   *   @IsRequired
   *   @IsEmail
   *   email: string;
   *
   *   @IsRequired
   *   @MinLength([3])
   *   @MaxLength([50])
   *   name: string;
   *
   *   @IsOptional
   *   @IsNumber
   *   age?: number;
   * }
   *
   * // Extract validation rules
   * const rules = Validator.getTargetRules(User);
   * console.log(rules);
   * // Output:
   * // {
   * //   email: ['required', 'email'],
   * //   name: ['required', 'minLength', 'maxLength'],
   * //   age: ['number']  // IsOptional doesn't add a rule
   * // }
   *
   * // Check if a property has specific rules
   * const emailRules = rules.email;
   * const hasEmailValidation = emailRules.includes('email');
   *
   * // Programmatic rule inspection
   * function analyzeClass(targetClass: any) {
   *   const rules = Validator.getTargetRules(targetClass);
   *   const analysis = {
   *     totalProperties: Object.keys(rules).length,
   *     requiredProperties: [],
   *     optionalProperties: []
   *   };
   *
   *   for (const [property, propertyRules] of Object.entries(rules)) {
   *     if (propertyRules.includes('required')) {
   *       analysis.requiredProperties.push(property);
   *     } else {
   *       analysis.optionalProperties.push(property);
   *     }
   *   }
   *
   *   return analysis;
   * }
   * ```
   *
   * @template T - The class constructor type to extract rules from
   *
   * @param target - Class constructor with validation decorators
   *
   * @returns Record mapping property names to their validation rules
   *
   * @since 1.0.0
   * @see {@link validateTarget} - Uses this method to get validation rules
   * @see {@link createPropertyDecorator} - How rules are attached to properties
   * @public
   */
  static getTargetRules<T extends IClassConstructor = any>(target: T): Record<keyof InstanceType<T>, IValidatorRule[]> {
    return getDecoratedProperties(target, VALIDATOR_TARGET_RULES_METADATA_KEY) as Record<keyof InstanceType<T>, IValidatorRule[]>;
  }

  /**
   * ## Get Target Validation Options
   *
   * Retrieves validation options that have been configured for a specific class
   * through the `@ValidationTargetOptions` decorator. These options control how
   * validation behaves when `validateTarget` is called on the class.
   *
   * ### Configuration Options
   * Options can include custom error message builders, validation contexts,
   * and other class-level validation behaviors that should be applied consistently
   * whenever the class is validated.
   *
   * @example
   * ```typescript
   * // Class with custom validation options
   * @ValidationTargetOptions({
   *   errorMessageBuilder: (translatedName, error) => {
   *     return `❌ ${translatedName}: ${error}`;
   *   }
   * })
   * class CustomUser {
   *   @IsRequired
   *   @IsEmail
   *   email: string;
   * }
   *
   * // Get the configured options
   * const options = Validator.getValidateTargetOptions(CustomUser);
   * console.log(typeof options.errorMessageBuilder); // 'function'
   *
   * // These options will be automatically used when validating
   * const result = await Validator.validateTarget(CustomUser, userData);
   * // Error messages will use the custom format
   * ```
   *
   * @template T - The class constructor type to get options for
   *
   * @param target - Class constructor that may have validation options
   *
   * @returns Validation options object, or empty object if none configured
   *
   * @since 1.0.0
   * @see {@link validateTarget} - Uses these options during validation
   * @see {@link ValidationTargetOptions} - Decorator to set these options
   * @public
   */
  public static getValidateTargetOptions<T extends IClassConstructor>(target: T): Parameters<typeof Validator.validateTarget>[2] {
    return Object.assign({}, Reflect.getMetadata(VALIDATOR_TARGET_OPTIONS_METADATA_KEY, target) || {});
  }

  /**
   * ## Create Rule Decorator Factory
   *
   * Creates a decorator factory that can be used to apply validation rules to class
   * properties. This method provides a way to create reusable decorators from
   * validation rule functions with enhanced type safety and parameter handling.
   *
   * ### Decorator Factory Pattern
   * The returned function is a decorator factory that accepts parameters and returns
   * a property decorator. This allows for flexible rule configuration while maintaining
   * type safety and proper parameter validation.
   *
   * ### Parameter Handling
   * Parameters passed to the decorator factory are automatically forwarded to the
   * validation rule function during validation. This enables parameterized validation
   * rules that can be configured at decoration time.
   *
   * @example
   * ```typescript
   * // Create a custom validation rule
   * const validateAge = ({ value, ruleParams }) => {
   *   const [minAge, maxAge] = ruleParams;
   *   if (value < minAge) return `Must be at least ${minAge} years old`;
   *   if (value > maxAge) return `Must be no more than ${maxAge} years old`;
   *   return true;
   * };
   *
   * // Create a decorator factory
   * const AgeRange = Validator.buildRuleDecorator(validateAge);
   *
   * // Use the decorator
   * class Person {
   *   @IsRequired
   *   name: string;
   *
   *   @IsRequired
   *   @IsNumber
   *   @AgeRange([18, 120])  // Min 18, Max 120
   *   age: number;
   * }
   *
   * // Create specialized decorators
   * const IsAdult = AgeRange([18, 150]);
   * const IsChild = AgeRange([0, 17]);
   *
   * class User {
   *   @IsAdult
   *   userAge: number;
   * }
   *
   * class Student {
   *   @IsChild
   *   studentAge: number;
   * }
   * ```
   *
   * ### Advanced Usage with Context
   * ```typescript
   * // Context-aware validation rule
   * const validatePermission = ({ value, ruleParams, context }) => {
   *   const [requiredPermission] = ruleParams;
   *   const userPermissions = context?.permissions || [];
   *   return userPermissions.includes(requiredPermission) ||
   *          `Requires ${requiredPermission} permission`;
   * };
   *
   * const RequiresPermission = Validator.buildRuleDecorator(validatePermission);
   *
   * class AdminAction {
   *   @RequiresPermission(['admin'])
   *   action: string;
   *
   *   @RequiresPermission(['delete', 'modify'])
   *   destructiveAction: string;
   * }
   * ```
   *
   * ### Async Rule Decorators
   * ```typescript
   * // Async validation rule
   * const validateUniqueEmail = async ({ value, context }) => {
   *   const exists = await database.user.findByEmail(value);
   *   return !exists || 'Email is already registered';
   * };
   *
   * const IsUniqueEmail = Validator.buildRuleDecorator(validateUniqueEmail);
   *
   * class Registration {
   *   @IsRequired
   *   @IsEmail
   *   @IsUniqueEmail([])
   *   email: string;
   * }
   * ```
   *
   * @template RuleParamsType - Array type defining parameter structure for the rule
   * @template Context - Type of the validation context object
   *
   * @param ruleFunction - Validation function that will be wrapped in a decorator
   *
   * @returns Decorator factory function that accepts parameters and returns a property decorator
   *
   * @since 1.22.0
   * @see {@link createPropertyDecorator} - Lower-level decorator creation
   * @see {@link registerRule} - Alternative way to create reusable rules
   * @public
   */
  static buildRuleDecorator<RuleParamsType extends Array<any> = Array<any>, Context = unknown>(ruleFunction: IValidatorRuleFunction<RuleParamsType, Context>) {
    return function (ruleParameters: RuleParamsType) {
      const enhancedValidatorFunction: IValidatorRuleFunction<RuleParamsType, Context> = function (validationOptions) {
        const enhancedOptions: IValidatorValidateOptions<RuleParamsType> = Object.assign({}, validationOptions);
        enhancedOptions.ruleParams = (Array.isArray(ruleParameters) ? ruleParameters : [ruleParameters]) as RuleParamsType;
        return ruleFunction(enhancedOptions as any);
      };
      return Validator.createPropertyDecorator<RuleParamsType, Context>(enhancedValidatorFunction);
    };
  }
  /**
   * ## Build Optional-Parameter Rule Decorator
   *
   * Same as {@link buildRuleDecorator}, but the factory parameter is **optional**.
   * Call it with `undefined`, `[]`, or no argument at all and the underlying rule
   * will receive an empty parameter array, letting you write:
   *
   * ```ts
   * @IsRequired        // no params
   * @MinLength([5])    // with params
   * @PhoneNumber()          // optional-params version
   * @IsPhoneNumber(["US"]) // with params
   * ```
   *
   * @param ruleFunction  The validation rule to wrap
   * @returns A decorator factory that can be invoked **with or without** parameters
   *
   * @since 1.34.1
   * @see {@link buildRuleDecorator}
   * @public
   */
  static buildRuleDecoratorOptional<RuleParamsType extends Array<any> = Array<any>, Context = unknown>(ruleFunction: IValidatorRuleFunction<RuleParamsType, Context>) {
    return function (ruleParameters?: RuleParamsType) {
      return Validator.buildRuleDecorator<RuleParamsType, Context>(ruleFunction)(ruleParameters as RuleParamsType);
    };
  }

  /**
   * ## Create Property Decorator
   *
   * Low-level method for creating property decorators that attach validation rules
   * to class properties. This method handles the metadata storage and provides
   * the foundation for all validation decorators in the system.
   *
   * ### Metadata Storage
   * This method uses TypeScript's metadata system to attach validation rules to
   * class properties. The rules are stored in a way that allows them to be
   * retrieved later during validation.
   *
   * ### Rule Accumulation
   * Multiple decorators can be applied to the same property, and this method
   * ensures that all rules are properly accumulated and stored together.
   *
   * @example
   * ```typescript
   * // Create a simple validation decorator
   * const IsPositive = Validator.createPropertyDecorator(
   *   ({ value }) => value > 0 || 'Must be positive'
   * );
   *
   * // Create a decorator with multiple rules
   * const IsValidEmail = Validator.createPropertyDecorator([
   *   'required',
   *   'email'
   * ]);
   *
   * // Use the decorators
   * class Product {
   *   @IsPositive
   *   price: number;
   *
   *   @IsValidEmail
   *   contactEmail: string;
   * }
   * ```
   *
   * @template RuleParamsType - Array type for rule parameters
   * @template Context - Type of the validation context object
   *
   * @param rule - Single rule or array of rules to attach to the property
   *
   * @returns Property decorator function that can be applied to class properties
   *
   * @since 1.0.0
   * @see {@link buildRuleDecorator} - Higher-level decorator creation
   * @internal
   */
  static createPropertyDecorator<RuleParamsType extends Array<any> = Array<any>, Context = unknown>(rule: IValidatorRule<RuleParamsType, Context> | IValidatorRule<RuleParamsType, Context>[]): PropertyDecorator {
    return createPropertyDecorator<IValidatorRule<RuleParamsType, Context>[]>(VALIDATOR_TARGET_RULES_METADATA_KEY, (oldRules) => {
      return [...(Array.isArray(oldRules) ? oldRules : []), ...(Array.isArray(rule) ? rule : [rule])];
    });
  }
}

/**
 * ## ValidationTargetOptions Class Decorator
 *
 * Class decorator that configures validation behavior for a target class.
 * This decorator allows you to set class-level validation options that will
 * be automatically applied whenever `validateTarget` is called on the class.
 *
 * ### Configuration Options
 * - **errorMessageBuilder**: Custom function to format validation error messages
 * - **context**: Default validation context for all validations
 * - **stopOnFirstError**: Whether to stop validation at first error (future feature)
 * - **locale**: Specific locale for error messages (future feature)
 *
 * ### Use Cases
 * - **Consistent Error Formatting**: Apply uniform error message styling across a class
 * - **Context Injection**: Provide default context for validation rules
 * - **Custom Validation Behavior**: Override default validation behavior per class
 *
 * @example
 * ```typescript
 * // Basic usage with custom error formatting
 * @ValidationTargetOptions({
 *   errorMessageBuilder: (fieldName, error) => {
 *     return `🚫 ${fieldName.toUpperCase()}: ${error}`;
 * // {
 * //   email: ['Required', 'Email'],
 * //   name: ['Required', 'MinLength', 'MaxLength'],
 * //   age: ['Number']  // IsOptional doesn't add a rule
 * // }
 *
 * // Check if a property has specific rules
 * const emailRules = rules.email;
 * const hasEmailValidation = emailRules.includes('Email');
 *   name: string;
 * }
 *
 * // When validation fails, errors will be formatted as:
 * // "🚫 EMAIL: Invalid email format"
 * // "🚫 NAME: Must be at least 3 characters"
 *
 * // Advanced usage with context and detailed formatting
 * @ValidationTargetOptions({
 *   errorMessageBuilder: (translatedName, error, builderOptions) => {
 *     const { propertyName, ruleName, separators } = builderOptions;
 *
 *     // Custom formatting based on rule type
 *     if (ruleName === 'required') {
 *       return `❗ ${translatedName} is mandatory`;
 *     }
 *
 *     if (ruleName === 'email') {
 *       return `📧 Please enter a valid email for ${translatedName}`;
 *     }
 *
 *     return `⚠️ ${translatedName}: ${error}`;
 *   }
 * })
 * class DetailedUser {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   @IsRequired
 *   name: string;
 * }
 * ```
 *
 * ### Context-Aware Validation
 * ```typescript
 * interface UserValidationContext {
 *   isAdmin: boolean;
 *   permissions: string[];
 *   organizationId: string;
 * }
 *
 * @ValidationTargetOptions({
 *   errorMessageBuilder: (fieldName, error, { context }) => {
 *     const userContext = context as UserValidationContext;
 *     if (userContext?.isAdmin) {
 *       return `[ADMIN] ${fieldName}: ${error}`;
 *     }
 *     return `${fieldName}: ${error}`;
 *   }
 * })
 * class AdminUser {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   @CustomRule([
 *     ({ value, context }) => {
 *       const { isAdmin, permissions } = context as UserValidationContext;
 *       return isAdmin && permissions.includes('manage-users') ||
 *              'Admin privileges required';
 *     }
 *   ])
 *   adminAction: string;
 * }
 * ```
 *
 * ### Internationalization Support
 * ```typescript
 * @ValidationTargetOptions({
 *   errorMessageBuilder: (translatedName, error, { data }) => {
 *     // Use translated property names and localized error formatting
 *     const locale = data.preferredLocale || 'en';
 *
 *     switch (locale) {
 *       case 'fr':
 *         return `❌ ${translatedName} : ${error}`;
 *       case 'es':
 *         return `❌ ${translatedName}: ${error}`;
 *       default:
 *         return `❌ ${translatedName}: ${error}`;
 *     }
 *   }
 * })
 * class InternationalUser {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   preferredLocale?: string;
 * }
 * ```
 *
 * @param validationOptions - Configuration object for validation behavior
 * @param validationOptions.errorMessageBuilder - Custom error message formatting function
 *
 * @returns Class decorator function that applies the validation configuration
 *
 * @since 1.22.0
 * @see {@link validateTarget} - Method that uses these options
 * @see {@link getValidateTargetOptions} - Retrieves configured options
 * @decorator
 * @public
 */
export function ValidationTargetOptions(validationOptions: Parameters<typeof Validator.validateTarget>[2]): ClassDecorator {
  return function (targetClass: Function) {
    Reflect.defineMetadata(VALIDATOR_TARGET_OPTIONS_METADATA_KEY, validationOptions, targetClass);
  };
}

function createValidationError(
  message: string,
  params: {
    value?: any;
    fieldName?: string;
    propertyName?: string;
    translatedPropertyName?: string;
    ruleName?: IValidatorRuleName;
    rawRuleName?: IValidatorRuleName | string;
    ruleParams: any[];
  }
): IValidatorValidationError {
  return {
    name: "ValidatorValidationError",
    message,
    status: "error",
    value: params.value,
    fieldName: params.fieldName ?? "",
    propertyName: params.propertyName ?? "",
    translatedPropertyName: params.translatedPropertyName,
    ruleName: params.ruleName,
    rawRuleName: params.rawRuleName,
    ruleParams: params.ruleParams,
  };
}

function createSuccessResult<Context = unknown>(
  options: {
    context?: Context;
    value: any;
    data?: Record<string, any>;
  },
  startTime: number
): IValidatorValidateSuccess<Context> {
  return {
    ...options,
    success: true,
    validatedAt: new Date(),
    duration: Date.now() - startTime,
  };
}
/**
 * ## Helper: Create Failure Result
 * Reduces duplication in failure result creation across methods
 * @private
 */
function createFailureResult<Context = unknown>(
  error: IValidatorValidationError,
  options: {
    context?: Context;
    value: any;
  },
  startTime: number
): IValidatorValidateFailure<Context> {
  return {
    ...options,
    error,
    success: false,
    failedAt: new Date(),
    duration: Date.now() - startTime,
  };
}
