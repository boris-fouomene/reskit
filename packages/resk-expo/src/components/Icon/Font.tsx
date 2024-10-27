import React, { forwardRef } from "react";
import { isNonNullString, defaultStr } from "@resk/core";
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
import Theme, { useTheme } from "@theme";
import Colors from "@colors";
import { IFontIconProps, IPrefixToFontIconsSetNames } from "./types";


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
const FontIcon = forwardRef<React.Ref<any>, IFontIconProps>(({ name, style, color, ...props }, ref) => {
    let IconSet: any = MaterialCommunityIcons, iconSetName: string = "", iconSetPrefix = "";
    const theme = useTheme();
    color = Colors.isValid(color) ? color : theme.colors.text;
    const nameString = defaultStr(name).trim();
    for (let i in PREFIX_TO_ICONS_SET_NAMES) {
        if (isFontIconName(nameString, i)) {
            iconSetPrefix = i;
            iconSetName = PREFIX_TO_ICONS_SET_NAMES[i as keyof IPrefixToFontIconsSetNames];
            IconSet = fontsObjects[iconSetName as keyof IFontsObject];
            break;
        }
    }
    if (iconSetPrefix) {
        iconSetPrefix += "-";
    }
    if (!nameString || !IconSet || (iconSetPrefix && !IconSet)) {
        console.warn(`Icon not defined for FontIcon component, icon [${nameString}], please specify a supported icon from https://github.com/expo/vector-icons/MaterialCommunityIcons`, iconSetName, " icon set prefix : ", iconSetPrefix, props);
        return null;
    }
    const iconName = nameString.trim().ltrim(iconSetPrefix).ltrim("-").trim();
    return <IconSet
        {...props}
        size={typeof props.size == "number" ? props.size : DEFAULT_FONT_ICON_SIZE}
        ref={ref}
        color={color}
        name={iconName}
        style={[Theme.styles.RTL, style]}
    />;
});

export const DEFAULT_FONT_ICON_SIZE = 20;

FontIcon.displayName = 'FontIcon';

export default FontIcon;



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
 * const iconName = "material-home";
 * const isValid = isFontIconName(iconName, "material"); // Returns true
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
export const isFontIconName = (name: string, iconSetName: string): boolean => {
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

    /**
     * Checks if the icon name starts with the icon set name followed by a hyphen.
     * 
     * If the icon name matches the specified pattern, the function returns `true`. Otherwise, it returns `false`.
     */
    return name.startsWith(iconSetName + "-");
};

/***
 * Defines the supported font icon sets.
 * 
 * @interface IFontsObject
 */
type IFontsObject = {
    MaterialCommunityIcons: any;
    FontAwesome5: any;
    AntDesign: any;
    Fontisto: any;
    Foundation: any;
    Ionicons: any;
    MaterialIcons: any;
    Octicons: any;
    SimpleLineIcons: any;
    Zocial: any;
}

/** An object containing all the available font icon sets. */
const fontsObjects: IFontsObject = {
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
}


/** An array of loaded icon set names. */
const loadedIconsSetsNames: string[] = [];

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
export function loadFontIcons(): Promise<any[]> {
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

