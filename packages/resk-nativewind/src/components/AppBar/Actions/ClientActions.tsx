"use client";
import { useDimensions } from "@utils/dimensions/hooks";
import {
    IAppBarActionProps,
    IAppBarActionsProps,
} from "../types";
import { DEFAULT_APPBAR_RESPONSIVE_CONFIG } from "./utils";
import { calculateMaxVisibleActions, sortActionsByPriority } from "./utils";
import { IReactNullableElement } from "@src/types";
import { isNumber, isObj } from "@resk/core/utils";
import { Menu } from "@components/Menu";
import { FONT_ICONS, Icon, IFontIconName } from "@components/Icon";
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
    onAppBarActionClassName,
    onMenuActionClassNamee,
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
    const actionOnMenuClx = cn("resk-app-bar-action-menu-item", onMenuActionClassNamee);
    const actionOnAppBarClx = cn("resk-app-bar-action", onAppBarActionClassName);
    // Destructure menu props with updated property names for open/closed icon states
    const {
        anchorClosedIconName,
        anchorOpenIconName,
        anchorClassName,
        anchorIconVariant,
        anchorIconSize,
        ...restMenuProps
    } = Object.assign({}, menuProps);
    // Use viewport width if provided, otherwise fall back to window width
    const effectiveViewportWidth = useMemo(() => {
        if (isNumber(viewportWidth) && viewportWidth > 0) {
            return viewportWidth;
        }
        // For constrained containers (drawer, modal), use a more conservative approach
        return Math.max(windowWidth, 320); // Minimum 320px width
    }, [viewportWidth, windowWidth]);

    // Process and filter valid actions (don't sort by priority here)
    const processedActions = useMemo(() => {
        if (!Array.isArray(items) || !items.length) return [];
        // Filter out null/undefined items but preserve original order
        return items.filter((action): action is IAppBarActionProps<Context> => isObj(action) && action != null && action.visibleOnAppBar !== false && action.visibleOnMenu !== false);
    }, [items]);

    // Calculate max actions based on responsive configuration
    const calculatedMaxActions = useMemo(() => {
        const baseMaxActions = isNumber(maxVisibleActions) && maxVisibleActions > 0
            ? Math.trunc(maxVisibleActions)
            : calculateMaxVisibleActions(effectiveViewportWidth, responsiveConfig);

        const totalActions = processedActions.length;

        if (totalActions <= 1) {
            // Single action or no actions: show directly, no menu needed
            return baseMaxActions;
        }

        if (baseMaxActions <= 1) {
            // Very constrained space: can only show menu button
            return 0; // 0 direct actions + 1 menu button = 1 total slot used
        }

        // Smart overflow calculation:
        // If we can fit all actions, show all directly
        if (totalActions <= baseMaxActions) {
            return baseMaxActions;
        }

        // SMART PREVENTION: If overflow would result in only 1 action in menu, 
        // it's better to show that action directly instead of wasting space on menu button
        // Example: 3 actions, space for 2 → instead of [Action1] [Menu▼] with 1 item,
        // show [Action1] [Action2] [Action3] directly (same space usage, better UX)
        const potentialDirectActions = baseMaxActions - 1; // Reserve slot for menu
        const potentialMenuActions = totalActions - potentialDirectActions;

        if (potentialMenuActions === 1) {
            // Only one action would go to menu, better to show it directly
            return Math.min(totalActions, baseMaxActions);
        }

        // Normal case: reserve one slot for menu button
        return baseMaxActions - 1;
    }, [maxVisibleActions, effectiveViewportWidth, responsiveConfig, processedActions.length]);

    const { actions, menuItems } = useMemo(() => {
        const menuItems: IAppBarActionProps<Context>[] = [];
        const actions: IReactNullableElement[] = [];

        // Check if we have priority-based actions and will need overflow
        const hasPriorityActions = processedActions.some(action => isNumber(action.visibilityPriority));

        // Calculate if we truly need overflow (consistent with calculatedMaxActions logic)
        const totalActions = processedActions.length;
        const baseMaxActions = isNumber(maxVisibleActions) && maxVisibleActions > 0
            ? Math.trunc(maxVisibleActions)
            : calculateMaxVisibleActions(effectiveViewportWidth, responsiveConfig);

        // SMART OVERFLOW DETECTION: Only apply priority sorting when it makes sense
        // We need overflow if we exceed space AND it would result in more than 1 menu item
        // This prevents the inefficient scenario of having a menu with just 1 item
        const needsOverflow = totalActions > baseMaxActions &&
            totalActions > calculatedMaxActions &&
            (totalActions - calculatedMaxActions) > 1;

        // Only sort by priority if we have priority actions AND there will be meaningful overflow
        const actionsToProcess = (hasPriorityActions && needsOverflow)
            ? sortActionsByPriority(processedActions)
            : processedActions; renderActions<Context>({
                actions: actionsToProcess,
                context,
                ...props,
                renderAction,
                renderExpandableAction,
                testID,
                actionMutator: function (renderer, { alwaysVisible, visibilityPriority, minViewportWidth, onAppBarClassName, onMenuClassName, visibleOnAppBar, visibleOnMenu, ...props }, index): IReactNullableElement {
                    const { level, className } = props;
                    // Handle nested actions (don't count towards limit)
                    if (level) {
                        props.className = cn(
                            "appbar-action-menu-item",
                            actionOnMenuClx,
                            "app-bar-action-menu-item-level-" + level,
                            className,
                            onMenuClassName
                        );
                        const renderedAction = (renderer as any)(props, index);
                        if (renderedAction) {
                            menuItems.push(props);
                        }
                        return null;
                    }

                    // Check viewport constraints
                    const meetsViewportRequirement = !(isNumber(minViewportWidth) && minViewportWidth > 0) || effectiveViewportWidth >= minViewportWidth;
                    if (!meetsViewportRequirement) {
                        return null;
                    }

                    // Progressive rendering logic:
                    // - Track current position in processing
                    // - Calculate remaining AppBar slots
                    // - Decide AppBar vs Menu placement based on availability and preferences

                    const currentAppBarCount = actions.length;
                    const remainingAppBarSlots = calculatedMaxActions - currentAppBarCount;

                    // Determine placement preference
                    const preferAppBar = visibleOnAppBar !== false; // true or undefined = prefer AppBar
                    const preferMenu = visibleOnMenu !== false;     // true or undefined = allow Menu

                    // Force AppBar if explicitly requested or always visible
                    const forceAppBar = alwaysVisible || visibleOnAppBar === true;

                    // Force Menu if explicitly requested
                    const forceMenu = visibleOnMenu === true && visibleOnAppBar === false;

                    // Decision logic
                    let renderOnAppBar: boolean;

                    if (forceAppBar) {
                        renderOnAppBar = true; // Always honor alwaysVisible or explicit visibleOnAppBar=true
                    } else if (forceMenu) {
                        renderOnAppBar = false; // Explicit menu-only request
                    } else if (remainingAppBarSlots > 0 && preferAppBar) {
                        renderOnAppBar = true; // Space available and action prefers AppBar
                    } else if (preferMenu) {
                        renderOnAppBar = false; // No AppBar space or action allows menu
                    } else {
                        renderOnAppBar = remainingAppBarSlots > 0; // Fallback: use AppBar if space available
                    }

                    // Apply appropriate styling and render
                    props.className = cn(
                        renderOnAppBar ? [
                            "appbar-action flex-none",
                            actionOnAppBarClx,
                            className,
                            onAppBarClassName
                        ] : [
                            "appbar-action-menu-item",
                            actionOnMenuClx,
                            className,
                            onMenuClassName
                        ]
                    );

                    const renderedAction = (renderer as any)(props, index);
                    if (!renderedAction) return null;
                    // Add to appropriate collection
                    if (renderOnAppBar) {
                        actions.push(renderedAction);
                    } else {
                        menuItems.push(props);
                    }
                    return null;
                },
            });
        return { actions, menuItems };
    }, [calculatedMaxActions, processedActions, renderAction, renderExpandableAction, actionOnAppBarClx, actionOnMenuClx, effectiveViewportWidth]);
    /* 
        if (!isHydrated) {
            if (isValidElement(hydrationFallback)) {
                return hydrationFallback;
            }
            return <ActivityIndicator size="small" className="flex-none" />;
        } */

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
                        // Determine which icon to show based on menu state
                        // When menu is open: use anchorOpenIconName
                        // When menu is closed: use anchorClosedIconName (default state)
                        const isMenuOpen = menu?.isOpen?.();
                        const iconName = (isMenuOpen ? anchorOpenIconName : anchorClosedIconName)
                            || FONT_ICONS.MORE;

                        return <Icon.Button
                            variant={anchorIconVariant}
                            size={anchorIconSize || 28}
                            fontIconName={iconName as any}
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
