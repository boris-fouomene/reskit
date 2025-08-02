import { IValidatorRule, IValidatorValidateOptions, IValidatorRules, IValidatorRuleName, IValidatorRuleFunction, IValidatorResult, IValidatorSanitizedRules } from "./types";
import { defaultStr, defaultVal, extendObj, isNonNullString, isObj, stringify } from "@utils/index";
import { i18n } from "../i18n";
import { IClassConstructor, IDict } from "@/types";
import { createPropertyDecorator, getDecoratedProperties } from "@/resources/decorators";

// Enhanced metadata keys with consistent naming convention
const VALIDATOR_TARGET_RULES_METADATA_KEY = Symbol("validatorTargetRules");
const VALIDATOR_TARGET_OPTIONS_METADATA_KEY = Symbol("validatorTargetOptions");

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
  static getRules(): IValidatorRules {
    const rules = Reflect.getMetadata(Validator.RULES_METADATA_KEY, Validator);
    return isObj(rules) ? { ...rules } : ({} as IValidatorRules);
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
  static getErrorMessageSeparators(): { multiple: string; single: string } {
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
  static parseAndValidateRules(inputRules?: IValidatorValidateOptions["rules"]): {
    sanitizedRules: IValidatorSanitizedRules;
    invalidRules: IValidatorRule[];
  } {
    const parsedRules: IValidatorSanitizedRules = [];
    const registeredRules = this.getRules();
    const invalidRules: IValidatorRule[] = [];

    const rulesToProcess = Array.isArray(inputRules) ? inputRules : [];

    for (const rule of rulesToProcess) {
      if (typeof rule === "function") {
        parsedRules.push(rule as IValidatorRuleFunction);
      } else if (isNonNullString(rule)) {
        const parsedRule = this.parseStringRule(rule, registeredRules);
        if (parsedRule) {
          parsedRules.push(parsedRule);
        } else {
          invalidRules.push(rule);
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
  private static parseStringRule(ruleString: string, registeredRules: IValidatorRules): any {
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
  private static parseObjectRules(
    rulesObject: Record<IValidatorRuleName, any>,
    registeredRules: IValidatorRules
  ): {
    valid: any[];
    invalid: IValidatorRule[];
  } {
    const validRules: any[] = [];
    const invalidRules: IValidatorRule[] = [];

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
          invalidRules.push(propertyKey as IValidatorRule);
        }
      }
    }

    return { valid: validRules, invalid: invalidRules };
  }

  /**
   * ## Validate Value Against Rules
   *
   * Performs comprehensive validation of a single value against a set of validation rules.
   * This is the core validation method that supports both synchronous and asynchronous
   * validation with detailed error reporting and internationalization support.
   *
   * ### Validation Process
   * 1. **Rule Parsing**: Converts input rules to standardized format
   * 2. **Rule Validation**: Checks that all rules are registered and valid
   * 3. **Sequential Execution**: Runs rules one by one, stopping at first failure
   * 4. **Error Handling**: Provides detailed error information with context
   * 5. **Internationalization**: Supports localized error messages
   *
   * ### Rule Execution Order
   * Rules are executed in the order they appear in the rules array. Validation stops
   * at the first rule that fails, ensuring efficient validation and consistent behavior.
   *
   * ### Error Handling
   * - **Invalid Rules**: Immediately rejects with list of unregistered rules
   * - **Validation Failures**: Rejects with detailed error context
   * - **Rule Exceptions**: Catches and formats rule execution errors
   *
   * @example
   * ```typescript
   * // Basic validation
   * try {
   *   const result = await Validator.validate({
   *     value: 'user@example.com',
   *     rules: ['Required', 'Email'],
   *     fieldName: 'email'
   *   });
   *   console.log('Validation passed!', result);
   * } catch (error) {
   *   console.error('Validation failed:', error.message);
   * }
   *
   * // Complex validation with context
   * const validationOptions = {
   *   value: 'newPassword123',
   *   rules: [
   *     'Required',
   *     'MinLength[8]',
   *     { StrongPassword: [] },
   *     async ({ value, context }) => {
   *       const isUsed = await checkPasswordHistory(value, context.userId);
   *       return !isUsed || 'Password was recently used';
   *     }
   *   ],
   *   fieldName: 'password',
   *   translatedPropertyName: 'Password',
   *   context: { userId: 123 }
   * };
   *
   * try {
   *   await Validator.validate(validationOptions);
   * } catch (error) {
   *   // Error contains: message, status, rule, ruleName, ruleParams, etc.
   *   console.log('Failed rule:', error.ruleName);
   *   console.log('Error message:', error.message);
   * }
   *
   * // Validation with custom parameters
   * const numericValidation = await Validator.validate({
   *   value: 25,
   *   rules: ['Required', 'Number', 'Between[18,65]'],
   *   fieldName: 'age',
   *   propertyName: 'userAge'
   * });
   * ```
   *
   * ### Advanced Usage
   * ```typescript
   * // Custom validation context
   * interface ValidationContext {
   *   currentUser: { id: number; role: string };
   *   formData: Record<string, any>;
   * }
   *
   * const contextValidation = await Validator.validate<ValidationContext>({
   *   value: 'admin-action',
   *   rules: [
   *     'required',
   *     ({ value, context }) => {
   *       return context.currentUser.role === 'admin' || 'Admin access required';
   *     }
   *   ],
   *   context: {
   *     currentUser: { id: 1, role: 'user' },
   *     formData: { action: 'admin-action' }
   *   }
   * });
   * ```
   *
   * @template Context - Type of the validation context object passed to rules
   *
   * @param options - Validation configuration object
   * @param options.rules - Array of validation rules to apply
   * @param options.value - The value to validate
   * @param options.fieldName - Name of the field being validated
   * @param options.propertyName - Property name (alias for fieldName)
   * @param options.translatedPropertyName - Localized field name for error messages
   * @param options.context - Additional context data passed to validation rules
   * @param options.extra - Any additional properties passed through to rules
   *
   * @returns Promise that resolves with validation success data or rejects with error details
   *
   * @throws {ValidationError} When validation fails, includes detailed error context
   * @throws {RuleError} When invalid rules are detected
   *
   * @since 1.0.0
   * @see {@link parseAndValidateRules} - Rule parsing used internally
   * @see {@link validateTarget} - Class-based validation
   * @see {@link registerRule} - Register custom rules
   * @public
   */
  static validate<Context = unknown>({ rules, value, ...extra }: IValidatorValidateOptions<Array<any>, Context>): Promise<IValidatorValidateOptions<Array<any>, Context>> {
    const { sanitizedRules, invalidRules } = Validator.parseAndValidateRules(rules);
    const separators = Validator.getErrorMessageSeparators();

    if (invalidRules.length) {
      const message = invalidRules.map((rule) => i18n.t("validator.invalidRule", { rule: isNonNullString(rule) ? rule : "unnamed rule" })).join(separators.multiple);
      return Promise.reject({ rules, value, ...extra, message });
    }

    if (!sanitizedRules.length) return Promise.resolve({ rules, value, ...extra });

    extra.fieldName = extra.propertyName = defaultStr(extra.fieldName, extra.propertyName);
    const i18nRulesOptions = {
      ...extra,
      value,
      rules,
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let index = -1;
        const rulesLength = sanitizedRules.length;
        const next = async function (): Promise<any> {
          index++;
          if (index >= rulesLength) {
            return resolve({ value, rules, ...extra });
          }
          const rule = sanitizedRules[index];
          let ruleName = undefined;
          let rawRuleName = undefined;
          let ruleParams: any[] = [];
          let ruleFunc: IValidatorRule<Array<any>, Context> | undefined = typeof rule === "function" ? rule : undefined;
          if (typeof rule === "object" && isObj(rule)) {
            ruleFunc = rule.ruleFunction;
            ruleParams = Array.isArray(rule.params) ? rule.params : [];
            ruleName = rule.ruleName;
            rawRuleName = rule.rawRuleName;
          }
          const valResult = { value, status: "error", rule, ruleName, rawRuleName, ruleParams, rules, ...extra };
          const i18nRuleOptions = { ...i18nRulesOptions, rule: defaultStr(ruleName), ruleName, rawRuleName, ruleParams };
          const handleResult = (result: any) => {
            result = typeof result === "string" ? (isNonNullString(result) ? result : i18n.t("validator.invalidMessage", i18nRuleOptions)) : result;
            if (result === false) {
              return reject({ ...valResult, message: i18n.t("validator.invalidMessage", i18nRuleOptions) });
            } else if (isNonNullString(result)) {
              return reject({ ...valResult, message: result });
            } else if ((result as any) instanceof Error) {
              return reject({ ...valResult, message: stringify(result) });
            }
            return next();
          };
          if (typeof ruleFunc !== "function") {
            return reject({ ...valResult, message: i18n.t("validator.invalidRule", i18nRuleOptions) });
          }
          try {
            const result = await ruleFunc({ ...extra, ruleName, rawRuleName, rules, ruleParams, value } as any);
            return handleResult(result);
          } catch (e) {
            return handleResult(typeof e === "string" ? e : (e as any)?.message || e?.toString() || stringify(e));
          }
        };
        return next();
      }, 0);
    });
  }

  /**
   * ## Validate Class Target with Decorators
   *
   * Validates data against a class that has been decorated with validation rules using
   * property decorators. This method provides a powerful way to define validation schemas
   * at the class level and validate entire objects against those schemas.
   *
   * ### Decorator-Based Validation
   * This method works with classes that use validation decorators on their properties.
   * Each decorated property defines the validation rules that should be applied to
   * the corresponding data field.
   *
   * ### Validation Process
   * 1. **Rule Extraction**: Retrieves validation rules from class metadata
   * 2. **Property Translation**: Gets localized property names for error messages
   * 3. **Parallel Validation**: Validates all properties concurrently for performance
   * 4. **Error Aggregation**: Collects all validation errors across properties
   * 5. **Result Formatting**: Provides comprehensive success/failure information
   *
   * ### Error Message Customization
   * The optional `errorMessageBuilder` function allows complete customization of
   * how validation errors are formatted and presented.
   *
   * @example
   * ```typescript
   * // Define a class with validation decorators
   * class UserRegistration {
   *   @IsRequired
   *   @IsEmail
   *   email: string;
   *
   *   @IsRequired
   *   @MinLength([8])
   *   @HasPattern([/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase and number'])
   *   password: string;
   *
   *   @IsRequired
   *   @MinLength([2])
   *   @MaxLength([50])
   *   name: string;
   *
   *   @IsOptional
   *   @IsNumber
   *   @Between([18, 120])
   *   age?: number;
   * }
   *
   * // Validate user data
   * const userData = {
   *   email: 'user@example.com',
   *   password: 'SecurePass123',
   *   name: 'John Doe',
   *   age: 25
   * };
   *
   * try {
   *   const result = await Validator.validateTarget(UserRegistration, userData);
   *   console.log('User data is valid!', result.data);
   * } catch (error) {
   *   console.error('Validation failed:');
   *   error.errors.forEach(err => {
   *     console.log(`${err.fieldName}: ${err.message}`);
   *   });
   * }
   * ```
   *
   * ### Advanced Usage with Custom Error Builder
   * ```typescript
   * const customOptions = {
   *   errorMessageBuilder: (translatedName, error, builderOptions) => {
   *     // Custom error format with field highlighting
   *     return `⚠️ ${translatedName.toUpperCase()}: ${error}`;
   *   }
   * };
   *
   * try {
   *   await Validator.validateTarget(UserRegistration, invalidData, customOptions);
   * } catch (error) {
   *   // Errors will use custom format: "⚠️ EMAIL: Invalid email format"
   * }
   * ```
   *
   * ### Context-Aware Validation
   * ```typescript
   * // Class with context-dependent validation
   * class AdminUser {
   *   @IsRequired
   *   @IsEmail
   *   email: string;
   *
   *   @CustomRule([
   *     ({ value, context }) => {
   *       return context.isAdmin || 'Admin privileges required';
   *     }
   *   ])
   *   adminAction: string;
   * }
   *
   * const adminData = {
   *   email: 'admin@company.com',
   *   adminAction: 'delete-user'
   * };
   *
   * // Validate with context
   * interface AdminContext {
   *   isAdmin: boolean;
   *   permissions: string[];
   * }
   *
   * const result = await Validator.validateTarget<typeof AdminUser, AdminContext>(
   *   AdminUser,
   *   adminData,
   *   { context: { isAdmin: true, permissions: ['delete', 'modify'] } }
   * );
   * ```
   *
   * ### Internationalization Support
   * ```typescript
   * // Property names are automatically translated based on i18n configuration
   * // Error messages will use localized property names
   *
   * // English: "Email: Invalid email format"
   * // French: "E-mail : Format d'e-mail invalide"
   * // Spanish: "Correo electrónico: Formato de correo inválido"
   * ```
   *
   * @template T - The class constructor type being validated
   * @template Context - Type of validation context passed to rules
   *
   * @param target - The class constructor with validation decorators
   * @param data - Object containing data to validate against the class schema
   * @param options - Optional configuration for validation behavior
   * @param options.errorMessageBuilder - Custom function to format error messages
   *
   * @returns Promise resolving to object with validated data
   * @returns returns.data - The input data (potentially transformed by validation)
   *
   * @throws {ValidationError} Contains detailed validation failure information
   * @throws returns.status - Always "error" for validation failures
   * @throws returns.message - Summary message with failure count
   * @throws returns.errors - Array of individual field validation errors
   * @throws returns.success - Always false for validation failures
   *
   * @since 1.0.0
   * @see {@link getTargetRules} - Extracts validation rules from class
   * @see {@link validate} - Core validation method used internally
   * @see {@link IsRequired} - Common validation decorator
   * @see {@link IsEmail} - Email validation decorator
   * @public
   */
  static validateTarget<T extends IClassConstructor = any, Context = unknown>(
    target: T,
    data: Partial<Record<keyof InstanceType<T>, any>>,
    options?: {
      context?: Context;
      errorMessageBuilder?: (
        translatedPropertyName: string,
        error: string,
        builderOptions: {
          propertyName: string;
          translatedPropertyName: string;
          message: string;
          ruleName: string;
          ruleParams: any[];
          value: any;
          separators: {
            multiple: string;
            single: string;
          };
          data: Partial<Record<keyof InstanceType<T>, any>>;
        }
      ) => string;
    }
  ): Promise<{ data: Partial<Record<keyof InstanceType<T>, any>> }> {
    const targetRules = Validator.getTargetRules<T>(target);
    const messageSeparators = Validator.getErrorMessageSeparators();
    const { context, errorMessageBuilder, ...restOptions } = extendObj({}, Validator.getValidateTargetOptions(target), options);
    data = Object.assign({}, data);

    const buildErrorMessage = typeof errorMessageBuilder === "function" ? errorMessageBuilder : (translatedPropertyName: string, error: string) => `[${String(translatedPropertyName)}] : ${error}`;

    const validationErrors: { fieldName: string; propertyName: string; message: string }[] = [];
    const validationPromises: Promise<any>[] = [];
    let errorCount = 0;

    const translatedPropertyNames = i18n.translateTarget(target, { data });

    for (const propertyKey in targetRules) {
      const translatedPropertyName: string = isNonNullString((translatedPropertyNames as any)[propertyKey]) ? (translatedPropertyNames as any)[propertyKey] : propertyKey;

      validationPromises.push(
        Validator.validate<Context>({
          context,
          ...restOptions,
          value: data[propertyKey],
          data,
          translatedPropertyName,
          fieldName: propertyKey,
          propertyName: propertyKey,
          rules: targetRules[propertyKey],
        }).catch((validationError) => {
          const errorMessage = stringify(defaultVal(validationError?.message, validationError));
          errorCount++;
          const formattedMessage = buildErrorMessage(translatedPropertyName, errorMessage, {
            ...Object.assign({}, validationError),
            separators: messageSeparators,
            data,
            propertyName: propertyKey,
            translatedPropertyName: translatedPropertyName,
          });
          validationErrors.push({
            fieldName: propertyKey,
            propertyName: propertyKey,
            message: formattedMessage,
          });
        })
      );
    }

    return new Promise<{ data: Partial<Record<keyof InstanceType<T>, any>> }>((resolve, reject) => {
      return Promise.all(validationPromises).then(() => {
        const isValidationSuccessful = !validationErrors.length;
        if (isValidationSuccessful) {
          resolve({ data });
        } else {
          reject({
            status: "error",
            message: i18n.translate("validator.failedForNFields", { count: errorCount }),
            errors: validationErrors,
            success: false,
          });
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
  public static getValidateTargetOptions<T extends IClassConstructor = any>(target: T): Parameters<typeof Validator.validateTarget>[2] {
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
   * const AgeRange = Validator.createRuleDecorator(validateAge);
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
   * const RequiresPermission = Validator.createRuleDecorator(validatePermission);
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
   * const IsUniqueEmail = Validator.createRuleDecorator(validateUniqueEmail);
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
  static createRuleDecorator<RuleParamsType extends Array<any> = Array<any>>(ruleFunction: IValidatorRuleFunction<RuleParamsType>) {
    return function (ruleParameters: RuleParamsType) {
      const enhancedValidatorFunction: IValidatorRuleFunction<RuleParamsType> = function (validationOptions) {
        const enhancedOptions: IValidatorValidateOptions<RuleParamsType> = Object.assign({}, validationOptions);
        enhancedOptions.ruleParams = (Array.isArray(ruleParameters) ? ruleParameters : [ruleParameters]) as RuleParamsType;
        return ruleFunction(enhancedOptions);
      };
      return Validator.createPropertyDecorator<RuleParamsType>(enhancedValidatorFunction);
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
   *
   * @param rule - Single rule or array of rules to attach to the property
   *
   * @returns Property decorator function that can be applied to class properties
   *
   * @since 1.0.0
   * @see {@link createRuleDecorator} - Higher-level decorator creation
   * @internal
   */
  static createPropertyDecorator<RuleParamsType extends Array<any> = Array<any>>(rule: IValidatorRule<RuleParamsType> | IValidatorRule<RuleParamsType>[]): PropertyDecorator {
    return createPropertyDecorator<IValidatorRule<RuleParamsType>[]>(VALIDATOR_TARGET_RULES_METADATA_KEY, (oldRules) => {
      return [...(Array.isArray(oldRules) ? oldRules : []), ...(Array.isArray(rule) ? rule : [rule])];
    });
  }
}

/**
 * ## Pre-Built Validation Decorators
 *
 * Collection of commonly used validation decorators that provide immediate
 * validation capabilities for standard data types and formats. These decorators
 * are built on top of registered validation rules and provide a convenient
 * way to apply common validations.
 */

/**
 * ### IsNumber Decorator
 *
 * Validates that a property value is a valid number. This decorator checks
 * for numeric values and rejects non-numeric inputs.
 *
 * @example
 * ```typescript
 * class Product {
 *   @IsNumber
 *   price: number;
 *
 *   @IsNumber
 *   quantity: number;
 *
 *   @IsRequired
 *   @IsNumber
 *   weight: number;
 * }
 *
 * // Valid data
 * const product = { price: 19.99, quantity: 5, weight: 2.5 };
 *
 * // Invalid data
 * const invalid = { price: "not-a-number", quantity: 5, weight: 2.5 };
 * // Will fail validation with error: "Price must be a number"
 * ```
 *
 * @decorator
 * @since 1.0.0
 * @see {@link IsRequired} - Often used together
 * @public
 */
export const IsNumber = Validator.createPropertyDecorator(["Number"]);

/**
 * ### IsRequired Decorator
 *
 * Validates that a property has a non-null, non-undefined value. This is
 * one of the most commonly used validation decorators and should be applied
 * to any property that must have a value.
 *
 * @example
 * ```typescript
 * class User {
 *   @IsRequired
 *   username: string;
 *
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   // Optional field - no @IsRequired
 *   bio?: string;
 * }
 *
 * // Valid data
 * const user = { username: "john_doe", email: "john@example.com" };
 *
 * // Invalid data
 * const invalid = { email: "john@example.com" }; // Missing username
 * // Will fail validation with error: "Username is required"
 * ```
 *
 * @decorator
 * @since 1.0.0
 * @see {@link IsOptional} - For optional fields
 * @public
 */
export const IsRequired = Validator.createPropertyDecorator(["Required"]);

/**
 * ### IsEmail Decorator
 *
 * Validates that a property value is a properly formatted email address.
 * Uses comprehensive email validation that checks for valid email format
 * according to RFC standards.
 *
 * @example
 * ```typescript
 * class Contact {
 *   @IsRequired
 *   @IsEmail
 *   primaryEmail: string;
 *
 *   @IsEmail  // Optional email
 *   secondaryEmail?: string;
 * }
 *
 * // Valid data
 * const contact = {
 *   primaryEmail: "user@example.com",
 *   secondaryEmail: "backup@company.org"
 * };
 *
 * // Invalid data
 * const invalid = {
 *   primaryEmail: "not-an-email",
 *   secondaryEmail: "user@"
 * };
 * // Will fail validation with errors about invalid email format
 * ```
 *
 * @decorator
 * @since 1.0.0
 * @see {@link IsRequired} - Often used together
 * @public
 */
export const IsEmail = Validator.createPropertyDecorator(["Email"]);

/**
 * ### IsUrl Decorator
 *
 * Validates that a property value is a properly formatted URL. Checks for
 * valid URL structure including protocol, domain, and optional path components.
 *
 * @example
 * ```typescript
 * class Website {
 *   @IsRequired
 *   @IsUrl
 *   homepage: string;
 *
 *   @IsUrl
 *   blogUrl?: string;
 *
 *   @IsUrl
 *   apiEndpoint: string;
 * }
 *
 * // Valid data
 * const website = {
 *   homepage: "https://example.com",
 *   blogUrl: "https://blog.example.com/posts",
 *   apiEndpoint: "https://api.example.com/v1"
 * };
 *
 * // Invalid data
 * const invalid = {
 *   homepage: "not-a-url",
 *   apiEndpoint: "ftp://invalid-protocol"
 * };
 * ```
 *
 * @decorator
 * @since 1.0.0
 * @public
 */
export const IsUrl = Validator.createPropertyDecorator(["Url"]);

/**
 * ### IsFileName Decorator
 *
 * Validates that a property value is a valid filename. Checks for proper
 * filename format and excludes invalid characters that are not allowed
 * in file systems.
 *
 * @example
 * ```typescript
 * class FileUpload {
 *   @IsRequired
 *   @IsFileName
 *   filename: string;
 *
 *   @IsFileName
 *   thumbnailName?: string;
 * }
 *
 * // Valid data
 * const upload = {
 *   filename: "document.pdf",
 *   thumbnailName: "thumb_001.jpg"
 * };
 *
 * // Invalid data
 * const invalid = {
 *   filename: "file<with>invalid:chars.txt"
 * };
 * ```
 *
 * @decorator
 * @since 1.0.0
 * @public
 */
export const IsFileName = Validator.createPropertyDecorator(["FileName"]);

/**
 * ### IsNonNullString Decorator
 *
 * Validates that a property value is a non-null, non-empty string. This
 * decorator is stricter than IsRequired as it also ensures the value is
 * a string with actual content (not just whitespace).
 *
 * @example
 * ```typescript
 * class Article {
 *   @IsNonNullString
 *   title: string;
 *
 *   @IsNonNullString
 *   content: string;
 *
 *   @IsNonNullString
 *   author: string;
 * }
 *
 * // Valid data
 * const article = {
 *   title: "How to Validate Data",
 *   content: "This article explains validation...",
 *   author: "John Doe"
 * };
 *
 * // Invalid data
 * const invalid = {
 *   title: "",           // Empty string
 *   content: "   ",      // Only whitespace
 *   author: null         // Null value
 * };
 * ```
 *
 * @decorator
 * @since 1.0.0
 * @see {@link IsRequired} - Less strict alternative
 * @public
 */
export const IsNonNullString = Validator.createPropertyDecorator(["NonNullString"]);

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
