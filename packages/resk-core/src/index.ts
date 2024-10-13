

/**
 * Exports the Session namespace.
 * This namespace provides a collection of functions and classes related to session management.
 * @namespace Session
 */
export { default as Session } from "./session";

/**
  @namespace Platform  
 * Exports the Platform namespace.
 * This namespace provides a collection of functions for detecting the current platform or environment,
 * including `isDarwin`, `isWin32`, and `isLinux`.
 */
export * as Platform from "./platform";

export * from "./fields";
export * from "./resources";