import React, { forwardRef } from "react";
import { isNonNullString, ltrim } from "@resk/core";
import { GestureResponderEvent, Pressable, PressableProps } from "react-native";
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
import { IStyle } from "../../types";
import { ITooltipProps } from "@components/Tooltip/types";
import Tooltip from "@components/Tooltip";


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
 *  - `ant` for AntDesign
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
const FontIcon = forwardRef(({ name, color, ...props }: IFontIconProps, ref) => {
    let IconSet: any = MaterialCommunityIcons, iconSetName: string = "", iconSetPrefix = "";
    name = name.trim();
    for (let i in PREFIX_TO_ICONS_SET_NAMES) {
        if (isIcon(name, i)) {
            iconSetPrefix = i;
            iconSetName = PREFIX_TO_ICONS_SET_NAMES[i as keyof IPrefixToIconsSetNames];
            IconSet = fontsObjects[iconSetName as keyof IFontsObject];
            break;
        }
    }
    if (iconSetPrefix) {
        iconSetPrefix += "-";
    }
    if (!name || !IconSet || (iconSetPrefix && !IconSet)) {
        console.warn(`Icon not defined for FontIcon component, icon [${name}], please specify a supported icon from https://github.com/expo/vector-icons/MaterialCommunityIcons`, iconSetName, " icon set prefix : ", iconSetPrefix, props);
        return null;
    }
    const iconName = name.trim().ltrim(iconSetPrefix).ltrim("-").trim();
    const children = <IconSet
        size={24}
        {...props}
        ref={ref}
        color={color}
        name={iconName}
        {...props}
    />;
    return <Tooltip
        {...props}
        children={children}
    />
});

FontIcon.displayName = 'FontIcon';

export default FontIcon;

/***
 * The props for the `FontIcon` component.
 * 
 * @interface IFontIconProps
 */
export type IFontIconProps = ITooltipProps & {
    /** The size of the icon. Default is 24. */
    size?: number;

    /** The style object for the icon. */
    style?: IStyle;

    /** The name of the icon to display (including the prefix for icon set if necessary). */
    name: string;

    /** The color of the icon. Defaults to the theme's text color. */
    color?: string;

    /** The text direction (either 'rtl' or 'ltr'). */
    direction: 'rtl' | 'ltr';

    /** Whether to allow font scaling. */
    allowFontScaling?: boolean;

    /** The test ID used for testing. */
    testID?: string;
}

/***
 * Checks whether the provided icon belongs to a specific icon set.
 * 
 * @param {string} name The name of the icon to check.
 * @param {string} iconSetName The name of the icon set to check within.
 * @returns {boolean} Returns `true` if the icon belongs to the specified icon set, otherwise `false`.
 */
export const isIcon = (name: string, iconSetName: string): boolean => {
    if (!isNonNullString(name) || !isNonNullString(iconSetName)) return false;
    name = name.toLowerCase();
    iconSetName = iconSetName.toLowerCase().trim();
    return name.startsWith(iconSetName + "-");
}

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
export const fontsObjects: IFontsObject = {
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
export const fonts = Object.values(fontsObjects).map(f => f.font);

/** An array of font names indexed by their icon set names. */
export const fontsByIndex = Object.keys(fontsObjects);

/***
 * Maps icon set prefixes to their respective icon set names.
 * 
 * @interface IPrefixToIconsSetNames
 */
export interface IPrefixToIconsSetNames {
    material: string,
    fa: string,
    ant: string,
    foundation: string,
    fontisto: string,
    ionic: string,
    octicons: string,
    "simple-line": string,
    zocial: string,
}

/** An object that maps icon set prefixes to their respective names. */
export const PREFIX_TO_ICONS_SET_NAMES: IPrefixToIconsSetNames = {
    material: "MaterialIcons",
    fa: "FontAwesome5",
    ant: "AntDesign",
    foundation: "Foundation",
    fontisto: "Fontisto",
    ionic: "Ionicons",
    octicons: "Octicons",
    'simple-line': "SimpleLineIcons",
    zocial: "Zocial",
}

/***
 * Maps icon set names to their respective prefixes.
 * 
 * @interface IIconsSetNamesToPrefix
 */
export interface IIconsSetNamesToPrefix {
    MaterialIcons: string;
    FontAwesome5: string;
    AntDesign: string;
    Foundation: string;
    Fontisto: string;
    Ionicons: string;
    Octicons: string;
    "SimpleLineIcons": string;
    Zocial: string;
};

/** An object that maps icon set names to their respective prefixes. */
export const ICONS_SET_NAMES_TO_PREFIX: IIconsSetNamesToPrefix = {
    MaterialIcons: "material",
    FontAwesome5: "fa",
    AntDesign: "ant",
    Foundation: "foundation",
    Fontisto: "fontisto",
    Ionicons: "ionic",
    Octicons: "octicons",
    "SimpleLineIcons": "simple-line",
    Zocial: "zocial",
};

/** An array of loaded icon set names. */
export const loadedIconsSetsNames: string[] = [];

/***
 * Loads the fonts for the application.
 * 
 * @returns {Promise<any[]>} A promise that resolves when all fonts are loaded.
 */
export function loadFonts(): Promise<any[]> {
    return Promise.all(fonts.map((font, index) => {
        const iconSetName = fontsByIndex[index];
        const fontName = Object.keys(font)[0]?.toLowerCase();
        const iconSetNameLower = iconSetName.toLocaleLowerCase();
        if (!isNonNullString(fontName) || (!iconSetNameLower.toLowerCase().includes("material"))) return Promise.resolve({
            status: false,
            message: `Font {0} not found ${fontName}`
        });
    }));
};
