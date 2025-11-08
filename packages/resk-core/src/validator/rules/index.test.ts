import { i18n, Translate } from "../../i18n";
import "../../translations";

import {
  HasLength,
  IsEmail,
  IsEmpty,
  IsNonNullString,
  IsNullable,
  IsNumber,
  IsNumberGreaterThan,
  IsNumberIsDifferentFrom,
  IsNumberLessThan,
  IsRequired,
  IsSometimes,
  IsUrl,
  Validator,
} from "../index";

describe("Validator Rules", () => {
  beforeAll(async () => {
    await i18n.setLocale("en");
  });

  describe("numberLessThanOrEquals 5, and 10", () => {
    it("should validate if the number 5 is less than  or equal to the specified value 10", async () => {
      const result = await Validator.getRules().NumberLessThanOrEquals({
        value: 5,
        ruleParams: [10],
      });
      expect(result).toBe(true);
    });
  });

  describe("numberLessThan", () => {
    it("should validate if the number is less than the specified value", async () => {
      const result = await Validator.getRules().NumberLessThan({
        value: 5,
        ruleParams: [10],
      });
      expect(result).toBe(true);
    });
  });

  describe("NumberGreaterThanOrEquals", () => {
    it("should validate if the number is greater than or equal to the specified value", async () => {
      const result = await Validator.getRules().NumberGreaterThanOrEquals({
        value: 10,
        ruleParams: [5],
      });
      expect(result).toBe(true);
    });
  });

  describe("NumberGreaterThan", () => {
    it("should validate if the number is greater than the specified value", async () => {
      const result = await Validator.getRules().NumberGreaterThan({
        value: 15,
        ruleParams: [10],
      });
      expect(result).toBe(true);
    });
  });

  describe("numberEquals", () => {
    it("should validate if the number is equal to the specified value", async () => {
      const result = await Validator.getRules().NumberEquals({
        value: 10,
        ruleParams: [10],
      });
      expect(result).toBe(true);
    });
  });

  describe("numberIsDifferentFrom", () => {
    it("should validate if the number is not equal to the specified value", async () => {
      const result = await Validator.getRules().NumberIsDifferentFrom({
        value: 5,
        ruleParams: [10],
      });
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
      const result = Validator.getRules().Length({
        value: "Hello",
        ruleParams: [3, 10],
      });
      expect(result).toBe(true);
    });

    it("should return an error message if the string length is not within the specified range", () => {
      const result = Validator.getRules().Length({
        value: "Hi",
        ruleParams: [3, 10],
      });
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
      const result = Validator.getRules().MinLength({
        value: "Hello",
        ruleParams: [3],
      });
      expect(result).toBe(true);
    });

    it("should return an error message if the string does not meet the minimum length requirement", () => {
      const result = Validator.getRules().MinLength({
        value: "Hi",
        ruleParams: [3],
      });
      expect(result).not.toBe(true);
    });
  });

  describe("maxLength", () => {
    it("should validate if the string does not exceed the maximum length", () => {
      const result = Validator.getRules().MaxLength({
        value: "Hello",
        ruleParams: [10],
      });
      expect(result).toBe(true);
    });

    it("should return an error message if the string exceeds the maximum length", () => {
      const result = Validator.getRules().MaxLength({
        value: "Hello, World!",
        ruleParams: [10],
      });
      expect(result).not.toBe(true);
    });
  });

  describe("fileName", () => {
    it("should validate if the value is a valid file name", () => {
      const result = Validator.getRules().FileName({
        value: "validFileName.txt",
      });
      expect(result).toBe(true);
    });

    it("should return an error message if the value is not a valid file name", () => {
      const result = Validator.getRules().FileName({
        value: "invalid/file:name.txt",
      });
      expect(result).not.toBe(true);
    });
  });

  describe("Test valdidator rules with decorators ", () => {
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
      @Translate("validator.tests.entity.note")
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
        note: expect.arrayContaining([
          "Required",
          expect.any(Function),
          expect.any(Function),
        ]),
        aString: expect.arrayContaining([
          expect.any(Function),
          expect.any(Function),
          "Required",
        ]),
      });
    });
    it("Validate rules with decorators on entity", async () => {
      try {
        await Validator.validateTarget(Entity, {
          id: 10,
          aString: "1234567890",
        });
      } catch (error) {
        expect(error).toMatchObject({
          message: "Validation failed for 4 fields",
        });
      }
    });
  });

  describe("Nullable Validation Rules", () => {
    describe("Empty Rule", () => {
      describe("Rule Function", () => {
        it("should always return true (Empty rule always passes)", () => {
          expect(Validator.getRules().Empty({ value: "" })).toBe(true);
          expect(Validator.getRules().Empty({ value: null })).toBe(true);
          expect(Validator.getRules().Empty({ value: undefined })).toBe(true);
          expect(Validator.getRules().Empty({ value: "test" })).toBe(true);
          expect(Validator.getRules().Empty({ value: 123 })).toBe(true);
          expect(Validator.getRules().Empty({ value: [] })).toBe(true);
          expect(Validator.getRules().Empty({ value: {} })).toBe(true);
        });
      });

      describe("Validation Behavior", () => {
        it("should skip validation when value is empty string", async () => {
          const result = await Validator.validate({
            value: "",
            rules: ["Empty", "Required"],
          });
          expect(result.success).toBe(true);
        });

        it("should apply other rules when value is not empty string", async () => {
          await expect(
            Validator.validate({
              value: null,
              rules: ["Empty", "Required"],
            })
          ).rejects.toBeDefined();
        });

        it("should apply other rules when value is undefined", async () => {
          await expect(
            Validator.validate({
              value: undefined,
              rules: ["Empty", "Required"],
            })
          ).rejects.toThrow();
        });

        it("should apply other rules when value is valid", async () => {
          const result = await Validator.validate({
            value: "valid",
            rules: ["Empty", "Required"],
          });
          expect(result.success).toBe(true);
        });

        it("should apply other rules when value is invalid", async () => {
          await expect(
            Validator.validate({
              value: "",
              rules: ["Empty", "Email"],
            })
          ).rejects.toThrow();
        });
      });

      describe("Decorator", () => {
        class TestEntity {
          @IsEmpty
          @IsRequired
          emptyField?: string;

          @IsEmpty
          @IsEmail
          optionalEmail?: string;
        }

        it("should register Empty rule in target rules", () => {
          const rules = Validator.getTargetRules(TestEntity);
          expect(rules.emptyField).toContain("Empty");
          expect(rules.optionalEmail).toContain("Empty");
        });

        it("should skip validation for empty string with decorator", async () => {
          const result = await Validator.validateTarget(TestEntity, {
            emptyField: "",
            optionalEmail: "",
          });
          expect(result.data?.emptyField).toBe("");
          expect(result.data?.optionalEmail).toBe("");
        });

        it("should apply other rules when not empty string", async () => {
          await expect(
            Validator.validateTarget(TestEntity, {
              emptyField: null,
              optionalEmail: "invalid-email",
            })
          ).rejects.toThrow();
        });
      });
    });

    describe("Nullable Rule", () => {
      describe("Rule Function", () => {
        it("should always return true (Nullable rule always passes)", () => {
          expect(Validator.getRules().Nullable({ value: null })).toBe(true);
          expect(Validator.getRules().Nullable({ value: undefined })).toBe(
            true
          );
          expect(Validator.getRules().Nullable({ value: "" })).toBe(true);
          expect(Validator.getRules().Nullable({ value: "test" })).toBe(true);
          expect(Validator.getRules().Nullable({ value: 123 })).toBe(true);
          expect(Validator.getRules().Nullable({ value: [] })).toBe(true);
          expect(Validator.getRules().Nullable({ value: {} })).toBe(true);
        });
      });

      describe("Validation Behavior", () => {
        it("should skip validation when value is null", async () => {
          const result = await Validator.validate({
            value: null,
            rules: ["Nullable", "Required"],
          });
          expect(result.success).toBe(true);
        });

        it("should skip validation when value is undefined", async () => {
          const result = await Validator.validate({
            value: undefined,
            rules: ["Nullable", "Required"],
          });
          expect(result.success).toBe(true);
        });

        it("should apply other rules when value is empty string", async () => {
          await expect(
            Validator.validate({
              value: "",
              rules: ["Nullable", "Required"],
            })
          ).rejects.toThrow();
        });

        it("should apply other rules when value is valid", async () => {
          const result = await Validator.validate({
            value: "valid",
            rules: ["Nullable", "Required"],
          });
          expect(result.success).toBe(true);
        });

        it("should apply other rules when value is invalid", async () => {
          await expect(
            Validator.validate({
              value: "invalid-email",
              rules: ["Nullable", "Email"],
            })
          ).rejects.toThrow();
        });

        it("should skip validation for null even with strict rules", async () => {
          const result = await Validator.validate({
            value: null,
            rules: ["Nullable", "NonNullString"],
          });
          expect(result.success).toBe(true);
        });

        it("should skip validation for undefined even with strict rules", async () => {
          const result = await Validator.validate({
            value: undefined,
            rules: ["Nullable", "NonNullString"],
          });
          expect(result.success).toBe(true);
        });
      });

      describe("Decorator", () => {
        class TestEntity {
          @IsNullable
          @IsRequired
          nullableField?: string;

          @IsNullable
          @IsEmail
          optionalEmail?: string;

          @IsNullable
          @IsNonNullString
          strictString?: string;
        }

        it("should register Nullable rule in target rules", () => {
          const rules = Validator.getTargetRules(TestEntity);
          expect(rules.nullableField).toContain("Nullable");
          expect(rules.optionalEmail).toContain("Nullable");
          expect(rules.strictString).toContain("Nullable");
        });

        it("should skip validation for null with decorator", async () => {
          const result = await Validator.validateTarget(TestEntity, {
            nullableField: null,
            optionalEmail: null,
            strictString: null,
          });
          expect(result.data?.nullableField).toBe(null);
          expect(result.data?.optionalEmail).toBe(null);
          expect(result.data?.strictString).toBe(null);
        });

        it("should skip validation for undefined with decorator", async () => {
          const result = await Validator.validateTarget(TestEntity, {
            nullableField: undefined,
            optionalEmail: undefined,
            strictString: undefined,
          });
          expect(result.data?.nullableField).toBe(undefined);
          expect(result.data?.optionalEmail).toBe(undefined);
          expect(result.data?.strictString).toBe(undefined);
        });

        it("should apply other rules when value is empty string", async () => {
          await expect(
            Validator.validateTarget(TestEntity, {
              nullableField: "",
              optionalEmail: "invalid-email",
              strictString: "",
            })
          ).rejects.toThrow();
        });

        it("should apply other rules when value is valid", async () => {
          const result = await Validator.validateTarget(TestEntity, {
            nullableField: "valid",
            optionalEmail: "test@example.com",
            strictString: "non-empty",
          });
          expect(result.data?.nullableField).toBe("valid");
          expect(result.data?.optionalEmail).toBe("test@example.com");
          expect(result.data?.strictString).toBe("non-empty");
        });
      });
    });

    describe("Sometimes Rule", () => {
      describe("Rule Function", () => {
        it("should always return true (Sometimes rule always passes)", () => {
          expect(Validator.getRules().Sometimes({ value: undefined })).toBe(
            true
          );
          expect(Validator.getRules().Sometimes({ value: null })).toBe(true);
          expect(Validator.getRules().Sometimes({ value: "" })).toBe(true);
          expect(Validator.getRules().Sometimes({ value: "test" })).toBe(true);
          expect(Validator.getRules().Sometimes({ value: 123 })).toBe(true);
          expect(Validator.getRules().Sometimes({ value: [] })).toBe(true);
          expect(Validator.getRules().Sometimes({ value: {} })).toBe(true);
        });
      });

      describe("Validation Behavior", () => {
        it("should skip validation when value is undefined", async () => {
          const result = await Validator.validate({
            value: undefined,
            rules: ["Sometimes", "Required"],
          });
          expect(result.success).toBe(true);
        });

        it("should apply other rules when value is null", async () => {
          await expect(
            Validator.validate({
              value: null,
              rules: ["Sometimes", "Required"],
            })
          ).rejects.toThrow();
        });

        it("should apply other rules when value is empty string", async () => {
          await expect(
            Validator.validate({
              value: "",
              rules: ["Sometimes", "Required"],
            })
          ).rejects.toThrow();
        });

        it("should apply other rules when value is valid", async () => {
          const result = await Validator.validate({
            value: "valid",
            rules: ["Sometimes", "Required"],
          });
          expect(result.success).toBe(true);
        });

        it("should apply other rules when value is invalid", async () => {
          await expect(
            Validator.validate({
              value: "invalid-email",
              rules: ["Sometimes", "Email"],
            })
          ).rejects.toThrow();
        });

        it("should skip validation for undefined even with strict rules", async () => {
          const result = await Validator.validate({
            value: undefined,
            rules: ["Sometimes", "NonNullString"],
          });
          expect(result.success).toBe(true);
        });

        it("should apply validation for null with strict rules", async () => {
          await expect(
            Validator.validate({
              value: null,
              rules: ["Sometimes", "NonNullString"],
            })
          ).rejects.toThrow();
        });
      });

      describe("Decorator", () => {
        class TestEntity {
          @IsSometimes
          @IsRequired
          sometimesField?: string;

          @IsSometimes
          @IsEmail
          optionalEmail?: string;

          @IsSometimes
          @IsNonNullString
          strictString?: string;
        }

        it("should register Sometimes rule in target rules", () => {
          const rules = Validator.getTargetRules(TestEntity);
          expect(rules.sometimesField).toContain("Sometimes");
          expect(rules.optionalEmail).toContain("Sometimes");
          expect(rules.strictString).toContain("Sometimes");
        });

        it("should skip validation for undefined with decorator", async () => {
          const result = await Validator.validateTarget(TestEntity, {
            sometimesField: undefined,
            optionalEmail: undefined,
            strictString: undefined,
          });
          expect(result.data?.sometimesField).toBe(undefined);
          expect(result.data?.optionalEmail).toBe(undefined);
          expect(result.data?.strictString).toBe(undefined);
        });

        it("should skip validation when field is absent from data", async () => {
          const result = await Validator.validateTarget(TestEntity, {});
          expect(result.data).toEqual({});
        });

        it("should apply other rules when value is null", async () => {
          await expect(
            Validator.validateTarget(TestEntity, {
              sometimesField: null,
              optionalEmail: "invalid-email",
              strictString: null,
            })
          ).rejects.toThrow();
        });

        it("should apply other rules when value is empty string", async () => {
          await expect(
            Validator.validateTarget(TestEntity, {
              sometimesField: "",
              optionalEmail: "invalid-email",
              strictString: "",
            })
          ).rejects.toThrow();
        });

        it("should apply other rules when value is valid", async () => {
          const result = await Validator.validateTarget(TestEntity, {
            sometimesField: "valid",
            optionalEmail: "test@example.com",
            strictString: "non-empty",
          });
          expect(result.data?.sometimesField).toBe("valid");
          expect(result.data?.optionalEmail).toBe("test@example.com");
          expect(result.data?.strictString).toBe("non-empty");
        });
      });
    });

    describe("Rule Combinations", () => {
      it("should handle multiple nullable rules (Empty takes precedence)", async () => {
        const result = await Validator.validate({
          value: "",
          rules: ["Empty", "Nullable", "Sometimes", "Required"],
        });
        expect(result.success).toBe(true);
      });

      it("should handle multiple nullable rules (Nullable takes precedence over Sometimes)", async () => {
        const result = await Validator.validate({
          value: null,
          rules: ["Nullable", "Sometimes", "Required"],
        });
        expect(result.success).toBe(true);
      });

      it("should handle Sometimes rule when value is undefined", async () => {
        const result = await Validator.validate({
          value: undefined,
          rules: ["Sometimes", "Nullable", "Required"],
        });
        expect(result.success).toBe(true);
      });

      it("should apply validation when no nullable conditions are met", async () => {
        await expect(
          Validator.validate({
            value: "invalid",
            rules: ["Empty", "Nullable", "Sometimes", "Email"],
          })
        ).rejects.toThrow();
      });
    });

    describe("Edge Cases", () => {
      it("should handle zero as valid value (not skipped)", async () => {
        const result = await Validator.validate({
          value: 0,
          rules: ["Nullable", "Required"],
        });
        expect(result.success).toBe(true);
      });

      it("should handle false as valid value (not skipped)", async () => {
        const result = await Validator.validate({
          value: false,
          rules: ["Nullable", "Required"],
        });
        expect(result.success).toBe(true);
      });

      it("should handle empty array as valid value (not skipped)", async () => {
        const result = await Validator.validate({
          value: [],
          rules: ["Nullable", "Required"],
        });
        expect(result.success).toBe(true);
      });

      it("should handle empty object as valid value (not skipped)", async () => {
        const result = await Validator.validate({
          value: {},
          rules: ["Nullable", "Required"],
        });
        expect(result.success).toBe(true);
      });

      it("should handle NaN as valid value (not skipped)", async () => {
        const result = await Validator.validate({
          value: NaN,
          rules: ["Nullable", "Required"],
        });
        expect(result.success).toBe(true);
      });
    });

    describe("Integration with validateTarget", () => {
      class ComprehensiveEntity {
        @IsRequired
        @IsEmail
        requiredEmail: string = "";

        @IsEmpty
        @IsEmail
        emptyEmail?: string;

        @IsNullable
        @IsEmail
        nullableEmail?: string;

        @IsSometimes
        @IsEmail
        sometimesEmail?: string;

        @IsEmpty
        @IsRequired
        emptyRequired?: string;

        @IsNullable
        @IsRequired
        nullableRequired?: string;

        @IsSometimes
        @IsRequired
        sometimesRequired?: string;
      }

      it("should validate complex entity with all nullable rules", async () => {
        const validData = {
          requiredEmail: "test@example.com",
          emptyEmail: "",
          nullableEmail: null,
          sometimesEmail: undefined,
          emptyRequired: "",
          nullableRequired: null,
          sometimesRequired: undefined,
        };

        const result = await Validator.validateTarget(
          ComprehensiveEntity,
          validData
        );
        expect(result.data).toEqual(validData);
      });

      it("should fail when required fields are missing", async () => {
        await expect(
          Validator.validateTarget(ComprehensiveEntity, {
            emptyEmail: "",
            nullableEmail: null,
            sometimesEmail: undefined,
            emptyRequired: "",
            nullableRequired: null,
            sometimesRequired: undefined,
          })
        ).rejects.toThrow();
      });

      it("should fail when nullable fields have invalid values", async () => {
        await expect(
          Validator.validateTarget(ComprehensiveEntity, {
            requiredEmail: "test@example.com",
            emptyEmail: "invalid-email",
            nullableEmail: "invalid-email",
            sometimesEmail: "invalid-email",
            emptyRequired: "",
            nullableRequired: null,
            sometimesRequired: undefined,
          })
        ).rejects.toThrow();
      });

      it("should skip Sometimes fields when absent from data", async () => {
        const result = await Validator.validateTarget(ComprehensiveEntity, {
          requiredEmail: "test@example.com",
          emptyRequired: "",
          nullableRequired: null,
          // sometimesEmail and sometimesRequired are absent
        });
        expect(result.data?.requiredEmail).toBe("test@example.com");
        expect(result.data?.emptyRequired).toBe("");
        expect(result.data?.nullableRequired).toBe(null);
      });
    });
  });
});
