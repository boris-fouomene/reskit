import { i18n } from "@/i18n";
import { IValidatorResult, IValidatorValidateOptions } from "../types";
import { IPrimitive } from "@/types";
import { Validator } from "../validator";

function Enum<T extends IPrimitive = IPrimitive>({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<Array<T>>): IValidatorResult {
  if (!ruleParams || !ruleParams.length) {
    const message = i18n.t("validator.invalidRuleParams", {
      rule: "Enum",
      field: translatedPropertyName || fieldName,
      ruleParams,
      ...rest,
    });
    return message;
  }
  const exists = ruleParams.some((v) => {
    return v === value || (v !== undefined && v !== null && String(value) == String(v));
  });
  if (!exists) {
    return i18n.t("validator.invalidEnumValue", {
      field: translatedPropertyName || fieldName,
      value,
      expectedValues: ruleParams.map((r) => String(r)).join("|"),
      ...rest,
    });
  }
  return true;
}
export const IsIsEnum = Validator.createRuleDecorator<Array<IPrimitive>>(Enum);
Validator.registerRule("Enum", Enum);
declare module "../types" {
  export interface IValidatorRules {
    /**
     * ### Enum Rule
     *
     * Validates that the field match one of the following value, passed throght rulesParams
     *
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing enum values
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.25.13
     * @public
     */
    Enum: IValidatorRuleFunction;
  }
}
