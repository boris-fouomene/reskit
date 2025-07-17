import { IValidatorValidateOptions, IValidatorResult } from "../../types";
import { i18n } from "../../../i18n";
import { isNonNullString } from "../../../utils";

/**
 * ## Boolean Validation Rules
 * 
 * Collection of Laravel-compatible boolean validation rules that handle
 * acceptance, decline, and boolean value validation with proper type safety
 * and internationalization support.
 * 
 * ### Available Rules
 * - `accepted` - Field must be accepted (yes, on, 1, "1", true, "true")
 * - `accepted_if` - Conditionally accepted based on another field value
 * - `boolean` - Field must be castable to boolean
 * - `declined` - Field must be declined (no, off, 0, "0", false, "false")
 * - `declined_if` - Conditionally declined based on another field value
 * 
 * @author Resk Framework Team
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-accepted | Laravel Boolean Rules}
 * @public
 */

/**
 * ### Accepted Rule
 * 
 * Validates that the field under validation is "yes", "on", 1, "1", true, or "true".
 * This is useful for validating "Terms of Service" acceptance or similar fields.
 * 
 * #### Accepted Values
 * - `"yes"` (case-insensitive)
 * - `"on"` (case-insensitive)
 * - `1` (number)
 * - `"1"` (string)
 * - `true` (boolean)
 * - `"true"` (case-insensitive string)
 * 
 * @example
 * ```typescript
 * // Basic usage
 * await Validator.validate({
 *   value: 'yes',
 *   rules: ['accepted']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: true,
 *   rules: ['accepted']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'no',
 *   rules: ['accepted']
 * }); // ✗ Invalid
 * 
 * // With class decorators
 * class Agreement {
 *   @Accepted
 *   termsAccepted: boolean;
 * 
 *   @Accepted
 *   privacyAccepted: string;
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-accepted | Laravel accepted Rule}
 * @public
 */
export function Accepted({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        const acceptedValues = ['yes', 'on', '1', 1, true, 'true'];

        // Handle string values case-insensitively
        const normalizedValue = typeof value === 'string' ? value.toLowerCase() : value;

        const isAccepted = acceptedValues.some(acceptedVal => {
            if (typeof acceptedVal === 'string') {
                return normalizedValue === acceptedVal.toLowerCase();
            }
            return normalizedValue === acceptedVal;
        });

        if (isAccepted) {
            resolve(true);
        } else {
            const message = i18n.t("validator.accepted", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Accepted If Rule
 * 
 * Validates that the field under validation is accepted if another field
 * under validation is equal to a specified value. Useful for conditional
 * acceptance based on user choices.
 * 
 * #### Parameters
 * - `anotherField` - Name of the field to check
 * - `value` - Value that the other field must equal
 * - Additional value pairs can be specified
 * 
 * @example
 * ```typescript
 * // Basic conditional acceptance
 * await Validator.validateTarget(MyClass, {
 *   accountType: 'premium',
 *   premiumTerms: 'yes'
 * }, {
 *   accountType: 'required|string',
 *   premiumTerms: 'accepted_if:accountType,premium'
 * }); // ✓ Valid - premium terms accepted for premium account
 * 
 * // Multiple conditions
 * const data = {
 *   userType: 'business',
 *   region: 'eu',
 *   gdprConsent: 'yes'
 * };
 * 
 * await Validator.validate({
 *   value: data.gdprConsent,
 *   rules: ['accepted_if:userType,business,region,eu'],
 *   context: { data }
 * }); // ✓ Valid
 * 
 * // With decorators
 * class RegistrationForm {
 *   @Required
 *   accountType: 'basic' | 'premium';
 * 
 *   @AcceptedIf(['accountType', 'premium'])
 *   premiumTerms?: boolean;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - [anotherField, value, ...additionalPairs]
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-accepted-if | Laravel accepted_if Rule}
 * @public
 */
export function AcceptedIf({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<any[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(ruleParams) || ruleParams.length < 2 || ruleParams.length % 2 !== 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "accepted_if",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        let shouldBeAccepted = false;

        // Check pairs of field and value
        for (let i = 0; i < ruleParams.length; i += 2) {
            const otherField = ruleParams[i];
            const requiredValue = ruleParams[i + 1];
            const otherFieldValue = data[otherField];

            if (otherFieldValue == requiredValue) {
                shouldBeAccepted = true;
                break;
            }
        }

        if (!shouldBeAccepted) {
            // If condition is not met, validation passes regardless of value
            resolve(true);
        } else {
            // If condition is met, field must be accepted
            const acceptedResult = Accepted({ value, fieldName, translatedPropertyName, ...rest });
            if (acceptedResult instanceof Promise) {
                acceptedResult.then(resolve).catch(reject);
            } else {
                // Handle synchronous result
                resolve(acceptedResult);
            }
        }
    });
}

/**
 * ### Boolean Rule
 * 
 * Validates that the field under validation can be cast as a boolean.
 * This rule accepts true, false, 1, 0, "1", and "0" as valid boolean values.
 * 
 * #### Valid Boolean Values
 * - `true` and `false` (boolean)
 * - `1` and `0` (number)
 * - `"1"` and `"0"` (string)
 * - `"true"` and `"false"` (case-insensitive string)
 * 
 * @example
 * ```typescript
 * // Valid boolean values
 * await Validator.validate({
 *   value: true,
 *   rules: ['boolean']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 0,
 *   rules: ['boolean']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'false',
 *   rules: ['boolean']
 * }); // ✓ Valid
 * 
 * // Invalid values
 * await Validator.validate({
 *   value: 'maybe',
 *   rules: ['boolean']
 * }); // ✗ Invalid
 * 
 * // With class validation
 * class UserPreferences {
 *   @Boolean
 *   emailNotifications: boolean;
 * 
 *   @Boolean
 *   darkMode: string; // Can be "true"/"false"
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-boolean | Laravel boolean Rule}
 * @public
 */
export function Boolean({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        const validBooleans = [true, false, 1, 0, '1', '0'];

        // Handle string boolean values case-insensitively
        let normalizedValue = value;
        if (typeof value === 'string') {
            const lowerValue = value.toLowerCase();
            if (lowerValue === 'true') normalizedValue = true;
            else if (lowerValue === 'false') normalizedValue = false;
            else normalizedValue = value;
        }

        const isValidBoolean = validBooleans.includes(normalizedValue);

        if (isValidBoolean) {
            resolve(true);
        } else {
            const message = i18n.t("validator.boolean", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Declined Rule
 * 
 * Validates that the field under validation is "no", "off", 0, "0", false, or "false".
 * This is the inverse of the accepted rule and is useful for opt-out scenarios.
 * 
 * #### Declined Values
 * - `"no"` (case-insensitive)
 * - `"off"` (case-insensitive)
 * - `0` (number)
 * - `"0"` (string)
 * - `false` (boolean)
 * - `"false"` (case-insensitive string)
 * 
 * @example
 * ```typescript
 * // Valid declined values
 * await Validator.validate({
 *   value: 'no',
 *   rules: ['declined']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: false,
 *   rules: ['declined']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 0,
 *   rules: ['declined']
 * }); // ✓ Valid
 * 
 * // Invalid values
 * await Validator.validate({
 *   value: 'yes',
 *   rules: ['declined']
 * }); // ✗ Invalid
 * 
 * // Practical usage
 * class MarketingPreferences {
 *   @Declined  // User must decline marketing emails
 *   marketingEmails: boolean;
 * 
 *   @Declined  // User must opt-out of data sharing
 *   dataSharing: string;
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-declined | Laravel declined Rule}
 * @public
 */
export function Declined({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        const declinedValues = ['no', 'off', '0', 0, false, 'false'];

        // Handle string values case-insensitively
        const normalizedValue = typeof value === 'string' ? value.toLowerCase() : value;

        const isDeclined = declinedValues.some(declinedVal => {
            if (typeof declinedVal === 'string') {
                return normalizedValue === declinedVal.toLowerCase();
            }
            return normalizedValue === declinedVal;
        });

        if (isDeclined) {
            resolve(true);
        } else {
            const message = i18n.t("validator.declined", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Declined If Rule
 * 
 * Validates that the field under validation is declined if another field
 * under validation is equal to a specified value. Useful for conditional
 * opt-out scenarios based on user choices.
 * 
 * #### Parameters
 * - `anotherField` - Name of the field to check
 * - `value` - Value that the other field must equal
 * - Additional value pairs can be specified
 * 
 * @example
 * ```typescript
 * // Conditional decline based on user type
 * await Validator.validateTarget(MyClass, {
 *   userType: 'minor',
 *   marketingConsent: 'no'
 * }, {
 *   userType: 'required|string',
 *   marketingConsent: 'declined_if:userType,minor'
 * }); // ✓ Valid - minors must decline marketing
 * 
 * // Multiple conditions
 * const data = {
 *   location: 'gdpr_region',
 *   accountType: 'free',
 *   dataProcessing: 'no'
 * };
 * 
 * await Validator.validate({
 *   value: data.dataProcessing,
 *   rules: ['declined_if:location,gdpr_region,accountType,free'],
 *   context: { data }
 * }); // ✓ Valid
 * 
 * // With decorators
 * class PrivacySettings {
 *   @Required
 *   userAge: number;
 * 
 *   @DeclinedIf(['userAge', '< 18'])  // Custom comparison
 *   adPersonalization?: boolean;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - [anotherField, value, ...additionalPairs]
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-declined-if | Laravel declined_if Rule}
 * @public
 */
export function DeclinedIf({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<any[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(ruleParams) || ruleParams.length < 2 || ruleParams.length % 2 !== 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "declined_if",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        let shouldBeDeclined = false;

        // Check pairs of field and value
        for (let i = 0; i < ruleParams.length; i += 2) {
            const otherField = ruleParams[i];
            const requiredValue = ruleParams[i + 1];
            const otherFieldValue = data[otherField];

            if (otherFieldValue == requiredValue) {
                shouldBeDeclined = true;
                break;
            }
        }

        if (!shouldBeDeclined) {
            // If condition is not met, validation passes regardless of value
            resolve(true);
        } else {
            // If condition is met, field must be declined
            const declinedResult = Declined({ value, fieldName, translatedPropertyName, ...rest });
            if (declinedResult instanceof Promise) {
                declinedResult.then(resolve).catch(reject);
            } else {
                // Handle synchronous result
                resolve(declinedResult);
            }
        }
    });
}
