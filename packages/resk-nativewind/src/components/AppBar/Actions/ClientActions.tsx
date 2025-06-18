"use client";
import { useBreakpoints } from "@utils/breakpoints/hooks";
import { IAppBarActionProps, IAppBarActionsProps } from "../types";
import { IReactNullableElement } from "@src/types";
import { defaultStr, isNumber } from "@resk/core/utils";
import { useId, useRef } from "react";
import { Menu } from "@components/Menu";
import { FONT_ICONS, Icon } from "@components/Icon";
import { renderActions } from "./utils";
import { isNextJs } from "@platform/isNext";
import { cn } from "@utils/cn";
import { Div } from "@html/Div";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { classes } from "@variants/classes";

export function AppBarClientActions<Context = unknown>({ context, testID, actionClassName, actions: items, viewportWidth, maxVisibleActions, ...props }: IAppBarActionsProps<Context>) {
    const {window:{width:windowWidth},isClientSide} = useBreakpoints();
    testID = defaultStr(testID, "resk-appbar-actions");
    const id = useId();
    const itemsCountRef = useRef<number>(0);
    itemsCountRef.current = 0;
    const mAction: number = typeof maxVisibleActions === "number" && maxVisibleActions ? Math.trunc(maxVisibleActions) : getAppBarMaxActions(windowWidth, viewportWidth);
    const actionCounter = { current: 0 };
    const menuItems: IAppBarActionProps<Context>[] = [];
    const actions : IReactNullableElement[] = []; 
    const computedClassName = "appbar-action-"+id;
    const isNext = isNextJs();
    const menuAnchorId = `${id}-menu-anchor`;
    const menuId = `${id}-menu`;
    const activityIndicatorId = `${id}-activity-indicator`;
    const nextClassName = isNext ? classes.hidden : "";
    const hiddenClassName = classes.hidden;
    let renderedMenuItemsCount = 0;
    renderActions<Context>({
        context: Object.assign({}, { isAppBar: true }, context),
        actions: items,
        ...props,
        actionMutator : function (renderer, props, index): IReactNullableElement {
            const {level} = props;
            if (!level && actionCounter.current <= mAction + 1) {
                actionCounter.current++;
            }
            //props.id = defaultStr(props.id,(id+index).toString());
            const canRenderAction = !level && (actionCounter.current <= mAction && mAction > 1) || items?.length === 1;
            const canAddAction = canRenderAction|| isNext;
            const canAddMenuWithoutNext = !canRenderAction && !level;
            const canAddMenu =  canAddMenuWithoutNext || isNext;
            props.className= cn(actionClassName,isNext && nextClassName,computedClassName,props.className,canAddAction && "appbar-action",canAddMenu && "appbar-menu");
            const renderedAction = (renderer as any)(props, index);
            if(!renderedAction) return null;
            if(canAddMenuWithoutNext){
                renderedMenuItemsCount++;
            }
            if (canAddAction) {
                actions.push(renderedAction);
                itemsCountRef.current++;
            }
            if (canAddMenu) {
                menuItems.push(props);
                itemsCountRef.current++;
            }
            return null;
        },
    });
    return <>
         {isNext ? <ActivityIndicator id={activityIndicatorId} size={"small"}/>:null}
         {actions}
         <Menu
            preferedPositionAxis='vertical'
            testID={`${testID}-menu`}
            className={cn("appbar-menu",nextClassName)}
            id={menuId}
            anchor={({ menu }) => {
                return <Div id={menuAnchorId} testID={testID+"-menu-anchor-container"} className={cn("appbar-menu-anchor-container",nextClassName,computedClassName)}>
                    {<Icon.Button
                        size={28}
                        iconName={FONT_ICONS.MORE as any}
                        className={"mx-[7px]"}
                        onPress={() => {
                            menu?.open();
                        }}
                    />}    
                </Div>
            }}
            items={menuItems}
        /> 
    </>;
}

const getAppBarMaxActions = (windowWidth: number, viewportWidth?: number): number => {
    let iWidth = isNumber(viewportWidth) && viewportWidth > 200 ? viewportWidth : windowWidth - 100;
    return iWidth >= 3000 ? 8 : iWidth >= 2500 ? 7 : iWidth >= 2000 ? 6 : iWidth >= 1600 ? 5 : iWidth >= 1300 ? 4 : iWidth >= 800 ? 2 : iWidth >= 600 ? 1 : 0;
};
