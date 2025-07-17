import { IValidatorValidateOptions, IValidatorResult } from "../../types";
import { i18n } from "../../../i18n";

/**
 * ## Numeric Validation Rules
 * 
 * Collection of Laravel-compatible numeric validation rules that handle
 * number validation, range checking, decimal validation, and mathematical
 * constraints with proper type safety and internationalization.
 * 
 * ### Available Rules
 * - `between` - Must be between minimum and maximum values
 * - `decimal` - Must have specified decimal places
 * - `integer` - Must be an integer
 * - `max` - Must not be greater than maximum value
 * - `min` - Must not be less than minimum value
 * - `multiple_of` - Must be a multiple of given value
 * - `numeric` - Must be numeric (numbers and numeric strings)
 * - `positive` - Must be a positive number
 * - `negative` - Must be a negative number
 * - `gt` - Must be greater than field or value
 * - `gte` - Must be greater than or equal to field or value
 * - `lt` - Must be less than field or value
 * - `lte` - Must be less than or equal to field or value
 * 
 * @author Resk Framework Team
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#available-validation-rules | Laravel Numeric Rules}
 * @public
 */

/**
 * ### Between Rule (Numeric)
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
 *   rules: ['between:18,65']
 * }); // ✓ Valid
 * 
 * // Price range validation
 * await Validator.validate({
 *   value: 99.99,
 *   rules: ['between:10.00,999.99']
 * }); // ✓ Valid
 * 
 * // Percentage validation
 * await Validator.validate({
 *   value: 85,
 *   rules: ['between:0,100']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 17,
 *   rules: ['between:18,65']
 * }); // ✗ Invalid (below minimum)
 * 
 * // Class validation
 * class Product {
 *   @Between([1, 999])
 *   quantity: number;
 * 
 *   @Between([0.01, 9999.99])
 *   price: number;
 * 
 *   @Between([0, 100])
 *   discountPercentage: number;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing [min, max] values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-between | Laravel between Rule}
 * @public
 */
export function Between({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length < 2) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "between",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const min = Number(ruleParams[0]);
        const max = Number(ruleParams[1]);

        if (isNaN(min) || isNaN(max)) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "between",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        if (numericValue >= min && numericValue <= max) {
            resolve(true);
        } else {
            const message = i18n.t("validator.between", {
                field: translatedPropertyName || fieldName,
                value: numericValue,
                min,
                max,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Decimal Rule
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
 *   rules: ['decimal:2']
 * }); // ✓ Valid (exactly 2 decimal places)
 * 
 * await Validator.validate({
 *   value: 123.456,
 *   rules: ['decimal:3']
 * }); // ✓ Valid (exactly 3 decimal places)
 * 
 * // Range of decimal places
 * await Validator.validate({
 *   value: 99.9,
 *   rules: ['decimal:1,3']
 * }); // ✓ Valid (1-3 decimal places)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 99.999,
 *   rules: ['decimal:2']
 * }); // ✗ Invalid (3 places, expected 2)
 * 
 * await Validator.validate({
 *   value: 99,
 *   rules: ['decimal:2']
 * }); // ✗ Invalid (0 places, expected 2)
 * 
 * // Class validation
 * class Financial {
 *   @Decimal([2])
 *   price: number; // Must have exactly 2 decimal places
 * 
 *   @Decimal([0, 4])
 *   exchangeRate: number; // 0-4 decimal places allowed
 * 
 *   @Decimal([3])
 *   weight: number; // Exactly 3 decimal places for precision
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array with decimal places specification
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-decimal | Laravel decimal Rule}
 * @public
 */
export function Decimal({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "decimal",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        // Get decimal places from the number
        const valueStr = String(value);
        const decimalIndex = valueStr.indexOf('.');
        const actualDecimalPlaces = decimalIndex === -1 ? 0 : valueStr.length - decimalIndex - 1;

        let isValid = false;

        if (ruleParams.length === 1) {
            // Exact decimal places
            const requiredPlaces = Number(ruleParams[0]);
            isValid = actualDecimalPlaces === requiredPlaces;
        } else if (ruleParams.length === 2) {
            // Range of decimal places
            const minPlaces = Number(ruleParams[0]);
            const maxPlaces = Number(ruleParams[1]);
            isValid = actualDecimalPlaces >= minPlaces && actualDecimalPlaces <= maxPlaces;
        }

        if (isValid) {
            resolve(true);
        } else {
            const message = i18n.t("validator.decimal", {
                field: translatedPropertyName || fieldName,
                value,
                places: ruleParams.join('-'),
                actualPlaces: actualDecimalPlaces,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Integer Rule
 * 
 * Validates that the field under validation is an integer. This rule does not
 * verify that the input is of the "integer" variable type, only that the input
 * is a string or numeric value that contains an integer.
 * 
 * @example
 * ```typescript
 * // Valid integers
 * await Validator.validate({
 *   value: 42,
 *   rules: ['integer']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: '123',
 *   rules: ['integer']
 * }); // ✓ Valid (numeric string)
 * 
 * await Validator.validate({
 *   value: -456,
 *   rules: ['integer']
 * }); // ✓ Valid (negative integer)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 12.34,
 *   rules: ['integer']
 * }); // ✗ Invalid (has decimal places)
 * 
 * await Validator.validate({
 *   value: 'abc',
 *   rules: ['integer']
 * }); // ✗ Invalid (not numeric)
 * 
 * // Class validation
 * class Inventory {
 *   @Integer
 *   quantity: number;
 * 
 *   @Integer
 *   @Min([0])
 *   stockLevel: number;
 * 
 *   @Integer
 *   @Between([-1000, 1000])
 *   adjustment: number;
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-integer | Laravel integer Rule}
 * @public
 */
export function Integer({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        const numericValue = Number(value);

        if (isNaN(numericValue) || !Number.isInteger(numericValue)) {
            const message = i18n.t("validator.integer", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        } else {
            resolve(true);
        }
    });
}

/**
 * ### Max Rule (Numeric)
 * 
 * Validates that the field under validation is less than or equal to a maximum value.
 * For numeric values, this compares the actual numeric value.
 * 
 * #### Parameters
 * - `max` - Maximum allowed value (inclusive)
 * 
 * @example
 * ```typescript
 * // Age validation
 * await Validator.validate({
 *   value: 65,
 *   rules: ['max:65']
 * }); // ✓ Valid
 * 
 * // Price limit
 * await Validator.validate({
 *   value: 999.99,
 *   rules: ['max:1000']
 * }); // ✓ Valid
 * 
 * // Percentage validation
 * await Validator.validate({
 *   value: 100,
 *   rules: ['max:100']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 101,
 *   rules: ['max:100']
 * }); // ✗ Invalid (exceeds maximum)
 * 
 * // Class validation
 * class Settings {
 *   @Max([100])
 *   volume: number;
 * 
 *   @Max([999.99])
 *   budget: number;
 * 
 *   @Max([5])
 *   @Min([1])
 *   priority: number;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing the maximum value
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-max | Laravel max Rule}
 * @public
 */
export function Max({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "max",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const maximum = Number(ruleParams[0]);
        if (isNaN(maximum)) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "max",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        if (numericValue <= maximum) {
            resolve(true);
        } else {
            const message = i18n.t("validator.max", {
                field: translatedPropertyName || fieldName,
                value: numericValue,
                max: maximum,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Min Rule (Numeric)
 * 
 * Validates that the field under validation is greater than or equal to a minimum value.
 * For numeric values, this compares the actual numeric value.
 * 
 * #### Parameters
 * - `min` - Minimum allowed value (inclusive)
 * 
 * @example
 * ```typescript
 * // Age validation
 * await Validator.validate({
 *   value: 18,
 *   rules: ['min:18']
 * }); // ✓ Valid
 * 
 * // Price validation
 * await Validator.validate({
 *   value: 10.00,
 *   rules: ['min:0.01']
 * }); // ✓ Valid
 * 
 * // Rating validation
 * await Validator.validate({
 *   value: 1,
 *   rules: ['min:1']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 17,
 *   rules: ['min:18']
 * }); // ✗ Invalid (below minimum)
 * 
 * // Class validation
 * class Product {
 *   @Min([0])
 *   price: number;
 * 
 *   @Min([1])
 *   @Max([5])
 *   rating: number;
 * 
 *   @Min([0.01])
 *   weight: number;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing the minimum value
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-min | Laravel min Rule}
 * @public
 */
export function Min({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "min",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const minimum = Number(ruleParams[0]);
        if (isNaN(minimum)) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "min",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        if (numericValue >= minimum) {
            resolve(true);
        } else {
            const message = i18n.t("validator.min", {
                field: translatedPropertyName || fieldName,
                value: numericValue,
                min: minimum,
                ...rest
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
 * await Validator.validate({
 *   value: 15,
 *   rules: ['multiple_of:5']
 * }); // ✓ Valid (15 is multiple of 5)
 * 
 * await Validator.validate({
 *   value: 0.25,
 *   rules: ['multiple_of:0.05']
 * }); // ✓ Valid (price increment validation)
 * 
 * // Time interval validation
 * await Validator.validate({
 *   value: 30,
 *   rules: ['multiple_of:15']
 * }); // ✓ Valid (15-minute intervals)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 17,
 *   rules: ['multiple_of:5']
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
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-multiple-of | Laravel multiple_of Rule}
 * @public
 */
export function MultipleOf({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "multiple_of",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const multiple = Number(ruleParams[0]);
        if (isNaN(multiple) || multiple === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "multiple_of",
                field: translatedPropertyName || fieldName,
                ...rest
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
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Numeric Rule
 * 
 * Validates that the field under validation is numeric. This includes integers,
 * floats, and numeric strings. Numeric strings are strings that represent
 * valid numbers.
 * 
 * @example
 * ```typescript
 * // Valid numeric values
 * await Validator.validate({
 *   value: 123,
 *   rules: ['numeric']
 * }); // ✓ Valid (integer)
 * 
 * await Validator.validate({
 *   value: 45.67,
 *   rules: ['numeric']
 * }); // ✓ Valid (float)
 * 
 * await Validator.validate({
 *   value: '89.10',
 *   rules: ['numeric']
 * }); // ✓ Valid (numeric string)
 * 
 * await Validator.validate({
 *   value: '-123.45',
 *   rules: ['numeric']
 * }); // ✓ Valid (negative number)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'abc',
 *   rules: ['numeric']
 * }); // ✗ Invalid (not numeric)
 * 
 * await Validator.validate({
 *   value: '12.34.56',
 *   rules: ['numeric']
 * }); // ✗ Invalid (invalid format)
 * 
 * // Class validation
 * class Measurement {
 *   @Numeric
 *   temperature: number | string;
 * 
 *   @Numeric
 *   @Min([0])
 *   distance: number | string;
 * 
 *   @Numeric
 *   @Between([-180, 180])
 *   longitude: number | string;
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-numeric | Laravel numeric Rule}
 * @public
 */
export function Numeric({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        const numericValue = Number(value);

        if (isNaN(numericValue) || (typeof value === 'string' && value.trim() === '')) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        } else {
            resolve(true);
        }
    });
}

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
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-gt | Laravel gt Rule}
 * @public
 */
export function Gt({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "gt",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
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
                    ...rest
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
                ...rest
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
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-gte | Laravel gte Rule}
 * @public
 */
export function Gte({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "gte",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
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
                    ...rest
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
                ...rest
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
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-lt | Laravel lt Rule}
 * @public
 */
export function Lt({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "lt",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
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
                    ...rest
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
                ...rest
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
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-lte | Laravel lte Rule}
 * @public
 */
export function Lte({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "lte",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const message = i18n.t("validator.numeric", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
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
                    ...rest
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
                ...rest
            });
            reject(message);
        }
    });
}
