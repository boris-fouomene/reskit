"use client";
import { useDimensions } from "@utils/dimensions/hooks";
import { IAppBarActionProps, IAppBarActionsProps } from "../types";
import { IReactNullableElement } from "@src/types";
import { isNumber } from "@resk/core/utils";
import { Menu } from "@components/Menu";
import { FONT_ICONS, Icon } from "@components/Icon";
import { renderActions } from "./utils";
import { cn } from "@utils/cn";
import { isValidElement, useMemo } from "react";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { Div } from "@html/Div";

export function AppBarClientActions<Context = unknown>({ context, className, menuAnchorClassName, menuAnchorIconProps, renderAction, renderExpandableAction, hydrationFallback, testID, actionClassName, actionMenuItemClassName, actions: items, viewportWidth, maxVisibleActions, ...props }: IAppBarActionsProps<Context>) {
    const { window: { width: windowWidth }, isHydrated } = useDimensions();
    const mAction: number = typeof maxVisibleActions === "number" && maxVisibleActions ? Math.trunc(maxVisibleActions) : getAppBarMaxActions(windowWidth, viewportWidth);
    const { actions, menuItems } = useMemo(() => {
        const actionCounter = { current: 0 };
        const menuItems: IAppBarActionProps<Context>[] = [];
        const actions: IReactNullableElement[] = [];
        renderActions<Context>({
            actions: items,
            context,
            ...props,
            renderAction,
            renderExpandableAction,
            testID,
            actionMutator: function (renderer, props, index): IReactNullableElement {
                const { level } = props;
                if (!level && actionCounter.current <= mAction + 1) {
                    actionCounter.current++;
                }
                const canRenderAction = !level && (actionCounter.current <= mAction && mAction > 1) || items?.length === 1;
                const canAddAction = canRenderAction;
                const canAddMenu = !canRenderAction && !level;
                props.className = cn(canAddAction && cn("appbar-action flex-none", actionClassName), canAddMenu && cn("appbar-action-menu-item", actionMenuItemClassName));
                const renderedAction = (renderer as any)(props, index);
                if (!renderedAction) return null;
                if (canAddAction) {
                    actions.push(renderedAction);
                } else if (canAddMenu) {
                    menuItems.push(props);
                }
                return null;
            },
        });
        return { actions, menuItems }
    }, [mAction, items, renderAction, renderExpandableAction, actionClassName, actionMenuItemClassName]);
    if (!isHydrated) {
        if (isValidElement(hydrationFallback)) {
            return hydrationFallback;
        }
        return <ActivityIndicator size="small" className="flex-none" />;
    }
    return <Div className={cn("appbar-actions", className, "flex flex-row items-center grow-0 justify-start")}>
        {actions}
        {menuItems.length ? <Menu
            preferredPositionAxis='vertical'
            testID={`${testID}-menu`}
            className={cn("appbar-menu")}
            anchor={({ menu }) => {
                return <Icon.Button
                    size={28}
                    fontIconName={FONT_ICONS.MORE as any}
                    {...menuAnchorIconProps}
                    className={cn("flex-none mx-[7px]", menuAnchorClassName, menuAnchorIconProps?.className)}
                    onPress={() => {
                        menu?.open();
                    }}
                />
            }}
            items={menuItems}
        /> : null}
    </Div>;
}

const getAppBarMaxActions = (windowWidth: number, viewportWidth?: number): number => {
    let iWidth = isNumber(viewportWidth) && viewportWidth > 200 ? viewportWidth : windowWidth - 100;
    return iWidth >= 3000 ? 8 : iWidth >= 2500 ? 7 : iWidth >= 2000 ? 6 : iWidth >= 1600 ? 5 : iWidth >= 1300 ? 4 : iWidth >= 800 ? 2 : iWidth >= 600 ? 1 : 0;
};
