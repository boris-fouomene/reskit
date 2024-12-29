import { IValidatorRuleFunction, IValidatorRuleName } from "../types";
import { i18n } from "../../i18n";
import "../../translations";
import { Validator } from "../index";

describe("Validator", () => {
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
        it("should sanitize an array of rules", () => {
            const sanitizedRules = Validator.sanitizeRules(["required", "minLength[2]", "maxLength[10]"]);
            expect(sanitizedRules).toEqual({
                invalidRules: [],
                sanitizedRules: [{
                    ruleName: "required",
                    rawRuleName: "required",
                    params: [],
                    ruleFunction: expect.any(Function),
                }, {
                    ruleName: "minLength",
                    rawRuleName: "minLength[2]",
                    params: ["2"],
                    ruleFunction: expect.any(Function),
                }, {
                    ruleName: "maxLength",
                    rawRuleName: "maxLength[10]",
                    params: ["10"],
                    ruleFunction: expect.any(Function),
                }],
            });
        });


        it("should sanitize a function rule", () => {
            const ruleFunction: IValidatorRuleFunction = ({ value }) => value !== null || "Value cannot be null";
            const sanitizedRules = Validator.sanitizeRules([ruleFunction]);
            expect(sanitizedRules).toEqual({ sanitizedRules: [ruleFunction], invalidRules: [] });
        });

        it("should return an empty array for undefined rules", () => {
            const sanitizedRules = Validator.sanitizeRules(undefined);

            expect(sanitizedRules).toEqual({ sanitizedRules: [], invalidRules: [] });
        });
    });

    describe("validate", () => {
        it("should validate a value against the specified rules", async () => {
            const ruleName = "isEven";
            const ruleFunction: IValidatorRuleFunction = ({ value }) => value % 2 === 0 || "The number must be even.";
            Validator.registerRule(ruleName as IValidatorRuleName, ruleFunction);

            const result = await Validator.validate({
                rules: ["isEven" as IValidatorRuleName],
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
                    rules: ["isEven" as IValidatorRuleName],
                    value: 3,
                })
            ).rejects.toMatchObject({
                value: 3,
                rules: ["isEven"],
                message: "The number must be even.",
            });
        });

        it("should resolve with true if no rules are provided", async () => {
            const result = await Validator.validate({
                rules: [],
                value: "test",
            });
            expect(result).toMatchObject({ rules: [], value: "test" });
        });
    });

    describe("validator invalid rules", () => {
        it("should throw an error for an invalid rule", async () => {
            await expect(
                Validator.validate({
                    rules: ["invalidRule" as IValidatorRuleName],
                    value: "test",
                })
            ).rejects.toMatchObject({ message: i18n.t("validator.invalidRule", { rule: "invalidRule" }) });
        });
        it("should throw an error for invalid numberLessThanOrEquals rule", async () => {
            const options = {
                rules: ["numberLessThanOrEquals[10]" as IValidatorRuleName],
                value: "test",
            };
            await expect(
                Validator.validate(options)
            ).rejects.toMatchObject({ message: i18n.t("validator.numberLessThanOrEquals", { ...options, ruleParams: ["10"] }) });
        });
        it("should throw an error for invalid numberLessThan rule", async () => {
            await expect(
                Validator.validate({
                    rules: ["numberLessThan[10]"],
                    value: "test",
                })
            ).rejects.toMatchObject({ message: "This field must be less than 10" });
        });
        it("should throw an error for invalid numberGreaterThanOrEquals rule", async () => {
            await expect(
                Validator.validate({
                    rules: ["numberGreaterThanOrEquals[10]"],
                    value: "test",
                })
            ).rejects.toMatchObject({ message: "This field must be greater than or equal to 10" });
        });
        it("should throw an error for invalid numberGreaterThan rule", async () => {
            await expect(
                Validator.validate({
                    rules: ["numberGreaterThan[10]"],
                    value: "test",
                })
            ).rejects.toMatchObject({ message: "This field must be greater than 10" });
        });
        it("should throw an error for invalid numberEquals rule", async () => {
            await expect(
                Validator.validate({
                    rules: ["numberEquals[10]"],
                    value: "test",
                })
            ).rejects.toMatchObject({ message: "This field must be equal to 10" });
        });
        it("Sould reject from a promise", async () => {
            const errorMessage = "This is an example of a promise rejection";
            Validator.registerRule("promise" as IValidatorRuleName, async () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(errorMessage);
                    }, 100);
                });
            });
            await expect(
                Validator.validate({
                    rules: ["promise" as IValidatorRuleName],
                    value: "test",
                    ruleParams: [10],
                })
            ).rejects.toMatchObject({ message: errorMessage });
        });
    });
});