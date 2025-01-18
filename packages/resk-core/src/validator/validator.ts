import { IValidatorRule, IValidatorValidateOptions, IValidatorRuleMap, IValidatorRuleName, IValidatorRuleFunction, IValidatorResult, IValidatorSanitizedRules } from "./types";
import { defaultStr, defaultVal, extendObj, isNonNullString, isObj, stringify } from "@utils/index";
import { i18n } from "../i18n";
import { IClassConstructor } from "@/types";


const validatorTargetRulesMetaKey = Symbol("validatorIsMetaData");
const validatorValidateTargetOptionsMetaKey = Symbol("validatorValidateTargetOptions");

/**
 * @class Validator
 * A class that provides methods for validating elements based on defined rules.
 * 
 * The `Validator` class allows you to define validation rules, sanitize them,
 * and validate values against those rules. It supports both synchronous and asynchronous
 * validation, making it flexible for various use cases.
 */
export class Validator {
  // Metadata key for storing validation rules
  private static readonly RULES_METADATA_KEY = Symbol("validationRules");

  /**
   * Register a new validation rule.
   * @template ParamType The type of the parameters that the rule function accepts.
   * @param name The name of the rule.
   * @param handler The validation function.
   */
  static registerRule<ParamType extends Array<any> = Array<any>>(name: IValidatorRuleName, handler: IValidatorRuleFunction<ParamType>): void {
    const rules = Validator.getRules();
    if (typeof handler == "function") {
      (rules as any)[name] = handler as IValidatorRuleFunction<ParamType>;
    }
    Reflect.defineMetadata(Validator.RULES_METADATA_KEY, rules, Validator);
  }
  /**
   * A static getter that returns a record of validation rules.
   * 
   * @returns {IValidatorRuleMap} An object containing validation rules.
   */
  static getRules(): IValidatorRuleMap {
    const rules = Reflect.getMetadata(Validator.RULES_METADATA_KEY, Validator);
    return isObj(rules) ? rules : {};
  }

  /**
   * Retrieves a validation rule by its name.
   * 
   * @param {IValidatorRuleName} rulesName - The name of the validation rule to retrieve.
   * @returns {IValidatorRuleFunction | undefined} The validation rule if found, otherwise undefined.
   */
  static getRule<ParamType extends Array<any> = Array<any>>(rulesName: IValidatorRuleName): IValidatorRuleFunction<ParamType> | undefined {
    if (!isNonNullString(rulesName)) return undefined;
    const rules = Validator.getRules();
    return rules[rulesName] as IValidatorRuleFunction<ParamType> | undefined;
  }
  /**
   * Sanitizes a set of validation rules and returns an array of rules.
   * 
   * This method takes a list of validation rules, which can be in various formats,
   * and returns an array of sanitized rules ready for validation.
   * 
   * @param {IValidatorValidateOptions["rules"]} rules - The list of validation rules. The rules can be:
   * - An array of rules (e.g., ["required", "minLength[2]", "maxLength[10]"]).
   * 
   * @returns {{sanitizedRules:IValidatorSanitizedRules,invalidRules:IValidatorRule[]}}
   */
  static sanitizeRules(rules?: IValidatorValidateOptions["rules"]): { sanitizedRules: IValidatorSanitizedRules, invalidRules: IValidatorRule[] } {
    const result: IValidatorSanitizedRules = [];
    const allRules = this.getRules();
    const invalidRules: IValidatorRule[] = [];
    (Array.isArray(rules) ? rules : []).map((rule) => {
      if (typeof rule === "function") {
        result.push(rule as IValidatorRuleFunction);
      } else if (isNonNullString(rule)) {
        let ruleName = String(rule).trim();
        const ruleParams: string[] = [];
        if (ruleName.indexOf("[") > -1) {
          const rulesSplit = ruleName.rtrim("]").split("[");
          ruleName = rulesSplit[0].trim();
          const spl = String(rulesSplit[1]).split(",");
          for (let t in spl) {
            ruleParams.push(spl[t].replace("]", "").trim());
          }
        }
        if (typeof allRules[ruleName as IValidatorRuleName] === "function") {
          result.push({
            ruleName: ruleName as unknown as IValidatorRuleName,
            params: ruleParams,
            ruleFunction: allRules[ruleName as IValidatorRuleName] as IValidatorRuleFunction,
            rawRuleName: String(rule)
          });
        } else {
          invalidRules.push(rule);
        }
      } else if (isObj(rule) && typeof rule == "object") {
        const rulesObj: Record<IValidatorRuleName, any> = rule;
        for (let key in rulesObj) {
          if (Object.hasOwnProperty.call(rulesObj, key)) {
            const rulesParams = rulesObj[key as IValidatorRuleName];
            const ruleFunction = allRules[key as IValidatorRuleName] as IValidatorRuleFunction;
            if (typeof ruleFunction === "function") {
              result.push({
                ruleName: key as unknown as IValidatorRuleName,
                params: Array.isArray(rulesParams) ? rulesParams : [],
                ruleFunction: ruleFunction,
                rawRuleName: String(key)
              });
            } else {
              invalidRules.push(key as IValidatorRule);
            }
          }
        }
      }
    });
    return { sanitizedRules: result, invalidRules };
  }

  /**
   * Validates a value against the specified validation rules.
   * 
   * This method takes a value and a set of validation rules, and performs validation.
   * It returns a promise that resolves if the validation passes, or rejects with an error
   * message if the validation fails.
   * 
   * @param {IValidatorValidateOptions} options - The options for validation, including:
   * - `value`: The value to validate.
   * - `rules`: An array of validation rules to apply.
   * - `...extra`: Any additional options that may be applied.
   * 
   * @returns {Promise<any>} A promise that resolves with the validation result or rejects with an error.
   * 
   * ### Example:
   * ```typescript
   * Validator.validate({
   *     rules: "minLength[5]|maxLength[10]",
   *     value: "test",
   * }).then(result => {
   *     console.log("Validation passed:", result);
   * }).catch(error => {
   *     console.error("Validation failed:", error);
   * });
   * ```
   */
  static validate({ rules, value, ...extra }: IValidatorValidateOptions): Promise<IValidatorValidateOptions> {
    const { sanitizedRules, invalidRules } = Validator.sanitizeRules(rules);
    if (invalidRules.length) {
      const message = invalidRules.map(rule => i18n.t("validator.invalidRule", { rule: isNonNullString(rule) ? rule : "unamed rule" })).join(", ");
      return Promise.reject({ rules, value, ...extra, message });
    }
    if (!sanitizedRules.length) return Promise.resolve({ rules, value, ...extra });
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
          let ruleFunc: IValidatorRule | undefined = typeof rule === "function" ? rule : undefined;
          if (typeof rule === "object" && isObj(rule)) {
            ruleFunc = rule.ruleFunction;
            ruleParams = Array.isArray(rule.params) ? rule.params : [];
            ruleName = rule.ruleName;
            rawRuleName = rule.rawRuleName;
          }
          const valResult = { value, rule, ruleName, rawRuleName, ruleParams, rules, ...extra };
          const i18nRuleOptions = { ...i18nRulesOptions, rule: defaultStr(ruleName), ruleName, rawRuleName, ruleParams };
          const handleResult = (result: any) => {
            result = typeof result === "string" ? (isNonNullString(result) ? result : i18n.t("validator.invalidMessage", i18nRuleOptions)) : result;
            if (result === false) {
              return reject({ ...valResult, message: i18n.t("validator.invalidMessage", i18nRuleOptions) });
            } else if (isNonNullString(result)) {
              return reject({ ...valResult, message: result });
            }
            return next();
          };
          if (typeof ruleFunc !== "function") {
            return reject({ ...valResult, message: i18n.t("validator.invalidRule", i18nRuleOptions) });
          }
          try {
            const result = await ruleFunc({ ...extra, ruleName, rawRuleName, rules, ruleParams, value });
            return handleResult(result);
          } catch (e) {
            return handleResult(typeof e === "string" ? e : (e as any)?.message || e?.toString() || stringify(e));
          }
        };
        return next();
      }, 0);
    });
  }
  /***
   * Validate a target decorated using the ValidatorDecorator. 
   * @param 
   */
  static validateTarget<T extends IClassConstructor = any>(target: T, data: Partial<Record<keyof InstanceType<T>, any>>, options?: {
    errorMessageBuilder?: (
      translatedPropertyName: string,
      error: string,
      builderOptions: {
        propertyName: string,
        translatedPropertyName: string,
        message: string,
        ruleName: string,
        ruleParams: any[],
        value: any,
        data: Partial<Record<keyof InstanceType<T>, any>>,
      },
    ) => string
  }
  ) {
    const rulesObject = Validator.getTargetRules<T>(target);
    options = extendObj({}, Validator.getValidateTargetOptions(target), options);
    data = Object.assign({}, data);
    const errorMessageBuilder = typeof options?.errorMessageBuilder === 'function' ? options.errorMessageBuilder : (translatedPropertyName: string, error: string) => `[${String(translatedPropertyName)}] : ${error}`;
    const result: Record<keyof InstanceType<T>, any> = {} as Record<keyof InstanceType<T>, any>;
    const errors: string[] = [];
    const promises = [];
    const errorsResult: Record<keyof InstanceType<T>, string[]> = {} as Record<keyof InstanceType<T>, string[]>;
    const errorsByField: Record<keyof InstanceType<T>, string> = {} as Record<keyof InstanceType<T>, string>;
    const translatedKeys = i18n.translateTarget(target, { data });
    for (let i in rulesObject) {
      const translatedPropertyName: string = (isNonNullString(translatedKeys[i]) ? translatedKeys[i] : i) as string;
      promises.push(Validator.validate({ value: data[i], translatedPropertyName, fieldName: i, propertyName: i, rules: rulesObject[i] }).then((result) => {
        result[i as keyof typeof result] = result;
      }).catch((error) => {
        const errorField = stringify(defaultVal(error?.message, error));
        errorsByField[i as keyof typeof errorsByField] = errorField;
        errorsResult[i as keyof typeof errorsResult] = [errorField];
        errors.push(errorMessageBuilder(translatedPropertyName, errorField, {
          ...error,
          data,
          propertyName: i,
          translatedPropertyName: translatedPropertyName,
        }));
      }));
    }
    return Promise.all(promises).then(() => {
      return {
        rulesByField: rulesObject,
        result,
        errors,
        success: !errors.length,
        errorsByField,
        errorsResult,
      }
    });
  }
  static getTargetRules<T extends IClassConstructor = any>(target: T): Record<keyof InstanceType<T>, IValidatorRule[]> {
    return Object.assign({}, Reflect.getMetadata(validatorTargetRulesMetaKey, target.prototype));
  }
  public static getValidateTargetOptions<T extends IClassConstructor = any>(target: T): Parameters<typeof Validator.validateTarget>[2] {
    return Object.assign({}, Reflect.getMetadata(validatorValidateTargetOptionsMetaKey, target) || {});
  }
  static createDecorator<RuleParamsType extends Array<any> = Array<any>>(ruleFunction: IValidatorRuleFunction<RuleParamsType>) {
    return function (params: RuleParamsType) {
      const validatorDynamicFunction: IValidatorRuleFunction<RuleParamsType> = function (options) {
        const validationOptions: IValidatorValidateOptions<RuleParamsType> = Object.assign({}, options);
        validationOptions.ruleParams = (Array.isArray(params) ? params : [params]) as RuleParamsType;
        return ruleFunction(validationOptions)
      }
      return Validator.createPropertyDecorator<RuleParamsType>(validatorDynamicFunction);
    }
  }
  static createPropertyDecorator<RuleParamsType extends Array<any> = Array<any>>(rule: IValidatorRule<RuleParamsType> | IValidatorRule[]): PropertyDecorator {
    return function (target: any, propertyKey) {
      const allRules = Object.assign({}, Reflect.getMetadata(validatorTargetRulesMetaKey, target));
      allRules[propertyKey] = Array.isArray(allRules[propertyKey]) ? allRules[propertyKey] : [];
      allRules[propertyKey].push(...(Array.isArray(rule) ? rule : [rule]) as any);
      Reflect.defineMetadata(validatorTargetRulesMetaKey, allRules, target);
      return allRules;
    }
  }
}

export const ValidatorIsNumber = Validator.createPropertyDecorator("number");
export const ValidatorIsRequired = Validator.createPropertyDecorator("required");
export const ValidatorIsEmail = Validator.createPropertyDecorator("email");
export const ValidatorIsUrl = Validator.createPropertyDecorator("url");
export const ValidatorIsFileName = Validator.createPropertyDecorator("fileName");
export const ValidatorIsNonNullString = Validator.createPropertyDecorator("nonNullString");

export function ValidatorValidateTargetOptions(options: Parameters<typeof Validator.validateTarget>[2]): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(validatorValidateTargetOptionsMetaKey, options, target);
  }
}