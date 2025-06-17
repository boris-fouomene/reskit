"use client";
import { useBreakpoints } from "@utils/breakpoints/hooks";
import { IAppBarActionProps, IAppBarActionsProps, IAppBarProps } from "../types";
import { IReactNullableElement } from "@src/types";
import { renderNavItems } from "@components/Nav/utils";
import { cn } from "@utils/cn";
import { defaultStr, isNumber } from "@resk/core/utils";
import { Menu } from "@components/Menu";
import { Icon } from "@components/Icon";
import { FONT_ICONS } from "@components/Icon/Font/icons";

export function AppBarClientActions<Context = unknown>({ context, testID, renderAction, renderExpandableAction, actionClassName, actions: items, viewportWidth, maxVisibleActions, ...props }: IAppBarActionsProps<Context>) {
    const {window:{width:windowWidth},isClientSide } = useBreakpoints();
    testID = defaultStr(testID, "resk-appbar-actions");
    const menuItems: IAppBarActionProps<Context>[] = [];
    const actionCounter = { current: 0 };
    context = Object.assign({}, context);
    const mAction: number = typeof maxVisibleActions === "number" && maxVisibleActions ? Math.trunc(maxVisibleActions) : getAppBarMaxActions(windowWidth, viewportWidth);
    const renderedActions = [];
    const canRenderAction = (level?: number) => {
        if (level) return false;
        return (actionCounter.current <= mAction && mAction > 1) || items?.length === 1;
    };
    const pushAction = (action: IReactNullableElement, item: IAppBarActionProps<Context>, level?: number) => {
        if (canRenderAction(level)) {
            renderedActions.push(level);
            return action;
        }
        if (!level) {
            menuItems.push(item);
        }
        return null;
    };
    const _render = function (renderCb: IAppBarProps<Context>["renderAction"], props: IAppBarActionProps<Context>, index: number): IReactNullableElement {
        if (!props?.level && actionCounter.current <= mAction + 1) {
            actionCounter.current++;
        }
        const itx: IAppBarActionProps<Context> = props;
        return pushAction(typeof renderCb != "function" ? null : renderCb(itx, index), itx, props.level);
    };
    const actions = renderNavItems<Context>({
        context: Object.assign({}, { isAppBar: true }, context),
        items: items,
        ...props,
        itemClassName: cn("appbar-action", actionClassName),
        renderItem: function (props, index) {
            return _render(renderAction, props, index);
        },
        renderExpandableItem: function (props, index) {
            return _render(renderExpandableAction, props, index);
        },
    });
    
    return <>
        {actions}
        {menuItems.length > 0 ? <Menu
            preferedPositionAxis='vertical'
            testID={`${testID}-menu`}
            anchor={menuItems.length ? ({ menu }) => {
                return <Icon.Button
                    size={28}
                    iconName={FONT_ICONS.MORE as any}
                    className="mx-[7px]"
                    onPress={() => {
                        menu?.open();
                    }}
                />
            }: null}
            items={menuItems}
        />: null}
    </>;
}

const getAppBarMaxActions = (windowWidth: number, viewportWidth?: number): number => {
    let iWidth = isNumber(viewportWidth) && viewportWidth > 200 ? viewportWidth : windowWidth - 100;
    return iWidth >= 3000 ? 8 : iWidth >= 2500 ? 7 : iWidth >= 2000 ? 6 : iWidth >= 1600 ? 5 : iWidth >= 1300 ? 4 : iWidth >= 800 ? 2 : iWidth >= 600 ? 1 : 0;
};
