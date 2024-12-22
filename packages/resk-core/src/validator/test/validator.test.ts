import { Validator } from "../validator";
import { IValidatorRuleFunction, IValidatorRuleName } from "../types";

describe("Validator", () => {
    beforeEach(() => {
        // Clear all registered rules before each test
        Reflect.defineMetadata(Validator["RULES_METADATA_KEY"], {}, Validator);
    });

    describe("registerRule", () => {
        it("should register a new validation rule", () => {
            const ruleName = "isEven";
            const ruleFunction: IValidatorRuleFunction = ({ value }) => value % 2 === 0 || "The number must be even.";

            Validator.registerRule(ruleName as IValidatorRuleName, ruleFunction);

            const rules = Validator.getRules();
            expect(rules[ruleName as IValidatorRuleName]).toBe(ruleFunction);
        });
    });

    describe("getRule", () => {
        it("should retrieve a registered validation rule by name", () => {
            const ruleName = "isEven" as IValidatorRuleName;
            const ruleFunction: IValidatorRuleFunction = ({ value }) => value % 2 === 0 || "The number must be even.";

            Validator.registerRule(ruleName, ruleFunction);

            const retrievedRule = Validator.getRule(ruleName);
            expect(retrievedRule).toBe(ruleFunction);
        });

        it("should return undefined for a non-existent rule", () => {
            const retrievedRule = Validator.getRule("nonExistentRule" as IValidatorRuleName);
            expect(retrievedRule).toBeUndefined();
        });
    });

    describe("sanitizeRules", () => {
        it("should sanitize a string of rules", () => {
            const rulesString = "required|minLength[2]|maxLength[10]";
            const sanitizedRules = Validator.sanitizeRules(rulesString);

            expect(sanitizedRules).toEqual(["required", "minLength[2]", "maxLength[10]"]);
        });

        it("should sanitize an array of rules", () => {
            const rulesArray = ["required", "minLength[2]", "maxLength[10]"];
            const sanitizedRules = Validator.sanitizeRules(rulesArray);

            expect(sanitizedRules).toEqual(rulesArray);
        });

        it("should sanitize a function rule", () => {
            const ruleFunction: IValidatorRuleFunction = ({ value }) => value !== null || "Value cannot be null";
            const sanitizedRules = Validator.sanitizeRules(ruleFunction);

            expect(sanitizedRules).toEqual([ruleFunction]);
        });

        it("should return an empty array for undefined rules", () => {
            const sanitizedRules = Validator.sanitizeRules(undefined);

            expect(sanitizedRules).toEqual([]);
        });
    });

    describe("validate", () => {
        it("should validate a value against the specified rules", async () => {
            const ruleName = "isEven";
            const ruleFunction: IValidatorRuleFunction = ({ value }) => value % 2 === 0 || "The number must be even.";

            Validator.registerRule(ruleName as IValidatorRuleName, ruleFunction);

            const result = await Validator.validate({
                rules: "isEven",
                value: 4,
            });

            expect(result).toEqual({ value: 4, rules: ["isEven"] });
        });

        it("should reject with an error message if validation fails", async () => {
            const ruleName = "isEven";
            const ruleFunction: IValidatorRuleFunction = ({ value }) => value % 2 === 0 || "The number must be even.";

            Validator.registerRule(ruleName as IValidatorRuleName, ruleFunction);

            await expect(
                Validator.validate({
                    rules: "isEven",
                    value: 3,
                })
            ).rejects.toEqual({
                value: 3,
                rules: ["isEven"],
                rule: "isEven",
                message: "The number must be even.",
            });
        });

        it("should resolve with true if no rules are provided", async () => {
            const result = await Validator.validate({
                rules: [],
                value: "test",
            });

            expect(result).toBe(true);
        });
    });
});