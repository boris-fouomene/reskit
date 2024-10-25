import { Platform, Pressable, StyleSheet, Switch as RNSwitch, SwitchChangeEvent, GestureResponderEvent } from "react-native";
import { ISwitchProps } from "./types";
import { useToggleable } from "./utils";
import { useTheme } from "@theme/index";
import Tooltip from "@components/Tooltip";
import Label from "@components/Label";

export * from "./types";
export * from "./utils";

export const Switch = ({ testID, ...props }: ISwitchProps) => {
    const theme = useTheme();
    const {
        checked,
        tooltip,
        labelProps,
        setChecked,
        toggleStatus,
        getValue,
        setValue,
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
    } = useToggleable<SwitchChangeEvent>(props);
    const switchProps = Platform.OS === 'web'
        ? {
            activeTrackColor: onTintColor,
            thumbColor: thumbTintColor,
            activeThumbColor: checkedColor,
        }
        : {
            thumbColor: thumbTintColor,
            trackColor: {
                true: onTintColor,
                false: onTintColor,
            },
        };
    const MTestID = typeof testID === 'string' && testID || "RNSwitchComponent";
    const labelContent = <Label testID={`${MTestID}_Label`} {...labelProps} style={[styles.label, labelProps.style]} children={label} />;
    return <Tooltip as={Pressable} disabled={disabled || readOnly} tooltip={tooltip} testID={`${MTestID}_Container`} {...containerProps} style={[styles.container, disabledStyle, readOnlyStyle, containerProps.style]}
        onPress={(event: GestureResponderEvent) => {
            if (typeof containerProps.onPress == "function") {
                containerProps.onPress(event);
            }
            toggleStatus();
        }}
    >
        {isLabelOnLeftSide ? labelContent : null}
        <RNSwitch
            {...rest}
            value={checked}
            onValueChange={toggleStatus}
            {...switchProps}
            testID={MTestID}
            disabled={disabled || readOnly}
        />
        {!isLabelOnLeftSide ? labelContent : null}
    </Tooltip>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: "flex-start"
    },
    label: {
        userSelect: "text",
    }
});

Switch.displayName = "Switch"