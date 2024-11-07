import * as React from 'react';
import {
    StyleSheet,
    ViewStyle,
    View,
    ActivityIndicator,
} from 'react-native';
import { ISurfaceProps, Surface } from '@components/Surface';
import { ITouchableRippleProps, TouchableRipple } from '@components/TouchableRipple';
import { getColors } from "@components/TouchableRipple/utils";
import { IIconProps, IIconSource } from './types';
import { Colors, useTheme } from '@theme/index';
import { useGetIcon } from "./Icon";
import { DEFAULT_FONT_ICON_SIZE } from "./Font";
import { ITheme } from '@theme/types';
import { defaultStr } from '@resk/core';

const PADDING = 4;

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
 * @example
 * // Customizing the container view
 * const buttonProps: IIconButtonProps = {
 *   containerProps: {
 *     elevation: 4,
 *     style: { padding: 10 },
 *   },
 * };
 */
export type IIconButtonProps = IIconProps & {
    /**
     * Background color of the icon container.
     */
    backgroundColor?: string;
    /**
     * Color of the ripple effect.
     */
    rippleColor?: string;

    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean;
    /**
     * Accessibility label for the button. This is read by the screen reader when the user taps the button.
     */
    accessibilityLabel?: string;

    ref?: React.RefObject<View>;
    /**
     * Whether to show a isLoading indicator.
     */
    isLoading?: boolean;

    /**
     * Props for the ripple effect.
     */
    rippleProps?: ITouchableRippleProps;

    /**
     * Props for the container view.
     */
    containerProps?: ISurfaceProps;
};

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
 *       name="check"
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
 *       name="loading"
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
            name,
            source,
            containerProps,
            ...rest
        },
        ref
    ) => {
        const theme = useTheme();
        containerProps = Object.assign({}, containerProps);
        rippleProps = Object.assign({}, rippleProps);
        testID = defaultStr(testID, "RNIconButton");
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
        const buttonSize = size + 2 * PADDING;
        const {
            borderWidth = isLoading ? 0 : 1,
            borderRadius = buttonSize / 2,
            borderColor = isLoading ? undefined : theme.colors.outline,
        } = (StyleSheet.flatten(style) || {}) as ViewStyle;
        const butonSizeStyle = {
            width: buttonSize,
            height: buttonSize
        }
        const icon = useGetIcon<IIconProps>({
            as: TouchableRipple,
            ...rest, icon: name || source || undefined, testID,
            disabled, size,
            containerProps: {
                hitSplot: { top: 10, left: 10, bottom: 10, right: 10 },
                testID: `${testID}_Tooltip`,
                accessibilityLabel,
                centered: true,
                disabled,
                borderRadius,
                accessibilityRole: "button",
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
    return theme.colors.surfaceVariant;
};