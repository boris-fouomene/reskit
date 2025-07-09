"use client";
import { IHtmlDetailsIconProps } from "./types";
import FontIcon from "@components/Icon/Font";
import { useEffect, useId } from "react";
import { Div } from "../Div";
import { cn } from "@utils/cn";
import { commonVariant } from "@variants/common";
import { addClassName, removeClassName, defaultStr } from "@resk/core/utils";
import { IFontIconName } from "@components/Icon/types";

/**
 * A component that renders an icon that can be used to toggle a `<details>` element.
 * It can either be used as a native icon that is rendered directly inside the `<details>` element
 * or as a custom icon that is rendered separately.
 * If the `toggleOpen` property is provided, the component will render a native icon that can be used
 * to toggle the `<details>` element. If the `toggleOpen` property is not provided, the component will
 * render a custom icon that can be used to toggle the `<details>` element.
 * The `open` property is used to determine whether the icon should be rendered as an opened or closed icon.
 * The `openedIcon` and `closedIcon` properties are used to customize the appearance of the icon.
 * @param {IHtmlDetailsIconProps & { toggleOpen?: () => void; open: boolean; }} props
 * @returns {JSX.Element}
 */
export function DetailsIcon({ openedIcon, closedIcon, toggleOpen, open, testID, className, ...rest }: IHtmlDetailsIconProps & { toggleOpen?: () => void; open: boolean; }) {
    const isNative = typeof toggleOpen == "function";
    const iconId = useId();
    const iconClassName = cn(className, "details-icon");
    const hiddenClassName = cn("opacity-0", "hidden", commonVariant({ hidden: true }));
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
    openedIcon = defaultStr(openedIcon, "chevron-down") as IFontIconName;
    closedIcon = defaultStr(closedIcon, "chevron-right") as IFontIconName;
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