import { IValidatorRule, IValidatorValidateOptions, IValidatorRuleMap, IValidatorRuleName, IValidatorRuleFunction, IValidatorResult, IValidatorSanitizedRules } from "./types";
import { defaultStr, defaultVal, extendObj, isNonNullString, isObj, stringify } from "@utils/index";
import { i18n } from "../i18n";
import { IClassConstructor, IDict } from "@/types";
import { createPropertyDecorator, getDecoratedProperties } from "@/resources/decorators";

// Enhanced metadata keys with consistent naming convention
const VALIDATOR_TARGET_RULES_METADATA_KEY = Symbol("validatorTargetRules");
const VALIDATOR_TARGET_OPTIONS_METADATA_KEY = Symbol("validatorTargetOptions");


export class Validator {
  // Metadata key for storing validation rules
  private static readonly RULES_METADATA_KEY = Symbol("validationRules");

  /**
   * Register a new validation rule with enhanced type safety.
   * @template ParamType The type of the parameters that the rule function accepts.
   * @template Context The context type for validation.
   * @param ruleName The name of the rule to register.
   * @param ruleHandler The validation function to register.
   * @throws {Error} When the handler is not a function or ruleName is invalid.
   */
  static registerRule<ParamType extends Array<any> = Array<any>, Context = unknown>(
    ruleName: IValidatorRuleName,
    ruleHandler: IValidatorRuleFunction<ParamType, Context>
  ): void {
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
   * Gets all registered validation rules.
   * @returns {IValidatorRuleMap} An immutable copy of all registered validation rules.
   */
  static getRules(): IValidatorRuleMap {
    const rules = Reflect.getMetadata(Validator.RULES_METADATA_KEY, Validator);
    return isObj(rules) ? { ...rules } : ({} as IValidatorRuleMap);
  }

  /**
   * Gets the error message separators for validation errors with better naming.
   * @returns {Object} The separators configuration for validation error messages.
   */
  static getErrorMessageSeparators(): { multiple: string; single: string } {
    const translatedSeparator: IDict = Object.assign({}, i18n.getNestedTranslation("validator.separators")) as IDict;
    return {
      multiple: defaultStr(translatedSeparator.multiple, ", "),
      single: defaultStr(translatedSeparator.single, ", "),
    };
  }

  /**
   * Finds a registered validation rule by name with enhanced error handling.
   * @template ParamType The type of parameters the rule function accepts.
   * @template Context The context type for validation.
   * @param ruleName The name of the rule to find.
   * @returns {IValidatorRuleFunction | undefined} The rule function if found, undefined otherwise.
   */
  static findRegisteredRule<ParamType extends Array<any> = Array<any>, Context = unknown>(
    ruleName: IValidatorRuleName
  ): IValidatorRuleFunction<ParamType, Context> | undefined {
    if (!isNonNullString(ruleName)) return undefined;
    const rules = Validator.getRules();
    return rules[ruleName] as IValidatorRuleFunction<ParamType, Context> | undefined;
  }

  /**
   * Parses and validates input rules, converting them to a standardized format.
   * Enhanced with better variable naming and error handling.
   * @param inputRules The raw validation rules to parse and validate.
   * @returns {Object} Object containing parsed rules and any invalid rules found.
   */
  static parseAndValidateRules(inputRules?: IValidatorValidateOptions["rules"]): {
    sanitizedRules: IValidatorSanitizedRules;
    invalidRules: IValidatorRule[]
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
   * Helper method to parse string-based rules (e.g., "required", "minLength[5]").
   * @private
   */
  private static parseStringRule(ruleString: string, registeredRules: IValidatorRuleMap): any {
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
   * Helper method to parse object-based rules.
   * @private
   */
  private static parseObjectRules(rulesObject: Record<IValidatorRuleName, any>, registeredRules: IValidatorRuleMap): {
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

  static validate<Context = unknown>({ rules, value, ...extra }: IValidatorValidateOptions<Array<any>, Context>): Promise<IValidatorValidateOptions<Array<any>, Context>> {
    const { sanitizedRules, invalidRules } = Validator.parseAndValidateRules(rules);
    const separators = Validator.getErrorMessageSeparators();

    if (invalidRules.length) {
      const message = invalidRules.map((rule) =>
        i18n.t("validator.invalidRule", { rule: isNonNullString(rule) ? rule : "unnamed rule" })
      ).join(separators.multiple);
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
   * Validates a target class decorated with validation rules.
   * Enhanced with better variable naming and error handling.
   * @param target The target class constructor.
   * @param data The data to validate against the target's rules.
   * @param options Additional validation options including custom error message builder.
   * @returns Promise that resolves with validated data or rejects with validation errors.
   */
  static validateTarget<T extends IClassConstructor = any, Context = unknown>(
    target: T,
    data: Partial<Record<keyof InstanceType<T>, any>>,
    options?: {
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
    options = extendObj({}, Validator.getValidateTargetOptions(target), options);
    data = Object.assign({}, data);

    const buildErrorMessage = typeof options?.errorMessageBuilder === "function"
      ? options.errorMessageBuilder
      : (translatedPropertyName: string, error: string) => `[${String(translatedPropertyName)}] : ${error}`;

    const validationErrors: { fieldName: string; propertyName: string; message: string }[] = [];
    const validationPromises: Promise<any>[] = [];
    let errorCount = 0;

    const translatedPropertyNames = i18n.translateTarget(target, { data });

    for (const propertyKey in targetRules) {
      const translatedPropertyName: string = isNonNullString((translatedPropertyNames as any)[propertyKey])
        ? (translatedPropertyNames as any)[propertyKey]
        : propertyKey;

      validationPromises.push(
        Validator.validate<Context>({
          value: data[propertyKey],
          translatedPropertyName,
          fieldName: propertyKey,
          propertyName: propertyKey,
          rules: targetRules[propertyKey]
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
  static getTargetRules<T extends IClassConstructor = any>(target: T): Record<keyof InstanceType<T>, IValidatorRule[]> {
    return getDecoratedProperties(target, VALIDATOR_TARGET_RULES_METADATA_KEY) as Record<keyof InstanceType<T>, IValidatorRule[]>;
  }
  public static getValidateTargetOptions<T extends IClassConstructor = any>(target: T): Parameters<typeof Validator.validateTarget>[2] {
    return Object.assign({}, Reflect.getMetadata(VALIDATOR_TARGET_OPTIONS_METADATA_KEY, target) || {});
  }
  /**
   * Creates a dynamic decorator factory for validation rules with enhanced type safety.
   * @template RuleParamsType The type of parameters the rule function accepts.
   * @param ruleFunction The validation rule function to create a decorator for.
   * @returns A decorator factory function that accepts rule parameters.
   */
  static createRuleDecorator<RuleParamsType extends Array<any> = Array<any>>(
    ruleFunction: IValidatorRuleFunction<RuleParamsType>
  ) {
    return function (ruleParameters: RuleParamsType) {
      const enhancedValidatorFunction: IValidatorRuleFunction<RuleParamsType> = function (validationOptions) {
        const enhancedOptions: IValidatorValidateOptions<RuleParamsType> = Object.assign({}, validationOptions);
        enhancedOptions.ruleParams = (Array.isArray(ruleParameters) ? ruleParameters : [ruleParameters]) as RuleParamsType;
        return ruleFunction(enhancedOptions);
      };
      return Validator.createPropertyDecorator<RuleParamsType>(enhancedValidatorFunction);
    };
  }

  static createPropertyDecorator<RuleParamsType extends Array<any> = Array<any>>(rule: IValidatorRule<RuleParamsType> | IValidatorRule<RuleParamsType>[]): PropertyDecorator {
    return createPropertyDecorator<IValidatorRule<RuleParamsType>[]>(VALIDATOR_TARGET_RULES_METADATA_KEY, (oldRules) => {
      return [...(Array.isArray(oldRules) ? oldRules : []), ...(Array.isArray(rule) ? rule : [rule])];
    });
  }
}

// Enhanced validation decorators with better naming and documentation
export const IsNumber = Validator.createPropertyDecorator("number");
export const IsRequired = Validator.createPropertyDecorator("required");
export const IsEmail = Validator.createPropertyDecorator("email");
export const IsUrl = Validator.createPropertyDecorator("url");
export const IsFileName = Validator.createPropertyDecorator("fileName");
export const IsNonNullString = Validator.createPropertyDecorator("nonNullString");

/**
 * Enhanced class decorator for setting validation target options with better naming.
 * @param validationOptions Configuration options for target validation.
 * @returns A class decorator function.
 */
export function ValidationTargetOptions(
  validationOptions: Parameters<typeof Validator.validateTarget>[2]
): ClassDecorator {
  return function (targetClass: Function) {
    Reflect.defineMetadata(VALIDATOR_TARGET_OPTIONS_METADATA_KEY, validationOptions, targetClass);
  };
}

