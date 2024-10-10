/**
 * Checks if the provided value is a class.
 *
 * A value is considered a class if it is a function, has a prototype, and its prototype's constructor is the same as the value itself.
 *
 * @param {any} variable The value to check.
 * @returns {boolean} True if the value is a class, false otherwise.
 * @example
 * ```typescript
 * class MyClass {}
 * console.log(isClass(MyClass)); // Output: true
 * console.log(isClass({})); // Output: false
 * console.log(isClass(function() {})); // Output: false
 * ```
 */
export default function isClass(variable: any): boolean {
  /**
   * Check if the value is a function.
   */
  if (typeof variable !== 'function') {
    return false;
  }

  /**
   * Check if the value has a prototype.
   */
  if (!variable.prototype) {
    return false;
  }

  /**
   * Check if the prototype's constructor is the same as the value itself.
   */
  return variable.prototype.constructor === variable;
}
