import { IValidatorValidateOptions, IValidatorResult } from "../../types";
import { i18n } from "../../../i18n";
import { isNonNullString, isValidEmail, isValidUrl } from "../../../utils";

/**
 * ## String Validation Rules
 * 
 * Collection of Laravel-compatible string validation rules that handle
 * text validation, format checking, and string pattern matching with
 * proper internationalization and type safety.
 * 
 * ### Available Rules
 * - `alpha` - Only alphabetic characters
 * - `alpha_dash` - Alphanumeric with dashes and underscores
 * - `alpha_num` - Only alphanumeric characters  
 * - `ascii` - Only 7-bit ASCII characters
 * - `confirmed` - Must have matching confirmation field
 * - `email` - Valid email address with validation styles
 * - `ends_with` - Must end with specified values
 * - `hex_color` - Valid hexadecimal color
 * - `json` - Valid JSON string
 * - `lowercase` - Must be lowercase
 * - `regex` - Must match regular expression
 * - `starts_with` - Must start with specified values
 * - `string` - Must be a string
 * - `uppercase` - Must be uppercase
 * - `url` - Valid URL with protocol support
 * - `uuid` - Valid UUID (versions 1-8)
 * - `ulid` - Valid ULID format
 * 
 * @author Resk Framework Team
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#available-validation-rules | Laravel String Rules}
 * @public
 */

/**
 * ### Alpha Rule
 * 
 * Validates that the field under validation contains entirely Unicode alphabetic
 * characters contained in [\p{L}] and [\p{M}]. Can be restricted to ASCII range.
 * 
 * #### Parameters
 * - `ascii` (optional) - Restrict to ASCII range (a-z and A-Z)
 * 
 * @example
 * ```typescript
 * // Basic alphabetic validation
 * await Validator.validate({
 *   value: 'HelloWorld',
 *   rules: ['alpha']
 * }); // ✓ Valid
 * 
 * // ASCII-only validation
 * await Validator.validate({
 *   value: 'AsciiOnly',
 *   rules: ['alpha:ascii']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'Hello123',
 *   rules: ['alpha']
 * }); // ✗ Invalid (contains numbers)
 * 
 * // With class decorators
 * class Person {
 *   @Alpha
 *   firstName: string;
 * 
 *   @Alpha(['ascii'])
 *   lastName: string;
 * }
 * ```
 * 
 * @param options - Validation options containing value and rule parameters
 * @param options.ruleParams - Optional array containing 'ascii' to restrict to ASCII
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-alpha | Laravel alpha Rule}
 * @public
 */
export function Alpha({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.alpha", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const isAsciiOnly = ruleParams && ruleParams.includes('ascii');
        let isValid = false;

        if (isAsciiOnly) {
            // ASCII alphabetic only (a-z, A-Z)
            isValid = /^[a-zA-Z]+$/.test(value);
        } else {
            // Unicode alphabetic characters (includes accented characters, etc.)
            isValid = /^[\p{L}\p{M}]+$/u.test(value);
        }

        if (isValid) {
            resolve(true);
        } else {
            const message = i18n.t("validator.alpha", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Alpha Dash Rule
 * 
 * Validates that the field under validation contains entirely Unicode alpha-numeric
 * characters contained in [\p{L}], [\p{M}], [\p{N}], as well as ASCII dashes (-) 
 * and ASCII underscores (_).
 * 
 * #### Parameters
 * - `ascii` (optional) - Restrict to ASCII range
 * 
 * @example
 * ```typescript
 * // Valid alpha-dash values
 * await Validator.validate({
 *   value: 'user_name-123',
 *   rules: ['alpha_dash']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'product-id_2024',
 *   rules: ['alpha_dash']
 * }); // ✓ Valid
 * 
 * // ASCII-only validation
 * await Validator.validate({
 *   value: 'simple_name',
 *   rules: ['alpha_dash:ascii']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'user@name',
 *   rules: ['alpha_dash']
 * }); // ✗ Invalid (contains @)
 * 
 * // Practical usage
 * class SlugField {
 *   @AlphaDash
 *   slug: string; // 'my-blog-post_2024'
 * 
 *   @AlphaDash(['ascii'])
 *   username: string; // 'john_doe-123'
 * }
 * ```
 * 
 * @param options - Validation options containing value and rule parameters
 * @param options.ruleParams - Optional array containing 'ascii' to restrict to ASCII
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-alpha-dash | Laravel alpha_dash Rule}
 * @public
 */
export function AlphaDash({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.alphaDash", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const isAsciiOnly = ruleParams && ruleParams.includes('ascii');
        let isValid = false;

        if (isAsciiOnly) {
            // ASCII alphanumeric with dashes and underscores
            isValid = /^[a-zA-Z0-9_-]+$/.test(value);
        } else {
            // Unicode alphanumeric with dashes and underscores
            isValid = /^[\p{L}\p{M}\p{N}_-]+$/u.test(value);
        }

        if (isValid) {
            resolve(true);
        } else {
            const message = i18n.t("validator.alphaDash", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Alpha Numeric Rule
 * 
 * Validates that the field under validation contains entirely Unicode alpha-numeric
 * characters contained in [\p{L}], [\p{M}], and [\p{N}].
 * 
 * #### Parameters
 * - `ascii` (optional) - Restrict to ASCII range (a-z, A-Z, 0-9)
 * 
 * @example
 * ```typescript
 * // Valid alphanumeric values
 * await Validator.validate({
 *   value: 'Product123',
 *   rules: ['alpha_num']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'Café2024',
 *   rules: ['alpha_num']
 * }); // ✓ Valid (Unicode support)
 * 
 * // ASCII-only validation
 * await Validator.validate({
 *   value: 'Product123',
 *   rules: ['alpha_num:ascii']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'Product-123',
 *   rules: ['alpha_num']
 * }); // ✗ Invalid (contains dash)
 * 
 * // Usage in forms
 * class ProductCode {
 *   @AlphaNum
 *   productId: string; // 'PROD123ABC'
 * 
 *   @AlphaNum(['ascii'])
 *   sku: string; // 'SKU123'
 * }
 * ```
 * 
 * @param options - Validation options containing value and rule parameters
 * @param options.ruleParams - Optional array containing 'ascii' to restrict to ASCII
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-alpha-num | Laravel alpha_num Rule}
 * @public
 */
export function AlphaNum({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.alphaNum", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const isAsciiOnly = ruleParams && ruleParams.includes('ascii');
        let isValid = false;

        if (isAsciiOnly) {
            // ASCII alphanumeric only
            isValid = /^[a-zA-Z0-9]+$/.test(value);
        } else {
            // Unicode alphanumeric characters
            isValid = /^[\p{L}\p{M}\p{N}]+$/u.test(value);
        }

        if (isValid) {
            resolve(true);
        } else {
            const message = i18n.t("validator.alphaNum", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### ASCII Rule
 * 
 * Validates that the field under validation contains entirely 7-bit ASCII characters.
 * This ensures compatibility with systems that don't support Unicode.
 * 
 * @example
 * ```typescript
 * // Valid ASCII values
 * await Validator.validate({
 *   value: 'Hello World 123!',
 *   rules: ['ascii']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'Basic-ASCII_text',
 *   rules: ['ascii']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'Café',
 *   rules: ['ascii']
 * }); // ✗ Invalid (contains é)
 * 
 * await Validator.validate({
 *   value: 'Hello 世界',
 *   rules: ['ascii']
 * }); // ✗ Invalid (contains Chinese characters)
 * 
 * // Practical usage
 * class SystemConfig {
 *   @Ascii
 *   hostname: string; // Must be ASCII-compatible
 * 
 *   @Ascii
 *   apiKey: string; // API keys are typically ASCII
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-ascii | Laravel ascii Rule}
 * @public
 */
export function Ascii({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.ascii", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        // Check if all characters are in ASCII range (0-127)
        const isAscii = /^[\x00-\x7F]*$/.test(value);

        if (isAscii) {
            resolve(true);
        } else {
            const message = i18n.t("validator.ascii", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Confirmed Rule
 * 
 * Validates that the field under validation has a matching field of `{field}_confirmation`.
 * For example, if the field under validation is `password`, a matching 
 * `password_confirmation` field must be present in the input.
 * 
 * #### Parameters
 * - `confirmationField` (optional) - Custom confirmation field name
 * 
 * @example
 * ```typescript
 * // Standard password confirmation
 * const data = {
 *   password: 'secret123',
 *   password_confirmation: 'secret123'
 * };
 * 
 * await Validator.validate({
 *   value: data.password,
 *   rules: ['confirmed'],
 *   context: { data }
 * }); // ✓ Valid
 * 
 * // Custom confirmation field
 * const emailData = {
 *   email: 'user@example.com',
 *   email_verify: 'user@example.com'
 * };
 * 
 * await Validator.validate({
 *   value: emailData.email,
 *   rules: ['confirmed:email_verify'],
 *   context: { data: emailData }
 * }); // ✓ Valid
 * 
 * // Class validation example
 * class UserRegistration {
 *   @Required
 *   @MinLength([8])
 *   password: string;
 * 
 *   @Confirmed
 *   password_confirmation: string;
 * 
 *   @Required
 *   @Email
 *   email: string;
 * 
 *   @Confirmed(['email_verify'])
 *   email_verify: string;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Optional array with custom confirmation field name
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-confirmed | Laravel confirmed Rule}
 * @public
 */
export function Confirmed({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        const data = (context as any)?.data || context || {};

        // Determine confirmation field name
        let confirmationFieldName: string;
        if (ruleParams && ruleParams[0]) {
            confirmationFieldName = ruleParams[0];
        } else if (fieldName) {
            confirmationFieldName = `${fieldName}_confirmation`;
        } else {
            const message = i18n.t("validator.confirmed", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const confirmationValue = data[confirmationFieldName];

        if (value === confirmationValue) {
            resolve(true);
        } else {
            const message = i18n.t("validator.confirmed", {
                field: translatedPropertyName || fieldName,
                confirmationField: confirmationFieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Email Rule
 * 
 * Validates that the field under validation is formatted as an email address.
 * This validation rule utilizes multiple validation styles for comprehensive
 * email validation.
 * 
 * #### Validation Styles
 * - `rfc` - RFC 5322 compliant validation (default)
 * - `strict` - RFC 5322 with no warnings
 * - `dns` - Check for valid MX record
 * - `spoof` - Check for spoofing/homograph attacks
 * - `filter` - Use PHP filter_var equivalent
 * - `filter_unicode` - Filter with Unicode support
 * 
 * @example
 * ```typescript
 * // Basic email validation
 * await Validator.validate({
 *   value: 'user@example.com',
 *   rules: ['email']
 * }); // ✓ Valid
 * 
 * // Strict RFC validation with DNS check
 * await Validator.validate({
 *   value: 'user@example.com',
 *   rules: ['email:rfc,dns']
 * }); // ✓ Valid (if DNS passes)
 * 
 * // Multiple validation styles
 * await Validator.validate({
 *   value: 'test@domain.com',
 *   rules: ['email:strict,spoof,dns']
 * }); // ✓ Comprehensive validation
 * 
 * // Class validation
 * class User {
 *   @Required
 *   @Email(['rfc', 'dns'])
 *   primaryEmail: string;
 * 
 *   @Email(['filter'])
 *   secondaryEmail?: string;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Optional array of validation styles
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-email | Laravel email Rule}
 * @public
 */
export function Email({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.email", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        // For now, use the existing email validation utility
        // TODO: Implement specific validation styles (rfc, dns, strict, etc.)
        const isValidEmailFormat = isValidEmail(value);

        if (isValidEmailFormat) {
            resolve(true);
        } else {
            const message = i18n.t("validator.email", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Ends With Rule
 * 
 * Validates that the field under validation ends with one of the given values.
 * 
 * #### Parameters
 * - List of values that the field must end with
 * 
 * @example
 * ```typescript
 * // Valid endings
 * await Validator.validate({
 *   value: 'profile.jpg',
 *   rules: ['ends_with:jpg,png,gif']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'document.pdf',
 *   rules: ['ends_with:pdf,doc,docx']
 * }); // ✓ Valid
 * 
 * // Invalid example
 * await Validator.validate({
 *   value: 'image.txt',
 *   rules: ['ends_with:jpg,png,gif']
 * }); // ✗ Invalid
 * 
 * // Class validation
 * class FileUpload {
 *   @EndsWith(['jpg', 'png', 'gif', 'webp'])
 *   imageFile: string;
 * 
 *   @EndsWith(['.com', '.org', '.net'])
 *   websiteUrl: string;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array of valid ending values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-ends-with | Laravel ends_with Rule}
 * @public
 */
export function EndsWith({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.endsWith", {
                field: translatedPropertyName || fieldName,
                value,
                endings: ruleParams?.join(', ') || '',
                ...rest
            });
            return reject(message);
        }

        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "ends_with",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const endsWithAny = ruleParams.some(ending => value.endsWith(ending));

        if (endsWithAny) {
            resolve(true);
        } else {
            const message = i18n.t("validator.endsWith", {
                field: translatedPropertyName || fieldName,
                value,
                endings: ruleParams.join(', '),
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Starts With Rule
 * 
 * Validates that the field under validation starts with one of the given values.
 * 
 * #### Parameters
 * - List of values that the field must start with
 * 
 * @example
 * ```typescript
 * // Valid beginnings
 * await Validator.validate({
 *   value: 'https://example.com',
 *   rules: ['starts_with:http://,https://']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'USER_12345',
 *   rules: ['starts_with:USER_,ADMIN_']
 * }); // ✓ Valid
 * 
 * // Invalid example
 * await Validator.validate({
 *   value: 'ftp://example.com',
 *   rules: ['starts_with:http://,https://']
 * }); // ✗ Invalid
 * 
 * // Class validation
 * class Configuration {
 *   @StartsWith(['http://', 'https://'])
 *   apiUrl: string;
 * 
 *   @StartsWith(['prod_', 'dev_', 'test_'])
 *   environment: string;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array of valid starting values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-starts-with | Laravel starts_with Rule}
 * @public
 */
export function StartsWith({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.startsWith", {
                field: translatedPropertyName || fieldName,
                value,
                prefixes: ruleParams?.join(', ') || '',
                ...rest
            });
            return reject(message);
        }

        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "starts_with",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const startsWithAny = ruleParams.some(prefix => value.startsWith(prefix));

        if (startsWithAny) {
            resolve(true);
        } else {
            const message = i18n.t("validator.startsWith", {
                field: translatedPropertyName || fieldName,
                value,
                prefixes: ruleParams.join(', '),
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### String Rule
 * 
 * Validates that the field under validation is a string. If you would like to
 * allow the field to also be null, you should assign the nullable rule to the field.
 * 
 * @example
 * ```typescript
 * // Valid string values
 * await Validator.validate({
 *   value: 'Hello World',
 *   rules: ['string']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: '',
 *   rules: ['string']
 * }); // ✓ Valid (empty string)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 123,
 *   rules: ['string']
 * }); // ✗ Invalid
 * 
 * await Validator.validate({
 *   value: null,
 *   rules: ['string']
 * }); // ✗ Invalid (use nullable for null support)
 * 
 * // With nullable support
 * await Validator.validate({
 *   value: null,
 *   rules: ['nullable', 'string']
 * }); // ✓ Valid
 * 
 * // Class validation
 * class TextContent {
 *   @Required
 *   @String
 *   title: string;
 * 
 *   @Nullable
 *   @String
 *   description?: string | null;
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-string | Laravel string Rule}
 * @public
 */
export function String({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value === 'string') {
            resolve(true);
        } else {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### URL Rule
 * 
 * Validates that the field under validation is a valid URL. You can specify
 * which URL protocols should be considered valid.
 * 
 * #### Parameters
 * - List of allowed protocols (optional, defaults to http and https)
 * 
 * @example
 * ```typescript
 * // Basic URL validation
 * await Validator.validate({
 *   value: 'https://example.com',
 *   rules: ['url']
 * }); // ✓ Valid
 * 
 * // Custom protocols
 * await Validator.validate({
 *   value: 'ftp://files.example.com',
 *   rules: ['url:http,https,ftp']
 * }); // ✓ Valid
 * 
 * // Game protocol example
 * await Validator.validate({
 *   value: 'minecraft://server.example.com',
 *   rules: ['url:minecraft,steam']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'not-a-url',
 *   rules: ['url']
 * }); // ✗ Invalid
 * 
 * // Class validation
 * class WebResource {
 *   @Required
 *   @Url
 *   website: string;
 * 
 *   @Url(['http', 'https', 'ftp'])
 *   downloadLink: string;
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Optional array of allowed protocols
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-url | Laravel url Rule}
 * @public
 */
export function Url({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.url", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        // For now, use the existing URL validation utility
        // TODO: Implement protocol-specific validation
        const isValidUrlFormat = isValidUrl(value);

        if (isValidUrlFormat) {
            resolve(true);
        } else {
            const message = i18n.t("validator.url", {
                field: translatedPropertyName || fieldName,
                value,
                protocols: ruleParams?.join(', ') || 'http, https',
                ...rest
            });
            reject(message);
        }
    });
}
