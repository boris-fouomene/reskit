
import { IFontMaterialCommunityIconsName } from "@components/Icon";
import Platform from "@platform";
import { isObj, isValidImageSrc } from "@resk/core";

/**
 * Determines if the provided source is a valid image source.
 *
 * This function checks if the `source` parameter conforms to the expected formats
 * for image sources used in React Native. It returns `true` if the source is a valid
 * image source and `false` otherwise.
 *
 * The function checks for the following conditions:
 *
 * 1. **Object with URI**: The source is an object that contains a `uri` property, which
 *    is a string. This is commonly used for remote images.
 *    - Example: `{ uri: 'https://example.com/image.png' }`
 *
 * 2. **Module Reference**: The source is a number, which indicates that it is a reference
 *    to a local image asset (e.g., `require('./path/to/image.png')`).
 *
 * 3. **Web Platform**: If the platform is web, the source can also be a string that:
 *    - Starts with `'data:image'`, indicating a base64 encoded image.
 *    - Matches common image file extensions (e.g., `.bmp`, `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`).
 *
 * @param {any} source - The source to check, which can be of any type.
 * @returns {boolean} - Returns `true` if the source is a valid image source, `false` otherwise.
 *
 * @example
 * // Valid image sources
 * const validUriSource = { uri: 'https://example.com/image.png' };
 * const validModuleSource = require('./path/to/image.png');
 * const validDataUriSource = 'data:image/png;base64,...';
 * const validWebSource = 'https://example.com/image.jpg';
 *
 * console.log(isImageSource(validUriSource)); // true
 * console.log(isImageSource(validModuleSource)); // true
 * console.log(isImageSource(validDataUriSource)); // true
 * console.log(isImageSource(validWebSource)); // true
 *
 * // Invalid image source
 * const invalidSource = 'notAnImage';
 * console.log(isImageSource(invalidSource)); // false
 */
export const isImageSource = (source: any) =>
  // source is an object with uri
  (source && isObj(source) && source !== null && Object.prototype.hasOwnProperty.call(source, 'uri') && typeof source.uri === 'string') ||
  // source is a module, e.g. - require('image')
  typeof source === 'number' || Platform.isWeb() && isValidImageSrc(source);



/**
 * Represents the icon name used for the back navigation button in the application.
 * 
 * The icon chosen depends on the platform the application is running on. 
 * For iOS, the icon is set to "chevron-left", while for Android or web, it is set to "arrow-left".
 * This allows for a consistent and platform-appropriate user interface.
 * 
 * @constant
 * @type {IFontMaterialCommunityIconsName}
 * 
 * @example
 * // Usage in a React Native component
 * import { BACK_ICON } from '@resk/expo';
 * 
 * const BackButton = () => (
 *   <Icon name={BACK_ICON} size={24} color="#000" />
 * );
 * 
 * @remarks
 * - Ensure that the `IFontMaterialCommunityIconsName` interface is correctly defined 
 *   to include both "chevron-left" and "arrow-left" as valid values.
 * - This constant should be used wherever a back navigation button is required 
 *   to maintain consistency across the application.
 * - Consider using this constant in conjunction with other navigation-related icons 
 *   to provide a cohesive user experience.
 */
export const BACK_ICON: IFontMaterialCommunityIconsName = Platform.isIos() ? "chevron-left" : "arrow-left";


/**
 * Represents the icon name used for the "more options" button in the application.
 *
 * The icon name varies depending on the platform:
 * - On iOS, the icon is set to 'dots-horizontal', which displays three horizontal dots.
 * - On Android, the icon is set to 'dots-vertical', which displays three vertical dots.
 * 
 * This distinction allows for a better alignment with platform-specific design guidelines 
 * and user expectations, ensuring a more intuitive user experience.
 * 
 * @constant
 * @type {string}
 * 
 * @example
 * // Usage in a React Native component
 * import { MORE_ICON } from '@resk/expo';
 * 
 * const MoreOptionsButton = () => (
 *   <Icon name={MORE_ICON} size={24} color="#000" />
 * );
 * 
 * @remarks
 * - Ensure that the icon library you are using supports both 'dots-horizontal' 
 *   and 'dots-vertical' icons for consistent rendering across platforms.
 * - This constant can be used in various UI components where a "more options" 
 *   menu is required, such as in navigation bars or settings menus.
 * - Consider using this constant in conjunction with accessibility features, 
 *   such as tooltips or screen reader labels, to enhance usability.
 */
export const MORE_ICON = Platform.isIos() ? 'dots-horizontal' : 'dots-vertical';

/**
 * Represents the icon name used for the menu button in the application.
 *
 * The `MENU_ICON` constant is set to the string "menu", which typically represents 
 * a hamburger menu icon. This icon is commonly used in applications to signify 
 * the presence of a navigation drawer or additional options.
 * 
 * Using a consistent icon for the menu button helps users easily identify 
 * navigation controls, improving the overall user experience.
 * 
 * @constant
 * @type {string}
 * 
 * @example
 * // Usage in a React Native component
 * import { MENU_ICON } from '@resk/expo';
 * 
 * const MenuButton = () => (
 *   <Icon name={MENU_ICON} size={24} color="#000" />
 * );
 * 
 * @remarks
 * - Ensure that the icon library you are using includes the "menu" icon 
 *   for proper rendering.
 * - This constant can be used in various UI components where a menu is required, 
 *   such as in navigation bars or header components.
 * - Consider pairing this icon with a label or tooltip to enhance accessibility 
 *   for users who rely on screen readers.
 */
export const MENU_ICON = "menu";

/**
 * Represents the icon name used for the copy action in the application.
 *
 * The `COPY_ICON` constant is set to the string "content-copy", which typically 
 * represents an icon indicating the action of copying content to the clipboard. 
 * This icon is commonly used in applications to allow users to duplicate text, 
 * images, or other data easily.
 * 
 * Utilizing a standard icon for copy actions helps users quickly identify 
 * functionality, thus improving the overall user experience.
 * 
 * @constant
 * @type {string}
 * 
 * @example
 * // Usage in a React Native component
 * import { COPY_ICON } from '@resk/expo';
 * 
 * const CopyButton = () => (
 *   <Button onPress={handleCopy}>
 *     <Icon name={COPY_ICON} size={24} color="#000" />
 *     <Text>Copy</Text>
 *   </Button>
 * );
 * 
 * @remarks
 * - Ensure that the icon library you are using supports the "content-copy" 
 *   icon for proper rendering.
 * - This constant can be used in various UI components where a copy action 
 *   is required, such as in text fields, image galleries, or document editors.
 * - Consider providing visual feedback (e.g., a toast message) to inform users 
 *   that the content has been successfully copied to the clipboard.
 */
export const COPY_ICON = "content-copy";

/**
 * Represents the icon name used for the print action in the application.
 *
 * The `PRINT_ICON` constant is set to the string "printer", which typically 
 * represents an icon indicating the action of printing documents or content. 
 * This icon is commonly used in applications to allow users to initiate 
 * printing tasks easily.
 * 
 * Using a standard icon for print actions helps users quickly identify 
 * functionality related to printing, thereby improving the overall user experience.
 * 
 * @constant
 * @type {string}
 * 
 * @example
 * // Usage in a React Native component
 * import { PRINT_ICON } from './path/to/your/icon/constants';
 * 
 * const PrintButton = () => (
 *   <Button onPress={handlePrint}>
 *     <Icon name={PRINT_ICON} size={24} color="#000" />
 *     <Text>Print</Text>
 *   </Button>
 * );
 * 
 * @remarks
 * - Ensure that the icon library you are using supports the "printer" 
 *   icon for proper rendering.
 * - This constant can be used in various UI components where a print action 
 *   is required, such as in document viewers, reports, or any printable content.
 * - Consider providing user feedback (e.g., a confirmation dialog) to 
 *   inform users that the print job has been initiated or to allow them 
 *   to configure print settings.
 */
export const PRINT_ICON = "printer";
