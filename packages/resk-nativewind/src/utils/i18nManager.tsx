import { I18nManager } from "react-native";

/**
 * @group I18nManager
 * @constant isRTL
 * @description
 * A boolean value indicating whether the current layout direction is Right-To-Left (RTL).
 *
 * This constant is derived from the `I18nManager` provided by React Native, which is responsible for
 * managing internationalization and localization settings in mobile applications. The `isRTL` value
 * will be `true` if the current language direction is Right-To-Left (such as Arabic or Hebrew) and 
 * `false` otherwise (for languages like English or Spanish that are Left-To-Right).
 *
 * @example
 * // Usage example in a React Native component
 * import {isRTL} from '@resk/native';
 *
 * const styles = {
 *   container: {
 *     flexDirection: isRTL ? 'row-reverse' : 'row',
 *   },
 * };
 *
 * // The above styles will adjust the layout direction of the container based on the current language.
 *
 * @returns {boolean} - Returns `true` if the current layout direction is RTL, otherwise `false`.
 *
 * @see [React Native I18nManager Documentation](https://reactnative.dev/docs/i18nmanager)
 * for more information on internationalization and layout direction handling.
 */
export const isRTL = !!I18nManager?.getConstants()?.isRTL;