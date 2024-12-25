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

    describe("validator invalid rules", () => {
        it("should throw an error for an invalid rule", async () => {
            await expect(
                Validator.validate({
                    rules: "invalidRule",
                    value: "test",
                })
            ).rejects.toMatchObject({ message: i18n.t("validator.invalidRule", { rule: "invalidRule" }) });
        });
        it("should throw an error for invalid numberLessThanOrEquals rule", async () => {
            const options = {
                rules: "numberLessThanOrEquals",
                value: "test",
                ruleParams: [10],
            };
            await expect(
                Validator.validate(options)
            ).rejects.toMatchObject({ message: i18n.t("validator.numberLessThanOrEquals", options) });
        });
        it("should throw an error for invalid numberLessThan rule", async () => {
            await expect(
                Validator.validate({
                    rules: "numberLessThan",
                    value: "test",
                    ruleParams: [10],
                })
            ).rejects.toMatchObject({ message: "This field must be less than 10" });
        });
        it("should throw an error for invalid numberGreaterThanOrEquals rule", async () => {
            await expect(
                Validator.validate({
                    rules: "numberGreaterThanOrEquals",
                    value: "test",
                    ruleParams: [10],
                })
            ).rejects.toMatchObject({ message: "This field must be greater than or equal to 10" });
        });
        it("should throw an error for invalid numberGreaterThan rule", async () => {
            await expect(
                Validator.validate({
                    rules: "numberGreaterThan",
                    value: "test",
                    ruleParams: [10],
                })
            ).rejects.toMatchObject({ message: "This field must be greater than 10" });
        });
        it("should throw an error for invalid numberEquals rule", async () => {
            await expect(
                Validator.validate({
                    rules: "numberEquals",
                    value: "test",
                    ruleParams: [10],
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
                    rules: "promise" as IValidatorRuleName,
                    value: "test",
                    ruleParams: [10],
                })
            ).rejects.toMatchObject({ message: errorMessage });
        });
    });
});