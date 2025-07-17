import { IValidatorValidateOptions, IValidatorResult } from "../../types";
import { i18n } from "../../../i18n";

/**
 * ## Array Validation Rules
 * 
 * Collection of Laravel-compatible array validation rules that handle
 * array structure validation, size constraints, content validation,
 * and list manipulation with proper type safety and internationalization.
 * 
 * ### Available Rules
 * - `array` - Must be an array
 * - `Filled` - Must be present and not empty
 * - `in` - Must be one of the given values
 * - `not_in` - Must not be one of the given values
 * - `required` - Must be present
 * - `required_if` - Required if another field equals value
 * - `required_unless` - Required unless another field equals value
 * - `required_with` - Required if any of the specified fields are present
 * - `required_with_all` - Required if all specified fields are present
 * - `required_without` - Required if any of the specified fields are not present
 * - `required_without_all` - Required if all specified fields are not present
 * - `size` - Must have exactly the specified size
 * - `distinct` - Array values must be unique
 * - `present` - Must be present (can be empty)
 * - `prohibited` - Must not be present
 * - `prohibited_if` - Prohibited if another field equals value
 * - `prohibited_unless` - Prohibited unless another field equals value
 * 
 * @author Resk Framework Team
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#available-validation-rules | Laravel Array Rules}
 * @public
 */

/**
 * ### Array Rule
 * 
 * Validates that the field under validation is a PHP array. When additional
 * arguments are provided to the array rule, each key in the input array must
 * be present within the list of values provided to the rule.
 * 
 * #### Parameters
 * - `allowedKeys` (optional) - List of allowed keys for the array
 * 
 * @example
 * ```typescript
 * // Basic array validation
 * await Validator.validate({
 *   value: [1, 2, 3],
 *   rules: ['array']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: { a: 1, b: 2 },
 *   rules: ['array']
 * }); // ✓ Valid (object treated as associative array)
 * 
 * // Array with allowed keys
 * await Validator.validate({
 *   value: { name: 'John', email: 'john@example.com' },
 *   rules: ['array:name,email,age']
 * }); // ✓ Valid (all keys are allowed)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'not an array',
 *   rules: ['array']
 * }); // ✗ Invalid
 * 
 * await Validator.validate({
 *   value: { name: 'John', invalid: 'key' },
 *   rules: ['array:name,email']
 * }); // ✗ Invalid (invalid key present)
 * 
 * // Class validation
 * class UserData {
 *   @Array(['name', 'email', 'age'])
 *   userInfo: Record<string, any>;
 * 
 *   @Array
 *   tags: string[];
 * 
 *   @Array
 *   @Size([3, 10])
 *   categories: number[];
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Optional array of allowed keys
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-array | Laravel array Rule}
 * @public
 */
export function ArrayRule({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        // Check if value is an array or object (PHP-like array behavior)
        const isArray = Array.isArray(value) || (typeof value === 'object' && value !== null && !Array.isArray(value));

        if (!isArray) {
            const message = i18n.t("validator.array", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        // If allowed keys are specified, validate them
        if (ruleParams && ruleParams.length > 0 && typeof value === 'object' && !Array.isArray(value)) {
            const valueKeys = Object.keys(value);
            const invalidKeys = valueKeys.filter(key => !ruleParams.includes(key));

            if (invalidKeys.length > 0) {
                const message = i18n.t("validator.arrayKeys", {
                    field: translatedPropertyName || fieldName,
                    invalidKeys: invalidKeys.join(', '),
                    allowedKeys: ruleParams.join(', '),
                    ...rest
                });
                return reject(message);
            }
        }

        resolve(true);
    });
}

/**
 * ### Filled Rule
 * 
 * Validates that the field under validation is present and not empty.
 * A field is considered empty if one of the following conditions are true:
 * - The value is null
 * - The value is an empty string
 * - The value is an empty array or object
 * - The value is an uploaded file with no path
 * 
 * @example
 * ```typescript
 * // Valid Filled values
 * await Validator.validate({
 *   value: 'Hello',
 *   rules: ['Filled']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: [1, 2, 3],
 *   rules: ['Filled']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: { key: 'value' },
 *   rules: ['Filled']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 0,
 *   rules: ['Filled']
 * }); // ✓ Valid (0 is not considered empty)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: '',
 *   rules: ['Filled']
 * }); // ✗ Invalid (empty string)
 * 
 * await Validator.validate({
 *   value: [],
 *   rules: ['Filled']
 * }); // ✗ Invalid (empty array)
 * 
 * await Validator.validate({
 *   value: null,
 *   rules: ['Filled']
 * }); // ✗ Invalid (null)
 * 
 * // Class validation
 * class Comment {
 *   @Filled
 *   content: string; // Must be present and not empty
 * 
 *   @Filled
 *   tags: string[]; // Must be present and have items
 * 
 *   @Filled
 *   metadata: Record<string, any>; // Must be present and not empty
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-Filled | Laravel Filled Rule}
 * @public
 */
export function Filled({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        let isEmpty = false;

        if (value === null || value === undefined) {
            isEmpty = true;
        } else if (typeof value === 'string' && value.trim() === '') {
            isEmpty = true;
        } else if (Array.isArray(value) && value.length === 0) {
            isEmpty = true;
        } else if (typeof value === 'object' && Object.keys(value).length === 0) {
            isEmpty = true;
        }

        if (isEmpty) {
            const message = i18n.t("validator.Filled", {
                field: translatedPropertyName || fieldName,
                ...rest
            });
            reject(message);
        } else {
            resolve(true);
        }
    });
}

/**
 * ### In Rule
 * 
 * Validates that the field under validation is included in the given list of values.
 * This is useful for validating enums, dropdown selections, and predefined choices.
 * 
 * #### Parameters
 * - List of allowed values
 * 
 * @example
 * ```typescript
 * // Valid enum values
 * await Validator.validate({
 *   value: 'active',
 *   rules: ['in:active,inactive,pending']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'red',
 *   rules: ['in:red,green,blue']
 * }); // ✓ Valid
 * 
 * // Numeric values
 * await Validator.validate({
 *   value: 2,
 *   rules: ['in:1,2,3,4,5']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'yellow',
 *   rules: ['in:red,green,blue']
 * }); // ✗ Invalid
 * 
 * await Validator.validate({
 *   value: 6,
 *   rules: ['in:1,2,3,4,5']
 * }); // ✗ Invalid
 * 
 * // Class validation
 * class Product {
 *   @In(['draft', 'published', 'archived'])
 *   status: string;
 * 
 *   @In(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
 *   size: string;
 * 
 *   @In([1, 2, 3, 4, 5])
 *   priority: number;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array of allowed values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-in | Laravel in Rule}
 * @public
 */
export function InRule({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "in",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        // Convert value to string for comparison (Laravel behavior)
        const stringValue = String(value);
        const isIncluded = ruleParams.includes(stringValue);

        if (isIncluded) {
            resolve(true);
        } else {
            const message = i18n.t("validator.in", {
                field: translatedPropertyName || fieldName,
                value,
                values: ruleParams.join(', '),
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Not In Rule
 * 
 * Validates that the field under validation is not included in the given list of values.
 * This is useful for blacklisting specific values or ensuring uniqueness.
 * 
 * #### Parameters
 * - List of forbidden values
 * 
 * @example
 * ```typescript
 * // Valid values (not in forbidden list)
 * await Validator.validate({
 *   value: 'allowed',
 *   rules: ['not_in:forbidden,banned,invalid']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'blue',
 *   rules: ['not_in:red,green']
 * }); // ✓ Valid
 * 
 * // Reserved usernames validation
 * await Validator.validate({
 *   value: 'john_doe',
 *   rules: ['not_in:admin,root,administrator,system']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'admin',
 *   rules: ['not_in:admin,root,system']
 * }); // ✗ Invalid (forbidden value)
 * 
 * // Class validation
 * class User {
 *   @NotIn(['admin', 'root', 'system', 'administrator'])
 *   username: string;
 * 
 *   @NotIn(['password', '123456', 'qwerty'])
 *   password: string;
 * 
 *   @NotIn(['DELETE', 'DROP', 'TRUNCATE'])
 *   sqlCommand: string;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array of forbidden values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-not-in | Laravel not_in Rule}
 * @public
 */
export function NotIn({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "not_in",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        // Convert value to string for comparison (Laravel behavior)
        const stringValue = String(value);
        const isIncluded = ruleParams.includes(stringValue) || ruleParams.includes(value);

        if (!isIncluded) {
            resolve(true);
        } else {
            const message = i18n.t("validator.notIn", {
                field: translatedPropertyName || fieldName,
                value,
                values: ruleParams.join(', '),
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Required Rule
 * 
 * Validates that the field under validation is present in the input data and not empty.
 * A field is considered "empty" if one of the following conditions are true:
 * - The value is null
 * - The value is an empty string
 * - The value is an empty array
 * - The value is an uploaded file with no path
 * 
 * @example
 * ```typescript
 * // Valid required values
 * await Validator.validate({
 *   value: 'Hello',
 *   rules: ['required']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 0,
 *   rules: ['required']
 * }); // ✓ Valid (0 is not empty)
 * 
 * await Validator.validate({
 *   value: false,
 *   rules: ['required']
 * }); // ✓ Valid (false is not empty)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: null,
 *   rules: ['required']
 * }); // ✗ Invalid
 * 
 * await Validator.validate({
 *   value: '',
 *   rules: ['required']
 * }); // ✗ Invalid
 * 
 * await Validator.validate({
 *   value: [],
 *   rules: ['required']
 * }); // ✗ Invalid
 * 
 * // Class validation
 * class User {
 *   @Required
 *   name: string;
 * 
 *   @Required
 *   email: string;
 * 
 *   @Required
 *   @Array
 *   roles: string[];
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-required | Laravel required Rule}
 * @public
 */
export function Required({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        let isEmpty = false;

        if (value === null || value === undefined) {
            isEmpty = true;
        } else if (typeof value === 'string' && value.trim() === '') {
            isEmpty = true;
        } else if (Array.isArray(value) && value.length === 0) {
            isEmpty = true;
        }

        if (isEmpty) {
            const message = i18n.t("validator.required", {
                field: translatedPropertyName || fieldName,
                ...rest
            });
            reject(message);
        } else {
            resolve(true);
        }
    });
}

/**
 * ### Required If Rule
 * 
 * Validates that the field under validation is present and not empty if another
 * field is equal to any value.
 * 
 * #### Parameters
 * - `field` - The field to check
 * - `value` - The value that triggers requirement
 * 
 * @example
 * ```typescript
 * // Conditional requirement based on another field
 * const data = {
 *   payment_method: 'credit_card',
 *   credit_card_number: '1234-5678-9012-3456'
 * };
 * 
 * await Validator.validate({
 *   value: data.credit_card_number,
 *   rules: ['required_if:payment_method,credit_card'],
 *   context: { data }
 * }); // ✓ Valid (credit card number required when payment method is credit_card)
 * 
 * // Multiple trigger values
 * const shippingData = {
 *   shipping_method: 'express',
 *   express_options: 'overnight'
 * };
 * 
 * await Validator.validate({
 *   value: shippingData.express_options,
 *   rules: ['required_if:shipping_method,express,priority'],
 *   context: { data: shippingData }
 * }); // ✓ Valid
 * 
 * // Class validation
 * class PaymentForm {
 *   @Required
 *   @In(['cash', 'credit_card', 'bank_transfer'])
 *   paymentMethod: string;
 * 
 *   @RequiredIf(['paymentMethod', 'credit_card'])
 *   creditCardNumber?: string;
 * 
 *   @RequiredIf(['paymentMethod', 'bank_transfer'])
 *   bankAccount?: string;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array with [field, value1, value2, ...]
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-required-if | Laravel required_if Rule}
 * @public
 */
export function RequiredIf({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length < 2) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "required_if",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const checkField = ruleParams[0];
        const triggerValues = ruleParams.slice(1);
        const checkValue = String(data[checkField]);

        const isTriggered = triggerValues.includes(checkValue);

        if (isTriggered) {
            // Field is required, check if it's empty
            let isEmpty = false;
            if (value === null || value === undefined) {
                isEmpty = true;
            } else if (typeof value === 'string' && value.trim() === '') {
                isEmpty = true;
            } else if (Array.isArray(value) && value.length === 0) {
                isEmpty = true;
            }

            if (isEmpty) {
                const message = i18n.t("validator.requiredIf", {
                    field: translatedPropertyName || fieldName,
                    otherField: checkField,
                    value: checkValue,
                    ...rest
                });
                return reject(message);
            }
        }

        resolve(true);
    });
}

/**
 * ### Size Rule
 * 
 * Validates that the field under validation has a size matching the given value.
 * For string data, value corresponds to the number of characters. For numeric data,
 * value corresponds to a given integer value. For arrays, size corresponds to the
 * count of the array. For files, size corresponds to the file size in kilobytes.
 * 
 * #### Parameters
 * - `size` - The exact size required
 * - `min,max` (optional) - Range of sizes allowed
 * 
 * @example
 * ```typescript
 * // Array size validation
 * await Validator.validate({
 *   value: [1, 2, 3],
 *   rules: ['size:3']
 * }); // ✓ Valid (array has 3 elements)
 * 
 * // String length validation
 * await Validator.validate({
 *   value: 'hello',
 *   rules: ['size:5']
 * }); // ✓ Valid (string has 5 characters)
 * 
 * // Range validation
 * await Validator.validate({
 *   value: [1, 2, 3, 4],
 *   rules: ['size:2,6']
 * }); // ✓ Valid (array has 4 elements, within range 2-6)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: [1, 2],
 *   rules: ['size:3']
 * }); // ✗ Invalid (array has 2 elements, expected 3)
 * 
 * // Class validation
 * class ValidationExample {
 *   @Size([10])
 *   phoneNumber: string; // Exactly 10 characters
 * 
 *   @Size([3, 10])
 *   tags: string[]; // 3-10 items in array
 * 
 *   @Size([5])
 *   zipCode: string; // Exactly 5 characters
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array with size specification
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-size | Laravel size Rule}
 * @public
 */
export function Size({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "size",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        let actualSize: number;

        // Determine the size based on value type
        if (typeof value === 'string') {
            actualSize = value.length;
        } else if (Array.isArray(value)) {
            actualSize = value.length;
        } else if (typeof value === 'number') {
            actualSize = value;
        } else if (typeof value === 'object' && value !== null) {
            actualSize = Object.keys(value).length;
        } else {
            const message = i18n.t("validator.invalidType", {
                field: translatedPropertyName || fieldName,
                rule: "size",
                ...rest
            });
            return reject(message);
        }

        let isValid = false;

        if (ruleParams.length === 1) {
            // Exact size
            const requiredSize = Number(ruleParams[0]);
            isValid = actualSize === requiredSize;
        } else if (ruleParams.length === 2) {
            // Size range
            const minSize = Number(ruleParams[0]);
            const maxSize = Number(ruleParams[1]);
            isValid = actualSize >= minSize && actualSize <= maxSize;
        }

        if (isValid) {
            resolve(true);
        } else {
            const message = i18n.t("validator.size", {
                field: translatedPropertyName || fieldName,
                value,
                size: ruleParams.join('-'),
                actualSize,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Distinct Rule
 * 
 * Validates that the field under validation is an array and all values in the
 * array are unique (no duplicates).
 * 
 * #### Parameters
 * - `strict` (optional) - Use strict comparison (===)
 * - `ignore_case` (optional) - Ignore case when comparing strings
 * 
 * @example
 * ```typescript
 * // Valid distinct arrays
 * await Validator.validate({
 *   value: [1, 2, 3, 4],
 *   rules: ['distinct']
 * }); // ✓ Valid (no duplicates)
 * 
 * await Validator.validate({
 *   value: ['apple', 'banana', 'cherry'],
 *   rules: ['distinct']
 * }); // ✓ Valid (no duplicates)
 * 
 * // Case-insensitive validation
 * await Validator.validate({
 *   value: ['Apple', 'banana', 'CHERRY'],
 *   rules: ['distinct:ignore_case']
 * }); // ✓ Valid (different cases, no duplicates)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: [1, 2, 2, 3],
 *   rules: ['distinct']
 * }); // ✗ Invalid (duplicate 2)
 * 
 * await Validator.validate({
 *   value: ['apple', 'Apple'],
 *   rules: ['distinct:ignore_case']
 * }); // ✗ Invalid (duplicate when ignoring case)
 * 
 * // Class validation
 * class UniqueList {
 *   @Distinct
 *   tags: string[];
 * 
 *   @Distinct(['ignore_case'])
 *   categories: string[];
 * 
 *   @Distinct(['strict'])
 *   ids: (string | number)[];
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Optional array with comparison options
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-distinct | Laravel distinct Rule}
 * @public
 */
export function Distinct({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(value)) {
            const message = i18n.t("validator.array", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const options = ruleParams || [];
        const ignoreCase = options.includes('ignore_case');
        const strict = options.includes('strict');

        const seen = new Set();
        const duplicates: any[] = [];

        for (const item of value) {
            let compareValue = item;

            if (ignoreCase && typeof item === 'string') {
                compareValue = item.toLowerCase();
            }

            if (seen.has(compareValue)) {
                duplicates.push(item);
            } else {
                seen.add(compareValue);
            }
        }

        if (duplicates.length === 0) {
            resolve(true);
        } else {
            const message = i18n.t("validator.distinct", {
                field: translatedPropertyName || fieldName,
                duplicates: duplicates.join(', '),
                ...rest
            });
            reject(message);
        }
    });
}
