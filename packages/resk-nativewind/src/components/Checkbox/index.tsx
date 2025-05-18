"use client";
import { TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICheckboxProps } from "./types";
import { Tooltip } from "@components/Tooltip";
import { Text } from "@html/Text";
import { useToggleable } from "@components/Switch/utils";
import FontIcon from "@components/Icon/Font";
import { isNonNullString } from "@resk/core/utils";
import { cn } from "@utils/cn";

export * from "./types";

export function Checkbox({ testID, checkedIconName, uncheckedIconName, checkedClassName, uncheckedClassName, checkedVariant, uncheckedVariant, style, ...props }: ICheckboxProps) {
    const {
        checked,
        tooltip,
        labelClassName,
        setChecked,
        toggleStatus,
        getValue,
        setValue,
        label,
        className,
        isLabelOnLeftSide,
        checkedValue,
        uncheckedValue,
        defaultValue,
        disabled,
        readOnly,
        containerClassName,
        ...rest
    } = useToggleable(props);
    const handleOnPress = (event: GestureResponderEvent) => {
        toggleStatus();
    };
    const iconChecked = isNonNullString(checkedIconName) ? checkedIconName : FontIcon.CHECKED;
    const iconUnchecked = isNonNullString(uncheckedIconName) ? uncheckedIconName : FontIcon.UNCHECKED;
    const MTestID = typeof testID === 'string' && testID || "resk-checkbox";
    const labelContent = <Text testID={`${MTestID}-label`} className={cn(labelClassName)} children={label} />;
    return <Tooltip
        as={TouchableOpacity}
        disabled={disabled || readOnly}
        tooltip={tooltip}
        testID={`${MTestID}`}
        accessibilityRole="checkbox"
        accessibilityState={{ disabled, checked }}
        onPress={handleOnPress}
        className={cn(containerClassName)}
    >
        {isLabelOnLeftSide ? labelContent : null}
        <FontIcon
            {...rest}
            disabled={disabled}
            accessibilityRole="checkbox"
            className={cn(checked ? checkedClassName : uncheckedClassName)}
            variant={checked ? checkedVariant : uncheckedVariant}
            name={(checked ? iconChecked as never : iconUnchecked as never)}
        />
        {!isLabelOnLeftSide ? labelContent : null}
    </Tooltip>
}

Checkbox.displayName = "Checkbox"