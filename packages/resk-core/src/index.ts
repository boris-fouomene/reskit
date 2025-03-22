import 'reflect-metadata';
import "./translations";
import Session from "./session";

export * from "./logger";

/**
 * Exports the Session namespace.
 * This namespace provides a collection of functions and classes related to session management.
 * @namespace Session
 */
export * from "./session";
export { Session };

/**
  @namespace Platform  
 * Exports the Platform namespace.
 * This namespace provides a collection of functions for detecting the current platform or environment,
 * including `isDarwin`, `isWin32`, and `isLinux`.
 */
export { default as Platform } from "./platform";

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
export { default as Auth } from "./auth";
export * from "./auth";
export * from "./i18n";
export { default as i18n } from "./i18n";
export * from "./validator";
export * from "./decorators";
export * from "./countries";
export * from "./inputFormatter";
export { default as InputFormatter } from "./inputFormatter";
export * from "./logger";
export { default as Logger } from "./logger";
export * from "./observable";