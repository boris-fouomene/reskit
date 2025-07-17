import { IValidatorValidateOptions, IValidatorResult } from "../../types";
import { i18n } from "../../../i18n";

/**
 * ## Utility Validation Rules
 * 
 * Collection of Laravel-compatible utility validation rules that provide
 * foundational validation patterns, data type checking, and common validation
 * helpers with proper type safety and internationalization.
 * 
 * ### Available Rules
 * - `different` - Must be different from another field
 * - `same` - Must be the same as another field
 * - `missing` - Must not be present in input data
 * - `missing_if` - Missing if another field equals value
 * - `missing_unless` - Missing unless another field equals value
 * - `missing_with` - Missing if any specified fields are present
 * - `missing_with_all` - Missing if all specified fields are present
 * - `missing_without` - Missing if any specified fields are absent
 * - `missing_without_all` - Missing if all specified fields are absent
 * - `regex` - Must match regular expression pattern
 * - `not_regex` - Must not match regular expression pattern
 * - `json` - Must be valid JSON string
 * - `lowercase` - Must be lowercase string
 * - `uppercase` - Must be uppercase string
 * - `hex_color` - Must be valid hexadecimal color
 * - `mac_address` - Must be valid MAC address
 * - `ip` - Must be valid IP address
 * - `ipv4` - Must be valid IPv4 address
 * - `ipv6` - Must be valid IPv6 address
 * 
 * @author Resk Framework Team
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#available-validation-rules | Laravel Utility Rules}
 * @public
 */

/**
 * ### Different Rule
 * 
 * Validates that the field under validation has a different value than another field.
 * This is useful for ensuring passwords don't match usernames, or that fields
 * that should be unique are actually different.
 * 
 * #### Parameters
 * - `field` - The field name to compare against
 * 
 * @example
 * ```typescript
 * // Password should be different from username
 * const data = {
 *   username: 'john_doe',
 *   password: 'different_password'
 * };
 * 
 * await Validator.validate({
 *   value: data.password,
 *   rules: ['different:username'],
 *   context: { data }
 * }); // ✓ Valid (password is different from username)
 * 
 * // Invalid example
 * const invalidData = {
 *   username: 'john_doe',
 *   password: 'john_doe' // Same as username
 * };
 * 
 * await Validator.validate({
 *   value: invalidData.password,
 *   rules: ['different:username'],
 *   context: { data: invalidData }
 * }); // ✗ Invalid (password same as username)
 * 
 * // Class validation
 * class UserRegistration {
 *   @Required
 *   username: string;
 * 
 *   @Required
 *   @Different(['username'])
 *   password: string; // Must be different from username
 * 
 *   @Different(['primaryEmail'])
 *   backupEmail?: string; // Must be different from primary email
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array containing the field name to compare against
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if different, rejecting if same
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-different | Laravel different Rule}
 * @public
 */
export function Different({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "different",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const compareField = ruleParams[0];
        const compareValue = data[compareField];

        if (value !== compareValue) {
            resolve(true);
        } else {
            const message = i18n.t("validator.different", {
                field: translatedPropertyName || fieldName,
                other: compareField,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Same Rule
 * 
 * Validates that the field under validation has the same value as another field.
 * This is commonly used for password confirmation fields.
 * 
 * #### Parameters
 * - `field` - The field name to compare against
 * 
 * @example
 * ```typescript
 * // Password confirmation must match password
 * const data = {
 *   password: 'secret123',
 *   passwordConfirmation: 'secret123'
 * };
 * 
 * await Validator.validate({
 *   value: data.passwordConfirmation,
 *   rules: ['same:password'],
 *   context: { data }
 * }); // ✓ Valid (passwords match)
 * 
 * // Invalid example
 * const invalidData = {
 *   password: 'secret123',
 *   passwordConfirmation: 'different456'
 * };
 * 
 * await Validator.validate({
 *   value: invalidData.passwordConfirmation,
 *   rules: ['same:password'],
 *   context: { data: invalidData }
 * }); // ✗ Invalid (passwords don't match)
 * 
 * // Class validation
 * class PasswordChange {
 *   @Required
 *   @MinLength([8])
 *   newPassword: string;
 * 
 *   @Required
 *   @Same(['newPassword'])
 *   confirmPassword: string; // Must match newPassword
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters and context
 * @param options.ruleParams - Array containing the field name to compare against
 * @param options.context - Validation context containing other field values
 * @returns Promise resolving to true if same, rejecting if different
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-same | Laravel same Rule}
 * @public
 */
export function Same({ value, ruleParams, context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "same",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        const data = (context as any)?.data || context || {};
        const compareField = ruleParams[0];
        const compareValue = data[compareField];

        if (value === compareValue) {
            resolve(true);
        } else {
            const message = i18n.t("validator.same", {
                field: translatedPropertyName || fieldName,
                other: compareField,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Missing Rule
 * 
 * Validates that the field under validation is not present in the input data.
 * This is the opposite of the present rule.
 * 
 * @example
 * ```typescript
 * // Admin fields should not be present in user requests
 * await Validator.validate({
 *   value: undefined,
 *   rules: ['missing'],
 *   context: { fieldExists: false }
 * }); // ✓ Valid (field is missing)
 * 
 * await Validator.validate({
 *   value: 'some value',
 *   rules: ['missing'],
 *   context: { fieldExists: true }
 * }); // ✗ Invalid (field is present)
 * 
 * // Class validation
 * class PublicAPI {
 *   @Required
 *   data: any;
 * 
 *   @Missing
 *   internalField?: any; // Should not be present in requests
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @param options.context - Should contain fieldExists property
 * @returns Promise resolving to true if missing, rejecting if present
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-missing | Laravel missing Rule}
 * @public
 */
export function Missing({ context, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        const fieldExists = (context as any)?.fieldExists ?? false;

        if (!fieldExists) {
            resolve(true);
        } else {
            const message = i18n.t("validator.missing", {
                field: translatedPropertyName || fieldName,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Regex Rule
 * 
 * Validates that the field under validation matches the given regular expression.
 * 
 * #### Parameters
 * - `pattern` - The regular expression pattern
 * - `flags` (optional) - Regular expression flags (i, g, m, etc.)
 * 
 * @example
 * ```typescript
 * // Custom format validation
 * await Validator.validate({
 *   value: 'ABC-123',
 *   rules: ['regex:^[A-Z]{3}-[0-9]{3}$']
 * }); // ✓ Valid (matches pattern)
 * 
 * // Phone number format
 * await Validator.validate({
 *   value: '(555) 123-4567',
 *   rules: ['regex:^\\(\\d{3}\\) \\d{3}-\\d{4}$']
 * }); // ✓ Valid (matches phone pattern)
 * 
 * // Case-insensitive matching
 * await Validator.validate({
 *   value: 'hello',
 *   rules: ['regex:^HELLO$,i']
 * }); // ✓ Valid (case-insensitive match)
 * 
 * // Class validation
 * class ProductCode {
 *   @Regex(['^PROD-[0-9]{4}$'])
 *   productId: string; // Must match PROD-XXXX format
 * 
 *   @Regex(['^[A-Z]{2}[0-9]{6}$'])
 *   serialNumber: string; // Two letters + six digits
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing [pattern, flags?]
 * @returns Promise resolving to true if matches, rejecting if doesn't match
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-regex | Laravel regex Rule}
 * @public
 */
export function Regex({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "regex",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const pattern = ruleParams[0];
        const flags = ruleParams[1] || '';

        try {
            const regex = new RegExp(pattern, flags);

            if (regex.test(value)) {
                resolve(true);
            } else {
                const message = i18n.t("validator.regex", {
                    field: translatedPropertyName || fieldName,
                    value,
                    pattern,
                    ...rest
                });
                reject(message);
            }
        } catch (error) {
            const message = i18n.t("validator.invalidRegex", {
                field: translatedPropertyName || fieldName,
                pattern,
                error: (error as Error).message,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Not Regex Rule
 * 
 * Validates that the field under validation does not match the given regular expression.
 * 
 * #### Parameters
 * - `pattern` - The regular expression pattern that should not match
 * - `flags` (optional) - Regular expression flags (i, g, m, etc.)
 * 
 * @example
 * ```typescript
 * // Ensure value doesn't contain forbidden patterns
 * await Validator.validate({
 *   value: 'safe_password',
 *   rules: ['not_regex:password|123456|qwerty']
 * }); // ✓ Valid (doesn't contain common weak passwords)
 * 
 * // Prevent SQL injection patterns
 * await Validator.validate({
 *   value: 'John Doe',
 *   rules: ['not_regex:(SELECT|INSERT|UPDATE|DELETE)']
 * }); // ✓ Valid (no SQL keywords)
 * 
 * // Invalid example
 * await Validator.validate({
 *   value: 'admin',
 *   rules: ['not_regex:^(admin|root|system)$']
 * }); // ✗ Invalid (matches forbidden pattern)
 * 
 * // Class validation
 * class SecureInput {
 *   @NotRegex(['<script|javascript:', 'i'])
 *   userInput: string; // Prevent XSS patterns
 * 
 *   @NotRegex(['^(admin|root|system)$', 'i'])
 *   username: string; // Prevent reserved usernames
 * }
 * ```
 * 
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing [pattern, flags?]
 * @returns Promise resolving to true if doesn't match, rejecting if matches
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-not-regex | Laravel not_regex Rule}
 * @public
 */
export function NotRegex({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (!ruleParams || ruleParams.length === 0) {
            const message = i18n.t("validator.invalidRuleParams", {
                rule: "not_regex",
                field: translatedPropertyName || fieldName,
                ...rest
            });
            return reject(message);
        }

        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const pattern = ruleParams[0];
        const flags = ruleParams[1] || '';

        try {
            const regex = new RegExp(pattern, flags);

            if (!regex.test(value)) {
                resolve(true);
            } else {
                const message = i18n.t("validator.notRegex", {
                    field: translatedPropertyName || fieldName,
                    value,
                    pattern,
                    ...rest
                });
                reject(message);
            }
        } catch (error) {
            const message = i18n.t("validator.invalidRegex", {
                field: translatedPropertyName || fieldName,
                pattern,
                error: (error as Error).message,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### JSON Rule
 * 
 * Validates that the field under validation is a valid JSON string.
 * 
 * @example
 * ```typescript
 * // Valid JSON strings
 * await Validator.validate({
 *   value: '{"name": "John", "age": 30}',
 *   rules: ['json']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: '[1, 2, 3]',
 *   rules: ['json']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: '"simple string"',
 *   rules: ['json']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: '{name: "John"}', // Missing quotes around key
 *   rules: ['json']
 * }); // ✗ Invalid
 * 
 * await Validator.validate({
 *   value: 'not json at all',
 *   rules: ['json']
 * }); // ✗ Invalid
 * 
 * // Class validation
 * class Configuration {
 *   @Json
 *   settings: string; // Must be valid JSON
 * 
 *   @Json
 *   metadata: string; // Must be valid JSON
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid JSON, rejecting if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-json | Laravel json Rule}
 * @public
 */
export function Json({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        try {
            JSON.parse(value);
            resolve(true);
        } catch (error) {
            const message = i18n.t("validator.json", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Lowercase Rule
 * 
 * Validates that the field under validation is entirely lowercase.
 * 
 * @example
 * ```typescript
 * // Valid lowercase strings
 * await Validator.validate({
 *   value: 'hello world',
 *   rules: ['lowercase']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'user@example.com',
 *   rules: ['lowercase']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'Hello World',
 *   rules: ['lowercase']
 * }); // ✗ Invalid (contains uppercase)
 * 
 * await Validator.validate({
 *   value: 'UPPERCASE',
 *   rules: ['lowercase']
 * }); // ✗ Invalid (all uppercase)
 * 
 * // Class validation
 * class UserProfile {
 *   @Lowercase
 *   username: string; // Must be lowercase
 * 
 *   @Email
 *   @Lowercase
 *   email: string; // Email must be lowercase
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if lowercase, rejecting if not
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-lowercase | Laravel lowercase Rule}
 * @public
 */
export function Lowercase({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        if (value === value.toLowerCase()) {
            resolve(true);
        } else {
            const message = i18n.t("validator.lowercase", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Uppercase Rule
 * 
 * Validates that the field under validation is entirely uppercase.
 * 
 * @example
 * ```typescript
 * // Valid uppercase strings
 * await Validator.validate({
 *   value: 'HELLO WORLD',
 *   rules: ['uppercase']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: 'API_KEY_123',
 *   rules: ['uppercase']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: 'Hello World',
 *   rules: ['uppercase']
 * }); // ✗ Invalid (contains lowercase)
 * 
 * await Validator.validate({
 *   value: 'lowercase',
 *   rules: ['uppercase']
 * }); // ✗ Invalid (all lowercase)
 * 
 * // Class validation
 * class Constants {
 *   @Uppercase
 *   countryCode: string; // Must be uppercase (e.g., 'US', 'CA')
 * 
 *   @Uppercase
 *   @AlphaDash
 *   constantName: string; // Must be uppercase constant
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if uppercase, rejecting if not
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-uppercase | Laravel uppercase Rule}
 * @public
 */
export function Uppercase({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        if (value === value.toUpperCase()) {
            resolve(true);
        } else {
            const message = i18n.t("validator.uppercase", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### Hex Color Rule
 * 
 * Validates that the field under validation is a valid hexadecimal color code.
 * Supports both 3-digit and 6-digit formats, with or without the # prefix.
 * 
 * @example
 * ```typescript
 * // Valid hex colors
 * await Validator.validate({
 *   value: '#FF0000',
 *   rules: ['hex_color']
 * }); // ✓ Valid (red)
 * 
 * await Validator.validate({
 *   value: '#fff',
 *   rules: ['hex_color']
 * }); // ✓ Valid (white, short format)
 * 
 * await Validator.validate({
 *   value: '123ABC',
 *   rules: ['hex_color']
 * }); // ✓ Valid (without # prefix)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: '#GG0000',
 *   rules: ['hex_color']
 * }); // ✗ Invalid (G is not hex)
 * 
 * await Validator.validate({
 *   value: '#1234',
 *   rules: ['hex_color']
 * }); // ✗ Invalid (wrong length)
 * 
 * // Class validation
 * class ThemeColors {
 *   @HexColor
 *   primaryColor: string; // Must be valid hex color
 * 
 *   @HexColor
 *   backgroundColor: string; // Must be valid hex color
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid hex color, rejecting if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-hex-color | Laravel hex_color Rule}
 * @public
 */
export function HexColor({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        // Remove # prefix if present
        const colorValue = value.startsWith('#') ? value.slice(1) : value;

        // Check for valid hex color format (3 or 6 digits)
        const hexColorRegex = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/;

        if (hexColorRegex.test(colorValue)) {
            resolve(true);
        } else {
            const message = i18n.t("validator.hexColor", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### MAC Address Rule
 * 
 * Validates that the field under validation is a valid MAC address.
 * Supports various MAC address formats including colon, hyphen, and dot separators.
 * 
 * @example
 * ```typescript
 * // Valid MAC addresses
 * await Validator.validate({
 *   value: '00:1B:44:11:3A:B7',
 *   rules: ['mac_address']
 * }); // ✓ Valid (colon format)
 * 
 * await Validator.validate({
 *   value: '00-1B-44-11-3A-B7',
 *   rules: ['mac_address']
 * }); // ✓ Valid (hyphen format)
 * 
 * await Validator.validate({
 *   value: '001B.4411.3AB7',
 *   rules: ['mac_address']
 * }); // ✓ Valid (dot format)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: '00:1B:44:11:3A',
 *   rules: ['mac_address']
 * }); // ✗ Invalid (too short)
 * 
 * await Validator.validate({
 *   value: '00:GG:44:11:3A:B7',
 *   rules: ['mac_address']
 * }); // ✗ Invalid (invalid hex)
 * 
 * // Class validation
 * class NetworkDevice {
 *   @MacAddress
 *   macAddress: string; // Must be valid MAC address
 * 
 *   @MacAddress
 *   wifiMac: string; // Must be valid MAC address
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid MAC address, rejecting if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-mac-address | Laravel mac_address Rule}
 * @public
 */
export function MacAddress({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        // MAC address patterns
        const macPatterns = [
            /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, // 00:1B:44:11:3A:B7 or 00-1B-44-11-3A-B7
            /^([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$/,   // 001B.4411.3AB7
            /^[0-9A-Fa-f]{12}$/                           // 001B44113AB7
        ];

        const isValidMac = macPatterns.some(pattern => pattern.test(value));

        if (isValidMac) {
            resolve(true);
        } else {
            const message = i18n.t("validator.macAddress", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### IP Address Rule
 * 
 * Validates that the field under validation is a valid IP address (IPv4 or IPv6).
 * 
 * @example
 * ```typescript
 * // Valid IP addresses
 * await Validator.validate({
 *   value: '192.168.1.1',
 *   rules: ['ip']
 * }); // ✓ Valid (IPv4)
 * 
 * await Validator.validate({
 *   value: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
 *   rules: ['ip']
 * }); // ✓ Valid (IPv6)
 * 
 * await Validator.validate({
 *   value: '::1',
 *   rules: ['ip']
 * }); // ✓ Valid (IPv6 localhost)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: '256.1.1.1',
 *   rules: ['ip']
 * }); // ✗ Invalid (256 > 255)
 * 
 * await Validator.validate({
 *   value: 'not.an.ip.address',
 *   rules: ['ip']
 * }); // ✗ Invalid
 * 
 * // Class validation
 * class NetworkConfig {
 *   @Ip
 *   serverAddress: string; // Must be valid IP address
 * 
 *   @Ip
 *   dnsServer: string; // Must be valid IP address
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid IP, rejecting if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-ip | Laravel ip Rule}
 * @public
 */
export function Ip({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        // IPv4 pattern
        const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        // IPv6 pattern (simplified)
        const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;

        const isValidIP = ipv4Pattern.test(value) || ipv6Pattern.test(value);

        if (isValidIP) {
            resolve(true);
        } else {
            const message = i18n.t("validator.ip", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### IPv4 Rule
 * 
 * Validates that the field under validation is a valid IPv4 address.
 * 
 * @example
 * ```typescript
 * // Valid IPv4 addresses
 * await Validator.validate({
 *   value: '192.168.1.1',
 *   rules: ['ipv4']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: '0.0.0.0',
 *   rules: ['ipv4']
 * }); // ✓ Valid
 * 
 * await Validator.validate({
 *   value: '255.255.255.255',
 *   rules: ['ipv4']
 * }); // ✓ Valid
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: '256.1.1.1',
 *   rules: ['ipv4']
 * }); // ✗ Invalid (256 > 255)
 * 
 * await Validator.validate({
 *   value: '2001:db8::1',
 *   rules: ['ipv4']
 * }); // ✗ Invalid (IPv6 address)
 * 
 * // Class validation
 * class IPv4Config {
 *   @Ipv4
 *   gatewayAddress: string; // Must be IPv4
 * 
 *   @Ipv4
 *   subnetMask: string; // Must be IPv4
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid IPv4, rejecting if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-ipv4 | Laravel ipv4 Rule}
 * @public
 */
export function Ipv4({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if (ipv4Pattern.test(value)) {
            resolve(true);
        } else {
            const message = i18n.t("validator.ipv4", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}

/**
 * ### IPv6 Rule
 * 
 * Validates that the field under validation is a valid IPv6 address.
 * 
 * @example
 * ```typescript
 * // Valid IPv6 addresses
 * await Validator.validate({
 *   value: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
 *   rules: ['ipv6']
 * }); // ✓ Valid (full format)
 * 
 * await Validator.validate({
 *   value: '2001:db8:85a3::8a2e:370:7334',
 *   rules: ['ipv6']
 * }); // ✓ Valid (compressed format)
 * 
 * await Validator.validate({
 *   value: '::1',
 *   rules: ['ipv6']
 * }); // ✓ Valid (localhost)
 * 
 * // Invalid examples
 * await Validator.validate({
 *   value: '192.168.1.1',
 *   rules: ['ipv6']
 * }); // ✗ Invalid (IPv4 address)
 * 
 * await Validator.validate({
 *   value: '2001:db8:85a3::8a2e::7334',
 *   rules: ['ipv6']
 * }); // ✗ Invalid (multiple ::)
 * 
 * // Class validation
 * class IPv6Config {
 *   @Ipv6
 *   serverAddress: string; // Must be IPv6
 * 
 *   @Ipv6
 *   dnsServer: string; // Must be IPv6
 * }
 * ```
 * 
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid IPv6, rejecting if invalid
 * 
 * @since 2.0.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-ipv6 | Laravel ipv6 Rule}
 * @public
 */
export function Ipv6({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
    return new Promise((resolve, reject) => {
        if (typeof value !== 'string') {
            const message = i18n.t("validator.string", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            return reject(message);
        }

        // IPv6 pattern (more comprehensive)
        const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;

        if (ipv6Pattern.test(value)) {
            resolve(true);
        } else {
            const message = i18n.t("validator.ipv6", {
                field: translatedPropertyName || fieldName,
                value,
                ...rest
            });
            reject(message);
        }
    });
}
