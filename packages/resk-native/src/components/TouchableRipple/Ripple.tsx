import {useMemo } from 'react';
import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import { ITouchableRippleProps } from './types';
import { defaultStr } from '@resk/core';
import { getColors } from './utils';
import Theme, { useTheme } from '@theme/index';
import Platform from "@platform";
import useGetRippleContent from "./RippleContent";


const version = parseInt(String(Platform.Version));
const isAndroid = Platform.isAndroid() && (typeof version == "number" ? version >= 21 : true);

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
 * @param {string} [props.testID] - Optional test ID used for testing purposes, defaults to "resk-touchable-ripple".
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
export function TouchableRipple({
    children, disabled, style,
    rippleColor: customRippleColor,
    hoverColor: customHoverColor,
    disableRipple,
    testID, borderRadius,
    rippleDuration,
    shadowEnabled,
    onLayout,
    ref,
    rippleOpacity,
    ...props
} : ITouchableRippleProps){
    const theme = useTheme();
    const { rippleColor, hoverColor } = getColors({ rippleColor: customRippleColor, hoverColor: customHoverColor, theme });
    testID = defaultStr(testID, "resk-touchable-ripple");
    const isRippleDisabled = useMemo(() => {
        return disableRipple || disabled || isAndroid;
    }, [disableRipple, disabled, isAndroid]);
    rippleDuration = typeof rippleDuration == "number" && rippleDuration > 0 ? rippleDuration : 500;
    shadowEnabled = typeof shadowEnabled == "boolean" ? shadowEnabled : false;
    rippleOpacity = typeof rippleOpacity == "number" && rippleOpacity > 0 && rippleOpacity <= 1 ? rippleOpacity : 0.9;
    const { startRipple, rippleContent, onLayout: onRippleLayout } = useGetRippleContent({
        testID,
        rippleColor,
        rippleOpacity,
        rippleDuration,
        disabled,
        disableRipple: isRippleDisabled,
        borderRadius,
    })

    const shadowStyle = useMemo(() => {
        return shadowEnabled ? {
            shadowOffset: {
                height: 1.5,
                width: 0,
            }
        } : undefined;
    }, [shadowEnabled]);
    return <Pressable
        ref={ref}
        {...props}
        disabled={disabled}
        onLayout={(event) => {
            if (typeof onLayout === "function") {
                onLayout(event)
            }
            if (typeof onRippleLayout === "function") {
                onRippleLayout(event);
            }
        }}
        onPress={(event) => {
            if (disabled) return;
            if (isRippleDisabled) {
                if (typeof props.onPress == 'function') {
                    props.onPress(event);
                }
                return;
            }
            if (typeof startRipple === "function") {
                startRipple(event);
            }
            if (typeof props.onPress == 'function') {
                props.onPress(event);
            }
        }}
        style={(state) => {
            const cStyle = typeof style === 'function' ? style(state) : style;
            const isHover = (state as any)?.hovered && !disabled;
            return StyleSheet.flatten([
                styles.container,
                state.pressed && !disabled && rippleColor && { backgroundColor: rippleColor },
                shadowStyle,
                disabled && Theme.styles.disabled,
                typeof borderRadius == "number" && { borderRadius },
                cStyle,
                isHover && hoverColor && { backgroundColor: hoverColor },
            ]);
        }}
        android_ripple={
            disableRipple ? undefined : Object.assign({
                color: rippleColor,
                duration: rippleDuration,
                foreground: Platform.OS === 'android' && Platform.Version >= 28 && !!props?.android_ripple?.borderless
            }, props.android_ripple)
        }
        testID={testID}
    >
        {
            typeof children === "function" ? (state) => {
                return isRippleDisabled ? children(state) : <>
                    {rippleContent}
                    {children(state)}
                </>
            } : isRippleDisabled ? children : <>
                {rippleContent}
                {children}
            </>}
    </Pressable>;
};



const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        position: "relative",
        ...Platform.select({
            web: {
                overflow: "hidden",
            }
        })
        //userSelect: "none",
    },
});

export * from "./utils";
export * from "./types";

TouchableRipple.displayName = "TouchableRipple";