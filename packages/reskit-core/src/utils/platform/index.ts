import { IDict } from '@types';

/**
 * Checks if the current environment is a web environment.
 *
 * @returns {boolean} True if the environment is a web environment, false otherwise.
 */
export function isWeb(): boolean {
    /**
     * Check if the window object is defined and has a document property.
     * This is a characteristic of web environments.
     */
    const hasWindowDocument = typeof window !== 'undefined' && window?.document !== undefined;
  
    /**
     * Check if the document object is defined.
     * This is another characteristic of web environments.
     */
    const hasDocument = typeof document !== 'undefined';
  
    /**
     * Check if the navigator object is defined.
     * This is a web-specific object that provides information about the browser and its capabilities.
     */
    const hasNavigator = typeof navigator !== 'undefined';
  
    /**
     * Return true if all the above conditions are met, indicating a web environment.
     */
    return hasWindowDocument && hasDocument && hasNavigator;
  }

/**
 * Checks if the current environment is a Node.js environment.
 *
 * @returns {boolean} True if the environment is a Node.js environment, false otherwise.
 */
export const isNode: () => boolean = (): boolean => {
    /**
     * Try to detect Node.js environment using the process object.
     */
    try {
      /**
       * Check if the process object is defined and has a versions property with a node property.
       * This is a characteristic of Node.js environments.
       */
      if (typeof process !== 'undefined' && process?.versions && process?.versions?.node) {
        return true;
      }
  
      /**
       * Check if the global object is defined and has a specific toString() method signature.
       * This is another characteristic of Node.js environments.
       */
      if (typeof global === 'object' && '[object global]' === global?.toString.call(global)) {
        return true;
      }
    } catch {
      // Ignore any errors that might occur during the detection process.
    }
  
    /**
     * If none of the above conditions are met, return false, indicating a non-Node.js environment.
     */
    return false;
}


/**
 * Checks if the current environment is an Electron environment.
 *
 * @returns {boolean} True if the environment is an Electron environment, false otherwise.
 */
export const isElectron: () => boolean = (): boolean => {
    /**
     * Check if we're in a renderer process in Electron.
     */
    if (typeof window !== "undefined" && window) {
      /**
       * Check if the window.process object is defined and has a type property set to 'renderer'.
       * This is a characteristic of Electron renderer processes.
       */
      if (typeof window?.process === 'object' && (window?.process as IDict)?.type === 'renderer') {
        return true;
      }
    }
    /**
     * Check if we're in the main process of Electron.
     */
    if (typeof process !== 'undefined' && typeof process?.versions === 'object' && !!process.versions?.electron) {
      /**
       * Check if the process.versions object has an electron property.
       * This is a characteristic of Electron main processes.
       */
      return true;
    }
  
    /**
     * Check if the user agent string indicates we're in an Electron environment.
     */
    if (typeof navigator === 'object' && navigator && typeof navigator.userAgent === 'string') {
      /**
       * Check if the user agent string contains the word 'electron' (case-insensitive).
       * This is another characteristic of Electron environments.
       */
      if (String(navigator?.userAgent).toLowerCase().indexOf('electron') >= 0) {
        return true;
      }
    }
  
    /**
     * If none of the above conditions are met, return false, indicating a non-Electron environment.
     */
    return false;
}
  

/**
 * Checks if the current device is a touch device.
 *
 * @returns {boolean} True if the device is a touch device, false otherwise.
 */
export const isTouchDevice: () => boolean = (): boolean => {
    /**
     * Check if the document object is defined.
     */
    if (typeof document !== 'undefined' && document) {
      /**
       * Try to create a TouchEvent to see if the browser supports touch events.
       */
      try {
        /**
         * If the browser supports TouchEvent, it's likely a touch device.
         */
        document.createEvent("TouchEvent");
        return true;
      } catch (e) {
        /**
         * If creating a TouchEvent fails, check for other indicators of a touch device.
         */
        /**
         * Check if the window object has an 'ontouchstart' property.
         * This is a common indicator of a touch device.
         */
        return 'ontouchstart' in window
          /**
           * Check if the window object has an 'onmsgesturechange' property.
           * This is another indicator of a touch device, although it can have some false positives.
           */
          || 'onmsgesturechange' in window;
      }
    }
    /**
     * If none of the above conditions are met, return false, indicating a non-touch device.
     */
    return false;
}

/**
 * Checks if the current environment is a server-side environment.
 *
 * @returns {boolean} True if the environment is a server-side environment, false otherwise.
 */
export const isServerSide: () => boolean = (): boolean => {
    /**
     * Check if the window object is undefined or not an object.
     * This is a characteristic of server-side environments.
     */
    if (typeof window === 'undefined' || !window || typeof window !== 'object') {
      /**
       * Check if the process object is defined.
       * This is another characteristic of server-side environments.
       */
      if (typeof process !== 'undefined') {
        return true;
      }
    }
    /**
     * If none of the above conditions are met, return false, indicating a client-side environment.
     */
    return false;
}

/**
 * Checks if the current environment is a client-side environment.
 *
 * @returns {boolean} True if the environment is a client-side environment, false otherwise.
 */
export const isClientSide: () => boolean = (): boolean => {
    /**
     * Check if the window object is defined and is an object.
     * This is a characteristic of client-side environments.
     */
    if (typeof window !== "undefined" && typeof window === "object") {
      return true;
    }
    /**
     * If the window object is undefined, return false, indicating a non-client-side environment.
     */
    return false;
}


/**
 * Checks if the current environment is a mobile browser.
 *
 * @returns {boolean} True if the environment is a mobile browser, false otherwise.
 */
export const isMobileBrowser: () => boolean = (): boolean => {
    /**
     * Check if we're in a web environment.
     */
    if (!isWeb()) {
      return false;
    }
  
    /**
     * Check if the navigator object is defined and has a userAgent property.
     */
    if (typeof navigator !== 'object' || !navigator || typeof (navigator as { userAgent: string }).userAgent !== 'string') {
      return false;
    }
  
    /**
     * Check if the user agent string matches a mobile browser pattern.
     */
    const userAgent = (navigator as { userAgent: string }).userAgent.toLowerCase();
    if (/android|webos|iphone|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return true;
    }
  
    /**
     * If none of the above conditions are met, return false, indicating a non-mobile browser.
     */
    return false;
}

/**
 * Checks if the current environment is an Android mobile browser.
 *
 * @returns {boolean} True if the environment is an Android mobile browser, false otherwise.
 */
export const isAndroidMobileBrowser: () => boolean = (): boolean => {
    /**
     * Check if we're in a web environment.
     */
    if (!isWeb()) {
      return false;
    }
  
    /**
     * Check if the navigator object is defined and has a userAgent property.
     */
    if (typeof navigator !== 'object' || !navigator || typeof (navigator as { userAgent: string }).userAgent !== 'string') {
      return false;
    }
  
    /**
     * Check if the user agent string matches an Android pattern.
     */
    const userAgent = (navigator as { userAgent: string }).userAgent.toLowerCase();
    if (/android/i.test(userAgent)) {
      return true;
    }
  
    /**
     * If none of the above conditions are met, return false, indicating a non-Android mobile browser.
     */
    return false;
}

/**
 * Checks if the current environment is a React Native WebView.
 *
 * @returns {boolean} True if the environment is a React Native WebView, false otherwise.
 */
export const isReactNativeWebview: () => boolean = (): boolean => {
    /**
     * Check if we're in a client-side environment.
     */
    if (!isClientSide()) {
      return false;
    }
  
    /**
     * Check if the window object has a ReactNativeWebView property.
     */
    if (!(window as IDict)?.ReactNativeWebView) {
      return false;
    }
  
    /**
     * Check if the ReactNativeWebView object has a postMessage method.
     */
    if (typeof (window as IDict )?.ReactNativeWebView?.postMessage !== 'function') {
      return false;
    }
  
    /**
     * If all the above conditions are met, return true, indicating a React Native WebView environment.
     */
    return true;
}
  
/**
 * Gets the platform string from the navigator object.
 *
 * @returns {string} The platform string.
 */
const pfstring: string = typeof window !== 'undefined' && window && window.navigator && typeof window.navigator.platform === 'string' ? window.navigator.platform : "";

/**
 * Checks if the current environment is a Darwin (macOS) environment.
 *
 * @returns {boolean} True if the environment is a Darwin environment, false otherwise.
 */
export const isDarwin: () => boolean = (): boolean => {
  /**
   * Check if we're in a Node.js environment and the platform is 'darwin'.
   */
  if (isNode() && process.platform === 'darwin') {
    return true;
  }

  /**
   * Check if the platform string starts with 'Mac'.
   */
  return pfstring.substring(0, 3) === 'Mac';
}

/**
 * Checks if the current environment is a Windows (win32) environment.
 *
 * @returns {boolean} True if the environment is a Windows environment, false otherwise.
 */
export const isWin32: () => boolean = (): boolean => {
  /**
   * Check if we're in a Node.js environment and the platform is 'win32'.
   */
  if (isNode() && process.platform === 'win32') {
    return true;
  }
  /**
   * Check if the platform string starts with 'Win'.
   */
  return pfstring.substring(0, 3) === 'Win';
}