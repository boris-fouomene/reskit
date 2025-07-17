import { i18n, Translate } from "../../i18n";
import "../../translations";

import {
    Validator,
    HasLength,
    HasMinLength,
    HasMaxLength,
    IsEmail,
    IsNonNullString,
    IsNumber,
    IsNumberGreaterThan,
    IsNumberLessThan,
    IsNumberLessThanOrEquals,
    IsNumberGreaterThanOrEquals,
    IsNumberEquals,
    IsNumberIsDifferentFrom,
    IsRequired,
    IsUrl,
    IsFileName,
    IsPhoneNumber,
    IsEmailOrPhoneNumber,
} from "../index";


describe("Validator Rules", () => {
    beforeAll(async () => {
        await i18n.setLocale("en");
    });

    describe("numberLessThanOrEquals 5, and 10", () => {
        it("should validate if the number 5 is less than  or equal to the specified value 10", async () => {
            const result = await Validator.getRules().NumberLessThanOrEquals({ value: 5, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("numberLessThan", () => {
        it("should validate if the number is less than the specified value", async () => {
            const result = await Validator.getRules().NumberLessThan({ value: 5, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("NumberGreaterThanOrEquals", () => {
        it("should validate if the number is greater than or equal to the specified value", async () => {
            const result = await Validator.getRules().NumberGreaterThanOrEquals({ value: 10, ruleParams: [5] });
            expect(result).toBe(true);
        });
    });

    describe("NumberGreaterThan", () => {
        it("should validate if the number is greater than the specified value", async () => {
            const result = await Validator.getRules().NumberGreaterThan({ value: 15, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("numberEquals", () => {
        it("should validate if the number is equal to the specified value", async () => {
            const result = await Validator.getRules().NumberEquals({ value: 10, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("numberIsDifferentFrom", () => {
        it("should validate if the number is not equal to the specified value", async () => {
            const result = await Validator.getRules().NumberIsDifferentFrom({ value: 5, ruleParams: [10] });
            expect(result).toBe(true);
        });
    });

    describe("required", () => {
        it("should validate if the value is present", () => {
            const result = Validator.getRules().Required({ value: "Hello" });
            expect(result).toBe(true);
        });

        it("should return an error message if the value is not present", () => {
            const result = Validator.getRules().Required({ value: "" });
            expect(result).toBe(i18n.t("validator.required"));
        });
    });

    describe("length", () => {
        it("should validate if the string length is within the specified range", () => {
            const result = Validator.getRules().Length({ value: "Hello", ruleParams: [3, 10] });
            expect(result).toBe(true);
        });

        it("should return an error message if the string length is not within the specified range", () => {
            const result = Validator.getRules().Length({ value: "Hi", ruleParams: [3, 10] });
            expect(result).not.toBe(true);
        });
    });

    describe("email", () => {
        it("should validate if the value is a valid email", () => {
            const result = Validator.getRules().Email({ value: "test@example.com" });
            expect(result).toBe(true);
        });

        it("should return an error message if the value is not a valid email", () => {
            const result = Validator.getRules().Email({ value: "invalid-email" });
            expect(result).not.toBe(true);
        });
    });

    describe("url", () => {
        it("should validate if the value is a valid URL", () => {
            const result = Validator.getRules().Url({ value: "https://example.com" });
            expect(result).toBe(true);
        });

        it("should return an error message if the value is not a valid URL", () => {
            const result = Validator.getRules().Url({ value: "invalid-url" });
            expect(result).not.toBe(true);
        });
    });

    describe("minLength", () => {
        it("should validate if the string meets the minimum length requirement", () => {
            const result = Validator.getRules().MinLength({ value: "Hello", ruleParams: [3] });
            expect(result).toBe(true);
        });

        it("should return an error message if the string does not meet the minimum length requirement", () => {
            const result = Validator.getRules().MinLength({ value: "Hi", ruleParams: [3] });
            expect(result).not.toBe(true);
        });
    });

    describe("maxLength", () => {
        it("should validate if the string does not exceed the maximum length", () => {
            const result = Validator.getRules().MaxLength({ value: "Hello", ruleParams: [10] });
            expect(result).toBe(true);
        });

        it("should return an error message if the string exceeds the maximum length", () => {
            const result = Validator.getRules().MaxLength({ value: "Hello, World!", ruleParams: [10] });
            expect(result).not.toBe(true);
        });
    });

    describe("fileName", () => {
        it("should validate if the value is a valid file name", () => {
            const result = Validator.getRules().FileName({ value: "validFileName.txt" });
            expect(result).toBe(true);
        });

        it("should return an error message if the value is not a valid file name", () => {
            const result = Validator.getRules().FileName({ value: "invalid/file:name.txt" });
            expect(result).not.toBe(true);
        });
    });

    describe('Test valdidator rules with decorators ', () => {
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
            @IsNumber
            @Translate("validator.tests.entity.id")
            @IsNumberIsDifferentFrom([10])
            id?: number;

            @IsRequired
            @IsNonNullString
            @Translate("validator.tests.entity.name")
            name?: string;

            @Translate("validator.tests.entity.Email")
            @IsEmail
            @IsRequired
            email?: string;

            @Translate("validator.tests.entity.Url")
            @IsUrl
            url?: string;

            @IsRequired
            @IsNumberLessThan([10])
            @IsNumberGreaterThan([5])
            @Translate(("validator.tests.entity.note"))
            note?: number;

            @Translate("validator.tests.entity.aString")
            @IsRequired
            @HasLength([10])
            @HasLength([5, 20])
            aString?: string;
        }

        const allRules = Validator.getTargetRules(Entity);
        it("Getting validation rules", async () => {
            expect(allRules).toMatchObject({
                id: expect.arrayContaining(["Number", expect.any(Function)]),
                name: expect.arrayContaining(["Required", "NonNullString"]),
                email: expect.arrayContaining(["Email", "Required"]),
                url: ["Url"],
                note: expect.arrayContaining(["Required", expect.any(Function), expect.any(Function)]),
                aString: expect.arrayContaining([expect.any(Function), expect.any(Function), "Required"]),
            });
        })
        it("Validate rules with decorators on entity", async () => {
            try {
                await Validator.validateTarget(Entity, {
                    id: 10,
                    aString: "1234567890",
                });
            } catch (error) {
                expect(error).toMatchObject({
                    message: "Validation failed for 4 fields"
                });
            }
        })
    })
});