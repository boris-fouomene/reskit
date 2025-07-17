/**
 * ## Laravel-Style Validation Rules
 * 
 * This module provides a comprehensive collection of Laravel 12-compatible validation rules
 * that seamlessly integrate with the existing Resk validator system. These rules maintain
 * Laravel's syntax and behavior while leveraging the powerful features of the Resk framework.
 * 
 * ### Key Features
 * - **Laravel Compatibility**: All rules follow Laravel 12 syntax and behavior patterns
 * - **Type Safety**: Full TypeScript support with proper generic types
 * - **Internationalization**: Built-in i18n support for error messages
 * - **Async Support**: Handles both synchronous and asynchronous validation
 * - **Decorators**: Ready-to-use property decorators for class validation
 * 
 * ### Available Rule Categories
 * 
 * #### Boolean Rules
 * - `accepted` - Field must be "yes", "on", 1, "1", true, or "true"
 * - `accepted_if` - Conditionally accepted based on another field
 * - `boolean` - Field must be castable to boolean
 * - `declined` - Field must be "no", "off", 0, "0", false, or "false"
 * - `declined_if` - Conditionally declined based on another field
 * 
 * #### String Rules
 * - `alpha` - Only alphabetic characters
 * - `alpha_dash` - Alpha-numeric with dashes and underscores
 * - `alpha_num` - Only alpha-numeric characters
 * - `ascii` - Only 7-bit ASCII characters
 * - `confirmed` - Must have matching confirmation field
 * - `email` - Valid email address with multiple validation styles
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
 * #### Numeric Rules
 * - `between` - Value between min and max
 * - `decimal` - Specific number of decimal places
 * - `digits` - Exact number of digits
 * - `digits_between` - Digits count within range
 * - `integer` - Must be an integer
 * - `max` - Maximum value
 * - `min` - Minimum value
 * - `multiple_of` - Must be multiple of specified value
 * - `numeric` - Must be numeric
 * - `gt` - Greater than field or value
 * - `gte` - Greater than or equal to
 * - `lt` - Less than field or value
 * - `lte` - Less than or equal to
 * 
 * #### Array Rules
 * - `array` - Must be an array with optional key constraints
 * - `distinct` - Array values must be unique
 * - `in` - Value must be in allowed list
 * - `in_array` - Value must exist in another field's array
 * - `list` - Array must be a list (consecutive numeric keys)
 * - `not_in` - Value must not be in specified list
 * - `size` - Exact size for strings, arrays, or files
 * 
 * #### Date Rules
 * - `after` - Date after specified date or field
 * - `after_or_equal` - Date after or equal to specified date
 * - `before` - Date before specified date or field
 * - `before_or_equal` - Date before or equal to specified date
 * - `date` - Valid date format
 * - `date_equals` - Date equals specified date
 * - `date_format` - Matches specific date format
 * - `timezone` - Valid timezone identifier
 * 
 * #### File Rules
 * - `file` - Must be uploaded file
 * - `image` - Must be image file
 * - `mimes` - File must have specified MIME type
 * - `mimetypes` - File must match specified MIME types
 * - `dimensions` - Image dimensions validation
 * - `extensions` - File must have specified extension
 * 
 * #### Database Rules
 * - `exists` - Value must exist in database
 * - `unique` - Value must be unique in database
 * 
 * #### Conditional Rules
 * - `bail` - Stop validation on first failure
 * - `exclude` - Exclude from validated data
 * - `exclude_if` - Conditionally exclude
 * - `exclude_unless` - Exclude unless condition met
 * - `filled` - Must not be empty when present
 * - `missing` - Must not be present
 * - `nullable` - May be null
 * - `present` - Must be present in data
 * - `prohibited` - Must be missing or empty
 * - `required` - Must be present and not empty
 * - `required_if` - Required based on another field
 * - `required_unless` - Required unless condition met
 * - `required_with` - Required with other fields
 * - `required_without` - Required without other fields
 * - `sometimes` - Only validate if present
 * 
 * #### Utility Rules
 * - `different` - Must be different from another field
 * - `same` - Must be the same as another field
 * - `regex` - Must match regular expression
 * - `not_regex` - Must not match regular expression
 * - `json` - Must be valid JSON string
 * - `lowercase` - Must be entirely lowercase
 * - `uppercase` - Must be entirely uppercase
 * - `hex_color` - Must be valid hexadecimal color
 * - `mac_address` - Must be valid MAC address
 * - `ip` - Must be valid IP address (IPv4 or IPv6)
 * - `ipv4` - Must be valid IPv4 address
 * - `ipv6` - Must be valid IPv6 address
 * 
 * ### Usage Examples
 * 
 * #### Basic Validation
 * ```typescript
 * import { LaravelValidator } from '@resk/core/validator/rules/laravel';
 * 
 * // Register Laravel rules
 * LaravelValidator.registerAll();
 * 
 * // Use with validator
 * const result = await Validator.validate({
 *   value: 'user@example.com',
 *   rules: ['required', 'email:rfc,dns']
 * });
 * ```
 * 
 * #### Decorator Usage
 * ```typescript
 * import { 
 *   Required, Email, MinLength, MaxLength, 
 *   Alpha, Between, After 
 * } from '@resk/core/validator/rules/laravel';
 * 
 * class UserRegistration {
 *   @Required
 *   @Email(['rfc', 'dns'])
 *   email: string;
 * 
 *   @Required
 *   @MinLength([8])
 *   @MaxLength([255])
 *   password: string;
 * 
 *   @Required
 *   @Alpha
 *   @Between([2, 50])
 *   name: string;
 * 
 *   @Required
 *   @After(['18 years ago'])
 *   birthDate: Date;
 * }
 * ```
 * 
 * #### Advanced Validation
 * ```typescript
 * // Complex conditional validation
 * const rules = [
 *   'required_if:type,premium',
 *   'numeric',
 *   'between:100,10000'
 * ];
 * 
 * // Array validation
 * const arrayRules = {
 *   'users': 'required|array',
 *   'users.*': 'required|string',
 *   'users.*.email': 'required|email|unique:users',
 *   'users.*.age': 'required|integer|between:18,65'
 * };
 * ```
 * 
 * @author Resk Framework Team
 * @since 2.0.0
 * @version 1.0.0
 * @see {@link https://laravel.com/docs/11.x/validation | Laravel Validation Documentation}
 * @public
 */

// Re-export all Laravel rules for convenient access
export * from './boolean';
export * from './string';
export * from './numeric';
export * from './array';
export * from './conditional';
// export * from './date';
// export * from './file';
// export * from './database';
export * from './utility';

// Translation support
export * from './translations';

// Main Laravel validator integration
// export * from './validator';

// Decorator collections
// export * from './decorators';
