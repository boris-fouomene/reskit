import 'reflect-metadata';
import "./translations";

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

/**
  @namespace Currency 
 * Exports the Currency namespace.
 * This namespace provides a collection of all the functions needed for currency handling
 */
export { default as Currency } from "./currency";

export * from "./fields";
export * from "./resources";
export * from "./types";
export * from "./utils";
export * from "./currency/types"
export * from "./auth/types";
export { default as Auth } from "./auth";
export * from "./i18n";
export * from "./validator";
export * from "./decorators";