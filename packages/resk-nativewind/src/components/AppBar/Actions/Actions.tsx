import {
    IAppBarActionsProps,
    IAppBarResponsiveConfig,
} from "../types";
import { APP_BAR_DEFAULT_RESPONSIVE_CONFIG, getActiveMaxActions, normalizeConfig, renderActions, usePrepareActions } from './utils';
import { cn } from "@utils/cn";
import { Div } from "@html/Div";
import { IReactNullableElement } from "@src/types";
import { AppBarMenu } from "./Menu";
import { useMemo } from "./hook";
import stableHash from "stable-hash";
import { isNonNullString, isNumber } from "@resk/core/utils";

export function AppBarServerActions<Context = unknown>({
    context,
    className,
    renderAction,
    renderExpandableAction,
    testID,
    onAppBarActionClassName,
    onMenuActionClassName,
    actions: items,
    responsiveConfig = APP_BAR_DEFAULT_RESPONSIVE_CONFIG,
    accessibilityLabel,
    viewportWidth,
    ...props
}: IAppBarActionsProps<Context>) {
    const { actions, menuItems, menuToActionMap } = usePrepareActions({ actions: items })
    if (actions.length === 0 && menuItems.length === 0) {
        return null;
    }
    // Get responsive breakpoint configuration
    const actionOnMenuClx = cn("resk-app-bar-action-menu-item", onMenuActionClassName);
    const actionOnAppBarClx = cn("resk-app-bar-action", onAppBarActionClassName);
    const config = normalizeConfig(responsiveConfig);

    console.log(config, "is normlized config", responsiveConfig, " is respon config ", actions, " is actions", menuItems, " is menu items");
    const restProps = { ...props, context, renderAction, renderExpandableAction, testID };
    const { actionsContent, menuItemsContent } = useMemo(() => {
        let renderedActionsCount = 0;
        const renderedAppBarActions: Record<string, number> = {};
        const menuItemsContent: IAppBarActionsProps<Context>[] = [];
        const activeMaxActions = isNumber(viewportWidth) && viewportWidth > 0 ? getActiveMaxActions(config, viewportWidth) : undefined;
        const actionsContent = renderActions<Context>({
            ...restProps,
            actions,
            actionMutator: function (renderer, { alwaysVisible, onMenuOrder, onAppBarClassName, onMenuClassName, visibleOnAppBar, visibleOnMenu, ...props }, index): IReactNullableElement {
                const { level, className } = props;
                // Nested actions, can not be rendered directly on the AppBar
                if (level) {
                    props.className = cn(
                        "appbar-action-menu-item",
                        actionOnMenuClx,
                        "app-bar-action-menu-item-level-" + level,
                        className,
                        onMenuClassName
                    );
                    return renderer(props, index);
                }
                const responsiveClasses: string[] = [];
                //we only add breakpoint visible class names to action if it's not always visible
                if (!alwaysVisible) {
                    const totalRenderedActionsWithMenu = renderedActionsCount + 1;
                    // If viewportWidth is fixed, calculate visibility once.
                    if (isNumber(activeMaxActions)) {
                        if (totalRenderedActionsWithMenu > activeMaxActions) {
                            responsiveClasses.push('hidden');
                        }
                    } else {
                        responsiveClasses.push('hidden');
                        for (const bp in config) {
                            const v: IAppBarResponsiveConfig[keyof IAppBarResponsiveConfig] = (config as any)[bp];
                            if (!isNumber(v?.maxActions) || v.maxActions < 1) continue;
                            //note : menu anchor is considered as a action
                            responsiveClasses.push(totalRenderedActionsWithMenu < v.maxActions ? `${bp}:flex` : `${bp}:hidden`);
                        }
                    }
                }
                const r = renderer({
                    ...props,
                    level,
                    className: cn(
                        actionOnAppBarClx,
                        className,
                        responsiveClasses,
                        onAppBarClassName,
                    )
                }, index);
                if (r) {
                    if (isNonNullString(props.id)) {
                        renderedAppBarActions[props.id] = renderedActionsCount;
                    }
                    renderedActionsCount += 1;
                    return r;
                }
                return null;
            },
        });
        menuItems.map(({ alwaysVisible, onMenuOrder, onAppBarClassName, onMenuClassName, className, visibleOnAppBar, visibleOnMenu, ...props }, index) => {
            const { level } = props;
            const actionId = isNonNullString(props.id) ? menuToActionMap[props.id] : undefined;
            const renderedActionIndex = isNonNullString(actionId) ? renderedAppBarActions[actionId] : undefined;
            const responsiveClasses: string[] = [];
            if (isNumber(renderedActionIndex)) {
                if (activeMaxActions) {
                    //we have already rendered action on the app bar so we should hide it on menu
                    if (renderedActionIndex <= activeMaxActions) {
                        responsiveClasses.push("hidden");
                    }
                } else {
                    for (const bp in config) {
                        const v: IAppBarResponsiveConfig[keyof IAppBarResponsiveConfig] = (config as any)[bp];
                        if (!isNumber(v?.maxActions) || v.maxActions < 1) continue;
                        //menu anchor is considered as a action
                        responsiveClasses.push(renderedActionIndex >= v.maxActions - 1 ? `${bp}:flex` : `${bp}:hidden`);
                    }
                }
            }
            menuItemsContent.push({
                ...props,
                className: cn(
                    "appbar-action-menu-item",
                    actionOnMenuClx,
                    "app-bar-action-menu-item-level-" + level,
                    className,
                    responsiveClasses,
                    onMenuClassName
                )
            })
        })
        return { actionsContent, menuItemsContent };
    }, [actions, menuItems, stableHash(renderExpandableAction), stableHash(config), stableHash(renderExpandableAction), testID, onAppBarActionClassName, onMenuActionClassName])
    return (
        <Div
            className={cn("appbar-actions flex flex-row items-center grow-0 justify-start overflow-hidden", className)}
            accessibilityLabel={accessibilityLabel}
        >
            {/* Render direct actions */}
            {actionsContent}

            {/* Render overflow menu if there are 2+ menu items */}
            {menuItemsContent.length >= 2 && (
                <AppBarMenu
                    {...props}
                    context={context}
                    menuItems={menuItemsContent}
                    testID={testID}
                />
            )}
        </Div>
    );
}
