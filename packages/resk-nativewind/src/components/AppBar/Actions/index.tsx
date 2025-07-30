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
import { isNonNullString, isNumber, typedEntries } from "@resk/core/utils";

export function AppBarActions<Context = unknown>({
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
    const { actions, menuItems, menuToActionMap,menuOnlyActionCount,menuRenderableActionCount } = usePrepareActions({ actions: items })
    if (actions.length === 0 && menuItems.length === 0) {
        return null;
    }
    // Get responsive breakpoint configuration
    const actionOnMenuClx = cn("resk-app-bar-action-menu-item", onMenuActionClassName);
    const actionOnAppBarClx = cn("resk-app-bar-action", onAppBarActionClassName);
    const config = normalizeConfig(responsiveConfig);
    const sanitizedConfig = stableHash(config);

    const restProps = { ...props, context, renderAction, renderExpandableAction, testID };
    const { actionsContent, menuItemsContent, hasMenu, menuAnchorclasses } = useMemo(() => {
        let renderedActionsCount = 0;
        const renderedAppBarActions: Record<string, number> = {};
        const menuItemsContent: IAppBarActionsProps<Context>[] = [];
        const menuAnchorclasses: string[] = [];
        const shouldRenderMenu = menuOnlyActionCount > 0;
        let hasMenu = shouldRenderMenu;
        const viewportMaxActions = isNumber(viewportWidth) && viewportWidth > 0 ? getActiveMaxActions(config, viewportWidth) : undefined;
        const hasViewport = isNumber(viewportMaxActions) && viewportMaxActions > 0;
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
                    if (hasViewport) {
                        if (totalRenderedActionsWithMenu > viewportMaxActions) {
                            responsiveClasses.push('hidden');
                        }
                    } else {
                        responsiveClasses.push('hidden');
                        typedEntries(config).map(function(opt){
                            if (!opt) return;
                            const [bp, v] = opt;
                            if(!v || !bp) return;
                            const {maxActions} = v;
                            if(!isNumber(maxActions) || maxActions < 1)return;
                            responsiveClasses.push(totalRenderedActionsWithMenu < maxActions ? `${bp}:flex` : `${bp}:hidden`);
                        })
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
            const actionIndex = isNonNullString(actionId) ? renderedAppBarActions[actionId] : undefined;
            const responsiveClasses: string[] = [];
            if (isNumber(actionIndex)) {
                if (hasViewport) {
                    if(actionIndex < viewportMaxActions){
                        responsiveClasses.push("hidden");
                    } else {
                        //we have already rendered action on the app bar so we should hide it on menu
                        hasMenu = true;
                    }
                } else {
                    typedEntries(config).map(function(opt){
                        if (!opt) return;
                        const [bp, v] = opt;
                        if(!v || !bp) return;
                        const {maxActions} = v;
                        if(!isNumber(maxActions) || maxActions < 1)return;
                        const shouldDisplay = actionIndex+1 >= maxActions;
                        const clx = shouldDisplay ? `${bp}:flex` : `${bp}:hidden`;
                        responsiveClasses.push(clx);
                        if(!shouldRenderMenu && !menuAnchorclasses.includes(clx)){
                           menuAnchorclasses.push(clx);
                        }
                        if (shouldDisplay) {
                            hasMenu = true;
                        }
                    });
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
        return { actionsContent, menuItemsContent, hasMenu, menuAnchorclasses };
    }, [actions, menuItems,menuOnlyActionCount,menuRenderableActionCount,viewportWidth, stableHash(renderExpandableAction), sanitizedConfig, stableHash(renderExpandableAction), testID, onAppBarActionClassName, onMenuActionClassName])
    return (
        <Div
            className={cn("appbar-actions flex flex-row items-center grow-0 justify-start overflow-hidden", className)}
            accessibilityLabel={accessibilityLabel}
        >
            {/* Render direct actions */}
            {actionsContent}
            {menuItemsContent.length && hasMenu && (
                <Div asHtmlTag="span" testID={testID+"-overflow-menu-anchor-container"} className={cn(menuAnchorclasses, "resk-appbar-menu-anchor-container")}>
                    <AppBarMenu
                        {...props}
                        context={context}
                        menuItems={menuItemsContent}
                        testID={testID}
                    />
                </Div>
            )}
        </Div>
    );
}


AppBarActions.displayName = "AppBar.Actions";