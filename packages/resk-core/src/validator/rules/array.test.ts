import { i18n } from "../../i18n";
import "../../translations";
import { Validator } from "../validator";
import { ArrayContains, ArrayLength, ArrayMaxLength, ArrayMinLength, ArrayUnique, IsArray } from "./array";

describe("Array Validation Rules", () => {
  beforeAll(async () => {
    await i18n.setLocale("en");
  });

  describe("Array Rule", () => {
    describe("Rule Function", () => {
      it("should validate arrays", async () => {
        const result = await Validator.getRules().Array({
          value: [1, 2, 3],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should validate empty arrays", async () => {
        const result = await Validator.getRules().Array({
          value: [],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should reject non-arrays", async () => {
        const result = await Validator.getRules().Array({
          value: "not an array",
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject null", async () => {
        const result = await Validator.getRules().Array({
          value: null,
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject undefined", async () => {
        const result = await Validator.getRules().Array({
          value: undefined,
          i18n,
        });
        expect(result).not.toBe(true);
      });
    });

    describe("Validation Behavior", () => {
      it("should validate array with programmatic API", async () => {
        const result = await Validator.validate({
          value: [1, 2, 3],
          rules: ["Array"],
        });
        expect(result.success).toBe(true);
      });

      it("should reject non-array with programmatic API", async () => {
        const result = await Validator.validate({
          value: "not an array",
          rules: ["Array"],
        });
        expect(result.success).toBe(false);
      });
    });

    describe("Decorator", () => {
      class TestEntity {
        @IsArray
        items?: any[];
      }

      it("should register Array rule in target rules", () => {
        const rules = Validator.getTargetRules(TestEntity);
        expect(rules.items).toContain("Array");
      });

      it("should validate array with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          items: [1, 2, 3],
        });
        expect(result.data?.items).toEqual([1, 2, 3]);
      });

      it("should reject non-array with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          items: "not an array",
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe("ArrayMinLength Rule", () => {
    describe("Rule Function", () => {
      it("should validate arrays with sufficient length", async () => {
        const result = await Validator.getRules().ArrayMinLength({
          value: [1, 2, 3],
          ruleParams: [2],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should validate arrays with exact minimum length", async () => {
        const result = await Validator.getRules().ArrayMinLength({
          value: [1, 2],
          ruleParams: [2],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should reject arrays with insufficient length", async () => {
        const result = await Validator.getRules().ArrayMinLength({
          value: [1],
          ruleParams: [2],
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject non-arrays", async () => {
        const result = await Validator.getRules().ArrayMinLength({
          value: "not an array",
          ruleParams: [1],
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject invalid parameters", async () => {
        const result = await Validator.getRules().ArrayMinLength({
          value: [1, 2, 3],
          ruleParams: [-1],
          i18n,
        });
        expect(result).not.toBe(true);
      });
    });

    describe("Validation Behavior", () => {
      it("should validate with programmatic API", async () => {
        const result = await Validator.validate({
          value: [1, 2, 3],
          rules: [{ ArrayMinLength: [2] }],
        });
        expect(result.success).toBe(true);
      });

      it("should reject insufficient length with programmatic API", async () => {
        const result = await Validator.validate({
          value: [1],
          rules: [{ ArrayMinLength: [2] }],
        });
        expect(result.success).toBe(false);
      });
    });

    describe("Decorator", () => {
      class TestEntity {
        @ArrayMinLength([2])
        items?: any[];
      }

      it("should register ArrayMinLength rule in target rules", () => {
        const rules = Validator.getTargetRules(TestEntity);
        expect(rules.items).toContainEqual(expect.any(Function));
      });

      it("should validate sufficient length with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          items: [1, 2, 3],
        });
        expect(result.data?.items).toEqual([1, 2, 3]);
      });

      it("should reject insufficient length with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          items: [1],
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe("ArrayMaxLength Rule", () => {
    describe("Rule Function", () => {
      it("should validate arrays with length under maximum", async () => {
        const result = await Validator.getRules().ArrayMaxLength({
          value: [1, 2],
          ruleParams: [3],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should validate arrays with exact maximum length", async () => {
        const result = await Validator.getRules().ArrayMaxLength({
          value: [1, 2, 3],
          ruleParams: [3],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should reject arrays exceeding maximum length", async () => {
        const result = await Validator.getRules().ArrayMaxLength({
          value: [1, 2, 3, 4],
          ruleParams: [3],
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject non-arrays", async () => {
        const result = await Validator.getRules().ArrayMaxLength({
          value: "not an array",
          ruleParams: [3],
          i18n,
        });
        expect(result).not.toBe(true);
      });
    });

    describe("Validation Behavior", () => {
      it("should validate with programmatic API", async () => {
        const result = await Validator.validate({
          value: [1, 2],
          rules: [{ ArrayMaxLength: [3] }],
        });
        expect(result.success).toBe(true);
      });

      it("should reject excessive length with programmatic API", async () => {
        const result = await Validator.validate({
          value: [1, 2, 3, 4],
          rules: [{ ArrayMaxLength: [3] }],
        });
        expect(result.success).toBe(false);
      });
    });

    describe("Decorator", () => {
      class TestEntity {
        @ArrayMaxLength([3])
        items?: any[];
      }

      it("should validate under maximum length with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          items: [1, 2],
        });
        expect(result.data?.items).toEqual([1, 2]);
      });

      it("should reject excessive length with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          items: [1, 2, 3, 4],
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe("ArrayLength Rule", () => {
    describe("Rule Function", () => {
      it("should validate arrays with exact length", async () => {
        const result = await Validator.getRules().ArrayLength({
          value: [1, 2, 3],
          ruleParams: [3],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should reject arrays with different length", async () => {
        const result = await Validator.getRules().ArrayLength({
          value: [1, 2],
          ruleParams: [3],
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject non-arrays", async () => {
        const result = await Validator.getRules().ArrayLength({
          value: "not an array",
          ruleParams: [3],
          i18n,
        });
        expect(result).not.toBe(true);
      });
    });

    describe("Validation Behavior", () => {
      it("should validate exact length with programmatic API", async () => {
        const result = await Validator.validate({
          value: [1, 2, 3],
          rules: [{ ArrayLength: [3] }],
        });
        expect(result.success).toBe(true);
      });

      it("should reject wrong length with programmatic API", async () => {
        const result = await Validator.validate({
          value: [1, 2],
          rules: [{ ArrayLength: [3] }],
        });
        expect(result.success).toBe(false);
      });
    });

    describe("Decorator", () => {
      class TestEntity {
        @ArrayLength([3])
        coordinates?: number[];
      }

      it("should validate exact length with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          coordinates: [1, 2, 3],
        });
        expect(result.data?.coordinates).toEqual([1, 2, 3]);
      });

      it("should reject wrong length with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          coordinates: [1, 2],
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe("ArrayContains Rule", () => {
    describe("Rule Function", () => {
      it("should validate arrays containing all required values", async () => {
        const result = await Validator.getRules().ArrayContains({
          value: [1, 2, 3, 4],
          ruleParams: [2, 3],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should validate arrays with object comparison", async () => {
        const result = await Validator.getRules().ArrayContains({
          value: [{ id: 1 }, { id: 2 }, { id: 3 }],
          ruleParams: [{ id: 2 }],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should reject arrays missing required values", async () => {
        const result = await Validator.getRules().ArrayContains({
          value: [1, 2, 3],
          ruleParams: [4],
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject non-arrays", async () => {
        const result = await Validator.getRules().ArrayContains({
          value: "not an array",
          ruleParams: [1],
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject empty rule parameters", async () => {
        const result = await Validator.getRules().ArrayContains({
          value: [1, 2, 3],
          ruleParams: [],
          i18n,
        });
        expect(result).not.toBe(true);
      });
    });

    describe("Validation Behavior", () => {
      it("should validate containing values with programmatic API", async () => {
        const result = await Validator.validate({
          value: ["read", "write", "delete"],
          rules: [{ ArrayContains: ["read", "write"] }],
        });
        expect(result.success).toBe(true);
      });

      it("should reject missing values with programmatic API", async () => {
        const result = await Validator.validate({
          value: ["read", "write"],
          rules: [{ ArrayContains: ["read", "delete"] }],
        });
        expect(result.success).toBe(false);
      });
    });

    describe("Decorator", () => {
      class TestEntity {
        @ArrayContains(["read"])
        permissions?: string[];
      }

      it("should validate containing values with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          permissions: ["read", "write", "delete"],
        });
        expect(result.data?.permissions).toEqual(["read", "write", "delete"]);
      });

      it("should reject missing values with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          permissions: ["write", "delete"],
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe("ArrayUnique Rule", () => {
    describe("Rule Function", () => {
      it("should validate arrays with unique primitive values", async () => {
        const result = await Validator.getRules().ArrayUnique({
          value: [1, 2, 3],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should validate arrays with unique string values", async () => {
        const result = await Validator.getRules().ArrayUnique({
          value: ["a", "b", "c"],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should validate arrays with unique objects", async () => {
        const result = await Validator.getRules().ArrayUnique({
          value: [{ id: 1 }, { id: 2 }, { id: 3 }],
          i18n,
        });
        expect(result).toBe(true);
      });

      it("should reject arrays with duplicate primitives", async () => {
        const result = await Validator.getRules().ArrayUnique({
          value: [1, 2, 2, 3],
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject arrays with duplicate objects", async () => {
        const result = await Validator.getRules().ArrayUnique({
          value: [{ id: 1 }, { id: 1 }, { id: 2 }],
          i18n,
        });
        expect(result).not.toBe(true);
      });

      it("should reject non-arrays", async () => {
        const result = await Validator.getRules().ArrayUnique({
          value: "not an array",
          i18n,
        });
        expect(result).not.toBe(true);
      });
    });

    describe("Validation Behavior", () => {
      it("should validate unique values with programmatic API", async () => {
        const result = await Validator.validate({
          value: [1, 2, 3],
          rules: ["ArrayUnique"],
        });
        expect(result.success).toBe(true);
      });

      it("should reject duplicate values with programmatic API", async () => {
        const result = await Validator.validate({
          value: [1, 2, 2, 3],
          rules: ["ArrayUnique"],
        });
        expect(result.success).toBe(false);
      });
    });

    describe("Decorator", () => {
      class TestEntity {
        @ArrayUnique
        tags?: string[];
      }

      it("should validate unique values with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          tags: ["javascript", "typescript", "react"],
        });
        expect(result.data?.tags).toEqual(["javascript", "typescript", "react"]);
      });

      it("should reject duplicate values with decorator", async () => {
        const result = await Validator.validateTarget(TestEntity, {
          tags: ["javascript", "typescript", "javascript"],
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe("Integration Tests", () => {
    describe("Multiple Array Rules", () => {
      class StrictArrayEntity {
        @IsArray
        @ArrayMinLength([2])
        @ArrayMaxLength([5])
        @ArrayUnique
        items?: any[];
      }

      it("should validate array meeting all criteria", async () => {
        const result = await Validator.validateTarget(StrictArrayEntity, {
          items: [1, 2, 3],
        });
        expect(result.data?.items).toEqual([1, 2, 3]);
      });

      it("should reject array failing any criteria", async () => {
        const result = await Validator.validateTarget(StrictArrayEntity, {
          items: [1, 1, 2, 3, 4, 5], // Not unique and too long
        });
        expect(result.success).toBe(false);
      });
    });

    describe("Programmatic API with Multiple Rules", () => {
      it("should validate with multiple array rules", async () => {
        const result = await Validator.validate({
          value: [1, 2, 3],
          rules: ["Array", { ArrayMinLength: [2] }, { ArrayMaxLength: [5] }, "ArrayUnique"],
        });
        expect(result.success).toBe(true);
      });

      it("should reject when any rule fails", async () => {
        const result = await Validator.validate({
          value: [1, 1, 1],
          rules: ["Array", { ArrayMinLength: [2] }, { ArrayMaxLength: [5] }, "ArrayUnique"],
        });
        expect(result.success).toBe(false);
      });
    });
  });
});
