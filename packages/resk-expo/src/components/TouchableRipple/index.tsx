import { defaultStr } from '@resk/core';
import React from 'react';
import {
    Animated as RNAnimated,
    StyleSheet,
    Pressable,
    View,
    PressableProps
} from 'react-native';
import { Colors, useTheme } from '@theme';
import platform from '@platform/index';

const useNativeDriver = platform.isMobileNative();
/**
 * Interface representing the props for the `TouchableRipple` component.
 * This interface extends the standard `PressableProps` from React Native,
 * allowing for all standard pressable properties alongside custom props specific 
 * to the ripple effect functionality.
 *
 * @interface ITouchableRippleProps
 * 
 * @extends PressableProps
 * 
 * @property {string} [rippleColor] - Specifies the color of the ripple effect. 
 * If not provided, it defaults to a semi-transparent black color 
 * ('rgba(0, 0, 0, 0.12)'). This property allows for customization 
 * of the ripple effect to match the application's theme.
 * 
 * @example
 * ```tsx
 * <TouchableRipple 
 *   onPress={() => console.log('Pressed!')}
 *   rippleColor="rgba(0, 0, 0, 0.12)"
 *   hoverColor="#ffffff"
 * >
 *   <Text>Click me!</Text>
 * </TouchableRipple>
 * ```
 * 
 * @property {string} [hoverColor] - Defines the background color of the 
 * component when it is hovered over. The default value is 'transparent'.
 * This property can be used to provide visual feedback to the user 
 * when the component is interacted with.
 * 
 * @example
 * ```tsx
 * <TouchableRipple 
 *   onPress={() => {}}
 *   rippleColor="rgba(255, 0, 0, 0.12)"
 *   hoverColor="#f5f5f5"
 *   style={{ borderRadius: 8 }}
 * >
 *   <Text>Styled Button</Text>
 * </TouchableRipple>
 * ```
 * 
 * @example
 * Here’s an example of how to use the `TouchableRipple` component with 
 * both ripple and hover colors customized:
 * 
 * ```tsx
 * const MyButton = () => (
 *   <TouchableRipple 
 *     onPress={() => alert('Button Pressed!')}
 *     rippleColor="rgba(0, 150, 136, 0.6)"
 *     hoverColor="#e0f7fa"
 *     style={{ padding: 10, borderRadius: 5 }}
 *   >
 *     <Text style={{ color: '#00796b' }}>Press Me!</Text>
 *   </TouchableRipple>
 * );
 * ```
 * 
 * @note 
 * The `TouchableRipple` component is designed to provide a visually appealing 
 * interaction experience by implementing a ripple effect. Ensure that the 
 * colors used for `rippleColor` and `hoverColor` maintain good contrast 
 * with the text and background for accessibility purposes.
 */
export interface ITouchableRippleProps extends PressableProps {
    /** Color of the ripple effect. Default is 'rgba(0, 0, 0, 0.12)' */
    rippleColor?: string;
    /** Background color of the component. Default is 'transparent' */
    hoverColor?: string;
}

/**
 * A custom `TouchableRipple` component that implements Material Design's ripple effect 
 * without any third-party dependencies. This component enhances user interaction 
 * by providing visual feedback when the user presses and holds the button.
 * 
 * @component
 * 
 * @param {ITouchableRippleProps} props - The properties for the component.
 * 
 * @param {React.ReactNode | ((state: PressableState) => React.ReactNode)} props.children - 
 * The content to be displayed inside the button. Can be a React node or a function 
 * that receives the current state of the button (pressed, hovered) and returns 
 * the content to render.
 * 
 * @param {(event:GestureResponderEvent) => void} [props.onPress] - Callback function that is called when the button is pressed. 
 * This function should contain the logic to be executed upon the press event.
 * 
 * @param {string} [props.rippleColor] - Custom color for the ripple effect. 
 * Defaults to a semi-transparent version of the theme's onSurface color if not provided.
 * 
 * @param {string} [props.hoverColor] - Custom background color when the button is hovered over. 
 * Defaults to a faded version of the ripple color if not specified.
 * 
 * @param {boolean} [props.disabled=false] - If true, disables the button, preventing any interaction.
 * 
 * @param {string} [props.testID] - Optional test ID used for testing purposes, defaults to "RNTouchableRipple".
 * 
 * @param {React.Ref} ref - A ref that can be used to access the underlying Pressable component.
 * 
 * @returns {JSX.Element} A `Pressable` component with ripple effect and hover functionality.
 * 
 * @example
 * Basic usage of the `TouchableRipple` component:
 * ```tsx
 * <TouchableRipple onPress={() => alert('Button Pressed!')}>
 *   <Text>Press Me!</Text>
 * </TouchableRipple>
 * ```
 * 
 * @example
 * Customizing the ripple and hover colors:
 * ```tsx
 * <TouchableRipple 
 *   onPress={() => console.log('Custom Button Pressed!')}
 *   rippleColor="rgba(0, 150, 136, 0.6)"
 *   hoverColor="#e0f7fa"
 * >
 *   <Text style={{ color: '#00796b' }}>Custom Styled Button</Text>
 * </TouchableRipple>
 * ```
 * 
 * @note 
 * The ripple effect is animated using the `Animated` API from React Native. 
 * The component uses the `Pressable` component to handle touch interactions, 
 * providing built-in support for hover and press states.
 * 
 * @example
 * Using a function as children to customize rendering based on the button state:
 * ```tsx
 * <TouchableRipple 
 *   onPress={(event) => alert('State-based Button Pressed!')}
 * >
 *   {(state) => (
 *     <Text style={{ color: state.pressed ? 'white' : 'black' }}>
 *       {state.pressed ? 'Pressed!' : 'Press Me!'}
 *     </Text>
 *   )}
 * </TouchableRipple>
 * ```
 */
export const TouchableRipple = React.forwardRef<View, ITouchableRippleProps>(({
    children,
    onPress,
    rippleColor: customRippleColor,
    hoverColor: customHoverColor,
    style,
    disabled = false,
    testID,
    ...props
}, ref) => {
    const theme = useTheme();
    testID = defaultStr(testID, "RNTouchableRipple");
    const rippleColor = Colors.isValid(customRippleColor) ? customRippleColor : Colors.setAlpha(theme.colors.onSurface, 0.12)
    const hoverColor = Colors.isValid(customHoverColor) ? customHoverColor : Colors.fade(rippleColor as string, 0.5);
    const animated = new RNAnimated.Value(1);
    const fadeIn = () => {
        RNAnimated.timing(animated, {
            toValue: 0.4,
            duration: 100,
            useNativeDriver,
        }).start();
    };
    const fadeOut = () => {
        RNAnimated.timing(animated, {
            toValue: 1,
            duration: 200,
            useNativeDriver,
        }).start();
    };
    const rippleContent = null;
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            ref={ref}
            {...props}
            onPressOut={(event) => {
                if (disabled) return;
                fadeOut();
                //handlePressOut(event);
                if (typeof props.onPressOut == "function") {
                    props.onPressOut(event);
                }
            }}
            onPressIn={(event) => {
                if (disabled) return;
                fadeIn();
                //handlePressIn(event);
                if (typeof props.onPressIn == "function") {
                    props.onPressIn(event);
                }
            }}
            testID={testID}
            style={(state) => [
                typeof style === 'function' ? style(state) : style,
                styles.container,
                (state as any)?.hovered && !disabled && hoverColor && { backgroundColor: hoverColor },
                state.pressed && !disabled && rippleColor && { backgroundColor: rippleColor },
            ]}
        >
            {typeof children === "function" ? (state) => {
                return <>
                    {rippleContent}
                    {children(state)}
                </>
            } : <>
                {rippleContent}
                {children}
            </>}
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        alignSelf: "flex-start",
        userSelect: "none",
    },
    ripple: {
        ...StyleSheet.absoluteFillObject,
    },
});

TouchableRipple.displayName = "TouchableRipple";