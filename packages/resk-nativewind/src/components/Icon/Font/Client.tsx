"use client";
import { fontsObjects } from "./utils";

import { IFontIconProps } from "../types";
import { pickTouchableProps } from "@utils/touchHandler";
import { cn, normalizeProps } from "@utils/cn";
import { defaultStr, isNonNullString, isNumber } from "@resk/core/utils";
import { iconVariant } from "@variants/icon";
import { FC } from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import { Tooltip } from "@components/Tooltip";


export const DEFAULT_FONT_ICON_SIZE = 20;

export default function ClientFontIcon({ name, variant, containerClassName, title, ref, ...props }: IFontIconProps) {
    const { touchableProps, size, disabled, className, ...restProps } = pickTouchableProps(normalizeProps(props));
    const nameString = defaultStr(name).trim();
    let fontIconName = nameString;
    if (!isNonNullString(nameString)) return null;
    const nameArray = nameString.split("-");
    let IconSet = fontsObjects[""], iconSetName = "MaterialCommunityIcons";
    if ((fontsObjects as any)[nameArray[0]]) {
        iconSetName = nameArray[0];
        IconSet = (fontsObjects as any)[iconSetName];
        nameArray.shift();
        fontIconName = nameArray.join("-");
    }
    const iconClassName = cn(iconVariant(variant), className, "resk-font-icon", "font-icon-set-" + iconSetName, "font-icon-" + fontIconName, "font-icon-real-name-" + nameString,);
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
                name={fontIconName}
            />
        </Tooltip>
    }
    return <Component
        {...restProps}
        {...rP}
        disabled={disabled}
        ref={ref as any}
        name={fontIconName}
        className={cn(iconClassName)}
    />;
}




