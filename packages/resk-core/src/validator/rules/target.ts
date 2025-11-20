import { Validator } from "../validator";

export const ValidateNested = Validator.buildTargetRuleDecorator(
  function ValidateNested(options) {
    return Validator.validateNestedRule(options as any);
  }
);
