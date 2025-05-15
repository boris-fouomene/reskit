import ReskPlatform from "@resk/core/platform";
import { Dimensions, Platform, StatusBar } from 'react-native';
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
const isNative = (): boolean => ReskPlatform.isClientSide() && Platform.OS !== "web";


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
const canUseNativeDriver: () => boolean = () => {
    return ReskPlatform.isClientSide() && !isWeb();
};

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


/**
 * Checks if the device is an iPhone X.
 * 
 * This function checks the device's operating system, screen dimensions, and type to determine if it's an iPhone X.
 * 
 * @returns {boolean} True if the device is an iPhone X, false otherwise.
 * 
 * @example
 * if (Platform.isIphoneX()) {
 *   console.log('This is an iPhone X');
 * } else {
 *   console.log('This is not an iPhone X');
 * }
 */
function isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTV &&
        ((dimen.height === 780 || dimen.width === 780)
            || (dimen.height === 812 || dimen.width === 812)
            || (dimen.height === 844 || dimen.width === 844)
            || (dimen.height === 896 || dimen.width === 896)
            || (dimen.height === 926 || dimen.width === 926))
    );
}
/**
 * Returns the style or properties for iPhone X devices or regular devices.
 * 
 * This function checks if the device is an iPhone X using the `isIphoneX` function and returns the corresponding style.
 * 
 * @param {any} iphoneXStyle The style to return if the device is an iPhone X.
 * @param {any} regularStyle The style to return if the device is not an iPhone X.
 * 
 * @returns {any} The style for the current device.
 * 
 * @example
 * const style = iphoneX({ height: 100 }, { height: 50 });
 * console.log(style); // Output: { height: 100 } if iPhone X, { height: 50 } otherwise
 */
function iphoneX(iphoneXStyle: any, regularStyle: any) {
    if (isIphoneX()) {
        return iphoneXStyle;
    }
    return regularStyle;
}
/**
 * Returns the height of the status bar based on the device's operating system.
 * 
 * This function checks the device's operating system and returns the corresponding status bar height.
 * If the device is an iPhone X, it returns the height based on the `safe` parameter.
 * 
 * @param {boolean} [safe=false] Whether to return the safe area height for iPhone X devices.
 * 
 * @returns {number} The height of the status bar.
 * 
 * @example
 * const statusBarHeight = getStatusBarHeight(true);
 * console.log(statusBarHeight); // Output: 44 if iPhone X, 20 otherwise
 */
function getStatusBarHeight(safe?: boolean) {
    return Platform.select({
        ios: iphoneX(safe ? 44 : 30, 20),
        android: StatusBar.currentHeight,
        default: 0
    });
}

/**
 * Returns the bottom space height for iPhone X devices.
 * 
 * This function checks if the device is an iPhone X and returns the corresponding bottom space height.
 * 
 * @returns {number} The bottom space height for iPhone X devices, 0 otherwise.
 * 
 * @example
 * const bottomSpace = getBottomSpace();
 * console.log(bottomSpace); // Output: 34 if iPhone X, 0 otherwise
 */
function getBottomSpace() {
    return isIphoneX() ? 34 : 0;
}

export default { ...ReskPlatform, ...Platform, isIphoneX, iphoneX, getStatusBarHeight, getBottomSpace, isTouchDevice, canUseNativeDriver, select: Platform.select, isDev, isIos, isAndroid, isWeb, isNative, web, ios, android, native };
