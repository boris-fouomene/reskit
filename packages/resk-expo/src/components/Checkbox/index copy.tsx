import { TouchableOpacity, Pressable, StyleSheet, Image, GestureResponderEvent, Animated } from "react-native";
import { ICheckboxProps } from "./types";
import { Tooltip } from "@components/Tooltip";
import Label from "@components/Label";
import { useToggleable } from "@components/Switch/utils";
import FontIcon from "@components/Icon/Font";
import { isNonNullString } from "@resk/core";
import { Colors, useTheme } from "@theme/index";
import { useRef, useState } from "react";
import Platform from "@platform/index";

export * from "./types";

/**
 * A customizable Checkbox component that supports tooltip, labels, and toggle functionality.
 *
 * This component uses the `Checkbox` from the `expo-checkbox` library and provides an enhanced 
 * user interface with optional tooltips and labels. It allows for easy integration into forms 
 * and other UI elements while supporting various states such as checked, unchecked, disabled, 
 * and read-only.
 *
 * @param {object} props - The properties for the Checkbox component.
 * @param {string} [props.testID] - Optional test identifier for testing purposes. Defaults to "resk-checkbox".
 * @param {string} [props.tooltip] - Optional tooltip text displayed when the user hovers over the checkbox.
 * @param {object} [props.labelProps] - Additional properties for the label component.
 * @param {string} [props.color] - The color of the checkbox when checked.
 * @param {string} [props.label] - The text label associated with the checkbox.
 * @param {any} [props.checkedValue] - The value representing the checked state.
 * @param {any} [props.uncheckedValue] - The value representing the unchecked state.
 * @param {any} [props.defaultValue] - The default value of the checkbox.
 * @param {boolean} [props.disabled] - Flag to indicate if the checkbox is disabled.
 * @param {boolean} [props.readOnly] - Flag to indicate if the checkbox is read-only.
 * @param {object} [rest] - Additional props passed to the RNCheckbox component.
 *
 * @returns {JSX.Element} - Returns a JSX element representing the Checkbox component.
 *
 * @example
 * // Usage example of the Checkbox component
 * import { Checkbox } from './path/to/Checkbox';
 *
 * const MyComponent = () => {
 *   return (
 *     <Checkbox
 *       defaultValue={"checked"}
 *       uncheckedValue="unchecked"
 *       checkedValue={"checked"}
 *       uncheckedValue={"unchecked"}
 *       label="Enable Notifications"
 *       tooltip="Toggle to receive notifications"
 *       color="#4CAF50"
 *       disabled={false}
 *       onChange={({value,event,checked})=>{
 *            console.log(value," is value");//display "checked" or "unchecked"
 *       }}
 *     />
 *   );
 * };
 *
 * @see [Expo Checkbox Documentation](https://docs.expo.dev/versions/latest/sdk/checkbox/) 
 * for more information on the underlying RNCheckbox component.
 */
export const Checkbox = ({ testID, size, checkedIcon, uncheckedColor, uncheckedIcon, iconProps, style, ...props }: ICheckboxProps) => {
    const {
        checked,
        tooltip,
        labelProps,
        setChecked,
        toggleStatus,
        getValue,
        setValue,
        color,
        label,
        isLabelOnLeftSide,
        disabledStyle,
        readOnlyStyle,
        checkedValue,
        uncheckedValue,
        defaultValue,
        checkedColor,
        onTintColor,
        thumbTintColor,
        disabled,
        readOnly,
        containerProps,
        ...rest
    } = useToggleable<GestureResponderEvent>(props);
    const theme = useTheme();
    checkedIcon = isNonNullString(checkedIcon) ? checkedIcon : FontIcon.CHECKED;
    uncheckedIcon = isNonNullString(uncheckedIcon) ? uncheckedIcon : FontIcon.UNCHECKED;
    size = typeof size === 'number' && size ? size : 25;
    iconProps = Object.assign({}, iconProps);
    const MTestID = typeof testID === 'string' && testID || "resk-checkbox";
    const labelContent = <Label testID={`${MTestID}-label`} {...labelProps} style={[styles.label, labelProps.style]} children={label} />;
    uncheckedColor = Colors.isValid(uncheckedColor) ? uncheckedColor : theme.colors.secondary;
    const scaleValue = useRef(new Animated.Value(0)).current;
    const handleOnPress = (event: GestureResponderEvent) => {
        toggleStatus();
        const newCheckedState = !checked;
        Animated.spring(scaleValue, {
            toValue: newCheckedState ? 1 : 0,
            useNativeDriver: Platform.isMobileNative(),
        }).start();
    };
    const animatedStyle = {
        transform: [{ scale: scaleValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }],
        backgroundColor: scaleValue.interpolate({
            inputRange: [0, 1],
            outputRange: [uncheckedColor as string, checkedColor as string],
        }),
    };
    return <Tooltip
        as={TouchableOpacity} disabled={disabled || readOnly}
        tooltip={tooltip} testID={`${MTestID}`}
        accessibilityRole="checkbox"
        accessibilityState={{ disabled, checked }}
        {...rest}
        style={[styles.container, disabledStyle, readOnlyStyle, style]}
        onPress={handleOnPress}
    >
        {isLabelOnLeftSide ? labelContent : null}
        <Animated.View style={[styles.checkedIconContainer, { borderRadius: size / 5, width: size, height: size }, animatedStyle]}>
            {checked ? <Image
                style={styles.checkedIcon}
                source={{
                    uri: checkedIconSource,
                    width: 80 * size / 100,
                    height: 80 * size / 100
                }} />
                : null}
        </Animated.View>
        {!isLabelOnLeftSide ? labelContent : null}
    </Tooltip>
}


const useAnimation = () => {
    const [animationValue] = useState(new Animated.Value(1));
    const animation = (
        value: number,
        velocity: number,
        bounciness: number,
    ) => {
        Animated.spring(animationValue, {
            toValue: value,
            velocity,
            bounciness,
            useNativeDriver: true,
        }).start();
    };

    const syntheticAnimation = (
        bounceEffectIn: number,
        bounceEffectOut: number,
        bounceVelocityOut: number,
        bouncinessOut: number,
    ) => {
        Animated.sequence([
            Animated.timing(animationValue, {
                toValue: bounceEffectIn,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.spring(animationValue, {
                toValue: bounceEffectOut,
                velocity: bounceVelocityOut,
                bounciness: bouncinessOut,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return {
        animationValue,
        animation,
        syntheticAnimation,
    };
};
const checkedIconSource = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkCQsPHRvlRfSJAAABcUlEQVRo3u2Wuy4FURSG/4nKrVEIoRalgii1GoU3UGi9gUIkJ5n2iE7jOSTEC5xKMaEUUUiEAqHxKUhOzmXua++t2H87s9b3rT3J7CXFxMQETuITxpb2taoPXek0efY8KQkp/Tyy7hvfZTCvbPrEnzCaFzZC4gGeWJ5wj1dXBzkPpzUVbvrfPITFw2dYPGQu8d1SPByGxfeYDInPWIj4iI/4/4UnYYU1Zp3hb5gvarLHPQBfnDPnH58OvHzLkl98Z6TgrpqCzbfvjC2qoGAz/U5uYYmCCV7iuqC4QMEIL/Fe2CBHwQwv8VbSZIyCIV7isrTRkIIpXmKb7zoKxnhJ4qhCwz8FB3hJ4riagsMbL+dnNKxw5mD6WqfgZnpDhbbrRksFi22nhYLVstVQwXLXa6BgvWrWVHCx6dZQyFg0x9dQcIWvqOASX0HBNb5EwQe+QMEXPkfBJ36Mgm+8NLAvNL3vWyvsckGPlJkg+JiYGHf5Abz2pvBsy0kqAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA5LTExVDE1OjI5OjI3KzAwOjAwWMpYYAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wOS0xMVQxNToyOToyNyswMDowMCmX4NwAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC";
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: "flex-start"
    },
    label: {
        userSelect: "text",
        marginHorizontal: 7,
    },
    icon: {
    },
    checkedIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    checkedIcon: {
        alignSelf: "center",
    }
});

Checkbox.displayName = "Checkbox";

