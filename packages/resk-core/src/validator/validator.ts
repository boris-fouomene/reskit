import { IValidatorRule, IValidatorRuleOptions, IValidatorRulesOptions, IValidatorRuleSeparator, IValidatorRulesMap, IValidatorRuleName, IValidatorRuleFunction, IValidatorResult } from "./types";
import { isNonNullString, isObj, stringify } from "@utils/index";
import { i18n } from "../i18n";
const RULE_SEPARATOR: IValidatorRuleSeparator = "|";


/**
 * A decorator function for registering a validation rule.
 * 
 * This function can be used to annotate methods in a class as validation rules.
 * When applied, it registers the method with the specified name in the `Validator` class,
 * allowing it to be used as a validation rule in form validation scenarios.
 * 
 * @template ParamType The type of the parameters that the rule function accepts.
 * 
 * @param {IValidatorRuleName} name - The name of the validation rule to register. This name will be used
 *                        to reference the rule when performing validation.
 * 
 * @returns {MethodDecorator} A method decorator that registers the method as a validation rule.
 * 
 * ### Example:
 * 
 * ```typescript
 * import { Validator, ValidatorRule } from "@resk/expo";
 * @ValidatorRule("isEven")
 * const validateEven({ value }: { value: number }): boolean | string {
 *      return value % 2 === 0 || "The number must be even.";
 * }
 * 
 * // Usage in validation
 * const rules = Validator.getValidationRule("isEven");
 * const result = rules({ value: 4 }); // Returns true
 * ```
 * 
 * In this example, the `validateEven` method is registered as a validation rule named "isEven".
 * When the rule is called, it checks if the provided value is even and returns an appropriate message if not.
 */
export function ValidatorRule<ParamType = Array<any>>(name: IValidatorRuleName): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    let handler: IValidatorRuleFunction<ParamType> | undefined = undefined;
    if (descriptor?.value instanceof Function) {
      // If applied to a class method
      handler = descriptor.value as IValidatorRuleFunction<ParamType>;
    } else if (target instanceof Function) {
      // If applied to a standalone function
      handler = target as IValidatorRuleFunction<ParamType>;
    }
    if (handler && handler instanceof Function) {
      Validator.registerRule(name, handler as IValidatorRuleFunction<ParamType>);
    }
  };
}

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
  static registerRule<ParamType = Array<any>>(name: IValidatorRuleName, handler: IValidatorRuleFunction<ParamType>): void {
    const rules = Validator.getRules();
    if (typeof handler == "function") {
      (rules as any)[name] = handler as IValidatorRuleFunction<ParamType>;
    }
    Reflect.defineMetadata(Validator.RULES_METADATA_KEY, rules, Validator);
  }
  /**
   * A static getter that returns a record of validation rules.
   * 
   * @returns {IValidatorRulesMap} An object containing validation rules.
   */
  static getRules(): IValidatorRulesMap {
    const rules = Reflect.getMetadata(Validator.RULES_METADATA_KEY, Validator);
    return isObj(rules) ? rules : {};
  }

  /**
   * Retrieves a validation rule by its name.
   * 
   * @param {IValidatorRuleName} rulesName - The name of the validation rule to retrieve.
   * @returns {IValidatorRuleFunction | undefined} The validation rule if found, otherwise undefined.
   */
  static getRule<ParamType = Array<any>>(rulesName: IValidatorRuleName): IValidatorRuleFunction<ParamType> | undefined {
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
   * @param {IValidatorRulesOptions} rules - The list of validation rules. The rules can be:
   * - A string (e.g., "required|minLength[2]|maxLength[10]") with multiple rules separated by `|`.
   * - An array of rules (e.g., ["required", "minLength[2]", "maxLength[10]"]).
   * - A function that performs validation.
   * 
   * @returns {IValidatorRule[]} An array of sanitized validation rules.
   */
  static sanitizeRules(rules?: IValidatorRulesOptions): IValidatorRule[] {
    const result: IValidatorRule[] = [];
    (typeof rules === "function"
      ? [rules]
      : typeof rules === "string" && rules
        ? (rules as string)
          .trim()
          .split(RULE_SEPARATOR)
          .filter((rule) => !!rule?.trim()?.ltrim(RULE_SEPARATOR)?.rtrim(RULE_SEPARATOR))
        : Array.isArray(rules)
          ? rules
          : []
    ).map((rule) => {
      if (typeof rule == "function") {
        result.push(rule);
      } else if (typeof rule === "string") {
        rule = rule.trim().ltrim(RULE_SEPARATOR).rtrim(RULE_SEPARATOR);
        if (rule) {
          rule.split(RULE_SEPARATOR).map((rr) => {
            if (["function", "string"].includes(typeof rr) && rr.trim()) {
              result.push(rr.trim());
            }
          });
        }
      }
    });
    return result;
  }

  /**
   * Validates a value against the specified validation rules.
   * 
   * This method takes a value and a set of validation rules, and performs validation.
   * It returns a promise that resolves if the validation passes, or rejects with an error
   * message if the validation fails.
   * 
   * @param {IValidatorRuleOptions} options - The options for validation, including:
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
  static validate({ rules, value, ...extra }: IValidatorRuleOptions): Promise<IValidatorRuleOptions> {
    rules = Validator.sanitizeRules(rules);
    if (!rules.length) return Promise.resolve({ rules, value, ...extra });
    const mainRuleParams = Array.isArray(extra.ruleParams) ? extra.ruleParams : [];
    const i18nRulesOptions = {
      ...extra,
      value,
      rules,
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let index = -1;
        const rulesLength = rules.length;
        const next = async function (): Promise<any> {
          index++;
          if (index >= rulesLength) {
            return resolve({ value, rules, ...extra });
          }
          const rule = (rules as any)[index];
          const ruleParams: any[] = [...mainRuleParams];
          let ruleFunc: IValidatorRule | undefined = typeof rule === "function" ? rule : undefined;
          if (typeof rule === "string") {
            if (!rule) {
              return next();
            }
            let vRule = String(rule).trim();
            if (vRule.indexOf("[") > -1) {
              const _sp = vRule.trim().split("[");
              vRule = _sp[0];
              const spl = _sp[1].split(",");
              for (let t in spl) {
                ruleParams.push(spl[t].replace("]", "").trim());
              }
            }
            ruleFunc = Validator.getRule(vRule as IValidatorRuleName);
          }
          const valResult = { value, rule, rules, ...extra };
          const i18nRuleOptions = { ...i18nRulesOptions, rule: stringify(rule) };
          if (typeof ruleFunc !== "function") {
            return reject({ ...valResult, message: i18n.t("validator.invalidRule", i18nRuleOptions) });
          }
          const handleResult = (result: any) => {
            result = typeof result === "string" ? (isNonNullString(result) ? result : i18n.t("validator.invalidMessage", i18nRuleOptions)) : result;
            if (result === false) {
              return reject({ ...valResult, message: i18n.t("validator.invalidMessage", i18nRuleOptions) });
            } else if (isNonNullString(result)) {
              return reject({ ...valResult, message: result });
            }
            return next();
          };
          try {
            const result = await ruleFunc({ ...extra, rule, rules, ruleParams, value });
            return handleResult(result);
          } catch (e) {
            return handleResult(typeof e === "string" ? e : (e as any)?.message || e?.toString() || stringify(e));
          }
        };
        return next();
      }, 0);
    });
  }
}

