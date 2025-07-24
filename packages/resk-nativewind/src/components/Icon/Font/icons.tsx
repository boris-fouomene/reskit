import { Platform } from "@platform/index";

const isRTL = Platform.isRTL();
const isIos = Platform.OS === 'ios';

export const FONT_ICONS = {

    /**
     * Represents the icon name used for the menu button in the application.
     *
     * The `MENU` constant is set to the string "menu", which typically represents 
     * a hamburger menu icon. This icon is commonly used in applications to signify 
     * the presence of a navigation drawer or additional options.
     * 
     * Using a consistent icon for the menu button helps users easily identify 
     * navigation controls, improving the overall user experience.
     * 
     * @constant
     * @type {'menu'}
     * 
     * @example
     * // Usage in a React Native component
     * import { FontIcon } from '@resk/native';
     * 
     * const MenuButton = () => (
     *   <Icon name={MENU} size={24} />
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
    MENU: "menu",


    /**
     * Represents the icon name used for the back navigation button in the application.
     * 
     * The icon chosen depends on the platform the application is running on. 
     * For iOS, the icon is set to "chevron-left", while for Android or web, it is set to "arrow-left".
     * This allows for a consistent and platform-appropriate user interface.
     * 
     * @constant
     * @type {"chevron-left" | "arrow-left"}
     * 
     * @example
     * // Usage in a React Native component
     * import { BACK_ICON } from '@resk/native';
     * 
     * const BackButton = () => (
     *   <Icon name={BACK_ICON} size={24}/>
     * );
     * 
     * @remarks
     * - Ensure that the `IFontIconMaterialCommunityName` interface is correctly defined 
     *   to include both "chevron-left" and "arrow-left" as valid values.
     * - This constant should be used wherever a back navigation button is required 
     *   to maintain consistency across the application.
     * - Consider using this constant in conjunction with other navigation-related icons 
     *   to provide a cohesive user experience.
     */
    BACK: isIos ? (isRTL ? "chevron-right" : "chevron-left") : (isRTL ? "arrow-right" : "arrow-left"),



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
     * @type {'content-copy'}
     * 
     * @example
     * // Usage in a React Native component
     * import { FontIcon } from '@resk/native';
     * 
     * const CopyButton = () => (
     *   <Button onPress={handleCopy}>
     *     <Icon name={COPY} size={24}/>
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
    COPY: "content-copy",


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
     * @type {"dots-vertical" | "dots-horizontal"}
     * 
     * @example
     * // Usage in a React Native component
     * import {FontIcon} from '@resk/native';
     * 
     * const MoreOptionsButton = () => (
     *   <Icon name={MORE} size={24}/>
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
    MORE: isIos ? "dots-horizontal" : "dots-vertical",


    /**
     * Represents the icon name used for the print action in the application.
     *
     * The `PRINT` constant is set to the string "printer", which typically 
     * represents an icon indicating the action of printing documents or content. 
     * This icon is commonly used in applications to allow users to initiate 
     * printing tasks easily.
     * 
     * Using a standard icon for print actions helps users quickly identify 
     * functionality related to printing, thereby improving the overall user experience.
     * 
     * @constant
     * @type {"printer"}
     * 
     * @example
     * // Usage in a React Native component
     * import { FontIcon } from './path/to/your/icon/constants';
     * 
     * const PrintButton = () => (
     *   <Button onPress={handlePrint}>
     *     <Icon name={PRINT} size={24}/>
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
    PRINT: "printer",

    /**
     * Represents the icon name used for the checked state of a checkbox in the application.
     * 
     * The value of this property is determined based on the platform the application is running on:
     * - On iOS, the icon is set to `'check'`, which visually represents a checked checkbox.
     * - On Android or other platforms, the icon is set to `'checkbox-marked'`, which also indicates a checked state.
     * 
     * This property allows for a consistent and platform-appropriate user interface, ensuring that 
     * users have a familiar experience regardless of the device they are using.
     * 
     * @constant {string}
     * @example
     * // Example usage of the CHECKED property
     * 
     * function renderCheckbox(isChecked: boolean): string {
     *     return isChecked ? CHECKED : UNCHECKED;
     * }
     * 
     * // Rendering a checked checkbox
     * const checkboxIcon = renderCheckbox(true);
     * console.log(checkboxIcon); // Output: 'check' (on iOS) or 'checkbox-marked' (on Android)
     * 
     * @remarks
     * - This property is particularly useful in applications that need to display checkboxes 
     *   or toggle buttons, providing a clear visual indication of the checked state.
     * - Ensure that the icon library you are using supports both 'check' and 'checkbox-marked' 
     *   icons for proper rendering across platforms.
     */
    CHECKED: isIos ? 'check' : "checkbox-marked",

    /**
     * Represents the icon name used for the unchecked state of a checkbox in the application.
     * 
     * This property is consistently set to `'checkbox-blank-outline'`, which visually represents 
     * an unchecked checkbox across all platforms. This provides a clear indication to users that 
     * the checkbox is not selected.
     * 
     * @constant {string}
     * @example
     * // Example usage of the UNCHECKED property
     * 
     * function renderCheckbox(isChecked: boolean): string {
     *     return isChecked ? CHECKED : UNCHECKED;
     * }
     * 
     * // Rendering an unchecked checkbox
     * const checkboxIcon = renderCheckbox(false);
     * console.log(checkboxIcon); // Output: 'checkbox-blank-outline'
     * 
     * @remarks
     * - This property is essential for applications that implement forms or settings where 
     *   users can select or deselect options.
     * - Consider using this icon in conjunction with accessibility features, such as 
     *   screen reader labels, to enhance usability for all users.
     */
    UNCHECKED: "checkbox-blank-outline",

    CHECK: "check",
}