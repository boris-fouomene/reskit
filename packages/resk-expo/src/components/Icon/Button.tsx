import * as React from 'react';
import {
    StyleSheet,
    ViewStyle,
    View,
    ActivityIndicator,
} from 'react-native';
import { Surface } from '@components/Surface';
import { TouchableRipple } from '@components/TouchableRipple';
import { getColors } from "@components/TouchableRipple/utils";
import { IIconButtonProps, IIconProps, IIconSource } from './types';
import { Colors, useTheme } from '@theme/index';
import { useGetIcon } from "./Icon";
import { DEFAULT_FONT_ICON_SIZE } from "./Font";
import { ITheme } from '@theme/types';
import { defaultStr } from '@resk/core';

const PADDING = 8;



/**
 * A customizable IconButton component that renders an icon button with various 
 * properties for styling and functionality. This component supports ripple effects 
 * and loading indicators, making it suitable for interactive applications.
 * An icon button is a button which displays only an icon without a label.
 *
 * @component IconButton
 * @param {IIconButtonProps} props - The properties for configuring the IconButton.
 * @param {React.Ref<View>} ref - A ref for accessing the underlying View component.
 *
 * @returns {JSX.Element} The rendered IconButton component.
 *
 * @example
 * // Example usage of the IconButton component
 * const App = () => {
 *   return (
 *     <IconButton
 *       iconName="check"
 *       backgroundColor="#4CAF50"
 *       rippleColor="#ffffff"
 *       accessibilityLabel="Confirm"
 *       onPress={() => console.log('Button Pressed')}
 *       isLoading={false}
 *       style={{ margin: 10 }}
 *     />
 *   );
 * };
 *
 * @example
 * // Example of a loading state
 * const App = () => {
 *   return (
 *     <IconButton
 *       iconName="loading"
 *       isLoading={true}
 *       accessibilityLabel="Loading"
 *       onPress={() => console.log('Button Pressed')}
 *       style={{ margin: 10 }}
 *     />
 *   );
 * };
 * 
 * @example
 * const MyComponent = () => (
 *   <IconButton
 *     icon="camera"
 *     iconColor={MD3Colors.error50}
 *     size={20}
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 */
const IconButton = React.forwardRef<View, IIconButtonProps>(
    (
        {
            backgroundColor: customBackgroundColor,
            rippleColor: customRippleColor,
            size = DEFAULT_FONT_ICON_SIZE,
            accessibilityLabel,
            disabled,
            style,
            testID,
            isLoading = false,
            color,
            rippleProps,
            iconName,
            source,
            containerProps,
            containerSize,
            ...rest
        },
        ref
    ) => {
        const theme = useTheme();
        containerProps = Object.assign({}, containerProps);
        rippleProps = Object.assign({}, rippleProps);
        testID = defaultStr(testID, "resk-icon-button");
        const containerStyle = StyleSheet.flatten([containerProps?.style]);
        const backgroundColor = getBackgroundColor({ theme, customBackgroundColor: Colors.isValid(customBackgroundColor) ? customBackgroundColor : Colors.isValid(containerStyle?.backgroundColor) ? containerStyle.backgroundColor : undefined });
        customRippleColor = Colors.isValid(customRippleColor) ? customRippleColor : Colors.isValid(rippleProps?.rippleColor) ? rippleProps.rippleColor : undefined;
        const { rippleColor } = getColors({
            theme,
            disabled,
            rippleColor: customRippleColor,
        });
        size = typeof size == "number" ? size : DEFAULT_FONT_ICON_SIZE;
        const iconColor = Colors.isValid(color) ? color : theme.colors.text;
        containerSize = typeof containerSize == "number" ? containerSize : (size + 2 * PADDING);
        const {
            borderWidth = isLoading ? 0 : 0,
            borderRadius = containerSize / 2,
            borderColor = isLoading ? undefined : theme.colors.outline,
        } = (StyleSheet.flatten(style) || {}) as ViewStyle;
        const butonSizeStyle = {
            width: containerSize,
            height: containerSize
        }
        const icon = useGetIcon<IIconProps>({
            as: TouchableRipple,
            rippleSize:size,
            ...rest, icon: source || iconName || undefined, testID,
            color: iconColor,
            disabled, size,
            containerProps: {
                hitSplot: { top: 10, left: 10, bottom: 10, right: 10 },
                testID: `${testID}-tooltip`,
                accessibilityLabel,
                centered: true,
                disabled,
                borderRadius,
                accessibilityRole: "button",
                backgroundColor,
                ...rippleProps,
                style: [styles.touchable, butonSizeStyle, rippleProps?.style],
                rippleColor,
            }
        });

        const borderStyles = {
            borderWidth,
            borderRadius,
            borderColor,
        };
        return (
            <Surface
                elevation={0}
                ref={ref}
                {...containerProps}
                testID={`${testID}-container`}
                style={[
                    styles.container,
                    borderStyles,
                    disabled && styles.disabled,
                    containerProps?.style,
                    {
                        backgroundColor,
                    },
                    butonSizeStyle
                ]}
            >
                {isLoading ? <ActivityIndicator size={size} color={iconColor} /> : icon}
            </Surface>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        elevation: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
    },
    touchable: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
    },
    disabled: {
        opacity: 0.32,
    },
});
IconButton.displayName = 'IconButton';
export default IconButton;

const getBackgroundColor = ({
    theme,
    customBackgroundColor,
}: {
    disabled?: boolean; theme: ITheme,
    selected?: boolean; customBackgroundColor?: string
}) => {
    if (Colors.isValid(customBackgroundColor)) {
        return customBackgroundColor;
    }
    return undefined;
};
