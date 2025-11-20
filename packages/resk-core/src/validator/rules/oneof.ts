import { Validator } from "../validator";

export const OneOf = Validator.buildOneOfRuleDecorator(function OneOf(options) {
  return Validator.validateOneOfRule(options);
});
