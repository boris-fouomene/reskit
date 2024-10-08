/**
 * Checks if the provided value is a non-empty string.
 *
 * A value is considered a non-empty string if it is not null and is a string.
 *
 * @param {any} val The value to check.
 * @returns {boolean} True if the value is a non-empty string, false otherwise.
 * @example
 * ```typescript
 * console.log(isNotEmptyString('hello')); // Output: true
 * console.log(isNotEmptyString('')); // Output: false
 * console.log(isNotEmptyString(null)); // Output: false
 * console.log(isNotEmptyString(undefined)); // Output: false
 * console.log(isNotEmptyString(123)); // Output: false
 * ```
 */
export default function isNotEmptyString(val: any): boolean {
  /**
   * Check if the value is not null and is a string.
   */
  return val && typeof val === 'string';
}
