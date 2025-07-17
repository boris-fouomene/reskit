import { IValidatorValidateOptions, IValidatorResult } from "../../types";
import { i18n } from "../../../i18n";

/**
 * ## Conditional Validation Rules
 * 
 * Collection of Laravel-compatible conditional validation rules that handle
 * field presence requirements, conditional validation logic, and data flow
 * control with proper type safety and internationalization.
 * 
 * ### Available Rules
 * - `bail` - Stop validation on first failure
 * - `exclude` - Exclude field from validated data
 * - `exclude_if` - Conditionally exclude field
 * - `exclude_unless` - Exclude unless condition met
 * - `nullable` - Allow null values
 * - `present` - Must be present in input data
  * - `missing` - Must not be present in input data
 * - `missing_if` - Missing if another field equals value
 * - `missing_unless` - Missing unless another field equals value
 * - `missing_with` - Missing if any specified fields are present
 * - `missing_with_all` - Missing if all specified fields are present
 * - `missing_without` - Missing if any specified fields are absent
 * - `missing_without_all` - Missing if all specified fields are absent
 * - `prohibited_if` - Prohibited if condition met
 * - `prohibited_unless` - Prohibited unless condition met
 * - `required_unless` - Required unless condition met
 * - `required_with` - Required if any specified fields are present
 * - `required_with_all` - Required if all specified fields are present
 * - `required_without` - Required if any specified fields are missing
 * - `required_without_all` - Required if all specified fields are missing
 * - `sometimes` - Only validate if field is present
 * 
 * @author Resk Framework Team
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#available-validation-rules | Laravel Conditional Rules}
 * @public
 */

/**
 * ### Bail Rule
 * 
 * Stops running validation rules for the field after the first validation failure.
 * This is useful for performance optimization when you have expensive validation
 * rules and want to short-circuit on the first error.
 * 
 * Note: This rule affects the validation flow rather than validating the value itself.
 * 
 * @example
 * ```typescript
 * // Stop validation on first failure
 * await Validator.validate({
 *   value: 'invalid-email',
 *   rules: ['bail', 'required', 'email', 'unique:users']
 * }); // Stops at email validation, doesn't check unique
 * 
 * // Without bail - all rules are checked
 * await Validator.validate({
 *   value: 'invalid-email',
 *   rules: ['required', 'email', 'unique:users']
 * }); // Checks all rules, reports all errors
 * 
 * // Class validation
 * class User {
 *   @Bail
 *   @Required
 *   @Email
 *   @Unique(['users'])
 *   email: string; // Stops validation on first failure
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true (bail doesn't validate the value itself)
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-bail | Laravel bail Rule}
 * @public
 */
export function Bail({ }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve) => {
        // Bail rule doesn't validate the value itself
        // It's a meta-rule that affects validation flow
        resolve(true);
    });
}

/**
 * ### Exclude Rule
 * 
 * Excludes the field from the request data returned by the validate method.
 * The field will still be validated but won't appear in the final validated data.
 * 
 * @example
 * ```typescript
 * // Field is validated but excluded from result
 * const validatedData = await Validator.validateRequest({
 *   password: 'secret123',
 *   password_confirmation: 'secret123',
 *   email: 'user@example.com'
 * }, {
 *   password: ['required', 'min:8'],
 *   password_confirmation: ['required', 'exclude'],
 *   email: ['required', 'email']
 * });
 * // Result: { password: 'secret123', email: 'user@example.com' }
 * // password_confirmation is excluded from final data
 * 
 * // Class validation
 * class UserRegistration {
 *   @Required
 *   @MinLength([8])
 *   password: string;
 * 
 *   @Required
 *   @Exclude
 *   passwordConfirmation: string; // Validated but excluded
 * 
 *   @Required
 *   @Email
 *   email: string;
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true (exclude doesn't validate the value itself)
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-exclude | Laravel exclude Rule}
 * @public
 */
export function Exclude({ }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve) => {
        // Exclude rule doesn't validate the value itself
        // It's a meta-rule that affects data inclusion
        resolve(true);
    });
}

/**
 * ### Exclude If Rule
 * 
 * Excludes the field from the request data if another field is equal to a specified value.
 * 
 * #### Parameters
 * - `field` - The field to check
 * - `value` - The value that triggers exclusion
 * 
 * @example
 * ```typescript
 * // Exclude credit card info if payment method is not credit card
 * const validatedData = await Validator.validateRequest({
 *   paymentMethod: 'cash',
 *   creditCardNumber: '1234-5678-9012-3456',
 *   amount: 100
 * }, {
 *   paymentMethod: ['required', 'in:cash,credit_card,bank_transfer'],
 *   creditCardNumber: ['exclude_if:paymentMethod,cash'],
 *   amount: ['required', 'numeric']
 * });
 * // Result: { paymentMethod: 'cash', amount: 100 }
 * // creditCardNumber excluded because paymentMethod is 'cash'
 * 
 * // Class validation
 * class PaymentForm {
 *   @Required
 *   @In(['cash', 'credit_card', 'bank_transfer'])
 *   paymentMethod: string;
 * 
 *   @ExcludeIf(['paymentMethod', 'cash'])
 *   creditCardNumber?: string;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array containing [field, value] to check
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true (exclude_if doesn't validate the value itself)
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-exclude-if | Laravel exclude_if Rule}
 * @public
 */
export function ExcludeIf({ ruleParams, context }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve) => {
        // exclude_if rule doesn't validate the value itself
        // It's a meta-rule that affects conditional data inclusion
        resolve(true);
    });
}

/**
 * ### Exclude Unless Rule
 * 
 * Excludes the field from the request data unless another field is equal to a specified value.
 * 
 * #### Parameters
 * - `field` - The field to check
 * - `value` - The value that prevents exclusion
 * 
 * @example
 * ```typescript
 * // Exclude admin settings unless user type is admin
 * const validatedData = await Validator.validateRequest({
 *   userType: 'user',
 *   adminSettings: { canManageUsers: true },
 *   email: 'user@example.com'
 * }, {
 *   userType: ['required', 'in:user,admin'],
 *   adminSettings: ['exclude_unless:userType,admin'],
 *   email: ['required', 'email']
 * });
 * // Result: { userType: 'user', email: 'user@example.com' }
 * // adminSettings excluded unless userType is 'admin'
 * 
 * // Class validation
 * class UserProfile {
 *   @Required
 *   @In(['user', 'admin'])
 *   userType: string;
 * 
 *   @ExcludeUnless(['userType', 'admin'])
 *   adminSettings?: object;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array containing [field, value] to check
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true (exclude_unless doesn't validate the value itself)
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-exclude-unless | Laravel exclude_unless Rule}
 * @public
 */
export function ExcludeUnless({ ruleParams, context }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve) => {
        // exclude_unless rule doesn't validate the value itself
        // It's a meta-rule that affects conditional data inclusion
        resolve(true);
    });
}

/**
 * ### Nullable Rule
 * 
 * Allows the field under validation to be null. Without this rule, null values
 * will be considered invalid by most validation rules.
 * 
 * @example
 * ```typescript
 * // Allow null values
 * await Validator.validate({
 *   value: null,
 *   rules: ['nullable', 'string', 'min:3']
 * }); // ✓ Valid (null is allowed)
 * 
 * await Validator.validate({
 *   value: 'hello',
 *   rules: ['nullable', 'string', 'min:3']
 * }); // ✓ Valid (string also valid)
 * 
 * // Without nullable
 * await Validator.validate({
 *   value: null,
 *   rules: ['string', 'min:3']
 * }); // ✗ Invalid (null not allowed)
 * 
 * // Class validation
 * class User {
 *   @Required
 *   name: string;
 * 
 *   @Nullable
 *   @String
 *   @MinLength([3])
 *   nickname?: string | null; // Can be null or valid string
 * 
 *   @Nullable
 *   @Date
 *   lastLoginAt?: Date | null;
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if value is null, false to continue validation
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-nullable | Laravel nullable Rule}
 * @public
 */
export function Nullable({ value }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve) => {
        if (value === null || value === undefined) {
            // Value is null/undefined, which is explicitly allowed
            resolve(true);
        } else {
            // Value is not null, continue with other validation rules
            resolve(true);
        }
    });
}

/**
 * ### Present Rule
 * 
 * Validates that the field under validation is present in the input data but can be empty.
 * This differs from required in that the field must exist in the data but can have
 * an empty value.
 * 
 * @example
 * ```typescript
 * // Field must be present but can be empty
 * const data = {
 *   name: 'John',
 *   email: '', // Present but empty
 *   // phone is missing
 * };
 * 
 * await Validator.validate({
 *   value: data.email,
 *   rules: ['present'],
 *   context: { data, fieldExists: true }
 * }); // ✓ Valid (field is present, even if empty)
 * 
 * await Validator.validate({
 *   value: undefined,
 *   rules: ['present'],
 *   context: { data, fieldExists: false }
 * }); // ✗ Invalid (field is not present)
 * 
 * // Class validation
 * class FormData {
 *   @Required
 *   name: string;
 * 
 *   @Present
 *   email: string; // Must be present, can be empty
 * 
 *   @Present
 *   @Nullable
 *   newsletter?: boolean | null; // Must be present, can be null
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @param options.context - Should contain fieldExists property indicating presence
 * @returns Promise resolving to true if field is present, rejecting if missing
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-present | Laravel present Rule}
 * @public
 */
export function Present({ context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        // Check if field exists in the data
        const fieldExists = (context as any)?.fieldExists ?? true;

        if (fieldExists) {
            resolve(true);
        } else {
            const message = i18n.t("validator.present", {
                field: translatedPropertyName || fieldName,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Prohibited Rule
 * 
 * Validates that the field under validation is not present or is empty.
 * A field is considered "empty" if it meets one of the following criteria:
 * - The value is null
 * - The value is an empty string
 * - The value is an empty array
 * - The field is not present in the input data
 * 
 * @example
 * ```typescript
 * // Field must not be present or must be empty
 * await Validator.validate({
 *   value: null,
 *   rules: ['prohibited']
 * }); // ✓ Valid (null)
 * 
 * await Validator.validate({
 *   value: '',
 *   rules: ['prohibited']
 * }); // ✓ Valid (empty string)
 * 
 * await Validator.validate({
 *   value: [],
 *   rules: ['prohibited']
 * }); // ✓ Valid (empty array)
 * 
 * await Validator.validate({
 *   value: 'some value',
 *   rules: ['prohibited']
 * }); // ✗ Invalid (has value)
 * 
 * // Class validation
 * class PublicForm {
 *   @Required
 *   message: string;
 * 
 *   @Prohibited
 *   adminOnly?: any; // Must not be present/filled
 * 
 *   @Prohibited
 *   internalNotes?: string; // Must be empty if present
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if field is prohibited (empty), rejecting if present
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-prohibited | Laravel prohibited Rule}
 * @public
 */
export function Prohibited({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
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
            resolve(true);
        } else {
            const message = i18n.t("validator.prohibited", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Prohibited If Rule
 * 
 * Validates that the field under validation is not present or is empty if
 * another field is equal to any of the specified values.
 * 
 * #### Parameters
 * - `field` - The field to check
 * - `value1, value2, ...` - Values that trigger prohibition
 * 
 * @example
 * ```typescript
 * // Prohibit admin fields for regular users
 * const data = {
 *   userType: 'regular',
 *   adminTools: null // Must be empty for regular users
 * };
 * 
 * await Validator.validate({
 *   value: data.adminTools,
 *   rules: ['prohibited_if:userType,regular,guest'],
 *   context: { data }
 * }); // ✓ Valid (adminTools is empty and userType is regular)
 * 
 * // Invalid example
 * const invalidData = {
 *   userType: 'regular',
 *   adminTools: { canDelete: true } // Not allowed for regular users
 * };
 * 
 * await Validator.validate({
 *   value: invalidData.adminTools,
 *   rules: ['prohibited_if:userType,regular'],
 *   context: { data: invalidData }
 * }); // ✗ Invalid (adminTools present for regular user)
 * 
 * // Class validation
 * class UserForm {
 *   @Required
 *   @In(['admin', 'regular', 'guest'])
 *   userType: string;
 * 
 *   @ProhibitedIf(['userType', 'regular', 'guest'])
 *   adminSettings?: object; // Only allowed for admin users
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array with [field, value1, value2, ...]
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting if prohibited field has value
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-prohibited-if | Laravel prohibited_if Rule}
 * @public
 */
export function ProhibitedIf({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length < 2) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "prohibited_if",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const checkField = ruleParams[0];
        const triggerValues = ruleParams.slice(1);
        const checkValue = String(data[checkField]);

        const isProhibited = triggerValues.includes(checkValue);

        if (isProhibited) {
            // Field is prohibited, check if it's empty
            let isEmpty = false;
            if (value === null || value === undefined) {
                isEmpty = true;
            } else if (typeof value === 'string' && value.trim() === '') {
                isEmpty = true;
            } else if (Array.isArray(value) && value.length === 0) {
                isEmpty = true;
            }

            if (isEmpty) {
                resolve(true);
            } else {
                const message = i18n.t("validator.prohibitedIf", {
                    field: translatedPropertyName || fieldName,
                    otherField: checkField,
                    value: checkValue,
                    ...rest
                });
                reject(message);
            }
        } else {
            // Field is not prohibited
            resolve(true);
        }
    });
}

/**
 * ### Prohibited Unless Rule
 * 
 * Validates that the field under validation is not present or is empty unless
 * another field is equal to any of the specified values.
 * 
 * #### Parameters
 * - `field` - The field to check
 * - `value1, value2, ...` - Values that allow the field
 * 
 * @example
 * ```typescript
 * // Prohibit payment info unless payment method requires it
 * const data = {
 *   paymentMethod: 'cash',
 *   creditCardInfo: null // Prohibited unless payment method is credit_card
 * };
 * 
 * await Validator.validate({
 *   value: data.creditCardInfo,
 *   rules: ['prohibited_unless:paymentMethod,credit_card'],
 *   context: { data }
 * }); // ✓ Valid (creditCardInfo is empty and payment method is cash)
 * 
 * // Allow credit card info for credit card payments
 * const validData = {
 *   paymentMethod: 'credit_card',
 *   creditCardInfo: { number: '1234-5678-9012-3456' }
 * };
 * 
 * await Validator.validate({
 *   value: validData.creditCardInfo,
 *   rules: ['prohibited_unless:paymentMethod,credit_card'],
 *   context: { data: validData }
 * }); // ✓ Valid (allowed for credit card payments)
 * 
 * // Class validation
 * class PaymentData {
 *   @Required
 *   @In(['cash', 'credit_card', 'bank_transfer'])
 *   paymentMethod: string;
 * 
 *   @ProhibitedUnless(['paymentMethod', 'credit_card'])
 *   creditCardInfo?: object;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array with [field, value1, value2, ...]
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting if prohibited field has value
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-prohibited-unless | Laravel prohibited_unless Rule}
 * @public
 */
export function ProhibitedUnless({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length < 2) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "prohibited_unless",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const checkField = ruleParams[0];
        const allowedValues = ruleParams.slice(1);
        const checkValue = String(data[checkField]);

        const isAllowed = allowedValues.includes(checkValue);

        if (!isAllowed) {
            // Field is prohibited, check if it's empty
            let isEmpty = false;
            if (value === null || value === undefined) {
                isEmpty = true;
            } else if (typeof value === 'string' && value.trim() === '') {
                isEmpty = true;
            } else if (Array.isArray(value) && value.length === 0) {
                isEmpty = true;
            }

            if (isEmpty) {
                resolve(true);
            } else {
                const message = i18n.t("validator.prohibitedUnless", {
                    field: translatedPropertyName || fieldName,
                    otherField: checkField,
                    values: allowedValues.join(', '),
                    ...rest
                });
                reject(message);
            }
        } else {
            // Field is allowed
            resolve(true);
        }
    });
}

/**
 * ### Required Unless Rule
 * 
 * Validates that the field under validation is present and not empty unless
 * another field is equal to any of the specified values.
 * 
 * #### Parameters
 * - `field` - The field to check
 * - `value1, value2, ...` - Values that make the field optional
 * 
 * @example
 * ```typescript
 * // Phone required unless contact method is email
 * const data = {
 *   contactMethod: 'phone',
 *   phoneNumber: '123-456-7890'
 * };
 * 
 * await Validator.validate({
 *   value: data.phoneNumber,
 *   rules: ['required_unless:contactMethod,email'],
 *   context: { data }
 * }); // ✓ Valid (phone required when contact method is phone)
 * 
 * // Phone not required when contact method is email
 * const emailData = {
 *   contactMethod: 'email',
 *   phoneNumber: null
 * };
 * 
 * await Validator.validate({
 *   value: emailData.phoneNumber,
 *   rules: ['required_unless:contactMethod,email'],
 *   context: { data: emailData }
 * }); // ✓ Valid (phone not required for email contact)
 * 
 * // Class validation
 * class ContactForm {
 *   @Required
 *   @In(['email', 'phone', 'mail'])
 *   contactMethod: string;
 * 
 *   @RequiredUnless(['contactMethod', 'email'])
 *   phoneNumber?: string; // Required unless email contact
 * 
 *   @RequiredUnless(['contactMethod', 'phone', 'mail'])
 *   email?: string; // Required unless phone or mail contact
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array with [field, value1, value2, ...]
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting if required field is missing
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-required-unless | Laravel required_unless Rule}
 * @public
 */
export function RequiredUnless({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length < 2) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "required_unless",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const checkField = ruleParams[0];
        const exemptValues = ruleParams.slice(1);
        const checkValue = String(data[checkField]);

        const isExempt = exemptValues.includes(checkValue);

        if (!isExempt) {
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
                const message = i18n.t("validator.requiredUnless", {
                    field: translatedPropertyName || fieldName,
                    otherField: checkField,
                    values: exemptValues.join(', '),
                    ...rest
                });
                return reject(message);
            }
        }

        resolve(true);
    });
}

/**
 * ### Required With Rule
 * 
 * Validates that the field under validation is present and not empty only if
 * any of the other specified fields are present and not empty.
 * 
 * #### Parameters
 * - `field1, field2, ...` - Fields that trigger requirement
 * 
 * @example
 * ```typescript
 * // Billing address required if shipping address provided
 * const data = {
 *   shippingAddress: '123 Main St',
 *   billingAddress: '456 Oak Ave'
 * };
 * 
 * await Validator.validate({
 *   value: data.billingAddress,
 *   rules: ['required_with:shippingAddress'],
 *   context: { data }
 * }); // ✓ Valid (billing required because shipping is present)
 * 
 * // Multiple trigger fields
 * const formData = {
 *   hasAccount: true,
 *   username: 'john_doe' // Required because hasAccount is present
 * };
 * 
 * await Validator.validate({
 *   value: formData.username,
 *   rules: ['required_with:hasAccount,existingUser'],
 *   context: { data: formData }
 * }); // ✓ Valid
 * 
 * // Class validation
 * class ShippingForm {
 *   @String
 *   shippingAddress?: string;
 * 
 *   @RequiredWith(['shippingAddress'])
 *   billingAddress?: string;
 * 
 *   @RequiredWith(['creditCard', 'paypal'])
 *   paymentConfirmation?: string;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array of field names that trigger requirement
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting if required field is missing
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-required-with | Laravel required_with Rule}
 * @public
 */
export function RequiredWith({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "required_with",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};

        // Check if any of the specified fields are present and not empty
        const anyFieldPresent = ruleParams.some(fieldName => {
            const fieldValue = data[fieldName];
            return fieldValue !== null && fieldValue !== undefined &&
                (typeof fieldValue !== 'string' || fieldValue.trim() !== '') &&
                (!Array.isArray(fieldValue) || fieldValue.length > 0);
        });

        if (anyFieldPresent) {
            // Field is required, check if current field is empty
            let isEmpty = false;
            if (value === null || value === undefined) {
                isEmpty = true;
            } else if (typeof value === 'string' && value.trim() === '') {
                isEmpty = true;
            } else if (Array.isArray(value) && value.length === 0) {
                isEmpty = true;
            }

            if (isEmpty) {
                const message = i18n.t("validator.requiredWith", {
                    field: translatedPropertyName || fieldName,
                    values: ruleParams.join(', '),
                    ...rest
                });
                return reject(message);
            }
        }

        resolve(true);
    });
}

/**
 * ### Required With All Rule
 * 
 * Validates that the field under validation is present and not empty only if
 * all of the other specified fields are present and not empty.
 * 
 * #### Parameters
 * - `field1, field2, ...` - All fields must be present to trigger requirement
 * 
 * @example
 * ```typescript
 * // Signature required only if both name and date are provided
 * const data = {
 *   signerName: 'John Doe',
 *   signatureDate: '2024-01-15',
 *   signature: 'John Doe Signature'
 * };
 * 
 * await Validator.validate({
 *   value: data.signature,
 *   rules: ['required_with_all:signerName,signatureDate'],
 *   context: { data }
 * }); // ✓ Valid (signature required because both name and date present)
 * 
 * // Not required if any field is missing
 * const incompleteData = {
 *   signerName: 'John Doe',
 *   // signatureDate missing
 *   signature: null
 * };
 * 
 * await Validator.validate({
 *   value: incompleteData.signature,
 *   rules: ['required_with_all:signerName,signatureDate'],
 *   context: { data: incompleteData }
 * }); // ✓ Valid (signature not required because signatureDate missing)
 * 
 * // Class validation
 * class ContractForm {
 *   @String
 *   signerName?: string;
 * 
 *   @Date
 *   signatureDate?: string;
 * 
 *   @RequiredWithAll(['signerName', 'signatureDate'])
 *   signature?: string; // Required only if both name and date provided
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array of field names that all must be present
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting if required field is missing
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-required-with-all | Laravel required_with_all Rule}
 * @public
 */
export function RequiredWithAll({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "required_with_all",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};

        // Check if ALL specified fields are present and not empty
        const allFieldsPresent = ruleParams.every(fieldName => {
            const fieldValue = data[fieldName];
            return fieldValue !== null && fieldValue !== undefined &&
                (typeof fieldValue !== 'string' || fieldValue.trim() !== '') &&
                (!Array.isArray(fieldValue) || fieldValue.length > 0);
        });

        if (allFieldsPresent) {
            // Field is required, check if current field is empty
            let isEmpty = false;
            if (value === null || value === undefined) {
                isEmpty = true;
            } else if (typeof value === 'string' && value.trim() === '') {
                isEmpty = true;
            } else if (Array.isArray(value) && value.length === 0) {
                isEmpty = true;
            }

            if (isEmpty) {
                const message = i18n.t("validator.requiredWithAll", {
                    field: translatedPropertyName || fieldName,
                    values: ruleParams.join(', '),
                    ...rest
                });
                return reject(message);
            }
        }

        resolve(true);
    });
}

/**
 * ### Required Without Rule
 * 
 * Validates that the field under validation is present and not empty only when
 * any of the other specified fields are empty or not present.
 * 
 * #### Parameters
 * - `field1, field2, ...` - Fields whose absence triggers requirement
 * 
 * @example
 * ```typescript
 * // Email required if phone number is not provided
 * const data = {
 *   email: 'user@example.com'
 *   // phoneNumber missing
 * };
 * 
 * await Validator.validate({
 *   value: data.email,
 *   rules: ['required_without:phoneNumber'],
 *   context: { data }
 * }); // ✓ Valid (email required because phone is missing)
 * 
 * // Email not required if phone is provided
 * const phoneData = {
 *   phoneNumber: '123-456-7890',
 *   email: null
 * };
 * 
 * await Validator.validate({
 *   value: phoneData.email,
 *   rules: ['required_without:phoneNumber'],
 *   context: { data: phoneData }
 * }); // ✓ Valid (email not required because phone is present)
 * 
 * // Class validation
 * class ContactInfo {
 *   @RequiredWithout(['email'])
 *   phoneNumber?: string; // Required if email missing
 * 
 *   @RequiredWithout(['phoneNumber'])
 *   @Email
 *   email?: string; // Required if phone missing
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array of field names whose absence triggers requirement
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting if required field is missing
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-required-without | Laravel required_without Rule}
 * @public
 */
export function RequiredWithout({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "required_without",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};

        // Check if any of the specified fields are missing or empty
        const anyFieldMissing = ruleParams.some(fieldName => {
            const fieldValue = data[fieldName];
            return fieldValue === null || fieldValue === undefined ||
                (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
                (Array.isArray(fieldValue) && fieldValue.length === 0);
        });

        if (anyFieldMissing) {
            // Field is required, check if current field is empty
            let isEmpty = false;
            if (value === null || value === undefined) {
                isEmpty = true;
            } else if (typeof value === 'string' && value.trim() === '') {
                isEmpty = true;
            } else if (Array.isArray(value) && value.length === 0) {
                isEmpty = true;
            }

            if (isEmpty) {
                const message = i18n.t("validator.requiredWithout", {
                    field: translatedPropertyName || fieldName,
                    values: ruleParams.join(', '),
                    ...rest
                });
                return reject(message);
            }
        }

        resolve(true);
    });
}

/**
 * ### Required Without All Rule
 * 
 * Validates that the field under validation is present and not empty only when
 * all of the other specified fields are empty or not present.
 * 
 * #### Parameters
 * - `field1, field2, ...` - All fields must be absent to trigger requirement
 * 
 * @example
 * ```typescript
 * // Backup contact required only if both primary contacts are missing
 * const data = {
 *   emergencyContact: 'emergency@example.com'
 *   // Both primaryPhone and primaryEmail missing
 * };
 * 
 * await Validator.validate({
 *   value: data.emergencyContact,
 *   rules: ['required_without_all:primaryPhone,primaryEmail'],
 *   context: { data }
 * }); // ✓ Valid (emergency required because both primary contacts missing)
 * 
 * // Not required if any primary contact exists
 * const partialData = {
 *   primaryEmail: 'user@example.com',
 *   // primaryPhone missing
 *   emergencyContact: null
 * };
 * 
 * await Validator.validate({
 *   value: partialData.emergencyContact,
 *   rules: ['required_without_all:primaryPhone,primaryEmail'],
 *   context: { data: partialData }
 * }); // ✓ Valid (emergency not required because email is present)
 * 
 * // Class validation
 * class EmergencyContacts {
 *   @Email
 *   primaryEmail?: string;
 * 
 *   @String
 *   primaryPhone?: string;
 * 
 *   @RequiredWithoutAll(['primaryEmail', 'primaryPhone'])
 *   @Email
 *   emergencyContact?: string; // Required only if both primary contacts missing
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array of field names that all must be absent
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting if required field is missing
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-required-without-all | Laravel required_without_all Rule}
 * @public
 */
export function RequiredWithoutAll({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "required_without_all",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};

        // Check if ALL specified fields are missing or empty
        const allFieldsMissing = ruleParams.every(fieldName => {
            const fieldValue = data[fieldName];
            return fieldValue === null || fieldValue === undefined ||
                (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
                (Array.isArray(fieldValue) && fieldValue.length === 0);
        });

        if (allFieldsMissing) {
            // Field is required, check if current field is empty
            let isEmpty = false;
            if (value === null || value === undefined) {
                isEmpty = true;
            } else if (typeof value === 'string' && value.trim() === '') {
                isEmpty = true;
            } else if (Array.isArray(value) && value.length === 0) {
                isEmpty = true;
            }

            if (isEmpty) {
                const message = i18n.t("validator.requiredWithoutAll", {
                    field: translatedPropertyName || fieldName,
                    values: ruleParams.join(', '),
                    ...rest
                });
                return reject(message);
            }
        }

        resolve(true);
    });
}

/**
 * ### Sometimes Rule
 * 
 * In some situations, you may wish to run validation checks against a field
 * only if that field is present in the input array. This is exactly what the
 * sometimes rule does.
 * 
 * @example
 * ```typescript
 * // Only validate email format if email is provided
 * await Validator.validate({
 *   value: 'user@example.com',
 *   rules: ['sometimes', 'email']
 * }); // ✓ Valid (email format checked because field is present)
 * 
 * // Skip validation if field is not present
 * await Validator.validate({
 *   value: undefined,
 *   rules: ['sometimes', 'email'],
 *   context: { fieldExists: false }
 * }); // ✓ Valid (email validation skipped because field not present)
 * 
 * // Class validation
 * class OptionalFields {
 *   @Required
 *   name: string;
 * 
 *   @Sometimes
 *   @Email
 *   email?: string; // Only validate if present
 * 
 *   @Sometimes
 *   @Integer
 *   @Min([18])
 *   age?: number; // Only validate if present
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @param options.context - Should contain fieldExists property
 * @returns Promise resolving to true if field should be validated, or skipped
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-sometimes | Laravel sometimes Rule}
 * @public
 */
export function Sometimes({ context }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve) => {
        // Check if field exists in the data
        const fieldExists = (context as any)?.fieldExists ?? true;

        if (fieldExists) {
            // Field exists, continue with other validation rules
            resolve(true);
        } else {
            // Field doesn't exist, skip validation (this is meta-rule behavior)
            resolve(true);
        }
    });
}

/**
 * ### Missing If Rule
 * 
 * Validates that the field under validation is missing if another field equals a specified value.
 * This is useful for conditional field requirements where fields should be absent based on other values.
 * 
 * #### Parameters
 * - `field` - The field name to check
 * - `value` - The value that triggers the missing requirement
 * 
 * @example
 * ```typescript
 * // Admin fields should be missing for regular users
 * const data = {
 *   userType: 'regular',
 *   adminNotes: 'Should not be here' // This should be missing
 * };
 * 
 * await Validator.validate({
 *   value: data.adminNotes,
 *   rules: ['missing_if:userType,regular'],
 *   context: { data, fieldExists: true }
 * }); // ✗ Invalid (field should be missing)
 * 
 * // Valid example
 * const validData = {
 *   userType: 'regular'
 *   // adminNotes is missing - this is correct
 * };
 * 
 * await Validator.validate({
 *   rules: ['missing_if:userType,regular'],
 *   context: { data: validData, fieldExists: false }
 * }); // ✓ Valid (field is missing as required)
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array with [field, value]
 * @param options.context - Validation context with fieldExists and data
 * @returns Promise resolving to true if correctly missing, rejecting if present when should be missing
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-missing-if | Laravel missing_if Rule}
 * @public
 */
export function MissingIf({ ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length < 2) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "missing_if",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const fieldExists = (context as any)?.fieldExists ?? false;
        const checkField = ruleParams[0];
        const checkValue = ruleParams[1];
        const actualValue = String(data[checkField]);

        if (actualValue === checkValue) {
            // Field should be missing
            if (fieldExists) {
                const message = i18n.t("validator.missingIf", {
                    field: translatedPropertyName || fieldName,
                    otherField: checkField,
                    checkValue: checkValue,
                    ...rest
                });
                return reject(message);
            }
        }

        resolve(true);
    });
}

/**
 * ### Missing Unless Rule
 * 
 * Validates that the field under validation is missing unless another field equals a specified value.
 * 
 * #### Parameters
 * - `field` - The field name to check
 * - `value` - The value that allows the field to be present
 * 
 * @example
 * ```typescript
 * // Special fields only allowed for admin users
 * const data = {
 *   userType: 'regular',
 *   adminToken: 'secret' // Should be missing unless admin
 * };
 * 
 * await Validator.validate({
 *   value: data.adminToken,
 *   rules: ['missing_unless:userType,admin'],
 *   context: { data, fieldExists: true }
 * }); // ✗ Invalid (field should be missing for non-admin)
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @returns Promise resolving to true if correctly missing, rejecting if present inappropriately
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-missing-unless | Laravel missing_unless Rule}
 * @public
 */
export function MissingUnless({ ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length < 2) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "missing_unless",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const fieldExists = (context as any)?.fieldExists ?? false;
        const checkField = ruleParams[0];
        const allowedValue = ruleParams[1];
        const actualValue = String(data[checkField]);

        if (actualValue !== allowedValue) {
            // Field should be missing
            if (fieldExists) {
                const message = i18n.t("validator.missingUnless", {
                    field: translatedPropertyName || fieldName,
                    otherField: checkField,
                    allowedValue: allowedValue,
                    ...rest
                });
                return reject(message);
            }
        }

        resolve(true);
    });
}

/**
 * ### Missing With Rule
 * 
 * Validates that the field under validation is missing if any of the specified fields are present.
 * 
 * #### Parameters
 * - `fields...` - One or more field names that trigger the missing requirement
 * 
 * @example
 * ```typescript
 * // Either use existing account or create new, not both
 * const data = {
 *   existingAccountId: '123',
 *   newAccountName: 'Should not be present' // Should be missing when existing account used
 * };
 * 
 * await Validator.validate({
 *   value: data.newAccountName,
 *   rules: ['missing_with:existingAccountId'],
 *   context: { data, fieldExists: true }
 * }); // ✗ Invalid (newAccountName should be missing when existingAccountId present)
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @returns Promise resolving to true if correctly missing, rejecting if present inappropriately
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-missing-with | Laravel missing_with Rule}
 * @public
 */
export function MissingWith({ ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "missing_with",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const fieldExists = (context as any)?.fieldExists ?? false;

        // Check if any of the specified fields are present
        const hasAnyField = ruleParams.some(field => {
            const value = data[field];
            return value !== null && value !== undefined && value !== '';
        });

        if (hasAnyField && fieldExists) {
            const message = i18n.t("validator.missingWith", {
                field: translatedPropertyName || fieldName,
                fields: ruleParams.join(', '),
                ...rest
            });
            return reject(message);
        }

        resolve(true);
    });
}

/**
 * ### Missing With All Rule
 * 
 * Validates that the field under validation is missing if all of the specified fields are present.
 * 
 * #### Parameters
 * - `fields...` - All field names that must be present to trigger missing requirement
 * 
 * @example
 * ```typescript
 * // Alternative payment method should be missing when both primary methods are available
 * const data = {
 *   creditCard: '1234',
 *   bankAccount: '5678',
 *   alternativePayment: 'crypto' // Should be missing when both primary methods present
 * };
 * 
 * await Validator.validate({
 *   value: data.alternativePayment,
 *   rules: ['missing_with_all:creditCard,bankAccount'],
 *   context: { data, fieldExists: true }
 * }); // ✗ Invalid (alternative should be missing when both primary methods present)
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @returns Promise resolving to true if correctly missing, rejecting if present inappropriately
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-missing-with-all | Laravel missing_with_all Rule}
 * @public
 */
export function MissingWithAll({ ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "missing_with_all",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const fieldExists = (context as any)?.fieldExists ?? false;

        // Check if all specified fields are present
        const hasAllFields = ruleParams.every(field => {
            const value = data[field];
            return value !== null && value !== undefined && value !== '';
        });

        if (hasAllFields && fieldExists) {
            const message = i18n.t("validator.missingWithAll", {
                field: translatedPropertyName || fieldName,
                fields: ruleParams.join(', '),
                ...rest
            });
            return reject(message);
        }

        resolve(true);
    });
}

/**
 * ### Missing Without Rule
 * 
 * Validates that the field under validation is missing if any of the specified fields are absent.
 * 
 * #### Parameters
 * - `fields...` - Field names whose absence triggers the missing requirement
 * 
 * @example
 * ```typescript
 * // Backup contact should be missing if primary contact methods are missing
 * const data = {
 *   backupPhone: '555-0123' // Should be missing if phone or email are absent
 *   // phone and email are missing
 * };
 * 
 * await Validator.validate({
 *   value: data.backupPhone,
 *   rules: ['missing_without:phone,email'],
 *   context: { data, fieldExists: true }
 * }); // ✗ Invalid (backup should be missing when primary contacts are absent)
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @returns Promise resolving to true if correctly missing, rejecting if present inappropriately
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-missing-without | Laravel missing_without Rule}
 * @public
 */
export function MissingWithout({ ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "missing_without",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const fieldExists = (context as any)?.fieldExists ?? false;

        // Check if any of the specified fields are missing
        const hasMissingField = ruleParams.some(field => {
            const value = data[field];
            return value === null || value === undefined || value === '';
        });

        if (hasMissingField && fieldExists) {
            const message = i18n.t("validator.missingWithout", {
                field: translatedPropertyName || fieldName,
                fields: ruleParams.join(', '),
                ...rest
            });
            return reject(message);
        }

        resolve(true);
    });
}

/**
 * ### Missing Without All Rule
 * 
 * Validates that the field under validation is missing if all of the specified fields are absent.
 * 
 * #### Parameters
 * - `fields...` - All field names that must be absent to trigger missing requirement
 * 
 * @example
 * ```typescript
 * // Default settings should be missing only when all custom settings are absent
 * const data = {
 *   defaultTheme: 'light' // Should be missing only when ALL custom themes are absent
 *   // customLightTheme, customDarkTheme, customColors are all missing
 * };
 * 
 * await Validator.validate({
 *   value: data.defaultTheme,
 *   rules: ['missing_without_all:customLightTheme,customDarkTheme,customColors'],
 *   context: { data, fieldExists: true }
 * }); // ✗ Invalid (default should be missing when all custom options are absent)
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @returns Promise resolving to true if correctly missing, rejecting if present inappropriately
 * 
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-missing-without-all | Laravel missing_without_all Rule}
 * @public
 */
export function MissingWithoutAll({ ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "missing_without_all",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const fieldExists = (context as any)?.fieldExists ?? false;

        // Check if all specified fields are missing
        const allFieldsMissing = ruleParams.every(field => {
            const value = data[field];
            return value === null || value === undefined || value === '';
        });

        if (allFieldsMissing && fieldExists) {
            const message = i18n.t("validator.missingWithoutAll", {
                field: translatedPropertyName || fieldName,
                fields: ruleParams.join(', '),
                ...rest
            });
            return reject(message);
        }

        resolve(true);
    });
}
