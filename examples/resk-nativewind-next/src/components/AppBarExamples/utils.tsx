/**
 * Utility functions for AppBar responsive behavior and action management.
 * 
 * @since 1.1.0
 */

import { 
    IAppBarActionProps, 
    IAppBarResponsiveConfig, 
    IAppBarActionPriority,
    DEFAULT_APPBAR_RESPONSIVE_CONFIG 
} from '@resk/nativewind/components/appBar';



/**
 * Filters actions based on viewport constraints and priority.
 * 
 * @param actions - Array of actions to filter
 * @param viewportWidth - Current viewport width
 * @param maxVisible - Maximum number of visible actions
 * @returns Object with visible actions and overflow actions
 */
export function filterActionsByViewport<Context = unknown>(
    actions: IAppBarActionProps<Context>[],
    viewportWidth: number,
    maxVisible: number
): {
    visibleActions: IAppBarActionProps<Context>[];
    overflowActions: IAppBarActionProps<Context>[];
} {
    if (!actions.length) {
        return { visibleActions: [], overflowActions: [] };
    }

    // Always show single action
    if (actions.length === 1) {
        return { visibleActions: actions, overflowActions: [] };
    }

    const visibleActions: IAppBarActionProps<Context>[] = [];
    const overflowActions: IAppBarActionProps<Context>[] = [];

    let visibleCount = 0;

    for (const action of actions) {
        // Always show critical actions
        if (action.alwaysVisible || action.priority === IAppBarActionPriority.CRITICAL) {
            visibleActions.push(action);
            continue;
        }

        // Check viewport constraints
        if (action.minViewportWidth && viewportWidth < action.minViewportWidth) {
            overflowActions.push(action);
            continue;
        }

        // Check if we have space for more actions
        if (visibleCount < maxVisible) {
            visibleActions.push(action);
            visibleCount++;
        } else {
            overflowActions.push(action);
        }
    }
    return { visibleActions, overflowActions };
}

/**
 * Groups actions by their group identifier.
 * 
 * @param actions - Array of actions to group
 * @returns Map of group name to actions
 */
export function groupActionsByGroup<Context = unknown>(
    actions: IAppBarActionProps<Context>[]
): Map<string, IAppBarActionProps<Context>[]> {
    const groups = new Map<string, IAppBarActionProps<Context>[]>();

    for (const action of actions) {
        const groupName = action.group || 'default';
        if (!groups.has(groupName)) {
            groups.set(groupName, []);
        }
        groups.get(groupName)!.push(action);
    }

    return groups;
}

/**
 * Calculates the optimal viewport width for different container types.
 * 
 * @param containerType - Type of container (window, drawer, modal)
 * @param actualWidth - Actual measured width
 * @returns Optimized viewport width for calculations
 */
export function calculateOptimalViewportWidth(
    containerType: 'window' | 'drawer' | 'modal' | 'auto' = 'auto',
    actualWidth: number
): number {
    const minWidth = 320; // Minimum supported width
    
    switch (containerType) {
        case 'drawer':
            // Drawers typically have constrained width
            return Math.max(Math.min(actualWidth, 400), minWidth);
        
        case 'modal':
            // Modals can vary but are often constrained
            return Math.max(Math.min(actualWidth, 600), minWidth);
        
        case 'window':
            // Use full window width with some padding
            return Math.max(actualWidth - 100, minWidth);
        
        case 'auto':
        default:
            // Auto-detect based on width
            if (actualWidth <= 500) {
                // Likely a constrained container
                return Math.max(actualWidth, minWidth);
            } else {
                // Likely main window, apply some padding
                return Math.max(actualWidth - 100, minWidth);
            }
    }
}

/**
 * Validates and normalizes responsive configuration.
 * 
 * @param config - Configuration to validate
 * @returns Normalized configuration
 */
export function normalizeResponsiveConfig(
    config?: Partial<IAppBarResponsiveConfig>
): IAppBarResponsiveConfig {
    const defaults = DEFAULT_APPBAR_RESPONSIVE_CONFIG;
    
    if (!config) {
        return defaults;
    }

    const normalized: IAppBarResponsiveConfig = {
        defaultMaxActions: config.defaultMaxActions ?? defaults.defaultMaxActions,
        breakpoints: []
    };

    // Merge and sort breakpoints
    const allBreakpoints = [
        ...(config.breakpoints || []),
        ...defaults.breakpoints
    ];

    // Remove duplicates and sort by width (descending)
    const uniqueBreakpoints = allBreakpoints
        .filter((bp, index, array) => 
            array.findIndex(item => item.width === bp.width) === index
        )
        .sort((a, b) => b.width - a.width);

    normalized.breakpoints = uniqueBreakpoints;

    return normalized;
}
