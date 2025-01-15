/**
 * The global object that provides access to the global scope in various environments.
 * This object is determined based on the following checks:
 * - If `window` is defined, it returns `window` (for browsers).
 * - If `self` is defined, it returns `self` (for web workers).
 * - If `global` is defined, it returns `global` (for Node.js).
 * - If `globalThis` is defined, it returns `globalThis` (for modern environments).
 * - If none of the above are defined, it returns an empty object.
 *
 * @returns {object} The global object or an empty object if none are found.
 *
 * @example
 * // Accessing the global object
 * const globalScope = gbl;
 * console.log(globalScope); // Logs the global object based on the environment
 *
 * @example
 * // Using the global object to access a global variable
 * if (gbl.myGlobalVar) {
 *     console.log(gbl.myGlobalVar);
 * }
 */
const gbl = (function () {
    if (typeof window !== 'undefined' && typeof window === "object") { return window; }
    if (typeof self !== 'undefined' && typeof self === "object") { return self; }
    if (typeof global !== 'undefined' && typeof global === "object") { return global; }
    if (typeof globalThis !== 'undefined' && typeof globalThis === "object") { return globalThis; }
    return {};
})();

export default gbl;