import { Platform as ReskPlatform } from "@resk/core";
import { Platform } from 'react-native';
/**
 * Determines if the current environment is a development environment.
 * 
 * This function checks the global variable `__DEV__`, which is typically 
 * set to true during development builds in frameworks like React Native. 
 * If the variable is defined and true, the function returns true; otherwise, it returns false.
 * 
 * @returns {boolean} - Returns `true` if the environment is development, otherwise `false`.
 * 
 * @example
 * // Example usage:
 * if (isDev()) {
 *   console.log("Running in development mode.");
 * } else {
 *   console.log("Running in production mode.");
 * }
 */
function isDev(): boolean {
    return typeof __DEV__ !== 'undefined' ? !!__DEV__ : false;
}


/**
 * Determines if the application is running on iOS.
 *
 * This function checks the `Platform.OS` property to see if it is equal to 
 * the string `'ios'`. It is useful for writing platform-specific code 
 * or applying styles specific to iOS devices.
 *
 * @returns {boolean} - Returns `true` if the application is running on iOS, otherwise `false`.
 *
 * @example
 * // Example usage:
 * if (isIos()) {
 *   console.log("This app is running on iOS.");
 * }
 */
const isIos = (): boolean => Platform.OS === 'ios';

/**
 * Determines if the application is running on Android.
 *
 * This function checks the `Platform.OS` property to see if it is equal to 
 * the string `'android'`. It is useful for writing platform-specific code 
 * or applying styles specific to Android devices.
 *
 * @returns {boolean} - Returns `true` if the application is running on Android, otherwise `false`.
 *
 * @example
 * // Example usage:
 * if (isAndroid()) {
 *   console.log("This app is running on Android.");
 * }
 */
const isAndroid = (): boolean => Platform.OS === 'android';

/**
 * Determines if the application is a mobile native application (Android or iOS).
 *
 * This function uses the `isAndroid` and `isIos` functions to check if the application
 * is running on either Android or iOS. It can be used to conditionally render components 
 * or apply logic specific to mobile devices.
 *
 * @returns {boolean} - Returns `true` if the application is running on either Android or iOS, otherwise `false`.
 *
 * @example
 * // Example usage:
 * if (isMobileNative()) {
 *   console.log("This app is running on a mobile native platform.");
 * }
 */
const isMobileNative = (): boolean => isAndroid() || isIos();



export default { ...ReskPlatform, isDev, isIos, isAndroid, isMobileNative };
