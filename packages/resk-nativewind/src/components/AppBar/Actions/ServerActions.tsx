"use client";
import {
    IAppBarActionProps,
    IAppBarActionsProps,
} from "../types";
import { APP_BAR_DEFAULT_RESPONSIVE_CONFIG, getMaxActionsPerBreakpoint, renderActions } from "./utils";
import { sortActionsByPriority } from "./utils";
import { isNumber, isObj } from "@resk/core/utils";
import { Menu } from "@components/Menu";
import { FONT_ICONS, Icon } from "@components/Icon";
import { cn } from "@utils/cn";
import { Div } from "@html/Div";
import { IReactNullableElement } from "@src/types";

export function AppBarServerActions<Context = unknown>({
    context,
    className,
    renderAction,
    renderExpandableAction,
    testID,
    onAppBarActionClassName,
    onMenuActionClassNamee,
    actions: items,
    responsiveConfig = APP_BAR_DEFAULT_RESPONSIVE_CONFIG,
    menuProps,
    accessibilityLabel,
    overflowMenuAccessibilityLabel = "More actions",
    ...props
}: IAppBarActionsProps<Context>) {

    // Early return if no actions
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    // Filter and process actions once
    const validActions = items.filter((action): action is IAppBarActionProps<Context> =>
        isObj(action) &&
        action != null &&
        action.visibleOnAppBar !== false &&
        action.visibleOnMenu !== false
    );

    if (validActions.length === 0) {
        return null;
    }

    // Sort by priority if any actions have priority
    const hasPriorityActions = validActions.some(action => isNumber(action.visibilityPriority));
    const sortedActions = hasPriorityActions
        ? sortActionsByPriority(validActions)
        : validActions;

    // Get responsive breakpoint configuration
    const maxActionsPerBreakpoint = getMaxActionsPerBreakpoint(responsiveConfig);
    console.log(maxActionsPerBreakpoint, " is max breakpoints ", items, responsiveConfig);
    const actionOnMenuClx = cn("resk-app-bar-action-menu-item", onMenuActionClassNamee);
    const actionOnAppBarClx = cn("resk-app-bar-action", onAppBarActionClassName);
    const menuItems: IAppBarActionProps<Context>[] = [];
    const actions: IReactNullableElement[] = [];

    renderActions<Context>({
        actions: sortedActions,
        context,
        ...props,
        renderAction,
        renderExpandableAction,
        testID,
        actionMutator: function (renderer, { alwaysVisible, visibilityPriority, minViewportWidth, onAppBarClassName, onMenuClassName, visibleOnAppBar, visibleOnMenu, ...props }, index): IReactNullableElement {
            const { level, className } = props;

            // Track current action count (0-based index becomes 1-based count)
            const currentActionCount = actions.length + 1;

            // Generate responsive visibility classes
            const responsiveClasses: string[] = [];

            // For each breakpoint, determine if this action should be hidden
            // Account for menu anchor taking 1 slot when there are overflow actions
            Object.entries(maxActionsPerBreakpoint).forEach(([breakpointName, { maxAction }]) => {
                // Reserve 1 slot for menu anchor if there will be overflow actions at this breakpoint
                const totalActions = sortedActions.length;

                // Calculate how many actions would overflow
                const overflowActions = Math.max(0, totalActions - maxAction);

                // Only reserve slot for menu if there are 2+ overflow actions
                // (single overflow action should just be shown directly)
                const availableSlots = overflowActions >= 2 ? maxAction - 1 : maxAction;

                if (currentActionCount > availableSlots) {
                    // This action exceeds the available slots (accounting for menu), so hide it
                    responsiveClasses.push(`${breakpointName}:hidden`);
                }
            });

            // Create the action with responsive classes
            const actionElement = renderer ? renderer({
                ...props,
                level,
                className: cn(
                    actionOnAppBarClx,
                    responsiveClasses,
                    className,
                    onAppBarClassName,
                )
            }, index) : null;

            // Add to actions array
            if (actionElement) {
                actions.push(actionElement);
            }

            // Only add to menu if this action will be hidden at some breakpoints
            const isHiddenAtSomeBreakpoints = responsiveClasses.length > 0;
            if (isHiddenAtSomeBreakpoints) {
                const menuItem: IAppBarActionProps<Context> = {
                    ...props,
                    level,
                    className: cn(actionOnMenuClx, className, onMenuClassName)
                };
                menuItems.push(menuItem);
            }

            return actionElement;
        },
    });
    return (
        <Div
            className={cn("appbar-actions flex flex-row items-center grow-0 justify-start overflow-hidden", className)}
            accessibilityLabel={accessibilityLabel}
        >
            {/* Render direct actions */}
            {actions}

            {/* Render overflow menu if there are 2+ menu items */}
            {menuItems.length >= 2 && (
                <Menu
                    {...menuProps}
                    items={menuItems}
                    accessibilityLabel={overflowMenuAccessibilityLabel}
                    anchor={
                        <Div
                            className={cn(
                                actionOnAppBarClx,
                                "cursor-pointer",
                                // Menu is visible when there are overflow actions at each breakpoint
                                Object.entries(maxActionsPerBreakpoint)
                                    .map(([breakpointName, { maxAction }]) => {
                                        const totalActions = sortedActions.length;
                                        const overflowActions = Math.max(0, totalActions - maxAction);

                                        // Show menu when there are 2+ overflow actions
                                        if (overflowActions >= 2) {
                                            return `${breakpointName}:flex`;
                                        } else {
                                            return `${breakpointName}:hidden`;
                                        }
                                    })
                                    .join(' ')
                            )}
                        >
                            ⋮
                        </Div>
                    }
                />
            )}
        </Div>
    );
}
