import { forwardRef, LegacyRef } from "react";
import { IIconProps } from "./types";
import { Image } from "react-native";
import { isImageSource } from "./utils";
import { defaultStr } from "@resk/core";
import Theme from "@theme/index";
import FontIcon, { DEFAULT_FONT_ICON_SIZE } from "./Font";


/**
 * A functional component that renders either an image or a font icon 
 * based on the provided `source` prop.
 *
 * This component can be used to display icons in a React Native application.
 * It intelligently decides whether to render an `Image` component or a 
 * `FontIcon` component based on the type of `source` provided.
 *
 * @param {IIconProps} props - The props for the Icon component.
 * @param {string} props.name - The name of the font icon to render (used when 
 *                               `source` is not an image).
 * @param {ImageSourcePropType} props.source - The source of the image to render. 
 *                                              If this prop is provided, the 
 *                                              component will render an `Image`.
 * @param {string} [props.testID] - An optional test ID for testing purposes.
 * @param {number} [props.size] - The size of the icon. If not provided or invalid, 
 *                                 it defaults to `DEFAULT_FONT_ICON_SIZE`.
 * @param {ViewStyle} [props.style] - Additional styles to apply to the icon.
 * @param {string} [props.color] - The color to apply to the icon (for tinting 
 *                                   the image or coloring the font icon).
 * @param {React.Ref} ref - A ref to access the underlying component.
 * @returns {JSX.Element} - Returns an `Image` component if `source` is an 
 *                          image, otherwise returns a `FontIcon` component.
 *
 * @example
 * // Rendering an image icon
 * <Icon source={require('./path/to/icon.png')} size={24}  />
 *
 * // Rendering a font icon
 * <Icon name="material-home" size={24} color="#000" />
 */
export const Icon = forwardRef<React.Ref<Image | any>, IIconProps>(({ name, source, testID, size, style, color, ...props }, ref) => {
    const isSource = isImageSource(source);
    testID = defaultStr(testID, isSource ? "RNImage" : "RNFontIcon");
    size = typeof size == "number" && size > 0 ? size : DEFAULT_FONT_ICON_SIZE;
    if (isSource) {
        return (
            <Image
                accessibilityIgnoresInvertColors
                {...props}
                testID={testID}
                source={source}
                ref={ref as LegacyRef<Image>}
                style={[
                    Theme.styles.RTL,
                    {
                        width: size,
                        height: size,
                        tintColor: color,
                        resizeMode: `contain`,
                    },
                    style,
                ]}
            />
        );
    }
    return <FontIcon
        testID={testID}
        name={name}
        size={size}
        {...props}
        color={color}
        ref={ref}
    />;
});

Icon.displayName = "Icon";

export * from "./Font";
export { default as FontIcon } from "./Font";
export * from "./types";
