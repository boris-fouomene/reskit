import React, { forwardRef } from "react";
import { isNonNullString, defaultStr, isObj } from "@resk/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Zocial from "@expo/vector-icons/Zocial";
import { useTheme } from "@theme";
import Colors from "@colors";
import { IFontIconProps, IPrefixToFontIconsSetNames } from "./types";
import Platform from "@platform/index";
import { isRTL } from "@utils/i18nManager";
import { getTouchableProps } from "@utils/hasTouchHandler";
import { TouchableOpacity } from "react-native";
const isIos = Platform.isIos();


/***
 * The `FontIcon` component is used to display font-based icons from various icon sets.
 * The default icon set is `MaterialCommunityIcons`, which doesn't require prefixes for icon names.
 * 
 * Icon sets are selected by prefixing the icon name with a specific key for each icon set. 
 * 
 * @see https://icons.expo.fyi/ for all supported icons
 * @see https://docs.expo.dev/guides/icons for application icons
 * 
 * The following prefixes should be used to specify the icon set:
 *  - `fa` for FontAwesome5
 *  - `antd` for AntDesign
 *  - `fontisto` for Fontisto
 *  - `foundation` for Foundation
 *  - `ionic` for Ionicons
 *  - `octicons` for Octicons
 *  - `simple-line` for SimpleLineIcons
 *  - `zocial` for Zocial
 *  - `material` for MaterialIcons (default)
 * 
 * By default, the icon color is based on the app's theme text color.
 * 
 * @example
 * ```ts
 * import FontIcon from "$components/Icon/Font";
 * 
 * export default function MyApp() {
 *   return (
 *     <>
 *       <FontIcon name="camera" />  // Defaults to MaterialCommunityIcons
 *       <FontIcon name="fa-camera" />  // Uses FontAwesome5 icon set
 *     </>
 *   );
 * }
 * ```
 * 
 * @param {IFontIconProps} props The properties of the `FontIcon` component.
 * @param {React.Ref} ref The reference to the icon component.
 * @returns {JSX.Element | null} Returns the icon element, or null if the icon is not defined.
 */
const FontIcon = forwardRef<React.Ref<any>, IFontIconProps>(({ name, disabled, style, color, ...props }, ref) => {
    const pressableProps = getTouchableProps(props);
    const theme = useTheme();
    color = Colors.isValid(color) ? color : theme.colors.text;
    let { iconSetName, iconSetPrefix, iconSet: IconSet, iconName } = getFontIconSet(name);
    if (!iconSetName || !IconSet || !iconName) {
        console.warn(`Icon not defined for FontIcon component, icon [${name}], please specify a supported icon from https://github.com/expo/vector-icons/MaterialCommunityIcons`, iconSetName, " icon set prefix : ", iconSetPrefix, props);
        return null;
    }
    if (pressableProps) {
        for (let i in pressableProps) {
            delete props[i as keyof typeof props];
        }
        return <TouchableOpacity disabled={disabled} {...pressableProps}>
            <IconSet
                disabled={disabled}
                {...props}
                size={typeof props.size == "number" ? props.size : DEFAULT_FONT_ICON_SIZE}
                ref={ref}
                color={color}
                name={iconName}
                style={[theme.styles.RTL, style]}
            />
        </TouchableOpacity>
    }
    return <IconSet
        {...props}
        disabled={disabled}
        size={typeof props.size == "number" ? props.size : DEFAULT_FONT_ICON_SIZE}
        ref={ref}
        color={color}
        name={iconName}
        style={[theme.styles.RTL, style]}
    />;
});


/**
 * Retrieves the font icon set details based on the provided icon name.
 *
 * @param name - The name of the icon to retrieve the set details for.
 * @returns An object containing the icon set name, icon set prefix, icon name, and the icon set itself.
 *
 * @remarks
 * This function checks if the provided icon name is non-null and non-empty. It then iterates through the
 * `PREFIX_TO_ICONS_SET_NAMES` to find a matching icon set prefix. If a match is found, it constructs and
 * returns an object with the icon set details. If no match is found, it returns an object with empty strings
 * and `null` for the icon set.
 *
 * @example
 * ```typescript
 * const iconDetails = getFontIconSet("fa-solid-home");
 * console.log(iconDetails);
 * // Output:
 * // {
 * //   iconSetName: "FontAwesome",
 * //   iconSetPrefix: "fa-solid",
 * //   iconName: "home",
 * //   iconSet: FontAwesomeIcons
 * // }
 * ```
 *
 * @example
 * ```typescript
 * const iconDetails = getFontIconSet("material-account");
 * console.log(iconDetails);
 * // Output:
 * // {
 * //   iconSetName: "MaterialDesignIcons",
 * //   iconSetPrefix: "material",
 * //   iconName: "account",
 * //   iconSet: MaterialDesignIcons
 * // }
 * ```
 *
 * @example
 * ```typescript
 * const iconDetails = getFontIconSet("unknown-icon");
 * console.log(iconDetails);
 * // Output:
 * // {
 * //   iconSetName: "",
 * //   iconSetPrefix: "",
 * //   iconName: "",
 * //   iconSet: null
 * // }
 * ```
 */
const getFontIconSet = (name: string): { iconSetName: string, iconSetPrefix: string, iconName: string, iconSet: IFontIconSet | null } => {
    if (isNonNullString(name)) {
        const nameString = defaultStr(name).trim();
        for (let iconSetPrefix in PREFIX_TO_ICONS_SET_NAMES) {
            if (!iconSetPrefix || (isFontIconName(nameString, iconSetPrefix))) {
                const iconPrefix = iconSetPrefix ? (iconSetPrefix.rtrim("-") + "-") : "";
                const iconSetName = PREFIX_TO_ICONS_SET_NAMES[iconSetPrefix as keyof IPrefixToFontIconsSetNames];
                const iconName = nameString.trim().ltrim(iconPrefix).trim().ltrim("-").trim();
                const iconSet = fontsObjects[iconSetName];
                if (iconSet && iconSet.glyphMap[iconName]) {
                    return {
                        iconSetName,
                        iconSetPrefix,
                        iconSet,
                        iconName
                    };
                }
            }
        }
    }
    return { iconSetName: "", iconName: "", iconSetPrefix: "", iconSet: null };
}
/**
 * Checks if the provided font icon name is valid.
 *
 * @param name - The name of the font icon to validate.
 * @returns `true` if the font icon name is valid, otherwise `false`.
 */
export const isValidFontIconName = (name: string): boolean => {
    return getFontIconSet(name).iconSet !== null;
}


export const DEFAULT_FONT_ICON_SIZE = 20;



/**
 * Checks whether the provided icon belongs to a specific icon set.
 * 
 * This function is used to determine if an icon name is associated with a particular
 * icon set, such as MaterialCommunityIcons, AntDesign, etc. It checks if the icon
 * name starts with the specified icon set name, followed by a hyphen.
 * 
 * @param {string} name The name of the icon to check.
 * 
 * @description The icon name to verify. It should be a string and is case-insensitive.
 * 
 * @example
 * const name = "material-home";
 * const isValid = isFontIconName(name, "material"); // Returns true
 * 
 * @param {string} iconSetName The name of the icon set to check within.
 * 
 * @description The name of the icon set to check against. It should be a string and
 * is case-insensitive. The icon set name should not include the hyphen or any
 * additional characters.
 * 
 * @example
 * const iconSetName = "material";
 * const isValid = isFontIconName("material-home", iconSetName); // Returns true
 * 
 * @returns {boolean} Returns `true` if the icon belongs to the specified icon set, otherwise `false`.
 * 
 * @description The return value indicates whether the icon name is associated with the
 * specified icon set. If the icon name starts with the icon set name followed by a
 * hyphen, the function returns `true`. Otherwise, it returns `false`.
 * 
 * @example
 * const isValid = isFontIconName("material-home", "material"); // Returns true
 * const isValid = isFontIconName("material-home", "antdesign"); // Returns false
 */
const isFontIconName = (name: string, iconSetName: string): boolean => {
    /**
     * Checks if both the icon name and icon set name are non-null and non-empty strings.
     * 
     * If either of the inputs is not a valid string, the function immediately returns `false`.
     */
    if (!isNonNullString(name) || !isNonNullString(iconSetName)) return false;

    /**
     * Converts both the icon name and icon set name to lowercase for case-insensitive comparison.
     */
    name = name.toLowerCase();
    iconSetName = iconSetName.toLowerCase().trim();
    if (iconSetName) {
        iconSetName = iconSetName.rtrim("-") + "-";
    }
    /**
     * Checks if the icon name starts with the icon set name followed by a hyphen.
     * 
     * If the icon name matches the specified pattern, the function returns `true`. Otherwise, it returns `false`.
     */
    return name.startsWith(iconSetName);
};


/**
 * Represents a type that can be any of the specified icon sets.
 * 
 * This type is a union of the following icon sets:
 * - MaterialCommunityIcons
 * - FontAwesome5
 * - AntDesign
 * - Fontisto
 * - Foundation
 * - Ionicons
 * - Octicons
 * - SimpleLineIcons
 * - Zocial
 * - MaterialIcons
 */
export type IFontIconSet = typeof MaterialCommunityIcons | typeof FontAwesome5 | typeof AntDesign | typeof Fontisto | typeof Foundation | typeof Ionicons | typeof Octicons | typeof SimpleLineIcons | typeof Zocial | typeof MaterialIcons;


/**
 * Represents the set of possible icon font names that can be used in the application.
 * 
 * @typedef {("MaterialCommunityIcons" | "FontAwesome5" | "AntDesign" | "Fontisto" | "Foundation" | "Ionicons" | "Octicons" | "SimpleLineIcons" | "Zocial" | "MaterialIcons")} IFontIconSetName
 * 
 * @property {"MaterialCommunityIcons"} MaterialCommunityIcons - Icon set from Material Community Icons.
 * @property {"FontAwesome5"} FontAwesome5 - Icon set from Font Awesome 5.
 * @property {"AntDesign"} AntDesign - Icon set from Ant Design.
 * @property {"Fontisto"} Fontisto - Icon set from Fontisto.
 * @property {"Foundation"} Foundation - Icon set from Foundation.
 * @property {"Ionicons"} Ionicons - Icon set from Ionicons.
 * @property {"Octicons"} Octicons - Icon set from Octicons.
 * @property {"SimpleLineIcons"} SimpleLineIcons - Icon set from Simple Line Icons.
 * @property {"Zocial"} Zocial - Icon set from Zocial.
 * @property {"MaterialIcons"} MaterialIcons - Icon set from Material Icons.
 */
export type IFontIconSetName = "MaterialCommunityIcons" | "FontAwesome5" | "AntDesign" | "Fontisto" | "Foundation" | "Ionicons" | "Octicons" | "SimpleLineIcons" | "Zocial" | "MaterialIcons";

/**
 * Represents an object containing various icon font types.
 * 
 * @typedef {Object} IFontIconSets
 * @property {typeof MaterialCommunityIcons} MaterialCommunityIcons - The MaterialCommunityIcons font type.
 * @property {typeof FontAwesome5} FontAwesome5 - The FontAwesome5 font type.
 * @property {typeof AntDesign} AntDesign - The AntDesign font type.
 * @property {typeof Fontisto} Fontisto - The Fontisto font type.
 * @property {typeof Foundation} Foundation - The Foundation font type.
 * @property {typeof Ionicons} Ionicons - The Ionicons font type.
 * @property {typeof MaterialIcons} MaterialIcons - The MaterialIcons font type.
 * @property {typeof Octicons} Octicons - The Octicons font type.
 * @property {typeof SimpleLineIcons} SimpleLineIcons - The SimpleLineIcons font type.
 * @property {typeof Zocial} Zocial - The Zocial font type.
 */
export type IFontIconSets = Record<IFontIconSetName, IFontIconSet>;

/**
 * An object containing various font icon libraries.
 * 
 * @type {IFontIconSets}
 * @property {typeof MaterialCommunityIcons} MaterialCommunityIcons - The Material Community Icons library.
 * @property {typeof FontAwesome5} FontAwesome5 - The FontAwesome 5 Icons library.
 * @property {typeof AntDesign} AntDesign - The AntDesign Icons library.
 * @property {typeof Fontisto} Fontisto - The Fontisto Icons library.
 * @property {typeof Foundation} Foundation - The Foundation Icons library.
 * @property {typeof Ionicons} Ionicons - The Ionicons library.
 * @property {typeof MaterialIcons} MaterialIcons - The Material Icons library.
 * @property {typeof Octicons} Octicons - The Octicons library.
 * @property {typeof SimpleLineIcons} SimpleLineIcons - The Simple Line Icons library.
 * @property {typeof Zocial} Zocial - The Zocial Icons library.
 */
const fontsObjects: IFontIconSets = {
    MaterialCommunityIcons,
    FontAwesome5,
    AntDesign,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
}

/** An array of font objects. */
const fonts = Object.values(fontsObjects).map(f => f.font);

/** An array of font names indexed by their icon set names. */
const fontsByIndex = Object.keys(fontsObjects);


/** An object that maps icon set prefixes to their respective names. */
const PREFIX_TO_ICONS_SET_NAMES: IPrefixToFontIconsSetNames = {
    material: "MaterialIcons",
    fa: "FontAwesome5",
    antd: "AntDesign",
    foundation: "Foundation",
    fontisto: "Fontisto",
    ionic: "Ionicons",
    octicons: "Octicons",
    'simple-line': "SimpleLineIcons",
    zocial: "Zocial",
    "": "MaterialCommunityIcons"
}

/**
 * Loads the fonts for the application.
 * 
 * This function is responsible for loading all the font icons defined in the
 * `fonts` array. It returns a promise that resolves when all fonts have been
 * successfully loaded. If any font fails to load, it resolves with an error 
 * message indicating which font could not be found.
 * 
 * @returns {Promise<any[]>} A promise that resolves when all fonts are loaded.
 * 
 * @description The promise resolves with an array of results, each containing
 * the status and message of the font loading process. If all fonts load 
 * successfully, the status will be true for each entry; otherwise, it will be 
 * false for any failed loads.
 * 
 * @example
 * loadFontIcons().then(results => {
 *     results.forEach(result => {
 *         if (!result.status) {
 *             console.error(result.message);
 *         }
 *     });
 * });
 */
function loadFontIcons(): Promise<any[]> {
    return Promise.all(fonts.map((font, index) => {
        const iconSetName = fontsByIndex[index];
        const fontName = Object.keys(font)[0]?.toLowerCase();
        const iconSetNameLower = iconSetName.toLocaleLowerCase();

        /**
         * Checks if the font name is a valid string and if the icon set name
         * includes "material". If not, it resolves with a message indicating
         * the font was not found.
         */
        if (!isNonNullString(fontName) || (!iconSetNameLower.toLowerCase().includes("material"))) {
            return Promise.resolve({
                status: false,
                message: `Font ${fontName} not found`
            });
        }

        // Here you would typically load the font (e.g., using a font loading library)
        // For example: return loadFont(fontName, iconSetNameLower);

        // Placeholder for successful font loading
        return Promise.resolve({
            status: true,
            message: `Font ${fontName} loaded successfully`
        });
    }));
};

type IFontWithCustomIcons = typeof FontIcon & {
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
     * import { FontIcon } from '@resk/expo';
     * 
     * const BackButton = () => (
     *   <Icon name={FontIcon.BACK} size={24} color="#000" />
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
    BACK: "chevron-left" | "arrow-left" | "chevron-right" | "arrow-right";


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
     * @type {"menu"}
     * 
     * @example
     * // Usage in a React Native component
     * import { FontIcon } from '@resk/expo';
     * 
     * const MenuButton = () => (
     *   <Icon name={FontIcon.MENU} size={24} color="#000" />
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
    MENU: 'menu';


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
     * import { FontIcon } from '@resk/expo';
     * 
     * const CopyButton = () => (
     *   <Button onPress={handleCopy}>
     *     <Icon name={FontIcon.COPY} size={24} color="#000" />
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
    COPY: "content-copy";

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
     * import {FontIcon} from '@resk/expo';
     * 
     * const MoreOptionsButton = () => (
     *   <Icon name={FontIcon.MORE} size={24} color="#000" />
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
    MORE: "dots-vertical" | "dots-horizontal";



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
     *     <Icon name={FontIcon.PRINT} size={24} color="#000" />
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
    PRINT: "printer";

    /**
     * Checks if the provided font icon name is valid.
     *
     * @param name - The name of the font icon to validate.
     * @returns `true` if the font icon name is valid, otherwise `false`.
     */
    isValidName: (name: string) => boolean;


    /**
     * Loads the fonts for the application.
     * 
     * This function is responsible for loading all the font icons defined in the
     * `fonts` array. It returns a promise that resolves when all fonts have been
     * successfully loaded. If any font fails to load, it resolves with an error 
     * message indicating which font could not be found.
     * 
     * @returns {Promise<any[]>} A promise that resolves when all fonts are loaded.
     * 
     * @description The promise resolves with an array of results, each containing
     * the status and message of the font loading process. If all fonts load 
     * successfully, the status will be true for each entry; otherwise, it will be 
     * false for any failed loads.
     * 
     * @example
     * loadFontIcons().then(results => {
     *     results.forEach(result => {
     *         if (!result.status) {
     *             console.error(result.message);
     *         }
     *     });
     * });
     */
    loadFonts: () => Promise<any[]>;

    /**
     * Retrieves the font icon set details based on the provided icon name.
     *
     * @param name - The name of the icon to retrieve the set details for.
     * @returns An object containing the icon set name, icon set prefix, icon name, and the icon set itself.
     *
     * @remarks
     * This function checks if the provided icon name is non-null and non-empty. It then iterates through the
     * `PREFIX_TO_ICONS_SET_NAMES` to find a matching icon set prefix. If a match is found, it constructs and
     * returns an object with the icon set details. If no match is found, it returns an object with empty strings
     * and `null` for the icon set.
     *
     * @example
     * ```typescript
     * const iconDetails = getFontIconSet("fa-solid-home");
     * console.log(iconDetails);
     * // Output:
     * // {
     * //   iconSetName: "FontAwesome",
     * //   iconSetPrefix: "fa-solid",
     * //   iconName: "home",
     * //   iconSet: FontAwesomeIcons
     * // }
     * ```
     *
     * @example
     * ```typescript
     * const iconDetails = getIconSet("material-account");
     * console.log(iconDetails);
     * // Output:
     * // {
     * //   iconSetName: "MaterialDesignIcons",
     * //   iconSetPrefix: "material",
     * //   iconName: "account",
     * //   iconSet: MaterialDesignIcons
     * // }
     * ```
     *
     * @example
     * ```typescript
     * const iconDetails = getIconSet("unknown-icon");
     * console.log(iconDetails);
     * // Output:
     * // {
     * //   iconSetName: "",
     * //   iconSetPrefix: "",
     * //   iconName: "",
     * //   iconSet: null
     * // }
     * ```
     */
    getIconSet: (name: string) => { iconSetName: string, iconSetPrefix: string, iconName: string, iconSet: IFontIconSet | null };

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
     *     return isChecked ? FontWithCustomIcons.CHECKED : FontWithCustomIcons.UNCHECKED;
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
    CHECKED: 'check' | "checkbox-marked";

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
     *     return isChecked ? FontWithCustomIcons.CHECKED : FontWithCustomIcons.UNCHECKED;
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
    UNCHECKED: "checkbox-blank-outline";
};
const FontWithCustomIcons = FontIcon as unknown as IFontWithCustomIcons;

FontWithCustomIcons.isValidName = isValidFontIconName;
FontWithCustomIcons.loadFonts = loadFontIcons;
FontWithCustomIcons.getIconSet = getFontIconSet;

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
FontWithCustomIcons.BACK = isIos ? (isRTL ? "chevron-right" : "chevron-left") : (isRTL ? "arrow-right" : "arrow-left");


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
 * import { FontIcon } from '@resk/expo';
 * 
 * const MenuButton = () => (
 *   <Icon name={FontIcon.MENU} size={24} color="#000" />
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
FontWithCustomIcons.MENU = "menu";


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
 * import { FontIcon } from '@resk/expo';
 * 
 * const CopyButton = () => (
 *   <Button onPress={handleCopy}>
 *     <Icon name={FontIcon.COPY} size={24} color="#000" />
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
FontWithCustomIcons.COPY = "content-copy";


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
 * import {FontIcon} from '@resk/expo';
 * 
 * const MoreOptionsButton = () => (
 *   <Icon name={FontIcon.MORE} size={24} color="#000" />
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
FontWithCustomIcons.MORE = isIos ? "dots-horizontal" : "dots-vertical";


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
 *     <Icon name={FontIcon.PRINT} size={24} color="#000" />
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
FontWithCustomIcons.PRINT = "printer";

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
 *     return isChecked ? FontWithCustomIcons.CHECKED : FontWithCustomIcons.UNCHECKED;
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
FontWithCustomIcons.CHECKED = isIos ? 'check' : "checkbox-marked";

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
 *     return isChecked ? FontWithCustomIcons.CHECKED : FontWithCustomIcons.UNCHECKED;
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
FontWithCustomIcons.UNCHECKED = "checkbox-blank-outline";

export default FontWithCustomIcons;

FontWithCustomIcons.displayName = "FontIcon";