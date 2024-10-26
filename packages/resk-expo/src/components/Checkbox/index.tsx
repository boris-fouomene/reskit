import { Platform, Pressable, StyleSheet, GestureResponderEvent } from "react-native";
import RNCheckbox from "expo-checkbox";
import { ICheckboxEvent, ICheckboxProps } from "./types";
import { useTheme } from "@theme/index";
import Tooltip from "@components/Tooltip";
import Label from "@components/Label";
import { useToggleable } from "@components/Switch/utils";

export * from "./types";


export const Checkbox = ({ testID, ...props }: ICheckboxProps) => {
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
    } = useToggleable<ICheckboxEvent>(props);
    const MTestID = typeof testID === 'string' && testID || "RNCheckboxComponent";
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
        <RNCheckbox
            {...rest}
            value={checked}
            onValueChange={toggleStatus}
            color={color}
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

Checkbox.displayName = "Checkbox"