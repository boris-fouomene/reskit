import { IAppBarActionProps, IAppBarActionsProps, IAppBarContext, IAppBarProps, IAppBarResponsiveConfig } from "../types";
import { IReactNullableElement } from "@src/types";
import { renderNavItems } from "@components/Nav/utils";
import { AppBarAction } from "../Action";
import ExpandableAppBarAction from "../ExpandableAction";
import { isNumber, isObj } from "@resk/core/utils";
import { Nav } from "@components/Nav";


export function renderActions<Context = unknown>({ context, actionMutator, testID, renderAction, renderExpandableAction, actions: items, viewportWidth, maxVisibleActions, ...props }: IAppBarActionsProps<Context> & {
    actionMutator?: (renderer: IAppBarActionsProps<Context>["renderAction"], _props: IAppBarActionProps<Context>, index: number, isExpandable: boolean) => IReactNullableElement;
}) {
    renderAction = typeof renderAction === 'function' ? renderAction : renderAppBarAction;
    renderExpandableAction = typeof renderExpandableAction === 'function' ? renderExpandableAction : renderExpandableAppBarAction;
    const mutatedActionMutator = typeof actionMutator === 'function' ? actionMutator : (renderer: IAppBarActionsProps<Context>["renderAction"], props: IAppBarActionProps<Context>, index: number, isExpandable: boolean) => (renderer as any)(props, index);
    return renderNavItems<IAppBarContext<Context>>({
        ...props,
        context,
        items,
        renderItem: function (props, index) {
            return mutatedActionMutator(renderAction, props, index, false);
        },
        renderExpandableItem: function (props, index) {
            return mutatedActionMutator(renderExpandableAction, props, index, true);
        },
    });
}

function renderAppBarAction<Context = unknown>(props: IAppBarActionProps<Context>, index: number) {
    return <AppBarAction {...props} key={Nav.getItemRenderKey(props, index)} />;
}
function renderExpandableAppBarAction<Context = unknown>(props: IAppBarActionProps<Context>, index: number) {
    return <ExpandableAppBarAction
        {...props}
        key={Nav.getItemRenderKey(props, index)}
    />;
}


export function calculateMaxVisibleActions(
    viewportWidth: number,
    breakpoints: IAppBarResponsiveConfig["breakpoints"] = APP_BAR_DEFAULT_RESPONSIVE_CONFIG.breakpoints,
    defaultMaxActions: number = 1
): number {
    // Find the first (largest) breakpoint where viewport width is >= breakpoint width
    const matchingBreakpoint = breakpoints.find(
        breakpoint => viewportWidth >= breakpoint.width
    );

    // If we found a matching breakpoint, use its maxActions
    if (matchingBreakpoint) {
        return matchingBreakpoint.maxActions;
    }

    // If viewport is larger than the largest defined breakpoint,
    // use the maxActions from the largest breakpoint instead of falling back to default
    if (breakpoints.length > 0 && viewportWidth > breakpoints[0].width) {
        return breakpoints[0].maxActions;
    }
    return defaultMaxActions;
}

/**
 * Utility function to sort actions by visibility priority.
 * 
 * Sorts actions in descending order of visibility priority, meaning actions with
 * higher priority values appear first and stay visible longer in responsive scenarios.
 * 
 * @param actions - Array of actions to sort
 * @returns Actions sorted by visibility priority (highest first)
 * 
 * @since 1.1.0
 * 
 * @example
 * ```tsx
 * const actions = [
 *   { id: 'save', visibilityPriority: 90 },
 *   { id: 'share', visibilityPriority: 75 },
 *   { id: 'archive', visibilityPriority: 25 }
 * ];
 * 
 * const sorted = sortActionsByPriority(actions);
 * // Result: [save(90), share(75), archive(25)]
 * ```
 */
export function sortActionsByPriority<Context = unknown>(
    actions: IAppBarActionProps<Context>[]
): IAppBarActionProps<Context>[] {
    return [...actions].sort((a, b) => {
        // Default to 50 (normal priority) if not specified
        const priorityA = isNumber(a?.visibilityPriority) ? a.visibilityPriority : 0;
        const priorityB = isNumber(b?.visibilityPriority) ? b.visibilityPriority : 0;
        return priorityB - priorityA;
    });
}

export function getMaxActionsPerBreakpoint(
    config: IAppBarResponsiveConfig = APP_BAR_DEFAULT_RESPONSIVE_CONFIG
): Record<string, { maxAction: number, hiddenClassName: string }> {
    const result: Record<string, { maxAction: number, hiddenClassName: string }> = {};

    // Ensure we have a valid configuration
    if (!isObj(config) || !Array.isArray(config.breakpoints) || config.breakpoints.length === 0) {
        config = APP_BAR_DEFAULT_RESPONSIVE_CONFIG;
    }

    // Sort breakpoints in descending order (largest to smallest) to ensure we find
    // the largest breakpoint that fits within the viewport width
    const sortedBreakpoints = [...config.breakpoints]
        .filter(breakpoint => breakpoint && isNumber(breakpoint?.width))
        .sort((a, b) => b.width - a.width);

    // Find the maximum breakpoint width in the config
    const maxBreakpointWidth = sortedBreakpoints.length > 0 ? sortedBreakpoints[0].width : 0;

    const screens = APP_BAR_DEFAULT_RESPONSIVE_SCREENS;

    // Add base (smallest screen) configuration - starts from 0px
    const baseMaxActions = calculateMaxVisibleActions(0, sortedBreakpoints, config.defaultMaxActions);
    result.base = { maxAction: baseMaxActions, hiddenClassName: "base:hidden" };

    // Sort screen entries by width (ascending order for consistency)
    const sortedScreenEntries = Object.entries(screens);

    let hasHandleLatest = false;
    // Generate configuration for each screen breakpoint
    sortedScreenEntries.forEach(([screenName, screenWidth]) => {
        // Skip screens that are larger than the maximum breakpoint width in config
        if (screenWidth > maxBreakpointWidth) {
            if (hasHandleLatest) {
                return;
            }
            hasHandleLatest = true;
        }

        // For this screen width, find the best possible maxActions by checking
        // all breakpoints that are <= this screen width using proper responsive logic
        const maxActionsForScreen = calculateMaxVisibleActions(screenWidth, sortedBreakpoints, config.defaultMaxActions);

        result[screenName] = { maxAction: maxActionsForScreen, hiddenClassName: `${screenName}:hidden` };
    });
    return result;
}
interface IAppBarResponsiveScreens extends Record<string, number> { }
export const APP_BAR_DEFAULT_RESPONSIVE_SCREENS: IAppBarResponsiveScreens = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    '3xl': 1920,  // Full HD+ / Gaming monitors
    '4xl': 2560,  // 1440p / QHD monitors  
    '5xl': 3840,  // 4K / UHD monitors
    '6xl': 5120,  // 5K / Ultra-wide monitors
    '7xl': 7680,  // 8K displays (future-proofing)
}
const classes = {
    sm: "sm:hidden",
    md: "md:hidden",
    lg: "lg:hidden",
    xl: "xl:hidden",
    '2xl': "2xl:hidden",
    '3xl': "3xl:hidden",  // Full HD+ / Gaming monitors
    '4xl': "4xl:hidden",  // 1440p / QHD monitors  
    '5xl': "5xl:hidden",  // 4K / UHD monitors
    '6xl': "6xl:hidden",  // 5K / Ultra-wide monitors
    '7xl': "7xl:hidden",  // 8K displays (future-proofing)
}
export const APP_BAR_DEFAULT_RESPONSIVE_CONFIG: IAppBarResponsiveConfig = {
    breakpoints: [
        // === ULTRA-LARGE DISPLAYS (8 actions max) ===
        {
            width: 3840,
            maxActions: 20
        },
        {
            width: 2560,
            maxActions: 12
        },
        // === LARGE DESKTOP DISPLAYS (6-7 actions) ===
        {
            width: 1920,
            maxActions: 10
        },

        {
            width: 1680,
            maxActions: 9
        },

        {
            width: 1440,
            maxActions: 8
        },

        // === STANDARD DESKTOP/LAPTOP (5 actions) ===
        {
            width: 1366,
            maxActions: 7
        },
        /* Common Laptop Resolution (1366px+)
         * Devices: Most budget/mid-range laptops, older displays
        
        */

        {
            width: 1280,
            maxActions: 6
        },
        // === TABLET LANDSCAPE (4 actions) ===
        {
            width: 1024,
            maxActions: 5
        },
        // === TABLET PORTRAIT/SMALL LANDSCAPE (3 actions) ===
        {
            width: 834,
            maxActions: 3
        },
        {
            width: 768,
            maxActions: 2
        },
        {
            width: 320,
            maxActions: 1
        },
    ],

    /**
     * Conservative default for screens smaller than 320px or when viewport width cannot be determined.
     * Ensures the interface remains functional even on very constrained displays or unknown contexts.
     * 
     * Examples: Feature phones with browsers, very old devices, unusual display configurations
     */
    defaultMaxActions: 1
};