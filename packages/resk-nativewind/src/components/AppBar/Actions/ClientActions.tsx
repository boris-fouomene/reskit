"use client";
import { useDimensions } from "@utils/dimensions/hooks";
import { 
    IAppBarActionProps, 
    IAppBarActionsProps,
} from "../types";
import { DEFAULT_APPBAR_RESPONSIVE_CONFIG } from "./utils";
import { calculateMaxVisibleActions,sortActionsByPriority} from "./utils";
import { IReactNullableElement } from "@src/types";
import { isNumber, isObj } from "@resk/core/utils";
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
    menuProps,
    enableVirtualization = false,
    accessibilityLabel,
    overflowMenuAccessibilityLabel = "More actions",
    ...props 
}: IAppBarActionsProps<Context>) {
    const { window: { width: windowWidth }, isHydrated } = useDimensions();
    const {anchorIconName,anchorClassName,anchorIconVarint,anchorIconSize,...restMenuProps} = Object.assign({},menuProps);
    // Use viewport width if provided, otherwise fall back to window width
    const effectiveViewportWidth = useMemo(() => {
        if (isNumber(viewportWidth) && viewportWidth > 0) {
            return viewportWidth;
        }
        // For constrained containers (drawer, modal), use a more conservative approach
        return Math.max(windowWidth, 320); // Minimum 320px width
    }, [viewportWidth, windowWidth]);
    
    // Sort and process actions based on priority first
    const processedActions = useMemo(() => {
        if (!Array.isArray(items) || !items.length) return [];
        // Filter out null/undefined items and sort by priority if priority is being used
        const validItems = items.filter((action): action is IAppBarActionProps<Context> => isObj(action) && action != null);
        const hasPriority = validItems.some(action => isNumber(action.visibilityPriority));

        if (hasPriority) {
            return sortActionsByPriority(validItems);
        }
        
        return validItems;
    }, [items]);
    
    // Calculate max actions based on responsive configuration
    const calculatedMaxActions = useMemo(() => {
        const baseMaxActions = isNumber(maxVisibleActions) && maxVisibleActions > 0
            ? Math.trunc(maxVisibleActions)
            : calculateMaxVisibleActions(effectiveViewportWidth, responsiveConfig);
        
        // Account for the menu button taking up one action slot
        // If we have space for N actions and need a menu, we can only show N-1 direct actions + 1 menu button
        // Special case: if we only have 1 action total, show it directly (no menu needed)
        const totalActions = processedActions.length;
        
        if (totalActions <= 1) {
            // Single action or no actions: show directly, no menu needed
            return baseMaxActions;
        }
        
        if (baseMaxActions <= 1) {
            // Very constrained space: can only show menu button
            return 0; // 0 direct actions + 1 menu button = 1 total slot used
        }
        
        // Normal case: reserve one slot for menu button if we need overflow
        // If all actions fit in baseMaxActions, no need to reserve slot for menu
        return totalActions <= baseMaxActions ? baseMaxActions : baseMaxActions - 1;
    }, [maxVisibleActions, effectiveViewportWidth, responsiveConfig, processedActions.length]);
    
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
                const shouldAlwaysShow = alwaysVisible || 
                    props.visibilityPriority === 100; // Critical actions should always be visible
                
                // Check viewport constraints
                const meetsViewportRequirement = !(isNumber(minViewportWidth) && minViewportWidth > 0) || effectiveViewportWidth >= minViewportWidth;
                
                // Determine if action can be rendered directly
                const canRenderDirectly = shouldAlwaysShow || 
                    (actionCounter.current < calculatedMaxActions && meetsViewportRequirement) ||
                    (processedActions?.length === 1); // Always show single action directly (no menu needed)
                
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
                            variant={anchorIconVarint}
                            size={anchorIconSize || 28}
                            fontIconName={(anchorIconName || FONT_ICONS.MORE) as any}
                            className={cn("flex-none mx-[7px]", anchorClassName)}
                            accessibilityLabel={overflowMenuAccessibilityLabel}
                            onPress={() => {
                                menu?.open();
                            }}
                        />
                    }}
                    items={menuItems}
                    context={context}
                    {...restMenuProps}
                />
            ) : null}
        </Div>
    );
}
