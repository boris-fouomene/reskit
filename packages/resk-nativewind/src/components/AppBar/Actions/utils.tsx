import { IAppBarActionProps, IAppBarActionsProps, IAppBarContext, IAppBarProps, IAppBarResponsiveConfig } from "../types";
import { IReactNullableElement } from "@src/types";
import { renderNavItems } from "@components/Nav/utils";
import { AppBarAction } from "../Action";
import ExpandableAppBarAction from "../ExpandableAction";
import { isNumber, isObj } from "@resk/core/utils";


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
    return <AppBarAction {...props} key={index} />;
}
function renderExpandableAppBarAction<Context = unknown>(props: IAppBarActionProps<Context>, index: number) {
    return <ExpandableAppBarAction
        {...props}
        key={index}
    />;
}

/**
 * Utility function to calculate maximum visible actions based on viewport width.
 * 
 * @param viewportWidth - Current viewport width
 * @param config - Responsive configuration object
 * @returns Maximum number of actions that should be visible
 * 
 * @example
 * ```tsx
 * const maxActions = calculateMaxVisibleActions(800, DEFAULT_APPBAR_RESPONSIVE_CONFIG);
 * // Returns appropriate number based on breakpoints
 * ```
 * 
 * @since 1.1.0
 */
export function calculateMaxVisibleActions(
    viewportWidth: number,
    config: IAppBarResponsiveConfig = DEFAULT_APPBAR_RESPONSIVE_CONFIG
): number {
    if (!isObj(config) || !Array.isArray(config.breakpoints) || config.breakpoints.length === 0) {
        config = DEFAULT_APPBAR_RESPONSIVE_CONFIG;
    }

    // Sort breakpoints in descending order (largest to smallest) to ensure we find
    // the largest breakpoint that fits within the viewport width
    const sortedBreakpoints = [...config.breakpoints]
        .filter(breakpoint => breakpoint && isNumber(breakpoint?.width))
        .sort((a, b) => b.width - a.width);

    // Find the first (largest) breakpoint where viewport width is >= breakpoint width
    const matchingBreakpoint = sortedBreakpoints.find(
        breakpoint => viewportWidth >= breakpoint.width
    );

    return matchingBreakpoint?.maxActions ?? config.defaultMaxActions;
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

/**
 * Default responsive configuration for AppBar actions.
 * 
 * This configuration provides comprehensive coverage for all common screen sizes in 2025,
 * from ultra-wide 8K monitors down to legacy mobile devices. Each breakpoint is carefully
 * chosen based on real device dimensions and UX research on optimal action counts.
 * 
 * ## Design Principles:
 * - **Cognitive Load**: Max 8 actions to stay within Miller's Rule (7±2 items)
 * - **Touch Targets**: Fewer actions on touch devices for better accessibility
 * - **Progressive Enhancement**: More actions available as screen space increases
 * - **Real Device Mapping**: Breakpoints match actual device specifications
 * - **Context Awareness**: Considers typical usage patterns per device type
 * 
 * ## Breakpoint Strategy:
 * - Descending order (largest to smallest) for efficient matching
 * - Real device widths, not arbitrary numbers
 * - Smooth transitions to prevent jarring UI changes
 * - Conservative mobile approach, generous desktop approach
 * 
 * ## Usage Examples:
 * ```tsx
 * // Use default configuration
 * <AppBar actions={actions} />
 * 
 * // For drawer context (constrained width)
 * <AppBar 
 *   actions={actions}
 *   actionsProps={{ 
 *     viewportWidth: 350,
 *     responsiveConfig: createConstrainedResponsiveConfig() 
 *   }} 
 * />
 * 
 * // Custom breakpoints
 * <AppBar 
 *   actions={actions}
 *   responsiveConfig={{
 *     breakpoints: [
 *       { width: 1200, maxActions: 5 },
 *       { width: 768, maxActions: 3 },
 *       { width: 390, maxActions: 1 }
 *     ],
 *     defaultMaxActions: 1
 *   }}
 * />
 * ```
 * 
 * @constant DEFAULT_APPBAR_RESPONSIVE_CONFIG
 * @since 1.1.0
 */
export const DEFAULT_APPBAR_RESPONSIVE_CONFIG: IAppBarResponsiveConfig = {
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
