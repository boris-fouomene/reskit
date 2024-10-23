import { Platform, Switch as RNSwitch, SwitchChangeEvent } from "react-native";
import { ISwitchProps } from "./types";
import { useToggleable } from "./utils";
import { useTheme } from "@theme/index";


export const Switch = (props: ISwitchProps) => {
    const theme = useTheme();
    const {
        checked,
        tooltip,
        setChecked,
        toggleStatus,
        getValue,
        setValue,
        label, isLabelOnLeftSide,
        disabledStyle,
        readOnlyStyle,
        checkedValue,
        uncheckedValue,
        defaultValue,
        checkedColor,
        onTintColor,
        thumbTintColor,
        disabled,
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
    return <RNSwitch
        {...rest}
        value={checked}
        onValueChange={(e) => {
            console.log(e, " is value changedddd");
            setChecked(e);
        }}
        onChange={(event) => {
            console.log(event, " is evvvvvvvvvvvvvvvv");
            toggleStatus(event);
        }}
        {...switchProps}
    />
}

export default Switch