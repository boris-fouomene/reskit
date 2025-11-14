import { IValidatorResult, IValidatorValidateOptions } from "../types";
import { Validator } from "../validator";

function NumberBetween({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  i18n,
  ...rest
}: IValidatorValidateOptions<[number, number]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!ruleParams || ruleParams.length < 2) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "NumberBetween",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      const message = i18n.t("validator.numeric", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const min = Number(ruleParams[0]);
    const max = Number(ruleParams[1]);
    if (isNaN(min) || isNaN(max)) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "NumberBetween",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }
    if (numericValue >= min && numericValue <= max) {
      resolve(true);
    } else {
      const message = i18n.t("validator.numberBetween", {
        field: translatedPropertyName || fieldName,
        value: numericValue,
        min,
        max,
        ...rest,
      });
      reject(message);
    }
  });
}
/**
 * ### IsNumberBetween Rule (Numeric)
 *
 * Validates that the field under validation has a numeric value between the
 * given minimum and maximum values (inclusive).
 *
 * #### Parameters
 * - `min` - Minimum value (inclusive)
 * - `max` - Maximum value (inclusive)
 *
 * @example
 * ```typescript
 * // Class validation
 * class Product {
 *   @IsNumberBetween([1, 999])
 *   quantity: number;
 *
 *   @IsNumberBetween([0.01, 9999.99])
 *   price: number;
 *
 *   @IsNumberBetween([0, 100])
 *   discountPercentage: number;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing [min, max] values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsNumberBetween =
  Validator.createRuleDecorator<[min: number, max: number]>(NumberBetween);
Validator.registerRule("NumberBetween", NumberBetween);

function DecimalPlaces({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  i18n,
  ...rest
}: IValidatorValidateOptions<
  [minDecimalPlaces: number, maxDecimalPlaces?: number]
>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!ruleParams || !ruleParams.length) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "DecimalPlaces",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      const message = i18n.t("validator.number", {
        rule: "DecimalPlaces",
        field: translatedPropertyName || fieldName,
        value,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    // Get decimal places from the number
    const valueStr = String(value);
    const decimalIndex = valueStr.indexOf(".");
    const actualDecimalPlaces =
      decimalIndex === -1 ? 0 : valueStr.length - decimalIndex - 1;

    let isValid = false;

    if (ruleParams.length === 1) {
      // Exact decimal places
      const requiredPlaces = Number(ruleParams[0]);
      isValid = actualDecimalPlaces === requiredPlaces;
    } else if (ruleParams.length === 2) {
      // Range of decimal places
      const minPlaces = Number(ruleParams[0]);
      const maxPlaces = Number(ruleParams[1]);
      isValid =
        actualDecimalPlaces >= minPlaces && actualDecimalPlaces <= maxPlaces;
    }
    if (isValid) {
      resolve(true);
    } else {
      const message = i18n.t("validator.decimalPlaces", {
        field: translatedPropertyName || fieldName,
        value,
        places: ruleParams.join("-"),
        actualPlaces: actualDecimalPlaces,
        ...rest,
      });
      reject(message);
    }
  });
}

Validator.registerRule("DecimalPlaces", DecimalPlaces);

/**
 * ### HasDecimalPlaces Rule
 *
 * Validates that the field under validation is numeric and contains the
 * specified number of decimal places.
 *
 * #### Parameters
 * - `places` - Exact number of decimal places required
 * - `min,max` (optional) - Range of decimal places allowed
 *
 * @example
 * ```typescript
 * // Class validation
 * class Financial {
 *   @HasDecimalPlaces([2])
 *   price: number; // Must have exactly 2 decimal places
 *
 *   @HasDecimalPlaces([0, 4])
 *   exchangeRate: number; // 0-4 decimal places allowed
 *
 *   @HasDecimalPlaces([3])
 *   weight: number; // Exactly 3 decimal places for precision
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array with decimal places specification
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const HasDecimalPlaces =
  Validator.createRuleDecorator<
    [minDecimalPlaces: number, maxDecimalPlaces?: number]
  >(DecimalPlaces);

function _Integer({
  value,
  fieldName,
  translatedPropertyName,
  i18n,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    const numericValue = Number(value);
    if (isNaN(numericValue) || !Number.isInteger(numericValue)) {
      const message = i18n.t("validator.integer", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    } else {
      resolve(true);
    }
  });
}

/**
 * ### IsInteger Rule
 *
 * Validates that the field under validation is an Integer. This rule does not
 * verify that the input is of the "Integer" variable type, only that the input
 * is a string or numeric value that contains an Integer.
 *
 * @example
 * ```typescript
 * class Inventory {
 *   @Integer
 *   quantity: number;
 *
 *   @Integer
 *   @Min([0])
 *   stockLevel: number;
 *
 *   @Integer
 *   @NumberBetween([-1000, 1000])
 *   adjustment: number;
 * }
 * ```
 *
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsInteger = Validator.createPropertyDecorator(["Integer"]);
Validator.registerRule("Integer", _Integer);

function MultipleOf({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  i18n,
  ...rest
}: IValidatorValidateOptions<[number]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!ruleParams || !ruleParams.length) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "MultipleOf",
        field: translatedPropertyName || fieldName,
        ...rest,
        ruleParams,
      });
      return reject(message);
    }

    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      const message = i18n.t("validator.number", {
        field: translatedPropertyName || fieldName,
        value,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const multiple = Number(ruleParams[0]);
    if (
      isNaN(multiple) ||
      (multiple === 0 && String(ruleParams[0]).trim() !== "0")
    ) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "MultipleOf",
        ruleParams,
        field: translatedPropertyName || fieldName,
        ...rest,
      });
      return reject(message);
    }

    // Check if the value is a multiple of the specified number
    const remainder = numericValue % multiple;
    const isMultiple = Math.abs(remainder) < Number.EPSILON;
    if (isMultiple) {
      resolve(true);
    } else {
      const message = i18n.t("validator.multipleOf", {
        field: translatedPropertyName || fieldName,
        value: numericValue,
        multiple,
        ruleParams,
        ...rest,
      });
      reject(message);
    }
  });
}
/**
 * ### Multiple Of Rule
 *
 * Validates that the field under validation is a multiple of the specified value.
 * This is useful for ensuring values conform to specific increments.
 *
 * #### Parameters
 * - `multiple` - The value that the field must be a multiple of
 *
 * @example
 * ```typescript
 * // Multiple validation
 * class Pricing {
 *   @IsMultipleOf([0.01])
 *   price: number; // Must be in cent increments
 *
 *   @IsMultipleOf([5])
 *   discountPercent: number; // 5% increments
 *
 *   @IsMultipleOf([15])
 *   appointmentDuration: number; // 15-minute slots
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing the multiple value
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsMultipleOf =
  Validator.createRuleDecorator<[multiple: number]>(MultipleOf);

declare module "../types" {
  export interface IValidatorRulesMap<Context = unknown> {
    /**
     * ### NumberBetween Rule (Numeric)
     *
     * Validates that the field under validation has a numeric value between the
     * given minimum and maximum values (inclusive).
     *
     * #### Parameters
     * - `min` - Minimum value (inclusive)
     * - `max` - Maximum value (inclusive)
     *
     * @example
     * ```typescript
     * // Age validation
     * await Validator.validate({
     *   value: 25,
     *   rules: ['NumberBetween[18,65]']
     * }); // ✓ Valid
     *
     * // Price range validation
     * await Validator.validate({
     *   value: 99.99,
     *   rules: ['NumberBetween[10.00,999.99]']
     * }); // ✓ Valid
     *
     * // Percentage validation
     * await Validator.validate({
     *   value: 85,
     *   rules: ['NumberBetween[0,100']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 17,
     *   rules: ['NumberBetween[18,65]']
     * }); // ✗ Invalid (below minimum)
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing [min, max] values
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    NumberBetween: IValidatorRuleFunction<[min: number, max: number], Context>;

    /**
     * ### DecimalPlaces Rule
     *
     * Validates that the field under validation is numeric and contains the
     * specified number of decimal places.
     *
     * #### Parameters
     * - `places` - Exact number of decimal places required
     * - `min,max` (optional) - Range of decimal places allowed
     *
     * @example
     * ```typescript
     * // Exact decimal places
     * await Validator.validate({
     *   value: 99.99,
     *   rules: ['DecimalPlaces[2]']
     * }); // ✓ Valid (exactly 2 decimal places)
     *
     * await Validator.validate({
     *   value: 123.456,
     *   rules: ['DecimalPlaces[3]']
     * }); // ✓ Valid (exactly 3 decimal places)
     *
     * // Range of decimal places
     * await Validator.validate({
     *   value: 99.9,
     *   rules: ['DecimalPlaces[1,3]']
     * }); // ✓ Valid (1-3 decimal places)
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 99.999,
     *   rules: ['DecimalPlaces[2]']
     * }); // ✗ Invalid (3 places, expected 2)
     *
     * await Validator.validate({
     *   value: 99,
     *   rules: ['DecimalPlaces[2']
     * }); // ✗ Invalid (0 places, expected 2)
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array with decimal places specification
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    DecimalPlaces: IValidatorRuleFunction<
      [minDecimalPlaces: number, maxDecimalPlaces?: number],
      Context
    >;

    /**
     * ### Integer Rule
     *
     * Validates that the field under validation is an Integer. This rule does not
     * verify that the input is of the "Integer" variable type, only that the input
     * is a string or numeric value that contains an Integer.
     *
     * @example
     * ```typescript
     * // Valid integers
     * await Validator.validate({
     *   value: 42,
     *   rules: ['Integer']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '123',
     *   rules: ['Integer']
     * }); // ✓ Valid (numeric string)
     *
     * await Validator.validate({
     *   value: -456,
     *   rules: ['Integer']
     * }); // ✓ Valid (negative Integer)
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 12.34,
     *   rules: ['Integer']
     * }); // ✗ Invalid (has decimal places)
     *
     * await Validator.validate({
     *   value: 'abc',
     *   rules: ['Integer']
     * }); // ✗ Invalid (not numeric)
     * ```
     *
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    Integer: IValidatorRuleFunction<[number], Context>;

    /**
     * ### Multiple Of Rule
     *
     * Validates that the field under validation is a multiple of the specified value.
     * This is useful for ensuring values conform to specific increments.
     *
     * #### Parameters
     * - `multiple` - The value that the field must be a multiple of
     *
     * @example
     * ```typescript
     * // Multiple validation
     * await Validator.validate({
     *   value: 15,
     *   rules: ['MultipleOf[5]']
     * }); // ✓ Valid (15 is multiple of 5)
     *
     * await Validator.validate({
     *   value: 0.25,
     *   rules: ['MultipleOf[0.05]']
     * }); // ✓ Valid (price increment validation)
     *
     * // Time interval validation
     * await Validator.validate({
     *   value: 30,
     *   rules: ['MultipleOf[15]']
     * }); // ✓ Valid (15-minute intervals)
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 17,
     *   rules: ['MultipleOf[5]']
     * }); // ✗ Invalid (not a multiple of 5)
     *
     * // Class validation
     * class Pricing {
     *   @MultipleOf([0.01])
     *   price: number; // Must be in cent increments
     *
     *   @MultipleOf([5])
     *   discountPercent: number; // 5% increments
     *
     *   @MultipleOf([15])
     *   appointmentDuration: number; // 15-minute slots
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing the multiple value
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    MultipleOf: IValidatorRuleFunction<[number], Context>;
  }
}
