import { IValidatorValidateOptions, IValidatorResult } from "../../types";
import { i18n } from "../../../i18n";

/**
 * ### Greater Than Rule
 *
 * Validates that the field under validation is greater than another field's value
 * or a specific numeric value.
 *
 * #### Parameters
 * - `field` - Name of another field to compare against, OR
 * - `value` - Specific numeric value to compare against
 *
 * @example
 * ```typescript
 * // Compare with another field
 * const data = {
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   minPrice: 10,
 *   maxPrice: 100
 * };
 *
 * await Validator.validate({
 *   value: data.maxPrice,
 *   rules: ['gt:minPrice'],
 *   context: { data }
 * }); // ✓ Valid (100 > 10)
 *
 * // Compare with specific value
 * await Validator.validate({
 *   value: 25,
 *   rules: ['gt:18']
 * }); // ✓ Valid (25 > 18)
 *
 * // Invalid examples
 * await Validator.validate({
 *   value: 15,
 *   rules: ['gt:20']
 * }); // ✗ Invalid (15 not > 20)
 *
 * // Class validation
 * class PriceRange {
 *   @Numeric
 *   @Min([0])
 *   minPrice: number;
 *
 *   @Numeric
 *   @Gt(['minPrice'])
 *   maxPrice: number; // Must be greater than minPrice
 * }
 * ```
 *
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array containing field name or value to compare
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-gt | Laravel gt Rule}
 * @public
 */
export function Gt({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "gt",
        field: translatedPropertyName || fieldName,
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

    const compareParam = ruleParams[0];
    let compareValue: number;

    // Check if it's a field reference or a direct value
    const directValue = Number(compareParam);
    if (!isNaN(directValue)) {
      compareValue = directValue;
    } else {
      // Try to get value from context data
      const data = (context as any)?.data || context || {};
      const fieldValue = data[compareParam];
      compareValue = Number(fieldValue);

      if (isNaN(compareValue)) {
        const message = i18n.t("validator.invalidCompareField", {
          field: translatedPropertyName || fieldName,
          compareField: compareParam,
          ...rest,
        });
        return reject(message);
      }
    }

    if (numericValue > compareValue) {
      resolve(true);
    } else {
      const message = i18n.t("validator.gt", {
        field: translatedPropertyName || fieldName,
        value: numericValue,
        compareValue,
        compareField: isNaN(Number(compareParam)) ? compareParam : undefined,
        ...rest,
      });
      reject(message);
    }
  });
}

/**
 * ### Greater Than or Equal Rule
 *
 * Validates that the field under validation is greater than or equal to another
 * field's value or a specific numeric value.
 *
 * #### Parameters
 * - `field` - Name of another field to compare against, OR
 * - `value` - Specific numeric value to compare against
 *
 * @example
 * ```typescript
 * // Compare with another field
 * const data = {
 *   quantity: 10,
 *   minQuantity: 5
 * };
 *
 * await Validator.validate({
 *   value: data.quantity,
 *   rules: ['gte:minQuantity'],
 *   context: { data }
 * }); // ✓ Valid (10 >= 5)
 *
 * // Compare with specific value
 * await Validator.validate({
 *   value: 18,
 *   rules: ['gte:18']
 * }); // ✓ Valid (18 >= 18)
 *
 * // Class validation
 * class Order {
 *   @Numeric
 *   @Min([1])
 *   minQuantity: number;
 *
 *   @Numeric
 *   @Gte(['minQuantity'])
 *   orderQuantity: number;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array containing field name or value to compare
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-gte | Laravel gte Rule}
 * @public
 */
export function Gte({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "gte",
        field: translatedPropertyName || fieldName,
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

    const compareParam = ruleParams[0];
    let compareValue: number;

    // Check if it's a field reference or a direct value
    const directValue = Number(compareParam);
    if (!isNaN(directValue)) {
      compareValue = directValue;
    } else {
      // Try to get value from context data
      const data = (context as any)?.data || context || {};
      const fieldValue = data[compareParam];
      compareValue = Number(fieldValue);

      if (isNaN(compareValue)) {
        const message = i18n.t("validator.invalidCompareField", {
          field: translatedPropertyName || fieldName,
          compareField: compareParam,
          ...rest,
        });
        return reject(message);
      }
    }

    if (numericValue >= compareValue) {
      resolve(true);
    } else {
      const message = i18n.t("validator.gte", {
        field: translatedPropertyName || fieldName,
        value: numericValue,
        compareValue,
        compareField: isNaN(Number(compareParam)) ? compareParam : undefined,
        ...rest,
      });
      reject(message);
    }
  });
}

/**
 * ### Less Than Rule
 *
 * Validates that the field under validation is less than another field's value
 * or a specific numeric value.
 *
 * #### Parameters
 * - `field` - Name of another field to compare against, OR
 * - `value` - Specific numeric value to compare against
 *
 * @example
 * ```typescript
 * // Compare with another field
 * const data = {
 *   currentPrice: 50,
 *   originalPrice: 100
 * };
 *
 * await Validator.validate({
 *   value: data.currentPrice,
 *   rules: ['lt:originalPrice'],
 *   context: { data }
 * }); // ✓ Valid (50 < 100)
 *
 * // Compare with specific value
 * await Validator.validate({
 *   value: 15,
 *   rules: ['lt:100']
 * }); // ✓ Valid (15 < 100)
 *
 * // Class validation
 * class Discount {
 *   @Numeric
 *   originalPrice: number;
 *
 *   @Numeric
 *   @Lt(['originalPrice'])
 *   salePrice: number; // Must be less than original price
 * }
 * ```
 *
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array containing field name or value to compare
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-lt | Laravel lt Rule}
 * @public
 */
export function Lt({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "lt",
        field: translatedPropertyName || fieldName,
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

    const compareParam = ruleParams[0];
    let compareValue: number;

    // Check if it's a field reference or a direct value
    const directValue = Number(compareParam);
    if (!isNaN(directValue)) {
      compareValue = directValue;
    } else {
      // Try to get value from context data
      const data = (context as any)?.data || context || {};
      const fieldValue = data[compareParam];
      compareValue = Number(fieldValue);

      if (isNaN(compareValue)) {
        const message = i18n.t("validator.invalidCompareField", {
          field: translatedPropertyName || fieldName,
          compareField: compareParam,
          ...rest,
        });
        return reject(message);
      }
    }

    if (numericValue < compareValue) {
      resolve(true);
    } else {
      const message = i18n.t("validator.lt", {
        field: translatedPropertyName || fieldName,
        value: numericValue,
        compareValue,
        compareField: isNaN(Number(compareParam)) ? compareParam : undefined,
        ...rest,
      });
      reject(message);
    }
  });
}

/**
 * ### Less Than or Equal Rule
 *
 * Validates that the field under validation is less than or equal to another
 * field's value or a specific numeric value.
 *
 * #### Parameters
 * - `field` - Name of another field to compare against, OR
 * - `value` - Specific numeric value to compare against
 *
 * @example
 * ```typescript
 * // Compare with another field
 * const data = {
 *   quantity: 100,
 *   maxQuantity: 100
 * };
 *
 * await Validator.validate({
 *   value: data.quantity,
 *   rules: ['lte:maxQuantity'],
 *   context: { data }
 * }); // ✓ Valid (100 <= 100)
 *
 * // Compare with specific value
 * await Validator.validate({
 *   value: 50,
 *   rules: ['lte:100']
 * }); // ✓ Valid (50 <= 100)
 *
 * // Class validation
 * class Capacity {
 *   @Numeric
 *   maxCapacity: number;
 *
 *   @Numeric
 *   @Lte(['maxCapacity'])
 *   currentLoad: number;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array containing field name or value to compare
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-lte | Laravel lte Rule}
 * @public
 */
export function Lte({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "lte",
        field: translatedPropertyName || fieldName,
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

    const compareParam = ruleParams[0];
    let compareValue: number;

    // Check if it's a field reference or a direct value
    const directValue = Number(compareParam);
    if (!isNaN(directValue)) {
      compareValue = directValue;
    } else {
      // Try to get value from context data
      const data = (context as any)?.data || context || {};
      const fieldValue = data[compareParam];
      compareValue = Number(fieldValue);

      if (isNaN(compareValue)) {
        const message = i18n.t("validator.invalidCompareField", {
          field: translatedPropertyName || fieldName,
          compareField: compareParam,
          ...rest,
        });
        return reject(message);
      }
    }

    if (numericValue <= compareValue) {
      resolve(true);
    } else {
      const message = i18n.t("validator.lte", {
        field: translatedPropertyName || fieldName,
        value: numericValue,
        compareValue,
        compareField: isNaN(Number(compareParam)) ? compareParam : undefined,
        ...rest,
      });
      reject(message);
    }
  });
}
