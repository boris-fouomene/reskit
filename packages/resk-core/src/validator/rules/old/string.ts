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
 * @since 1.22.0
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
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-alpha | Laravel alpha Rule}
 * @public
 */
export function Alpha({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.alpha", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const isAsciiOnly = ruleParams && ruleParams.includes("ascii");
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
        ...rest,
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
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-alpha-dash | Laravel alpha_dash Rule}
 * @public
 */
export function AlphaDash({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.alphaDash", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const isAsciiOnly = ruleParams && ruleParams.includes("ascii");
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
        ...rest,
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
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-alpha-num | Laravel alpha_num Rule}
 * @public
 */
export function AlphaNum({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.alphaNum", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const isAsciiOnly = ruleParams && ruleParams.includes("ascii");
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
        ...rest,
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
 * @since 1.22.0
 * @see {@link https://laravel.com/docs/11.x/validation#rule-ascii | Laravel ascii Rule}
 * @public
 */
export function Ascii({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.ascii", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
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
        ...rest,
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
 * @since 1.22.0
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
        ...rest,
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
        ...rest,
      });
      reject(message);
    }
  });
}
