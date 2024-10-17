/**
 * Checks if the provided value is a non-empty string.
 *
 * A value is considered a non-empty string if it is not null and is a string.
 *
 * @param {any} val The value to check.
 * @returns {boolean} True if the value is a non-empty string, false otherwise.
 * @example
 * ```typescript
 * console.log(isNonNullString('hello')); // Output: true
 * console.log(isNonNullString('')); // Output: false
 * console.log(isNonNullString(null)); // Output: false
 * console.log(isNonNullString(undefined)); // Output: false
 * console.log(isNonNullString(123)); // Output: false
 * ```
 */
export default function isNonNullString(val: any): boolean {
  /**
   * Check if the value is not null and is a string.
   */
  return val && typeof val === 'string';
}
