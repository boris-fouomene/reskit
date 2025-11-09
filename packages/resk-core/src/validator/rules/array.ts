import { i18n } from "../../i18n";
import { IValidatorValidateOptions } from "../types";
import { Validator } from "../validator";

function _Array({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): boolean | string {
  if (Array.isArray(value)) {
    return true;
  } else {
    const message = i18n.t("validator.array", {
      field: translatedPropertyName || fieldName,
      value,
      ...rest,
    });
    return message;
  }
}
Validator.registerRule("Array", _Array);

/**
 * ### Array Rule
 *
 * Validates that the field under validation is an array.
 *
 * @example
 * ```typescript
 * // Class validation
 * class DataCollection {
 *   @IsRequired
 *   @IsArray
 *   items: any[];
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsArray = Validator.createPropertyDecorator(["Array"]);

function _ArrayMinLength({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<number[]>): boolean | string {
  if (!Array.isArray(value)) {
    const message = i18n.t("validator.array", {
      field: translatedPropertyName || fieldName,
      value,
      ...rest,
    });
    return message;
  }

  const minLength = Number(ruleParams?.[0]);
  if (isNaN(minLength) || minLength < 0) {
    const message = i18n.t("validator.invalidRuleParams", {
      rule: "ArrayMinLength",
      field: translatedPropertyName || fieldName,
      ruleParams,
      ...rest,
    });
    return message;
  }

  if (value.length >= minLength) {
    return true;
  } else {
    const message = i18n.t("validator.arrayMinLength", {
      field: translatedPropertyName || fieldName,
      value,
      minLength,
      actualLength: value.length,
      ...rest,
    });
    return message;
  }
}
Validator.registerRule("ArrayMinLength", _ArrayMinLength);

/**
 * ### ArrayMinLength Rule
 *
 * Validates that the array has at least the specified minimum length.
 *
 * #### Parameters
 * - Minimum length (number)
 *
 * @example
 * ```typescript
 * // Class validation
 * class ShoppingCart {
 *   @ArrayMinLength(1)
 *   items: Product[];
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing minimum length
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const ArrayMinLength =
  Validator.createRuleDecorator<[number]>(_ArrayMinLength);

function _ArrayMaxLength({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<number[]>): boolean | string {
  if (!Array.isArray(value)) {
    const message = i18n.t("validator.array", {
      field: translatedPropertyName || fieldName,
      value,
      ...rest,
    });
    return message;
  }

  const maxLength = Number(ruleParams?.[0]);
  if (isNaN(maxLength) || maxLength < 0) {
    const message = i18n.t("validator.invalidRuleParams", {
      rule: "ArrayMaxLength",
      field: translatedPropertyName || fieldName,
      ruleParams,
      ...rest,
    });
    return message;
  }

  if (value.length <= maxLength) {
    return true;
  } else {
    const message = i18n.t("validator.arrayMaxLength", {
      field: translatedPropertyName || fieldName,
      value,
      maxLength,
      actualLength: value.length,
      ...rest,
    });
    return message;
  }
}
Validator.registerRule("ArrayMaxLength", _ArrayMaxLength);

/**
 * ### ArrayMaxLength Rule
 *
 * Validates that the array has at most the specified maximum length.
 *
 * #### Parameters
 * - Maximum length (number)
 *
 * @example
 * ```typescript
 * // Class validation
 * class LimitedList {
 *   @ArrayMaxLength(10)
 *   tags: string[];
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing maximum length
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const ArrayMaxLength =
  Validator.createRuleDecorator<[number]>(_ArrayMaxLength);

function _ArrayLength({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<number[]>): boolean | string {
  if (!Array.isArray(value)) {
    const message = i18n.t("validator.array", {
      field: translatedPropertyName || fieldName,
      value,
      ...rest,
    });
    return message;
  }

  const exactLength = Number(ruleParams?.[0]);
  if (isNaN(exactLength) || exactLength < 0) {
    const message = i18n.t("validator.invalidRuleParams", {
      rule: "ArrayLength",
      field: translatedPropertyName || fieldName,
      ruleParams,
      ...rest,
    });
    return message;
  }

  if (value.length === exactLength) {
    return true;
  } else {
    const message = i18n.t("validator.arrayLength", {
      field: translatedPropertyName || fieldName,
      value,
      length: exactLength,
      actualLength: value.length,
      ...rest,
    });
    return message;
  }
}
Validator.registerRule("ArrayLength", _ArrayLength);

/**
 * ### ArrayLength Rule
 *
 * Validates that the array has exactly the specified length.
 *
 * #### Parameters
 * - Exact length (number)
 *
 * @example
 * ```typescript
 * // Class validation
 * class FixedSizeArray {
 *   @ArrayLength(3)
 *   coordinates: number[];
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing exact length
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const ArrayLength =
  Validator.createRuleDecorator<[number]>(_ArrayLength);

function _ArrayContains({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<any[]>): boolean | string {
  if (!Array.isArray(value)) {
    const message = i18n.t("validator.arrayContains", {
      field: translatedPropertyName || fieldName,
      value,
      requiredValues: ruleParams?.join(", ") || "",
      ...rest,
    });
    return message;
  }

  if (!ruleParams || ruleParams.length === 0) {
    const message = i18n.t("validator.invalidRuleParams", {
      rule: "ArrayContains",
      field: translatedPropertyName || fieldName,
      ruleParams,
      ...rest,
    });
    return message;
  }

  const containsAll = ruleParams.every((requiredValue) =>
    value.some((item) => {
      // Deep equality check for objects/arrays, simple equality for primitives
      if (typeof requiredValue === "object" && requiredValue !== null) {
        return JSON.stringify(item) === JSON.stringify(requiredValue);
      }
      return item === requiredValue;
    })
  );

  if (containsAll) {
    return true;
  } else {
    const message = i18n.t("validator.arrayContains", {
      field: translatedPropertyName || fieldName,
      value,
      requiredValues: ruleParams.map((v) => JSON.stringify(v)).join(", "),
      ...rest,
    });
    return message;
  }
}
Validator.registerRule("ArrayContains", _ArrayContains);

/**
 * ### ArrayContains Rule
 *
 * Validates that the array contains all of the specified values.
 *
 * #### Parameters
 * - Values that must be present in the array
 *
 * @example
 * ```typescript
 * // Class validation
 * class Permissions {
 *   @ArrayContains(['read'])
 *   userPermissions: string[];
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array of values that must be contained
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const ArrayContains =
  Validator.createRuleDecorator<any[]>(_ArrayContains);

function _ArrayUnique({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): boolean | string {
  if (!Array.isArray(value)) {
    const message = i18n.t("validator.arrayUnique", {
      field: translatedPropertyName || fieldName,
      value,
      ...rest,
    });
    return message;
  }

  try {
    const uniqueValues = new Set(
      value.map((item) => {
        // Convert objects/arrays to JSON strings for comparison
        if (typeof item === "object" && item !== null) {
          return JSON.stringify(item);
        }
        return item;
      })
    );

    if (uniqueValues.size === value.length) {
      return true;
    } else {
      const message = i18n.t("validator.arrayUnique", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return message;
    }
  } catch (error) {
    // JSON.stringify might fail for circular references
    const message = i18n.t("validator.arrayUnique", {
      field: translatedPropertyName || fieldName,
      value,
      ...rest,
    });
    return message;
  }
}
Validator.registerRule("ArrayUnique", _ArrayUnique);

/**
 * ### ArrayUnique Rule
 *
 * Validates that all elements in the array are unique.
 *
 * @example
 * ```typescript
 * // Class validation
 * class UniqueTags {
 *   @ArrayUnique
 *   tags: string[];
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const ArrayUnique = Validator.createPropertyDecorator(["ArrayUnique"]);

declare module "../types" {
  export interface IValidatorRulesMap<Context = unknown> {
    /**
     * ### Array Rule
     *
     * Validates that the field under validation is an array.
     *
     * @example
     * ```typescript
     * // Valid arrays
     * await Validator.validate({
     *   value: [1, 2, 3],
     *   rules: ['Array']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: [],
     *   rules: ['Array']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: "not an array",
     *   rules: ['Array']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: null,
     *   rules: ['Array']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class DataCollection {
     *   @Required
     *   @Array
     *   items: any[];
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    Array: IValidatorRuleFunction<Array<any>, Context>;

    /**
     * ### ArrayMinLength Rule
     *
     * Validates that the array has at least the specified minimum length.
     *
     * #### Parameters
     * - Minimum length (number)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: [1, 2, 3],
     *   rules: ['ArrayMinLength[2]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: ['a', 'b'],
     *   rules: ['ArrayMinLength[1]']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: [1],
     *   rules: ['ArrayMinLength[2]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: "not an array",
     *   rules: ['ArrayMinLength[1]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class ShoppingCart {
     *   @ArrayMinLength(1)
     *   items: Product[];
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing minimum length
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    ArrayMinLength: IValidatorRuleFunction<number[], Context>;

    /**
     * ### ArrayMaxLength Rule
     *
     * Validates that the array has at most the specified maximum length.
     *
     * #### Parameters
     * - Maximum length (number)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: [1, 2],
     *   rules: ['ArrayMaxLength[3]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: [],
     *   rules: ['ArrayMaxLength[10]']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: [1, 2, 3, 4],
     *   rules: ['ArrayMaxLength[3]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: "not an array",
     *   rules: ['ArrayMaxLength[5]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class LimitedList {
     *   @ArrayMaxLength(10)
     *   tags: string[];
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing maximum length
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    ArrayMaxLength: IValidatorRuleFunction<number[], Context>;

    /**
     * ### ArrayLength Rule
     *
     * Validates that the array has exactly the specified length.
     *
     * #### Parameters
     * - Exact length (number)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: [1, 2, 3],
     *   rules: ['ArrayLength[3]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: ['x', 'y'],
     *   rules: ['ArrayLength[2]']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: [1, 2],
     *   rules: ['ArrayLength[3]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: [1, 2, 3, 4],
     *   rules: ['ArrayLength[3]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: "not an array",
     *   rules: ['ArrayLength[2]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class FixedSizeArray {
     *   @ArrayLength(3)
     *   coordinates: number[];
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing exact length
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    ArrayLength: IValidatorRuleFunction<number[], Context>;

    /**
     * ### ArrayContains Rule
     *
     * Validates that the array contains all of the specified values.
     *
     * #### Parameters
     * - Values that must be present in the array
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: ['read', 'write', 'delete'],
     *   rules: ['ArrayContains[read,write]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: [1, 2, 3, 4],
     *   rules: ['ArrayContains[2,3]']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: ['read', 'write'],
     *   rules: ['ArrayContains[read,delete]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: "not an array",
     *   rules: ['ArrayContains[1]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Permissions {
     *   @ArrayContains(['read'])
     *   userPermissions: string[];
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array of values that must be contained
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    ArrayContains: IValidatorRuleFunction<any[], Context>;

    /**
     * ### ArrayUnique Rule
     *
     * Validates that all elements in the array are unique.
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: [1, 2, 3],
     *   rules: ['ArrayUnique']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: ['a', 'b', 'c'],
     *   rules: ['ArrayUnique']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: [1, 2, 2, 3],
     *   rules: ['ArrayUnique']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: ['a', 'b', 'a'],
     *   rules: ['ArrayUnique']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: "not an array",
     *   rules: ['ArrayUnique']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class UniqueTags {
     *   @ArrayUnique
     *   tags: string[];
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    ArrayUnique: IValidatorRuleFunction<Array<any>, Context>;
  }
}
