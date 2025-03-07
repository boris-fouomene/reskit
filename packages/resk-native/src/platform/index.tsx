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
 * Determines if the application is running on web.
 *
 * This function checks the `Platform.OS` property to see if it is equal to 
 * the string `'web'`. It is useful for writing platform-specific code 
 * or applying styles specific to iOS devices.
 *
 * @returns {boolean} - Returns `true` if the application is running on web, otherwise `false`.
 *
 * @example
 * // Example usage:
 * if (isWeb()) {
 *   console.log("This app is running on iOS.");
 * }
 */
const isWeb = (): boolean => Platform.OS === 'web' || ReskPlatform.isWeb();

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
 * if (isNative()) {
 *   console.log("This app is running on a mobile native platform.");
 * }
 */
const isNative = (): boolean => isAndroid() || isIos();


/**
 * Identity function on web. Returns nothing on other platforms.
 *
 * Note: Platform splitting does not tree-shake away the other platforms,
 * so don't do stuff like e.g. rely on platform-specific imports. Use
 * platform-split files instead.
 */
export function web(value: any) {
    if (isWeb()) {
        return value
    }
}

/**
 * Identity function on iOS. Returns nothing on other platforms.
 *
 * Note: Platform splitting does not tree-shake away the other platforms,
 * so don't do stuff like e.g. rely on platform-specific imports. Use
 * platform-split files instead.
 */
function ios(value: any) {
    if (isIos()) {
        return value
    }
}

/**
 * Identity function on Android. Returns nothing on other platforms..
 *
 * Note: Platform splitting does not tree-shake away the other platforms,
 * so don't do stuff like e.g. rely on platform-specific imports. Use
 * platform-split files instead.
 */
function android(value: any) {
    if (isAndroid()) {
        return value
    }
}

/**
 * Identity function on iOS and Android. Returns nothing on web.
 *
 * Note: Platform splitting does not tree-shake away the other platforms,
 * so don't do stuff like e.g. rely on platform-specific imports. Use
 * platform-split files instead.
 */
function native(value: any) {
    if (isNative()) {
        return value
    }
}

/***
 * This function is used to determine if the native driver can be used for animations.
 * It checks if the current environment is a mobile native application (Android or iOS).
 * If it is, it returns true, otherwise it returns false.
 * @returns {boolean} - Returns `true` if the native driver can be used for animations, otherwise `false`.
 */
const canUseNativeDriver: () => boolean = isNative;

/**
  @group Platform
 * Checks if the current device is a touch device.
 *
 * This function assesses the presence of touch event support in the browser to determine if the device is a touch device.
 * It does this by attempting to create a `TouchEvent` and checking for specific properties in the `window` object.
 *
 * @returns {boolean} True if the device is a touch device, false otherwise.
 *
 * @example
 * ```typescript
 * if (isTouchDevice()) {
 *   console.log("This device supports touch!");
 * } else {
 *   console.log("This device does not support touch.");
 * }
 * ```
 */
const isTouchDevice: () => boolean = (): boolean => {
    if (isNative()) {
        return true;
    }
    return ReskPlatform.isTouchDevice();
}


export default { ...ReskPlatform, ...Platform, isTouchDevice, canUseNativeDriver, select: Platform.select, isDev, isIos, isAndroid, isWeb, isNative, web, ios, android, native };
