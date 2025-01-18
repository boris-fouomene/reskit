import exp from "constants";
import { i18n, Translate } from "../../i18n";
import "../../translations";
import {
    Validator, ValidatorHasLength, ValidatorIsEmail, ValidatorIsFileName, ValidatorIsNonNullString, ValidatorIsNumber,
    ValidatorIsNumberGreaterThan,
    ValidatorIsNumberLessThan,
    ValidatorIsRequired,
    ValidatorIsUrl,
    ValidatorNumberIsDifferentFrom,
    ValidatorValidateTargetOptions
} from "../index";


describe("Validator Rules", () => {
    beforeAll(() => {
        i18n.setLocale("en");
    });

    describe("numberLessThanOrEquals 5, and 10", () => {
        it("should validate if the number 5 is less than  or equal to the specified value 10", async () => {
            const result = await Validator.getRules().numberLessThanOrEquals({ value: 5, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("numberLessThan", () => {
        it("should validate if the number is less than the specified value", async () => {
            const result = await Validator.getRules().numberLessThan({ value: 5, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("numberGreaterThanOrEquals", () => {
        it("should validate if the number is greater than or equal to the specified value", async () => {
            const result = await Validator.getRules().numberGreaterThanOrEquals({ value: 10, ruleParams: [5] });
            expect(result).toBe(true);
        });
    });

    describe("numberGreaterThan", () => {
        it("should validate if the number is greater than the specified value", async () => {
            const result = await Validator.getRules().numberGreaterThan({ value: 15, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("numberEquals", () => {
        it("should validate if the number is equal to the specified value", async () => {
            const result = await Validator.getRules().numberEquals({ value: 10, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("numberIsDifferentFrom", () => {
        it("should validate if the number is not equal to the specified value", async () => {
            const result = await Validator.getRules().numberIsDifferentFrom({ value: 5, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("required", () => {
        it("should validate if the value is present", () => {
            const result = Validator.getRules().required({ value: "Hello" });
            expect(result).toBe(true);
        });

        it("should return an error message if the value is not present", () => {
            const result = Validator.getRules().required({ value: "" });
            expect(result).toBe(i18n.t("validator.required"));
        });
    });

    describe("length", () => {
        it("should validate if the string length is within the specified range", () => {
            const result = Validator.getRules().length({ value: "Hello", ruleParams: [3, 10] });
            expect(result).toBe(true);
        });

        it("should return an error message if the string length is not within the specified range", () => {
            const result = Validator.getRules().length({ value: "Hi", ruleParams: [3, 10] });
            expect(result).not.toBe(true);
        });
    });

    describe("email", () => {
        it("should validate if the value is a valid email", () => {
            const result = Validator.getRules().email({ value: "test@example.com" });
            expect(result).toBe(true);
        });

        it("should return an error message if the value is not a valid email", () => {
            const result = Validator.getRules().email({ value: "invalid-email" });
            expect(result).not.toBe(true);
        });
    });

    describe("url", () => {
        it("should validate if the value is a valid URL", () => {
            const result = Validator.getRules().url({ value: "https://example.com" });
            expect(result).toBe(true);
        });

        it("should return an error message if the value is not a valid URL", () => {
            const result = Validator.getRules().url({ value: "invalid-url" });
            expect(result).not.toBe(true);
        });
    });

    describe("minLength", () => {
        it("should validate if the string meets the minimum length requirement", () => {
            const result = Validator.getRules().minLength({ value: "Hello", ruleParams: [3] });
            expect(result).toBe(true);
        });

        it("should return an error message if the string does not meet the minimum length requirement", () => {
            const result = Validator.getRules().minLength({ value: "Hi", ruleParams: [3] });
            expect(result).not.toBe(true);
        });
    });

    describe("maxLength", () => {
        it("should validate if the string does not exceed the maximum length", () => {
            const result = Validator.getRules().maxLength({ value: "Hello", ruleParams: [10] });
            expect(result).toBe(true);
        });

        it("should return an error message if the string exceeds the maximum length", () => {
            const result = Validator.getRules().maxLength({ value: "Hello, World!", ruleParams: [10] });
            expect(result).not.toBe(true);
        });
    });

    describe("fileName", () => {
        it("should validate if the value is a valid file name", () => {
            const result = Validator.getRules().fileName({ value: "validFileName.txt" });
            expect(result).toBe(true);
        });

        it("should return an error message if the value is not a valid file name", () => {
            const result = Validator.getRules().fileName({ value: "invalid/file:name.txt" });
            expect(result).not.toBe(true);
        });
    });

    describe('Test valdidator rules with decorators ', () => {
        @ValidatorValidateTargetOptions({
            /* errorMessageBuilder: (propertyName: string, error: string) => {
                return `property : ${propertyName},  error : ${error}`;
            } */
        })
        class Entity {
            constructor(options?: Entity) {
                try {
                    this.email = options?.email;
                    this.id = options?.id;
                    this.aString = options?.aString;
                    this.name = options?.name;
                    this.note = options?.note;
                    this.url = options?.url;
                } catch (error) {
                    //console.log(error, " instance of Entity");
                }
            }
            @ValidatorIsNumber
            @Translate("validator.tests.entity.id")
            @ValidatorNumberIsDifferentFrom([10])
            id?: number;

            @ValidatorIsRequired
            @ValidatorIsNonNullString
            @Translate("validator.tests.entity.name")
            name?: string;

            @Translate("validator.tests.entity.email")
            @ValidatorIsEmail
            @ValidatorIsRequired
            email?: string;

            @Translate("validator.tests.entity.url")
            @ValidatorIsUrl
            url?: string;

            @ValidatorIsRequired
            @ValidatorIsNumberLessThan([10])
            @ValidatorIsNumberGreaterThan([5])
            @Translate(("validator.tests.entity.note"))
            note?: number;

            @Translate("validator.tests.entity.aString")
            @ValidatorIsRequired
            @ValidatorHasLength([10])
            @ValidatorHasLength([5, 20])
            aString?: string;
        }

        const allRules = Validator.getTargetRules(Entity);
        it("Getting validation rules", async () => {
            expect(allRules).toMatchObject({
                id: expect.arrayContaining(["number", expect.any(Function)]),
                name: expect.arrayContaining(["required", "nonNullString"]),
                email: expect.arrayContaining(["email", "required"]),
                url: ["url"],
                note: expect.arrayContaining(["required", expect.any(Function), expect.any(Function)]),
                aString: expect.arrayContaining([expect.any(Function), expect.any(Function), "required"]),
            });
        })
        it("Validate rules with decorators on entity", async () => {
            const r = await Validator.validateTarget(Entity, {
                id: 10,
                aString: "1234567890",
            });
            expect(r).toMatchObject({
                errors: expect.arrayContaining([
                    "[Id] : This field must be different from 10",
                    "[Name] : This field must be a non null string",
                    "[Email] : This field is required",
                    "[Note] : This field must be greater than 5",
                ]),
                success: false,
            })
        })
    })
});