import { Animated, StyleSheet } from 'react-native';
import { defaultStr, isNonNullString } from "@resk/core";
import Theme, { useTheme } from "@theme";
import Label, { ILabelProps } from '@components/Label';
import isValidElement from '@utils/isValidElement';
import { useEffect } from 'react';
import platform from '@platform/index';


/**
 * The `HelperText` component displays a helper text or error message below 
 * an input field. It can be customized to show or hide based on the `visible` 
 * prop and can change color based on the `error` prop.
 *
 * @param {IHelperTextProps} props - The properties for the `HelperText` component.
 * @param {boolean} [props.visible=true] - Determines whether the helper text is visible.
 * @param {boolean} [props.error=false] - Specifies if the helper text represents an error.
 * @param {string} [props.color] - Custom color for the helper text.
 * @param {React.ReactNode} [props.children] - The text or element to be displayed.
 * @param {IStyle} [props.style] - Additional styles for the helper text.
 * 
 * @returns {JSX.Element | null} The rendered component or null if not visible.
 *
 * @example
 * Here’s an example of how to use the `HelperText` component:
 * 
 * ```tsx
 * import React from 'react';
 * import { View } from 'react-native';
 * import HelperText from './HelperText'; // Adjust the import path as necessary
 * 
 * const MyComponent = () => {
 *   return (
 *     <View>
 *       <HelperText visible={true} error={true}>
 *         This is an error message.
 *       </HelperText>
 *     </View>
 *   );
 * };
 * 
 * export default MyComponent;
 * ```
 */
export function HelperText({ visible = true, testID, color, style, error, ...rest }: IHelperTextProps) {
    const theme = useTheme();
    const useNativeDriver = platform.isNative();
    // Animation value for opacity
    const opacity = new Animated.Value(visible ? 1 : 0);
    testID = defaultStr(testID, "resk-helper-text");
    useEffect(() => {
        // Animate fade in/out based on visibility
        if (visible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver,
            }).start();
        }
    }, [visible, opacity]);
    return <Animated.View testID={testID + "-container"} style={[{ opacity }, !visible && theme.styles.hidden]}>
        <Label
            {...rest}
            testID={testID}
            color={error ? theme.colors.error : color}
            style={[styles.padding, error && { color: theme.colors.error }, style,
            rest.disabled ? theme.styles.disabled : undefined]}
        />
    </Animated.View>
}

/**
 * The `IHelperTextProps` interface defines the properties for the `HelperText` component.
 * It extends the standard properties of the `Label` component, allowing for all typical 
 * `Label` properties to be utilized, while also adding custom functionality specific 
 * to the `HelperText`.
 *
 * @interface IHelperTextProps
 * @extends ILabelProps
 * 
 * @property {boolean} [visible=true] - Determines whether the helper text is visible.
 * If set to `false`, the helper text will not be rendered.
 * @default true
 * @example
 * // Example of using the visible prop
 * <HelperText visible={true}>This helper text is visible.</HelperText>
 * 
 * @property {boolean} [error=false] - Specifies if the helper text represents an error.
 * If set to `true`, the text color will change to the error color defined in the theme.
 * @default false
 * @example
 * // Example of using the error prop
 * <HelperText error={true}>This is an error message.</HelperText>
 * 
 * @property {string} [color] - Optional. Custom color for the helper text. If not provided,
 * the default color will be used based on the error state or theme.
 * @example
 * // Example of using the color prop
 * <HelperText color="blue">This helper text is blue.</HelperText>
 */
export type IHelperTextProps = ILabelProps & {
    /**
     * Determines whether the helper text is visible.
     * @default true
     * @example true
     */
    visible?: boolean;

    /**
     * Specifies if the helper text represents an error.
     * If true, the text color will change to the error color.
     * @default false
     * @example true
     */
    error?: boolean;

    /**
     * Optional custom color for the helper text.
     */
    color?: string;
};

const styles = StyleSheet.create({
    padding: {
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 5,
    },
});