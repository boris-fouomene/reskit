import {IAppBarActionPriority, IAppBarActionProps, IAppBarActionsProps, IAppBarContext, IAppBarProps, IAppBarResponsiveConfig } from "../types";
import { IReactNullableElement } from "@src/types";
import { renderNavItems } from "@components/Nav/utils";
import { AppBarAction } from "../Action";
import ExpandableAppBarAction from "../ExpandableAction";


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
    // Find the first breakpoint where viewport width is >= breakpoint width
    const matchingBreakpoint = config.breakpoints.find(
        breakpoint => viewportWidth >= breakpoint.width
    );
    return matchingBreakpoint?.maxActions ?? config.defaultMaxActions;
}

/**
 * Utility function to sort actions by priority.
 * 
 * @param actions - Array of actions to sort
 * @returns Actions sorted by priority (highest first)
 * 
 * @since 1.1.0
 */
export function sortActionsByPriority<Context = unknown>(
    actions: IAppBarActionProps<Context>[]
): IAppBarActionProps<Context>[] {
    return [...actions].sort((a, b) => {
        const priorityA = a.priority ?? IAppBarActionPriority.NORMAL;
        const priorityB = b.priority ?? IAppBarActionPriority.NORMAL;
        return priorityB - priorityA;
    });
}

/**
 * Default responsive configuration for AppBar actions.
 * 
 * Comprehensive breakpoints covering all common screen sizes in 2025:
 * - Extra large displays (8K, 5K, ultra-wide monitors)
 * - Standard desktop and laptop displays
 * - Tablet devices (various orientations)
 * - Modern mobile devices (all major models)
 * - UX best practices (3-8 actions optimal range)
 * - Smooth transitions between breakpoints
 * 
 * @constant DEFAULT_APPBAR_RESPONSIVE_CONFIG
 * @since 1.1.0
 */
export const DEFAULT_APPBAR_RESPONSIVE_CONFIG: IAppBarResponsiveConfig = {
    breakpoints: [
        { width: 3840, maxActions: 8 },  // 8K/5K monitors (3840px+) - 8 actions max
        { width: 2560, maxActions: 8 },  // 4K monitors (2560px+) - 8 actions max for ultra-wide space
        { width: 1920, maxActions: 7 },  // Full HD+ monitors (1920px+) - 7 actions
        { width: 1680, maxActions: 6 },  // MacBook Pro 16" (1680px+) - 6 actions
        { width: 1440, maxActions: 6 },  // MacBook Pro 14"/Large desktop (1440px+) - 6 actions
        { width: 1366, maxActions: 5 },  // Common laptop (1366px+) - 5 actions
        { width: 1280, maxActions: 5 },  // MacBook Air/Standard desktop (1280px+) - 5 actions
        { width: 1024, maxActions: 4 },  // iPad Pro landscape/small desktop (1024px+) - 4 actions
        { width: 834, maxActions: 3 },   // iPad Air landscape (834px+) - 3 actions
        { width: 768, maxActions: 3 },   // iPad portrait/tablet portrait (768px+) - 3 actions
        { width: 667, maxActions: 2 },   // iPhone Pro Max landscape (667px+) - 2 actions
        { width: 640, maxActions: 2 },   // Large mobile landscape (640px+) - 2 actions
        { width: 430, maxActions: 1 },   // iPhone 14 Pro Max portrait (430px+) - 1 action
        { width: 414, maxActions: 1 },   // iPhone Plus models (414px+) - 1 action  
        { width: 393, maxActions: 1 },   // iPhone 14/15 standard (393px+) - 1 action
        { width: 375, maxActions: 1 },   // iPhone 13 mini, SE (375px+) - 1 action
        { width: 360, maxActions: 1 },   // Android standard (360px+) - 1 action
        { width: 320, maxActions: 1 },   // Older/small devices (320px+) - 1 action
    ],
    defaultMaxActions: 1  // Conservative default for very small or unknown screens
};