"use client";
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, Switch as RNSwitch, GestureResponderEvent } from "react-native";
import { ISwitchProps } from "./types";
import { useToggleable } from "./utils";
import { Tooltip } from "@components/Tooltip";
import { Text } from "@html/Text";
import switchVariants from "@variants/switch";
import { cn } from "@utils/cn";
import { remapProps } from "nativewind";

export * from "./types";
export * from "./utils";

export const Switch = ({ testID, ...props }: ISwitchProps) => {
    const {
        checked,
        tooltip,
        setChecked,
        toggleStatus,
        getValue,
        setValue,
        label,
        isLabelOnLeftSide,
        checkedValue,
        uncheckedValue,
        defaultValue,
        variant,
        disabled,
        className,
        thumbClassName,
        trackClassName,
        readOnly,
        containerClassName,
        labelClassName,
        ...rest
    } = useToggleable(props);
    const MTestID = typeof testID === 'string' && testID || "resk-switch";
    const variantSwitch = switchVariants(variant);
    const labelContent = <Text testID={`${MTestID}-label`} children={label} className={cn(variantSwitch?.label(), labelClassName)} />;
    return <Tooltip<TouchableOpacityProps> as={TouchableOpacity as any} disabled={disabled || readOnly} tooltip={tooltip} testID={`${MTestID}-container`}
        onPress={(event: GestureResponderEvent) => {
            toggleStatus();
        }}
        className={cn(variantSwitch?.container(), containerClassName)}
    >
        {isLabelOnLeftSide ? labelContent : null}
        <CustomSwitch
            {...rest}
            className={cn(variantSwitch?.base(), className)}
            thumbClassName={cn(variantSwitch?.thumb(), thumbClassName)}
            trackClassName={cn(variantSwitch?.track(), trackClassName)}
            value={checked}
            onValueChange={toggleStatus}
            testID={MTestID}
            disabled={disabled || readOnly}
        />
        {!isLabelOnLeftSide ? labelContent : null}
    </Tooltip>
}
const CustomSwitch = remapProps(RNSwitch, {
    thumbClassName: "thumbColor",
    trackClassName: "trackColor",
});
CustomSwitch.displayName = "Switch.RemapProps";
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
    }
});

Switch.displayName = "Switch"
