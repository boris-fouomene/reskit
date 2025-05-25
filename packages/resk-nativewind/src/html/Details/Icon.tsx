"use client";
import { IHtmlDetailsIconProps } from "./types";
import FontIcon from "@components/Icon/Font";
import { useEffect, useId } from "react";
import { Div } from "../Div";
import { cn } from "@utils/cn";
import allVariants from "@variants/all";
import { addClassName, removeClassName, defaultStr } from "@resk/core/utils";
import { IFontIconName } from "@components/Icon/types";

export function DetailsIcon({ openedIcon, closedIcon, toggleOpen, open, testID, className, ...rest }: IHtmlDetailsIconProps & { toggleOpen?: () => void; open: boolean; }) {
    const isNative = typeof toggleOpen == "function";
    const iconId = useId();
    const iconClassName = cn(className, "details-icon");
    const hiddenClassName = cn("opacity-0", "hidden", allVariants({ hidden: true }));
    useEffect(() => {
        if (typeof document !== "undefined" && document) {
            const openIcon = document.querySelector(`#${iconId}-opened`);
            const closeIcon = document.querySelector(`#${iconId}-closed`);
            const icon = openIcon || closeIcon;
            if (icon) {
                const details = icon.closest("details");
                if (details) {
                    details.addEventListener("toggle", (event) => {
                        const openIcon = document.querySelector(`#${iconId}-opened`);
                        const closeIcon = document.querySelector(`#${iconId}-closed`);
                        const isOpen = details.open;
                        if (isOpen) {
                            addClassName(closeIcon, hiddenClassName);
                            removeClassName(openIcon, hiddenClassName);
                        } else {
                            addClassName(openIcon, hiddenClassName);
                            removeClassName(closeIcon, hiddenClassName);
                        }
                    });
                }
            }
        }
    }, []);
    const iconProps = Object.assign({}, { size: 20 }, rest);
    openedIcon = defaultStr(openedIcon, "chevron-up") as IFontIconName;
    closedIcon = defaultStr(closedIcon, "chevron-down") as IFontIconName;
    if (isNative) {
        return <FontIcon
            id={iconId}
            {...iconProps}
            name={(open ? openedIcon : closedIcon) as IFontIconName}
            className={iconClassName}
            testID={testID}
        />
    }
    return <Div asHtmlTag="span" testID={testID + "-icons-container"} id={iconId} className={cn("details-icon-container")}>
        {<FontIcon
            {...iconProps}
            name={openedIcon as IFontIconName}
            className={cn(iconClassName, !open && hiddenClassName)}
            id={iconId + "-opened"}
            testID={testID + "-opened"}
        />}
        {<FontIcon
            {...iconProps}
            name={closedIcon as IFontIconName}
            className={cn(iconClassName, open && hiddenClassName)}
            id={iconId + "-closed"}
            testID={testID + "-closed"}
        />}
    </Div>;
}

DetailsIcon.displayName = "Html.Details.Icon";