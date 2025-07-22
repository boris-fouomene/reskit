"use client";
import { useDimensions } from "@utils/dimensions/hooks";
import { 
    IAppBarActionProps, 
    IAppBarActionsProps, 
    IAppBarActionPriority
} from "../types";
import { DEFAULT_APPBAR_RESPONSIVE_CONFIG } from "./utils";
import { calculateMaxVisibleActions,sortActionsByPriority} from "./utils";
import { IReactNullableElement } from "@src/types";
import { isNumber } from "@resk/core/utils";
import { Menu } from "@components/Menu";
import { FONT_ICONS, Icon } from "@components/Icon";
import { renderActions } from "./utils";
import { cn } from "@utils/cn";
import { isValidElement, useMemo } from "react";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { Div } from "@html/Div";

export function AppBarClientActions<Context = unknown>({ 
    context, 
    className, 
    menuAnchorClassName, 
    menuAnchorIconProps, 
    renderAction, 
    renderExpandableAction, 
    hydrationFallback, 
    testID, 
    actionClassName, 
    actionMenuItemClassName, 
    actions: items, 
    viewportWidth, 
    maxVisibleActions,
    responsiveConfig = DEFAULT_APPBAR_RESPONSIVE_CONFIG,
    actionPriority,
    menuProps,
    enableVirtualization = false,
    accessibilityLabel,
    overflowMenuAccessibilityLabel = "More actions",
    ...props 
}: IAppBarActionsProps<Context>) {
    const { window: { width: windowWidth }, isHydrated } = useDimensions();
    
    // Use viewport width if provided, otherwise fall back to window width
    const effectiveViewportWidth = useMemo(() => {
        if (isNumber(viewportWidth) && viewportWidth > 0) {
            return viewportWidth;
        }
        // For constrained containers (drawer, modal), use a more conservative approach
        return Math.max(windowWidth - 100, 320); // Minimum 320px width
    }, [viewportWidth, windowWidth]);
    
    // Calculate max actions based on responsive configuration
    const calculatedMaxActions = useMemo(() => {
        if (isNumber(maxVisibleActions) && maxVisibleActions > 0) {
            return Math.trunc(maxVisibleActions);
        }
        return calculateMaxVisibleActions(effectiveViewportWidth, responsiveConfig);
    }, [maxVisibleActions, effectiveViewportWidth, responsiveConfig]);
    
    // Sort and process actions based on priority
    const processedActions = useMemo(() => {
        if (!items?.length) return [];
        
        // Filter out null/undefined items and sort by priority if priority is being used
        const validItems = items.filter((action): action is IAppBarActionProps<Context> => action != null);
        const hasPriority = validItems.some(action => action.priority !== undefined);
        
        if (hasPriority) {
            return sortActionsByPriority(validItems);
        }
        
        return validItems;
    }, [items]);
    
    const { actions, menuItems } = useMemo(() => {
        const actionCounter = { current: 0 };
        const menuItems: IAppBarActionProps<Context>[] = [];
        const actions: IReactNullableElement[] = [];
        
        renderActions<Context>({
            actions: processedActions,
            context,
            ...props,
            renderAction,
            renderExpandableAction,
            testID,
            actionMutator: function (renderer, {alwaysVisible,minViewportWidth,...props}, index): IReactNullableElement {
                const { level } = props;
                
                // Handle nested actions (don't count towards limit)
                if (level) {
                    props.className = cn("appbar-action-menu-item", actionMenuItemClassName);
                    const renderedAction = (renderer as any)(props, index);
                    if (renderedAction) {
                        menuItems.push(props);
                    }
                    return null;
                }
                
                // Check if action should always be visible
                const shouldAlwaysShow = alwaysVisible || props.priority === IAppBarActionPriority.CRITICAL;
                
                // Check viewport constraints
                const meetsViewportRequirement = !(isNumber(minViewportWidth) && minViewportWidth > 0) || effectiveViewportWidth >= minViewportWidth;
                
                // Determine if action can be rendered directly
                const canRenderDirectly = shouldAlwaysShow || 
                    (actionCounter.current < calculatedMaxActions && meetsViewportRequirement) ||
                    (processedActions?.length === 1); // Always show single action
                
                if (!level && !shouldAlwaysShow) {
                    actionCounter.current++;
                }
                
                props.className = cn(
                    canRenderDirectly && cn("appbar-action flex-none", actionClassName),
                    !canRenderDirectly && cn("appbar-action-menu-item", actionMenuItemClassName)
                );
                
                const renderedAction = (renderer as any)(props, index);
                if (!renderedAction) return null;
                
                if (canRenderDirectly) {
                    actions.push(renderedAction);
                } else {
                    menuItems.push(props);
                }
                
                return null;
            },
        });
        
        return { actions, menuItems };
    }, [calculatedMaxActions, processedActions, renderAction, renderExpandableAction, actionClassName, actionMenuItemClassName, effectiveViewportWidth]);
    
    if (!isHydrated) {
        if (isValidElement(hydrationFallback)) {
            return hydrationFallback;
        }
        return <ActivityIndicator size="small" className="flex-none" />;
    }
    
    return (
        <Div 
            className={cn("appbar-actions", className, "flex flex-row items-center grow-0 justify-start")}
            accessibilityLabel={accessibilityLabel}
        >
            {actions}
            {menuItems.length ? (
                <Menu
                    preferredPositionAxis='vertical'
                    testID={`${testID}-menu`}
                    className={cn("appbar-menu")}
                    anchor={({ menu }) => {
                        return <Icon.Button
                            size={28}
                            fontIconName={FONT_ICONS.MORE as any}
                            {...menuAnchorIconProps}
                            className={cn("flex-none mx-[7px]", menuAnchorClassName, menuAnchorIconProps?.className)}
                            accessibilityLabel={overflowMenuAccessibilityLabel}
                            onPress={() => {
                                menu?.open();
                            }}
                        />
                    }}
                    items={menuItems}
                />
            ) : null}
        </Div>
    );
}
