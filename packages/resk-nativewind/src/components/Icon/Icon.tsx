"use client";
import { Fragment, ReactNode } from "react";
import { IIconProps, IIconSource } from "./types";
import { Image, ImageSourcePropType, ImageStyle, Pressable, TouchableOpacity } from "react-native";
import { cn, isValidElement, normalizeProps, pickTouchableProps } from "@utils";
import { isImageSource, isImageUrl } from "./utils";
import FontIcon from "./Font";
import { StyleSheet } from "react-native";
import { isNonNullString, isObj } from "@resk/core/utils";
import { variants } from "@variants/index";
import { Tooltip } from "@components/Tooltip";
/**
 * The `Icon` component is a versatile icon renderer that can display both 
 * image-based icons and font-based icons. It supports press events, tooltips, 
 * and customizable styles. The component automatically determines the type of 
 * icon to render based on the provided `source` prop.
 * It  can be used to display icons in a React Native application.
 * It intelligently decides whether to render an `Image` component or a 
 * `FontIcon` component based on the type of `source` provided.
 *
 * @param {IIconProps} props - The properties for the `Icon` component.
 * @param {string} props.iconName - The name of the font icon (used if `source` is not provided).
 * @param {function} [props.onPress] - Optional. Function to call when the icon is pressed.
 * @param {ITooltipProps} [props.containerProps] - Optional. Properties for the tooltip container.
 * @param {ReactNode} [props.title] - Optional. Tooltip text to display on hover.
 * @param {ReactNode} [props.tooltip] - Optional. Tooltip text to display.
 * @param {ImageSourcePropType} props.source - The source of the image to render. 
 *                                              If this prop is provided, the 
 *                                              component will render an `Image`.
  @param {string} [props.testID] - An optional test ID for testing purposes.
 *@param {number} [props.size] - The size of the icon. If not provided or invalid, 
 *                                 it defaults to `DEFAULT_FONT_ICON_SIZE` : 20.
 * @param {Ref} ref - A ref to access the underlying component.
 * @returns {ReactElement} - Returns an `Image` component if `source` is an 
 *                          image, otherwise returns a `FontIcon` component.
 * 
 * @returns {ReactElement} The rendered icon component.
 *
 * @example
 * Here’s an example of how to use the `Icon` component:
 * 
 * ```tsx
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import Icon from './Icon'; // Adjust the import path as necessary
import isNonNullString from '../../../../resk-core/build/utils/isNonNullString';
 * 
 * const MyComponent = () => {
 *   return (
 *     <View>
 *       <Icon
 *         iconName="home"
 *         size={24}
 *         onPress={() => console.log('Icon pressed!')}
 *         title="Go to home"
 *         containerProps={{ tooltip: "Home" }}
 *       />
 *     </View>
 *   );
 * };
 * 
 * export default MyComponent;
 * ```
 * @example
 * // Rendering an image icon
 * <Icon source={require('./path/to/icon.png')} size={24}  />
 *
 * // Rendering a font icon
 * <Icon iconName="material-home" size={24} />
 */

function Icon({ iconName, className, variant, resizeMode, tooltip, title, source, containerClassName, testID, size, style, ref, ...props }: IIconProps) {
    const isSource = isImageSource(source);
    className = cn(isObj(variant) && variants.icon(variant), className);
    //const isValidIconName = iconName && FontIcon.isValidName(iconName);
    testID = testID && typeof testID == "string" ? testID : (isSource ? "resk-image" : "resk-font-icon");
    const iconSize = typeof size == "number" && size > 0 ? size : FontIcon.DEFAULT_SIZE;
    if (isSource) {
        const { touchableProps, ...restProps } = pickTouchableProps(normalizeProps({ ...props, className }));
        const disabled = props.disabled;
        const isPressable = !disabled && !!touchableProps;
        const Component = isPressable ? Tooltip : Fragment;
        const containerP = isPressable ? Object.assign({}, touchableProps, { testID: testID + "-icon-container" }) : {};
        const iconStyle = StyleSheet.flatten([
            iconSize ? {
                width: iconSize,
                height: iconSize,
            } : undefined,
            style,
        ]);
        return <Component as={TouchableOpacity} title={title} tooltip={tooltip} disabled={disabled} {...containerP as any} className={cn("shrink-0 grow-0", containerClassName)}>
            <Image
                accessibilityIgnoresInvertColors
                resizeMode={resizeMode || "contain"}
                {...restProps}
                ref={ref as any}
                testID={testID}
                source={getIconSource(source)}
                style={iconStyle as ImageStyle}
            />
        </Component>
    }
    return <FontIcon
        containerClassName={containerClassName}
        testID={testID}
        name={iconName as never}
        size={iconSize}
        style={style}
        title={title}
        tooltip={tooltip}
        {...props}
        className={className}
        ref={ref}
    />
};



/**
 * Determines the appropriate image source for an icon.
 * 
 * This function evaluates the provided `iconSource` and returns an `ImageSourcePropType`
 * based on its type. It supports direct numeric identifiers, arrays, string URIs, and object
 * references, ensuring compatibility with React Native's image handling.
 * 
 * @param {any} iconSource - The source of the icon, which can be a number, array, string, or object.
 * @returns {ImageSourcePropType | undefined} - The processed image source or undefined if the input is invalid.
 * 
 * @example
 * // Numeric source
 * const source = getIconSource(123);
 * 
 * // String URI source
 * const source = getIconSource("https://example.com/icon.png");
 * 
 * // Object source
 * const source = getIconSource({ uri: "https://example.com/icon.png" });
 * 
 * // Invalid source
 * const source = getIconSource(null); // returns undefined
 */

function getIconSource(iconSource: any): ImageSourcePropType | undefined {
    if (typeof iconSource === "number" || Array.isArray(iconSource)) return iconSource;
    if (isNonNullString(iconSource)) {
        return { uri: iconSource };
    }
    if (!isObj(iconSource)) return undefined;
    return iconSource as ImageSourcePropType;
}
Icon.getIconSource = getIconSource;

/***
 * /**
 * Retrieves an icon component based on the provided parameters.
 * 
 * This function can handle both predefined icon names and custom icon sources.
 * It also supports dynamic icon generation through a function that returns an icon source.
 * 
 * @param {Object} params - The parameters for retrieving the icon.
 * @param {IIconSource} params.icon - The source of the icon (string, ImageSource, or function).
 * @param {...any} rest - Additional properties to pass to the icon component.
 * 
 * @returns {ReactNode} The rendered icon component.
 * @see {@link IGetIconOptions} for the options of the function.
 * 
 * @example
 * const myIcon = getIcon({ icon: "material-home", color: "blue", theme: customTheme });
 */
Icon.getIcon = function getIcon<T = any>({ icon, ...rest }: IGetIconOptions<T>): ReactNode {
    if (isValidElement(icon)) return icon as ReactNode;
    if (isValidElement(icon)) return icon as ReactNode;
    if (!icon) return null;
    const isSource = isImageSource(icon) || isNonNullString(icon) && isImageUrl(icon as string);
    const iconName = typeof icon == "string" && !isSource ? (icon as any) : undefined;
    const iconProps: IIconProps = {
        ...rest,
        iconName,
        ...Object.assign({}, !iconName ? { source: getIconSource(icon) } : undefined),
    }
    return <Icon {...iconProps} />;
}


Icon.displayName = "Icon";

export default Icon;



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
 * 
 * @property {ITheme} [theme] - An optional property to define the theme context in which
 *                               the icon will be rendered. This can influence styles such as
 *                               background, border, or hover effects.
 *                               Example:
 *                               ```typescript
 *                               const options: IGetIconOptions = {
 *                                   theme: { theme details },
 *                               };
 *                               ``
 * 
 * @description
 * The `IGetIconOptions` type merges properties from a generic type `T` (excluding those defined in {@link IGetIconOptionsBase})
 * with the base icon options and additional properties:
 * - `icon`: An optional property that defines the icon source, which can be a predefined icon name or a custom image source.
 * 
 * @example
 * // Basic usage of IGetIconOptions with default type
 * const iconOptions: IGetIconOptions = {
 *   size: 24,
 *   style: { margin: 10 },
 *   icon: "home" | { uri: string } | 'number',
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
 *   const { icon, size, style, theme } = options;
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
type IGetIconOptions<T = any> = Omit<T, keyof IGetIconOptionsBase> & IGetIconOptionsBase & { icon?: IIconSource };
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
 *   };
 * }
 * 
 * @see {@link IIconProps} For the complete set of icon properties
 */
type IGetIconOptionsBase = Omit<IIconProps, "iconName" | "source" | "color">;