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
 * @constant DEFAULT_APPBAR_RESPONSIVE_CONFIG
 * @since 1.1.0
 */
export const DEFAULT_APPBAR_RESPONSIVE_CONFIG: IAppBarResponsiveConfig = {
    breakpoints: [
        { width: 1200, maxActions: 8 },
        { width: 992, maxActions: 6 },
        { width: 768, maxActions: 4 },
        { width: 576, maxActions: 3 },
        { width: 480, maxActions: 2 },
        { width: 320, maxActions: 1 }
    ],
    defaultMaxActions: 2
};