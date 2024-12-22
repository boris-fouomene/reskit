import { IFormValidationRule, IFormValidationRuleOptions, IFormValidationRules, IFormValidationRuleSeparator } from "./types";
import { i18n, isNonNullString, isObj, isPromise, stringify } from "@resk/core";

const RULE_SEPARATOR: IFormValidationRuleSeparator = "|";


/**
 * A decorator function for registering a validation rule.
 * 
 * This function can be used to annotate methods in a class as validation rules.
 * When applied, it registers the method with the specified name in the `FormValidation` class,
 * allowing it to be used as a validation rule in form validation scenarios.
 * 
 * @param {string} name - The name of the validation rule to register. This name will be used
 *                        to reference the rule when performing validation.
 * 
 * @returns {MethodDecorator} A method decorator that registers the method as a validation rule.
 * 
 * ### Example:
 * 
 * ```typescript
 * import { FormValidation, FormValidationRule } from "@resk/expo";
 * @FormValidationRule("isEven")
 * const validateEven({ value }: { value: number }): boolean | string {
 *      return value % 2 === 0 || "The number must be even.";
 * }
 * 
 * // Usage in validation
 * const rules = FormValidation.getValidationRule("isEven");
 * const result = rules({ value: 4 }); // Returns true
 * ```
 * 
 * In this example, the `validateEven` method is registered as a validation rule named "isEven".
 * When the rule is called, it checks if the provided value is even and returns an appropriate message if not.
 */
export function FormValidationRule(name: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    if (descriptor?.value instanceof Function) {
      FormValidation.registerRule(name, descriptor.value as IFormValidationRule);
    }
  };
}

/**
 * @class FormValidation
 * A class that provides methods for validating form fields based on defined rules.
 * 
 * The `FormValidation` class allows you to define validation rules, sanitize them,
 * and validate values against those rules. It supports both synchronous and asynchronous
 * validation, making it flexible for various use cases.
 */
export class FormValidation {
  // Metadata key for storing validation rules
  private static readonly RULES_METADATA_KEY = Symbol("validationRules");

  /**
   * Register a new validation rule.
   * @param name The name of the rule.
   * @param handler The validation function.
   */
  static registerRule(name: string, handler: IFormValidationRule): void {
    const rules = this.validationRules;
    Reflect.defineMetadata(this.RULES_METADATA_KEY, rules, this);
  }
  static getRules(): Record<string, IFormValidationRule> {
    return this.validationRules;
  }
  /**
   * A static getter that returns a record of validation rules.
   * 
   * @returns {Record<string, IFormValidationRule>} An object containing validation rules.
   */
  static get validationRules(): Record<string, IFormValidationRule> {
    const rules = Reflect.getMetadata(this.RULES_METADATA_KEY, this);
    return isObj(rules) ? rules : {};
  }
  /**
   * Retrieves a validation rule by its name.
   * 
   * @param {string} rulesName - The name of the validation rule to retrieve.
   * @returns {IFormValidationRule | undefined} The validation rule if found, otherwise undefined.
   */
  static getRule(rulesName: string): IFormValidationRule | undefined {
    if (!isNonNullString(rulesName)) return undefined;
    return this.validationRules[rulesName];
  }
  /**
   * Sanitizes a set of validation rules and returns an array of rules.
   * 
   * This method takes a list of validation rules, which can be in various formats,
   * and returns an array of sanitized rules ready for validation.
   * 
   * @param {IFormValidationRules} rules - The list of validation rules. The rules can be:
   * - A string (e.g., "required|minLength[2]|maxLength[10]") with multiple rules separated by `|`.
   * - An array of rules (e.g., ["required", "minLength[2]", "maxLength[10]"]).
   * - A function that performs validation.
   * 
   * @returns {IFormValidationRule[]} An array of sanitized validation rules.
   */
  static sanitizeRules(rules?: IFormValidationRules): IFormValidationRule[] {
    const result: IFormValidationRule[] = [];
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
   * @param {IFormValidationRuleOptions} options - The options for validation, including:
   * - `value`: The value to validate.
   * - `rules`: An array of validation rules to apply.
   * - `...extra`: Any additional options that may be applied.
   * 
   * @returns {Promise<any>} A promise that resolves with the validation result or rejects with an error.
   * 
   * ### Example:
   * ```typescript
   * FormValidation.validate({
   *     rules: "minLength[5]|maxLength[10]",
   *     value: "test",
   * }).then(result => {
   *     console.log("Validation passed:", result);
   * }).catch(error => {
   *     console.error("Validation failed:", error);
   * });
   * ```
   */
  static validate({ rules, value, ...extra }: IFormValidationRuleOptions) {
    rules = this.sanitizeRules(rules);
    if (!rules.length) return Promise.resolve(true);
    const i18nRulesOptions = {
      ...extra,
      value,
      rules,
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let index = -1;
        const rulesLength = rules.length;
        const next = function (): any {
          index++;
          if (index >= rulesLength) {
            return resolve({ value, rules, ...extra });
          }
          const rule = rules[index];
          const ruleParams: any[] = [];
          let ruleFunc: IFormValidationRule | undefined = typeof rule === "function" ? rule : undefined;
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
            ruleFunc = FormValidation.getRule(vRule);
          }
          const valResult = { value, rule, rules, ...extra };
          const i18nRuleOptions = { ...i18nRulesOptions, rule: stringify(rule) };
          if (typeof ruleFunc !== "function") {
            return reject({ ...valResult, message: i18n.t("form.validation.invalidRule", i18nRuleOptions) });
          }
          let r = undefined;
          try {
            r = ruleFunc({ ...extra, rule, rules, ruleParams, value });
          } catch (e) {
            r = typeof e === "string" ? e : (e as any)?.message || e?.toString() || stringify(e);
          }
          if (typeof r === "string" || r === false) {
            return reject({ ...valResult, message: r ? String(r) : i18n.t("form.validation.invalidValidationMessage", i18nRuleOptions), value, rules, rule });
          } else if (isPromise(r)) {
            return Promise.resolve(r)
              .then((a: any) => {
                return next();
              })
              .catch((e: any) => {
                return reject({
                  ...valResult,
                  message: typeof e === "string" ? e : e?.message || e?.toString() || stringify(e),
                  error: e,
                });
              });
          } else {
            return next();
          }
        };
        return next();
      }, 0);
    });
  }
}

