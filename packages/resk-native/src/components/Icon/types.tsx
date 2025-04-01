import MaterialCommunity from "react-native-vector-icons/dist/glyphmaps/MaterialCommunityIcons.json";
import FontAwesome6 from "react-native-vector-icons/glyphmaps/FontAwesome6Free.json";
import AntDesign from "react-native-vector-icons/glyphmaps/AntDesign.json";
import Foundation from "react-native-vector-icons/glyphmaps/Foundation.json";
import Ionicons from "react-native-vector-icons/glyphmaps/Ionicons.json";
import MaterialIcons from "react-native-vector-icons/glyphmaps/MaterialIcons.json";
import Octicons from "react-native-vector-icons/glyphmaps/Octicons.json";
import Feather from "react-native-vector-icons/glyphmaps/Feather.json";

import { IReactComponent, ITextStyle, ITouchableProps } from "../../types";
import { ImageProps, ImageSourcePropType, View } from "react-native";
import { ITooltipBaseProps, ITooltipProps } from "@components/Tooltip";
import { ITheme } from "@theme/types";
import { ITouchableRippleProps } from "@components/TouchableRipple/types";
import { ISurfaceProps } from "@components/Surface";
import { IconProps } from "react-native-vector-icons/Icon";

/**
 * Represents the valid names of icons from the FontAwesome6 icon set.
 * 
 * This type is derived from the glyph map of the FontAwesome6 icon set,
 * allowing developers to use autocomplete features in TypeScript for
 * icon names, ensuring that only valid names are used.
 * 
 * @example
 * const iconName: IFontIconAwesome6Name = "home"; // Valid
 * const iconName: IFontIconAwesome6Name = "invalid-icon"; // TypeScript error
 */
export type IFontIconAwesome6Name = keyof typeof FontAwesome6;

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
export type IFontAntDesignName = `antd-${keyof typeof AntDesign}`;

/**
 * Represents the valid names of icons from the Feather icon set.
 * 
 * This type is constructed from the Feather glyph map, allowing for
 * type-safe usage of icon names in the Feather library.
 * 
 * @example
 * const iconName: IFontIconFeatherName = "feather-home"; // Valid
 * const iconName: IFontIconFeatherName = "invalid-icon"; // TypeScript error
 */
export type IFontIconFeatherName = `feather-${keyof typeof Feather}`;

/**
 * Represents the valid names of icons from the Ionicons icon set.
 * 
 * This type provides a way to use Ionicons with type safety, ensuring that
 * only valid icon names are used throughout the application.
 * 
 * @example
 * const iconName: IFontIconIoniconsName = "ionic-home"; // Valid
 * const iconName: IFontIconIoniconsName = "invalid-icon"; // TypeScript error
 */
export type IFontIconIoniconsName = `ionic-${keyof typeof Ionicons}`;

/**
 * Represents the valid names of icons from the Material Icons set.
 * 
 * This type allows developers to reference Material Icons in a type-safe
 * manner, ensuring that the icon names used are valid according to the 
 * Material Icons glyph map.
 * 
 * @example
 * const iconName: IFontIconMaterialName = "material-home"; // Valid
 * const iconName: IFontIconMaterialName = "invalid-icon"; // TypeScript error
 */
export type IFontIconMaterialName = `material-${keyof typeof MaterialIcons}`;

/**
 * @interface IFontFoundationIconsName
 * Represents the valid names of icons from the Foundation Icons set.
 * 
 * This type allows developers to reference Foundation Icons in a type-safe
 * manner, ensuring that the icon names used are valid according to the 
 * Foundation Icons glyph map.
 * 
 * @example
 * const iconName: IFontFoundationIconsName = "foundation-home"; // Valid
 * const iconName: IFontFoundationIconsName = "invalid-icon"; // TypeScript error
 */
export type IFontFoundationIconsName = `foundation-${keyof typeof Foundation}`;

/**
 * Represents the valid names of icons from the Octicons icon set.
 * 
 * This type ensures that only valid Octicons icon names are used in the 
 * application, promoting type safety and reducing runtime errors.
 * 
 * @example
 * const iconName: IFontIconOcticonsName = "octicons-home"; // Valid
 * const iconName: IFontIconOcticonsName = "invalid-icon"; // TypeScript error
 */
export type IFontIconOcticonsName = `octicons-${keyof typeof Octicons}`;

/**
 * Represents the valid names of icons from the Material Community Icons set.
 * 
 * This type provides a way to use Material Community Icons with type safety,
 * ensuring that only valid icon names are referenced in your code.
 * 
 * @example
 * const iconName: IFontIconMaterialCommunityName = "home"; // Valid
 * const iconName: IFontIconMaterialCommunityName = "invalid-icon"; // TypeScript error
 */
export type IFontIconMaterialCommunityName = keyof typeof MaterialCommunity;


/**
 * Props for the FontIcon component, extending the properties of MaterialCommunityIcons
 * while allowing for customization of icon appearance and behavior.
 * 
 * it defines the properties that can be passed to the `FontIcon`
 * component, allowing for customization of the icon's appearance and behavior.
 * It extends the props of the `MaterialCommunityIcons` component while omitting
 * the `name`, `style`, and `size` properties to redefine them with more specific types.
 *
 * @typedef {object} IFontIconProps
 * @property {ITextStyle} [style] - The style object for the icon.
 * 
 * This property allows you to customize the icon's appearance using
 * standard React Native style properties. You can specify styles such as
 * color, margin, padding, etc.
 * 
 * @example
 * const customStyle: ITextStyle = { color: 'red', margin: 10 };
 * <FontIcon name="home" style={customStyle} />;
 *
 * @property {IFontIconMaterialCommunityName | IFontAntDesignName | IFontIconFeatherName | 
*           IFontIconIoniconsName | IFontIconOcticonsName | IFontSimpleLineIconsName | 
*           IFontZocialName | IFontIconMaterialName | IFontIconMaterialCommunityName | 
*           IFontFoundationIconsName} name - The name of the icon to display.
* 
*
* This property specifies which icon to render (including the prefix for icon set if necessary).
* It accepts a variety of icon names from different icon sets, ensuring that only valid names are passed.
* The name must correspond to one of the defined types for the various icon sets
* (e.g., MaterialCommunityIcons, AntDesign, etc.).
* 
* @extends React.ComponentProps<typeof MaterialCommunityIcons>
* @example
* // Valid icon names
* const iconName: IFontIconProps['name'] = "home"; // From MaterialCommunityIcons
* const iconNameAnt: IFontIconProps['name'] = "antd-home"; // From AntDesign
* <FontIcon name={iconName} />;
*
* @property {number} [size] - The icon size.
* 
* This property defines the size of the icon in pixels. If not specified,
* a default size will be used. You can set this to any number to customize
* the icon's size according to your layout needs.
* 
* @example
* <FontIcon iconName="home" size={30} /> // Renders the icon with a size of 30 pixels
    
*/
export type IFontIconProps = Omit<IconProps, 'name' | 'style' | 'size'> & {
    /**
     * The style object for the icon.
     * 
     * This property allows you to customize the icon's appearance using
     * standard React Native style properties. You can specify styles such as
     * color, margin, padding, etc.
     * 
     * @example
     * const customStyle: ITextStyle = { color: 'red', margin: 10 };
     * <FontIcon name="home" style={customStyle} />;
     */
    style?: ITextStyle;

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
     * const name: IFontIconProps['name'] = "home"; // From MaterialCommunityIcons
     * const nameAnt: IFontIconProps['name'] = "antd-home"; // From AntDesign
     * <FontIcon name={name} />;
     */
    name: IFontIconName;

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
 * @typedef IFontIconName - The name of the font icon.
 * @see {@link IFontIconProps} for the `IFontIconProps` type.
 * @see {@link IFontIconMaterialCommunityName} for the `IFontIconMaterialCommunityName` type.
 * @see {@link IFontAntDesignName} for the `IFontAntDesignName` type.
 * @see {@link IFontIconFeatherName} for the `IFontIconFeatherName` type.
 * @see {@link IFontIconIoniconsName} for the `IFontIconIoniconsName` type.
 * @see {@link IFontIconOcticonsName} for the `IFontIconOcticonsName` type.
 * @see {@link IFontIconMaterialName} for the `IFontIconMaterialName` type.
 * @see {@link IFontIconMaterialCommunityName} for the `IFontIconMaterialCommunityName` type.
 * @see {@link IFontFoundationIconsName} for the `IFontFoundationIconsName` type.
 * The name of the icon to display (including the prefix for icon set if necessary).
 * 
 * This property specifies which icon to render. It accepts a variety of icon
 * names from different icon sets, ensuring that only valid names are passed.
 * The name must correspond to one of the defined types for the various icon sets
 * (e.g., MaterialCommunityIcons, AntDesign, etc.).
 * 
 * @example
 * // Valid icon names
 * const name: IFontIconProps['name'] = "home"; // From MaterialCommunityIcons
 * const nameAnt: IFontIconProps['name'] = "antd-home"; // From AntDesign
 * <FontIcon name={name} />;
 */
export type IFontIconName = IFontIconMaterialCommunityName | IFontAntDesignName | IFontIconFeatherName
    | IFontIconIoniconsName | IFontIconOcticonsName | IFontIconMaterialName | IFontIconMaterialCommunityName | IFontFoundationIconsName;

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
 *   fa: "FontAwesome6",
 *   antd: "AntDesign",
 *   foundation: "Foundation",
 *   feather: "Feather",
 *   ionic: "Ionicons",
 *   octicons: "Octicons",
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
    fa: "FontAwesome6";

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
     * The prefix for Feather Icons.
     * 
     * This prefix is used in icon names to identify icons from the Feather
     * set. For example, an icon name like "feather-home" indicates it belongs
     * to the Feather set.
     */
    feather: "Feather";

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
     * The prefix for Material Community Icons.
     * Material Community Icons is the default icon set.
     */
    "": "MaterialCommunityIcons";
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
 *   FontAwesome6: "fa",
 *   AntDesign: "antd",
 *   Foundation: "foundation",
 *   Feather: "feather",
 *   Ionicons: "ionic",
 *   Octicons: "octicons",
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
    FontAwesome6: "fa";

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
     * The prefix for Feather Icons.
     * 
     * This prefix is used in icon names to identify icons from the Feather
     * set. For example, an icon name like "feather-home" indicates it belongs
     * to the Feather set.
     */
    Feather: "feather";

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
}


/**
 * 
 *
 * @typedef {IIconSourceBase}
 * @type {string | ImageSourcePropType}
 * @see the name property of the {@link IIconProps} interface
 * @example
 * // Using a predefined icon name
 * const name: IIconSourceBase = "home"; // From MaterialCommunityIcons
 *
 * // Using a custom image source
 * const customIcon: IIconSourceBase = require('./path/to/icon.png');
 *
 * <Icon source={{uri:"...an icon uri"}} /> // Renders the predefined icon
 * <Icon source={customIcon} /> // Renders the custom image as an icon
 */
export type IIconSourceBase = IFontIconName | ImageSourcePropType;

/***
 * /**
 * Represents the source for an icon, which can be either a predefined icon name 
 * or a custom image source. Additionally, it can be a function that returns an 
 * icon source based on the provided props.
 * 
 * @type {IIconSource}
 * @see {@link IIconSourceBase}  IIconSourceBase
 * @see {@link IIconProps}

 * 
 * @example
 * // Using a predefined icon source
 * const icon: IIconSource = "settings";
 *
 * // Using a custom image source
 * const customIcon: IIconSource = require('./path/to/icon.png');
 *
 * // Using a function to dynamically determine the icon source
 * const dynamicIcon: IIconSource = (props) => {
 *   return props.color === 'red' ? "alert" : require('./path/to/default/icon.png');
 * };
 *
 * <Icon source={icon} />
 * <Icon source={customIcon} />
 * <Icon source={dynamicIcon} color="red" />
 */
export type IIconSource = IIconSourceBase | null | JSX.Element | ((props: IIconProps & { color: string }) => IIconSourceBase | JSX.Element);

/**
 * @interface IIconProps
 * Represents the properties for an icon component that combines the icon-specific
 * properties from `IFontIconProps` with the standard image properties from React Native.
 *
 * This type allows for a versatile icon component that can render both font-based icons,
 * custom images, and tooltip functionality, allowing for a versatile icon component that can display both font-based and image-based icons,
 * as well as providing optional tooltip support, providing a unified interface for developers. It inherits all the
 * properties from both `IFontIconProps` and `ImageProps`, enabling the use of various
 * icon sources and additional image attributes.
 * 
 * This type allows flexibility in using icons within your application by supporting:
 * 
 * 1. **Predefined Icon Names**: You can use names from different icon libraries such as 
 *    MaterialCommunityIcons, AntDesign, Feather, Ionicons, Octicons, SimpleLineIcons, 
 *    Zocial, MaterialIcons, and FoundationIcons.
 *
 * 2. **Custom Image Sources**: You can also provide an image source using the standard
 *    `ImageSourcePropType` from React Native, allowing you to use any image as an icon.
 *
 * @typedef {IIconProps}
 * 
 * @extends {IFontIconProps} - All properties related to font icons, including:
 *   - `iconName`: The name of the icon to display.
 *   - `style`: The style object for the icon.
 *   - `size`: The size of the icon.
 * 
 * @extends {ImageProps} - All standard image properties, including:
 *   - `source`: The source of the image (can be a URI or local asset).
 *   - `resizeMode`: How to resize the image when the frame doesn't match the raw image dimensions.
 *   - `onLoad`: Callback function when the image loads successfully.
 *   - `onError`: Callback function when the image fails to load.
 * 
 * @extends ITooltipBaseProps
 * 
 * @property {ITooltipProps} [containerProps] - Optional. Properties for the tooltip container,
 * allowing customization of the tooltip behavior and appearance when the icon is hovered or focused.
 *
 * @example
 * // Using IIconProps to render a font icon
 * const iconProps: IIconProps = {
 *   iconName : "home" | "material-home",
 *   style: { color: 'blue', fontSize: 24 },
 *   size: 30,
 *   resizeMode: 'contain',
 *   onLoad: () => console.log('Icon loaded'),
 * };
 *
 * // Using IIconProps to render a custom image
 * const customIconProps: IIconProps = {
 *   source: require('./path/to/icon.png'),
 *   style: { width: 50, height: 50 },
 *   resizeMode: 'cover',
 *   onError: () => console.error('Error loading image'),
 * };
 */
export type IIconProps = Partial<Omit<IFontIconProps, "name" | "color">> & ImageProps & ITooltipBaseProps & ITouchableProps & {
    /***
     * Optional. Properties for the tooltip container,
    * allowing customization of the tooltip behavior and appearance when the icon is hovered or focused.
     */
    containerProps?: ITooltipProps;

    as?: ITooltipProps['as'];

    /**
     * Optional. The color of the icon.
     */
    color?: string;
    /****
     * the name of the icon to display (including the prefix for icon set if necessary).
     * It accepts a variety of icon names from different icon libraries such as 
     * MaterialCommunityIcons, AntDesign, Feather, Ionicons, Octicons, SimpleLineIcons, 
     * Zocial, MaterialIcons, and FoundationIcons.
     */
    iconName?: IFontIconName;
};



/**
 * Represents a comprehensive set of options for configuring icons, combining base icon options with additional properties.
 * This type allows developers to specify a wide range of icon configurations while ensuring type safety.
 * 
 * @template T - An optional generic type that allows for extending the options with
 *               additional properties specific to the implementation context.
 *
 * @interface IGetIconOptions
 * @extends Omit<IIconProps, "iconName" | "source"> - Excludes the `iconName` and `source` properties
 *                                                from the base icon properties, as they are
 *                                                not needed for this context.
 * 
 * @property {IIconSource} [icon] - The source of the icon to be displayed. This can be 
 *                                   an icon object or a reference to an icon in a library.
 *                                   Example:
 *                                   ```typescript
 *                                   const options: IGetIconOptions = {
 *                                       icon: {  icon details  },
 *                                   };
 *                                   ```
 * 
 * @property {string} [color] - Optional property to specify the color of the icon.
 *                               This can be a named color, hex code, or RGB value.
 *                               Example:
 *                               ```typescript
 *                               const options: IGetIconOptions = {
 *                                   color: '#FF5733',
 *                               };
 *                               ```
 * 
 * @property {ITheme} [theme] - An optional property to define the theme context in which
 *                               the icon will be rendered. This can influence styles such as
 *                               background, border, or hover effects.
 *                               Example:
 *                               ```typescript
 *                               const options: IGetIconOptions = {
 *                                   theme: { theme details },
 *                               };
 *                               ```
 *
 * @typedef {Omit<T, keyof IGetIconOptionsBase> & IGetIconOptionsBase & { icon?: IIconSource, color?: string, theme?: ITheme }} IGetIconOptions
 * 
 * @description
 * The `IGetIconOptions` type merges properties from a generic type `T` (excluding those defined in {@link IGetIconOptionsBase})
 * with the base icon options and additional properties:
 * - `icon`: An optional property that defines the icon source, which can be a predefined icon name or a custom image source.
 * - `color`: An optional string property that specifies the color to apply to the icon.
 * - `theme`: An optional property that allows for the application of a specific theme to the icon, enhancing its visual appearance.
 * 
 * @example
 * // Basic usage of IGetIconOptions with default type
 * const iconOptions: IGetIconOptions = {
 *   size: 24,
 *   style: { margin: 10 },
 *   icon: "home" | { uri: string } | 'number',
 *   color: "blue",
 *   theme: { primary: "blue", secondary: "gray" }
 * };
 * 
 * @example
 * // Using IGetIconOptions with a custom type
 * interface ICustomIconProps {
 *   customLabel?: string;
 * }
 * 
 * const customIconOptions: IGetIconOptions<ICustomIconProps> = {
 *   size: 30,
 *   icon: require('./path/to/custom/icon.png'),
 *   customLabel: "My Custom Icon",
 *   theme: { primary: "green", secondary: "lightgray" }
 * };
 * 
 * @example
 * // Function that accepts IGetIconOptions
 * function renderIcon(options: IGetIconOptions) {
 *   const { icon, color, size, style, theme } = options;
 *   // Implementation to render the icon based on the provided options
 * }
 * 
 * @see {@link IGetIconOptionsBase} For the base icon options
 * @see {@link IIconSource} For information on icon sources
 * @see {@link ITheme} For theme-related properties
 * 
* @remarks 
 * This type is particularly useful when working with icon components that require 
 * customization options while ensuring that the core properties are managed correctly.
 * 
 * Ensure that the properties provided align with the expected types to avoid runtime errors.
  * 
 * @beta
 * @category Icons
 * @since 1.0.0
 */
export type IGetIconOptions<T = any> = Omit<T, keyof IGetIconOptionsBase> & IGetIconOptionsBase & { icon?: IIconSource, IconComponent?: IReactComponent<IIconProps>, color?: string, theme?: ITheme };
/**
 * Represents the base options for retrieving icons, excluding essential properties like name, source, and color.
 * This type is used as a foundation for icon configuration options while allowing specific icon properties to be
 * defined separately.
 * 
 * @typedef {Omit<IIconProps, "name" | "source" | "color">} IGetIconOptionsBase
 * 
 * @description
 * This type omits the following properties from IIconProps:
 * - 'name': The identifier of the icon
 * - 'source': The react native source of the icon (e.g., {uri:"assets...",number})
 * - 'color': The color to apply to the icon
 * 
 * @example
 * // Basic usage of IGetIconOptionsBase
 * const iconOptions: IGetIconOptionsBase = {
 *   size: 24,
 *   style: { marginRight: 10 },
 *   onPress: () => console.log('Icon pressed')
 * };
 * 
 * @example
 * // Using in a function
 * function createIcon(options: IGetIconOptionsBase & { iconName: string }) {
 *   return {
 *     ...options,
 *     iconName : options.iconName,
 *     color: 'default'
 *   };
 * }
 * 
 * @see {@link IIconProps} For the complete set of icon properties
 */
type IGetIconOptionsBase = Omit<IIconProps, "iconName" | "source" | "color">;


/**
 * Represents the properties for an IconButton component.
 * This type extends the IIconProps interface to include additional
 * functionality and customization options for the button.
 *
 * @interface IIconButtonProps
 * @extends IIconProps
 *
 * @property {string} [backgroundColor] - The background color of the icon container.
 * This property allows customization of the button's appearance.
 * 
 * @example
 * // Setting a custom background color
 * const buttonProps: IIconButtonProps = {
 *   backgroundColor: '#ff5722',
 * };
 *
 * @property {string} [rippleColor] - The color of the ripple effect that appears 
 * when the button is pressed. This enhances the user experience by providing 
 * visual feedback.
 * 
 * @example
 * // Customizing the ripple effect color
 * const buttonProps: IIconButtonProps = {
 *   rippleColor: '#ffffff',
 * };
 *
 * @property {boolean} [disabled] - Indicates whether the button is disabled. 
 * A disabled button is visually greyed out, and the `onPress` event will not 
 * trigger when the button is touched.
 * 
 * @example
 * // Disabling the button
 * const buttonProps: IIconButtonProps = {
 *   disabled: true,
 * };
 *
 * @property {string} [accessibilityLabel] - An accessibility label for the button, 
 * which is read by screen readers when the user taps the button. This is important 
 * for making the application more accessible to users with disabilities.
 * 
 * @example
 * // Providing an accessibility label
 * const buttonProps: IIconButtonProps = {
 *   accessibilityLabel: 'Submit your response',
 * };
 *
 * @property {React.RefObject<View>} [ref] - A reference to the View component 
 * that wraps the button. This can be used for imperative actions or accessing 
 * the component's methods.
 * 
 * @property {boolean} [isLoading] - A flag indicating whether to show a loading 
 * indicator on the button. This is useful for indicating to the user that an 
 * action is in progress.
 * 
 * @example
 * // Showing a loading indicator
 * const buttonProps: IIconButtonProps = {
 *   isLoading: true,
 * };
 *
 * @property {ITouchableRippleProps} [rippleProps] - Additional properties 
 * for customizing the ripple effect behavior. This can include settings such 
 * as duration, borderless effect, etc.
 * 
 * @property {ISurfaceProps} [containerProps] - Properties for the container 
 * view of the button, allowing further customization of the layout and style.
 * 
 * @property {number} [containerSize] - Size of the button container. If not provided, it will be calculated based on the size of the icon.
 *
 * @example
 * // Customizing the container view
 * const buttonProps: IIconButtonProps = {
 *   containerProps: {
 *     elevation: 4,
 *     style: { padding: 10 },
 *   },
 * };
 */
export type IIconButtonProps = Omit<ITouchableRippleProps, "children"> & IIconProps & {
    /**
     * Background color of the icon container.
     */
    backgroundColor?: string;

    /**
     * Whether to show a isLoading indicator.
     */
    isLoading?: boolean;

    /**
     * Props for the container view.
     */
    containerProps?: ISurfaceProps;

    /**
     * Size of the button container.
        If not provided, it will be calculated based on the size of the icon.
    *
     */
    containerSize?: number;
};