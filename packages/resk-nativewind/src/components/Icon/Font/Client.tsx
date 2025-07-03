"use client";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import Octicons from "react-native-vector-icons/Octicons";
import { IFontIconProps } from "../types";
import { pickTouchableProps } from "@utils/touchHandler";
import { cn, normalizeProps } from "@utils/cn";
import { defaultStr, isNonNullString, isNumber } from "@resk/core/utils";
import iconVariants from "@variants/icon";
import { FC } from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import { Tooltip } from "@components/Tooltip";


export const DEFAULT_FONT_ICON_SIZE = 20;

export default function ClientFontIcon({ name, variant, containerClassName, title, ref, ...props }: IFontIconProps) {
    const { touchableProps, size, disabled, className, ...restProps } = pickTouchableProps(normalizeProps(props));
    const nameString = defaultStr(name).trim();
    let iconName = nameString;
    if (!isNonNullString(nameString)) return null;
    const nameArray = nameString.split("-");
    let iconSet = "";
    let IconSet = MaterialCommunityIcons, iconSetPrefix = "";
    if ((fontsObjects as any)[nameArray[0]]) {
        IconSet = (fontsObjects as any)[iconSetPrefix];
        iconSet = nameArray[0];
        nameArray.shift();
        iconName = nameArray.join("-");
    }
    const iconClassName = cn(iconVariants(variant), className, "font-icon", ("font-icon-" + iconName), ("font-icon-raw-name-" + nameString), ("font-icon-set-" + iconSet));
    const iconSize = isNumber(size) && size > 0 ? size : DEFAULT_FONT_ICON_SIZE;
    const rP = iconSize ? { size } : {};
    const Component: FC<IconProps & { ref?: any }> = IconSet as unknown as FC<IconProps>
    if (touchableProps || title) {
        return <Tooltip
            title={title}
            disabled={disabled}
            {...touchableProps}
            className={cn("shrink-0 grow-0", containerClassName)}>
            <Component
                disabled={disabled}
                {...restProps}
                ref={ref as any}
                {...rP}
                className={iconClassName}
                name={iconName}
            />
        </Tooltip>
    }
    return <Component
        {...restProps}
        {...rP}
        disabled={disabled}
        ref={ref as any}
        name={iconName}
        className={cn(iconClassName)}
    />;
}


const fontsObjects = {
    "": MaterialCommunityIcons,
    antd: AntDesign,
    fa6: FontAwesome6,
    ionic: Ionicons,
    material: MaterialIcons,
    feather: Feather,
    foundation: Foundation,
    octicons: Octicons,
}

