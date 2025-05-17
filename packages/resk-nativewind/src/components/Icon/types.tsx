import { IClassName, INativewindBaseProps, ITextStyle, ITouchableProps } from "../../types";
import { ImageProps, ImageSourcePropType, View } from "react-native";
import { IconProps } from "react-native-vector-icons/Icon";
import { ReactElement } from "react";
import { IVariantPropsAll } from "@variants/index";
import { IVariantPropsIconButton } from '@variants/iconButton';
import { IVariantPropsIcon } from "@variants/icon";

/***
 * The `IFontIconNameRegistry` interface is used to define the registry of font icon names.
 * It is used to augment the `IFontIconName` type with the registry of font icon names.
 * 
 * @interface IFontIconNameRegistry
 * 
 */
export interface IFontIconNameRegistry { };

export type IFontIconName = keyof IFontIconNameRegistry;

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
export type IFontIconProps = Omit<IconProps, 'name' | 'size' | "ref" | "className"> & INativewindBaseProps & IVariantPropsAll & {
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

    ref?: React.Ref<View>;

    /***
     * The className of the container of the icon. It's used when the icon is wrapped in a Pressable component
     */
    containerClassName?: IClassName;

    /***
     * Variant for the icon
     */
    variant?: IVariantPropsIcon;
};

/***
 * /**
 * Represents the source for an icon, which can be either a predefined icon name 
 * or a custom image source. Additionally, it can be a function that returns an 
 * icon source based on the provided props.
 * 
 * @type {IIconSource}
 * @see {@link IFontIconName} For the name of the font icon (used if `source` is not provided).
 * @see {@link ImageSourcePropType} 

 * 
 * @example
 * // Using a predefined icon source
 * const icon: IIconSource = "settings";
 *
 * // Using a custom image source
 * const customIcon: IIconSource = require('./path/to/icon.png');
 *
 * <Icon source={icon} />
 * <Icon source={customIcon} />
 * <Icon source={dynamicIcon} color="red" />
 */
export type IIconSource = IFontIconName | ImageSourcePropType | null | ReactElement;

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
export type IIconProps = Partial<Omit<IFontIconProps, "name" | "color">> & Omit<ImageProps, "className"> & Omit<ITouchableProps, "className"> & {
    /****
     * the name of the icon to display (including the prefix for icon set if necessary).
     * It accepts a variety of icon names from different icon libraries such as 
     * MaterialCommunityIcons, AntDesign, Feather, Ionicons, Octicons, SimpleLineIcons, 
     * Zocial, MaterialIcons, and FoundationIcons.
     */
    iconName?: IFontIconName;
};


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
 * const buttonProps: IIconButtonProps = {};
 */
export interface IIconButtonProps extends Omit<IIconProps, "variant"> {
    isLoading?: boolean;
    containerClassName?: IClassName;
    containerSize?: number;
    variant?: IVariantPropsIconButton;
};