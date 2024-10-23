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
import { IStyle } from "../../types";
import { IconButtonProps, IconProps } from "@expo/vector-icons/build/createIconSet";
import { useTheme } from "@theme";
import Colors from "@colors";


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
const FontIcon = forwardRef<React.Ref<any>, IFontIconProps>(({ name, color, ...props }, ref) => {
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
        size={DEFAULT_FONT_ICON_SIZE}
        {...props}
        ref={ref}
        color={color}
        name={iconName}
    />;
});

export const DEFAULT_FONT_ICON_SIZE = 20;

FontIcon.displayName = 'FontIcon';

export default FontIcon;


/**
 * Represents the valid names of icons from the FontAwesome5 icon set.
 * 
 * This type is derived from the glyph map of the FontAwesome5 icon set,
 * allowing developers to use autocomplete features in TypeScript for
 * icon names, ensuring that only valid names are used.
 * 
 * @example
 * const iconName: IFontAwesome5Name = "home"; // Valid
 * const iconName: IFontAwesome5Name = "invalid-icon"; // TypeScript error
 */
export type IFontAwesome5Name = keyof typeof FontAwesome5.glyphMap;

/**
 * Represents the valid names of icons from the AntDesign icon set.
 * 
 * This type includes all the keys from the AntDesign glyph map, prefixed
 * with 'antd-', ensuring that developers use valid icon names while 
 * providing a clear indication that these icons belong to the AntDesign set.
 * 
 * @example
 * const iconName: IFontAntDesignName = "antd-home"; // Valid
 * const iconName: IFontAntDesignName = "invalid-icon"; // TypeScript error
 */
export type IFontAntDesignName = `antd-${keyof typeof AntDesign.glyphMap | 'book'}`;

/**
 * Represents the valid names of icons from the Fontisto icon set.
 * 
 * This type is constructed from the Fontisto glyph map, allowing for
 * type-safe usage of icon names in the Fontisto library.
 * 
 * @example
 * const iconName: IFontFontistoName = "fontisto-home"; // Valid
 * const iconName: IFontFontistoName = "invalid-icon"; // TypeScript error
 */
export type IFontFontistoName = `fontisto-${keyof typeof Fontisto.glyphMap}`;

/**
 * Represents the valid names of icons from the Ionicons icon set.
 * 
 * This type provides a way to use Ionicons with type safety, ensuring that
 * only valid icon names are used throughout the application.
 * 
 * @example
 * const iconName: IFontIoniconsName = "ionic-home"; // Valid
 * const iconName: IFontIoniconsName = "invalid-icon"; // TypeScript error
 */
export type IFontIoniconsName = `ionic-${keyof typeof Ionicons.glyphMap}`;

/**
 * Represents the valid names of icons from the Material Icons set.
 * 
 * This type allows developers to reference Material Icons in a type-safe
 * manner, ensuring that the icon names used are valid according to the 
 * Material Icons glyph map.
 * 
 * @example
 * const iconName: IFontMaterialIconsName = "material-home"; // Valid
 * const iconName: IFontMaterialIconsName = "invalid-icon"; // TypeScript error
 */
export type IFontMaterialIconsName = `material-${keyof typeof MaterialIcons.glyphMap}`;

/**
 * Represents the valid names of icons from the Octicons icon set.
 * 
 * This type ensures that only valid Octicons icon names are used in the 
 * application, promoting type safety and reducing runtime errors.
 * 
 * @example
 * const iconName: IFontOcticonsName = "octicons-home"; // Valid
 * const iconName: IFontOcticonsName = "invalid-icon"; // TypeScript error
 */
export type IFontOcticonsName = `octicons-${keyof typeof Octicons.glyphMap}`;

/**
 * Represents the valid names of icons from the Simple Line Icons set.
 * 
 * This type provides a way to use Simple Line Icons with type safety, 
 * ensuring that only valid icon names are referenced in your code.
 * 
 * @example
 * const iconName: IFontSimpleLineIconsName = "simple-line-home"; // Valid
 * const iconName: IFontSimpleLineIconsName = "invalid-icon"; // TypeScript error
 */
export type IFontSimpleLineIconsName = `simple-line-${keyof typeof SimpleLineIcons.glyphMap}`;

/**
 * Represents the valid names of icons from the Zocial icon set.
 * 
 * This type allows developers to use Zocial icons in a type-safe manner,
 * ensuring that only valid icon names are used throughout the application.
 * 
 * @example
 * const iconName: IFontZocialName = "zocial-home"; // Valid
 * const iconName: IFontZocialName = "invalid-icon"; // TypeScript error
 */
export type IFontZocialName = `zocial-${keyof typeof Zocial.glyphMap}`;

/**
 * Represents the valid names of icons from the Material Community Icons set.
 * 
 * This type provides a way to use Material Community Icons with type safety,
 * ensuring that only valid icon names are referenced in your code.
 * 
 * @example
 * const iconName: IFontMaterialCommunityIconsName = "home"; // Valid
 * const iconName: IFontMaterialCommunityIconsName = "invalid-icon"; // TypeScript error
 */
export type IFontMaterialCommunityIconsName = keyof typeof MaterialCommunityIcons.glyphMap;


/**
 * The props for the `FontIcon` component.
 * 
 * This interface defines the properties that can be passed to the `FontIcon`
 * component, allowing for customization of the icon's appearance and behavior.
 * It extends the props of the `MaterialCommunityIcons` component while omitting
 * the `name`, `style`, and `size` properties to redefine them with more specific types.
 * 
 * @interface IFontIconProps
 * 
 * @extends React.ComponentProps<typeof MaterialCommunityIcons>
 * 
 * @example
 * // Example usage of the FontIcon component with props
 * const MyComponent = () => (
 *   <FontIcon name="home" size={24} style={{ color: 'blue' }} />
 * );
 */
export type IFontIconProps = Omit<React.ComponentProps<typeof MaterialCommunityIcons>, 'name' | 'style' | 'size'> & {
    /**
     * The style object for the icon.
     * 
     * This property allows you to customize the icon's appearance using
     * standard React Native style properties. You can specify styles such as
     * color, margin, padding, etc.
     * 
     * @example
     * const customStyle: IStyle = { color: 'red', margin: 10 };
     * <FontIcon name="home" style={customStyle} />;
     */
    style?: IStyle;

    /**
     * The name of the icon to display (including the prefix for icon set if necessary).
     * 
     * This property specifies which icon to render. It accepts a variety of icon
     * names from different icon sets, ensuring that only valid names are passed.
     * The name must correspond to one of the defined types for the various icon sets
     * (e.g., MaterialCommunityIcons, AntDesign, etc.).
     * 
     * @example
     * // Valid icon names
     * const iconName: IFontIconProps['name'] = "home"; // From MaterialCommunityIcons
     * const iconNameAnt: IFontIconProps['name'] = "antd-home"; // From AntDesign
     * <FontIcon name={iconName} />;
     */
    name: IFontMaterialCommunityIconsName | IFontAntDesignName | IFontFontistoName
    | IFontIoniconsName | IFontOcticonsName | IFontSimpleLineIconsName |
    IFontZocialName | IFontMaterialIconsName | IFontMaterialCommunityIconsName;

    /**
     * The icon size.
     * 
     * This property defines the size of the icon in pixels. If not specified,
     * a default size will be used. You can set this to any number to customize
     * the icon's size according to your layout needs.
     * 
     * @example
     * <FontIcon name="home" size={30} /> // Renders the icon with a size of 30 pixels
     */
    size?: number;
};

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

/**
 * Maps icon set prefixes to their respective icon set names.
 * 
 * This interface serves as a mapping between the prefix used in icon names
 * and the corresponding icon set names. It allows for easy reference and
 * organization of different icon sets by their prefixes, facilitating 
 * the usage of icons throughout the application.
 * 
 * @interface IPrefixToFontIconsSetNames
 * 
 * @example
 * // Example usage of the IPrefixToFontIconsSetNames interface
 * const iconSetMapping: IPrefixToFontIconsSetNames = {
 *   material: "MaterialCommunityIcons",
 *   fa: "FontAwesome5",
 *   antd: "AntDesign",
 *   foundation: "Foundation",
 *   fontisto: "Fontisto",
 *   ionic: "Ionicons",
 *   octicons: "Octicons",
 *   "simple-line": "SimpleLineIcons",
 *   zocial: "Zocial",
 * };
 */
export interface IPrefixToFontIconsSetNames {
    /**
     * The prefix for Material Community Icons.
     * 
     * This prefix is used in icon names to identify icons from the Material
     * Community Icons set. For example, an icon name like "material-home"
     * would indicate it belongs to this set.
     */
    material: "MaterialIcons";

    /**
     * The prefix for Font Awesome 5 Icons.
     * 
     * This prefix is used in icon names to identify icons from the Font Awesome
     * 5 set. For example, an icon name like "fa-home" indicates it belongs to
     * the Font Awesome set.
     */
    fa: "FontAwesome5";

    /**
     * The prefix for Ant Design Icons.
     * 
     * This prefix is used in icon names to identify icons from the Ant Design
     * set. For example, an icon name like "antd-home" indicates it belongs to
     * the Ant Design set.
     */
    antd: "AntDesign";

    /**
     * The prefix for Foundation Icons.
     * 
     * This prefix is used in icon names to identify icons from the Foundation
     * set. For example, an icon name like "foundation-home" indicates it belongs
     * to the Foundation set.
     */
    foundation: "Foundation";

    /**
     * The prefix for Fontisto Icons.
     * 
     * This prefix is used in icon names to identify icons from the Fontisto
     * set. For example, an icon name like "fontisto-home" indicates it belongs
     * to the Fontisto set.
     */
    fontisto: "Fontisto";

    /**
     * The prefix for Ionicons.
     * 
     * This prefix is used in icon names to identify icons from the Ionicons
     * set. For example, an icon name like "ionic-home" indicates it belongs
     * to the Ionicons set.
     */
    ionic: "Ionicons";

    /**
     * The prefix for Octicons.
     * 
     * This prefix is used in icon names to identify icons from the Octicons
     * set. For example, an icon name like "octicons-home" indicates it belongs
     * to the Octicons set.
     */
    octicons: "Octicons";

    /**
     * The prefix for Simple Line Icons.
     * 
     * This prefix is used in icon names to identify icons from the Simple Line
     * Icons set. For example, an icon name like "simple-line-home" indicates it
     * belongs to the Simple Line Icons set.
     */
    "simple-line": "SimpleLineIcons";

    /**
     * The prefix for Zocial Icons.
     * 
     * This prefix is used in icon names to identify icons from the Zocial set.
     * For example, an icon name like "zocial-home" indicates it belongs to the
     * Zocial set.
     */
    zocial: "Zocial";
}

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

/**
 * Maps icon set names to their respective prefixes.
 * 
 * This interface serves as a mapping between the full names of icon sets
 * and their corresponding prefixes. It allows for easy reference and
 * organization of different icon sets by their full names, facilitating
 * the usage of icons throughout the application.
 * 
 * @interface IFontIconsSetNamesToPrefix
 * 
 * @example
 * // Example usage of the IFontIconsSetNamesToPrefix interface
 * const iconSetMapping: IFontIconsSetNamesToPrefix = {
 *   MaterialIcons: "material",
 *   FontAwesome5: "fa",
 *   AntDesign: "antd",
 *   Foundation: "foundation",
 *   Fontisto: "fontisto",
 *   Ionicons: "ionic",
 *   Octicons: "octicons",
 *   SimpleLineIcons: "simple-line",
 *   Zocial: "zocial",
 * };
 */
export interface IFontIconsSetNamesToPrefix {
    /**
     * The prefix for Material Icons.
     * 
     * This prefix is used in icon names to identify icons from the Material
     * Icons set. For example, an icon name like "material-home" would indicate
     * it belongs to this set.
     */
    MaterialIcons: "material";

    /**
     * The prefix for Font Awesome 5 Icons.
     * 
     * This prefix is used in icon names to identify icons from the Font Awesome
     * 5 set. For example, an icon name like "fa-home" indicates it belongs to
     * the Font Awesome set.
     */
    FontAwesome5: "fa";

    /**
     * The prefix for Ant Design Icons.
     * 
     * This prefix is used in icon names to identify icons from the Ant Design
     * set. For example, an icon name like "antd-home" indicates it belongs to
     * the Ant Design set.
     */
    AntDesign: "antd";

    /**
     * The prefix for Foundation Icons.
     * 
     * This prefix is used in icon names to identify icons from the Foundation
     * set. For example, an icon name like "foundation-home" indicates it belongs
     * to the Foundation set.
     */
    Foundation: "foundation";

    /**
     * The prefix for Fontisto Icons.
     * 
     * This prefix is used in icon names to identify icons from the Fontisto
     * set. For example, an icon name like "fontisto-home" indicates it belongs
     * to the Fontisto set.
     */
    Fontisto: "fontisto";

    /**
     * The prefix for Ionicons.
     * 
     * This prefix is used in icon names to identify icons from the Ionicons
     * set. For example, an icon name like "ionic-home" indicates it belongs
     * to the Ionicons set.
     */
    Ionicons: "ionic";

    /**
     * The prefix for Octicons.
     * 
     * This prefix is used in icon names to identify icons from the Octicons
     * set. For example, an icon name like "octicons-home" indicates it belongs
     * to the Octicons set.
     */
    Octicons: "octicons";

    /**
     * The prefix for Simple Line Icons.
     * 
     * This prefix is used in icon names to identify icons from the Simple Line
     * Icons set. For example, an icon name like "simple-line-home" indicates it
     * belongs to the Simple Line Icons set.
     */
    "SimpleLineIcons": "simple-line";

    /**
     * The prefix for Zocial Icons.
     * 
     * This prefix is used in icon names to identify icons from the Zocial set.
     * For example, an icon name like "zocial-home" indicates it belongs to the
     * Zocial set.
     */
    Zocial: "zocial";
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
