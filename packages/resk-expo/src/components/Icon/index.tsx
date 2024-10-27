import React, { forwardRef, isValidElement, LegacyRef, ReactNode, useMemo } from "react";
import { IFontIconProps, IIconProps, IIconSource } from "./types";
import { Image, ImageSourcePropType, ImageStyle, Pressable } from "react-native";
import { isImageSource } from "./utils";
import { defaultStr, isObj } from "@resk/core";
import Theme, { Colors, useTheme } from "@theme/index";
import FontIcon, { DEFAULT_FONT_ICON_SIZE } from "./Font";
import { Tooltip } from "@components/Tooltip";
import { IStyle } from "../../types";
import { StyleSheet } from "react-native";
import { TouchableRipple } from "@components/TouchableRipple";
import { ITheme } from "@theme/types";

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
 * @param {string} props.name - The name of the font icon (used if `source` is not provided).
 * @param {function} [props.onPress] - Optional. Function to call when the icon is pressed.
 * @param {ITooltipProps} [props.containerProps] - Optional. Properties for the tooltip container.
 * @param {ReactNode} [props.title] - Optional. Tooltip text to display on hover.
 * @param {ReactNode} [props.tooltip] - Optional. Tooltip text to display.
 * @param {ImageSourcePropType} props.source - The source of the image to render. 
 *                                              If this prop is provided, the 
 *                                              component will render an `Image`.
  @param {string} [props.testID] - An optional test ID for testing purposes.
 *@param {number} [props.size] - The size of the icon. If not provided or invalid, 
 *                                 it defaults to `DEFAULT_FONT_ICON_SIZE` : 12.
 * @param {IStyle} [props.style] - Optional. Additional styles for the icon.
 * @param {string} [props.color] - Optional. Color for the font icon or tint color for the image icon.
 * 
 * @param {React.Ref} ref - A ref to access the underlying component.
 * @returns {JSX.Element} - Returns an `Image` component if `source` is an 
 *                          image, otherwise returns a `FontIcon` component.
 * 
 * @returns {JSX.Element} The rendered icon component.
 *
 * @example
 * Here’s an example of how to use the `Icon` component:
 * 
 * ```tsx
 * import React from 'react';
 * import { View } from 'react-native';
 * import Icon from './Icon'; // Adjust the import path as necessary
 * 
 * const MyComponent = () => {
 *   return (
 *     <View>
 *       <Icon
 *         name="home"
 *         size={24}
 *         color="blue"
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
 * <Icon name="material-home" size={24} color="#000" />
 */

export const Icon = forwardRef<React.Ref<Image | any>, IIconProps>(({ name, disabled, onPress, containerProps, title, tooltip, source, testID, size, style, color, ...props }, ref) => {
    const isSource = isImageSource(source);
    testID = defaultStr(testID, isSource ? "RNImage" : "RNFontIcon");
    size = typeof size == "number" && size > 0 ? size : DEFAULT_FONT_ICON_SIZE;
    const { Component, props: containerP } = useMemo(() => {
        const isPressable = !disabled && (title || tooltip || onPress);
        return {
            Component: isPressable ? Tooltip : React.Fragment,
            props: isPressable ? Object.assign({}, { onPress, testID: `${testID}_IconContainer`, disabled, title, tooltip }, containerProps, { style: [styles.container, containerProps?.style] }) : {}
        };
    }, [title, tooltip, onPress, disabled, testID]);
    const iconStyle = StyleSheet.flatten([
        Theme.styles.RTL,
        disabled && Theme.styles.disabled,
        {
            width: size,
            height: size,
            tintColor: color,
            resizeMode: `contain`,
        },
        style,
    ]);
    return <Component {...containerP}>
        {isSource ? <Image
            accessibilityIgnoresInvertColors
            {...props}
            testID={testID}
            source={source}
            ref={ref as LegacyRef<Image>}
            style={iconStyle as ImageStyle}
        /> : <FontIcon
            testID={testID}
            name={name as IFontIconProps["name"]}
            size={size}
            {...props}
            color={color}
            style={iconStyle}
            ref={ref}
        />}
    </Component>;
});

const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start"
    }
})

Icon.displayName = "Icon";

export * from "./Font";
export { default as FontIcon } from "./Font";
export * from "./types";

/***
 * /**
 * Retrieves an icon component based on the provided parameters.
 * 
 * This function can handle both predefined icon names and custom icon sources.
 * It also supports dynamic icon generation through a function that returns an icon source.
 * 
 * @param {Object} params - The parameters for retrieving the icon.
 * @param {IIconSource} params.icon - The source of the icon (string, ImageSource, or function).
 * @param {string} [params.color] - Optional color for the icon.
 * @param {ITheme} [params.theme] - Optional theme object to customize styles.
 * @param {...any} rest - Additional properties to pass to the icon component.
 * 
 * @returns {ReactNode} The rendered icon component.
 * 
 * @example
 * const myIcon = getIcon({ icon: "home", color: "blue", theme: customTheme });
 */
export const getIcon = ({ icon, color: col2, theme, ...rest }: { icon?: IIconSource } & { color?: string, theme?: ITheme }): ReactNode => {
    theme = isObj(theme) && theme || Theme;
    const color: string = (Colors.isValid(col2) ? col2 : theme.colors.text) as string;
    const iconSource = typeof icon == "function" ? icon({ ...rest, color } as IIconProps & { color: string }) : icon;
    if (isValidElement(iconSource)) return iconSource;
    if (!iconSource) return null;
    const iconProps: IIconProps = {
        color
        , ...rest,
        name: typeof iconSource == "string" ? (iconSource as unknown as IFontIconProps["name"]) : undefined,
        ...Object.assign({}, (isImageSource(iconSource) ? { source: iconSource as ImageSourcePropType } : isImageSource(Icon) ? { source: icon as ImageSourcePropType } : undefined)),
    }
    return <Icon
        {...iconProps}
    />
}

/**
 * A custom hook that retrieves an icon component based on the provided parameters.
 * 
 * This hook utilizes the current theme from the theme provider and delegates the
 * icon retrieval to the `getIcon` function.
 * 
 * @param {Object} params - The parameters for retrieving the icon.
 * @param {IIconSource} params.icon - The source of the icon (string, ImageSource, or function).
 * @param {string} [params.color] - Optional color for the icon.
 * @param {...any} rest - Additional properties to pass to the icon component.
 * 
 * @returns {ReactNode} The rendered icon component.
 * 
 * @example
 * const MyComponent = () => {
 *   const icon = useGetIcon({ icon: "home", color: "blue" });
 *   return <View>{icon}</View>;
 * };
 */
export const useGetIcon = ({ icon, color: col2, ...rest }: { icon?: IIconSource } & { color?: string }) => {
    const theme = useTheme();
    return getIcon({ icon, color: col2, theme, ...rest });
}