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
            maxActions: 8 
        },  
        /* 8K/5K Monitors (3840px+)
         * Devices: Apple Pro Display XDR (6016×3384), Samsung 8K monitors, Dell 8K displays
         * Context: Professional workstations, content creation, multi-monitor setups
         * Rationale: Maximum actions while respecting cognitive load limits (Miller's Rule)
         * Usage: Power users who benefit from quick access to many tools
         */

        { 
            width: 2560, 
            maxActions: 8 
        },  
        /* 4K Monitors (2560px+) 
         * Devices: iMac 27" (5120×2880), Dell 4K monitors, LG UltraWide monitors
         * Context: Design work, development, productivity applications
         * Rationale: Ample space allows for maximum action visibility
         * Usage: Professional workflows requiring quick access to multiple tools
         */

        // === LARGE DESKTOP DISPLAYS (6-7 actions) ===
        { 
            width: 1920, 
            maxActions: 7 
        },  
        /* Full HD+ Monitors (1920px+)
         * Devices: Most desktop monitors, iMac 24" (4480×2520), external displays
         * Context: Standard desktop computing, office work, gaming
         * Rationale: Good balance between functionality and visual cleanliness
         * Usage: General desktop applications, productivity software
         */

        { 
            width: 1680, 
            maxActions: 6 
        },  
        /* MacBook Pro 16" (1680px+)
         * Devices: MacBook Pro 16" (3456×2234 scaled to 1728×1117)
         * Context: Professional laptop work, mobile development
         * Rationale: High-end laptop users expect rich functionality
         * Usage: Development tools, creative applications, complex interfaces
         */

        { 
            width: 1440, 
            maxActions: 6 
        },  
        /* Large Desktop/MacBook Pro 14" (1440px+)
         * Devices: MacBook Pro 14" (3024×1964 scaled to 1512×982), high-res laptops
         * Context: Premium laptop computing, mobile professional work
         * Rationale: Professional users need comprehensive toolsets
         * Usage: Code editors, design tools, business applications
         */

        // === STANDARD DESKTOP/LAPTOP (5 actions) ===
        { 
            width: 1366, 
            maxActions: 5 
        },  
        /* Common Laptop Resolution (1366px+)
         * Devices: Most budget/mid-range laptops, older displays
         * Context: General computing, business laptops, educational devices
         * Rationale: Balanced approach for mainstream laptop users
         * Usage: Office applications, web browsing, general productivity
         */

        { 
            width: 1280, 
            maxActions: 5 
        },  
        /* MacBook Air/Standard Desktop (1280px+)
         * Devices: MacBook Air 13" (2560×1664 scaled to 1280×832), older desktops
         * Context: General laptop use, portable computing
         * Rationale: Good functionality without overwhelming the interface
         * Usage: Everyday applications, student work, casual professional use
         */

        // === TABLET LANDSCAPE (4 actions) ===
        { 
            width: 1024, 
            maxActions: 4 
        },  
        /* iPad Pro Landscape/Small Desktop (1024px+)
         * Devices: iPad Pro 12.9" landscape (2732×2048), iPad Pro 11" landscape
         * Context: Tablet productivity, small desktop displays, touch interfaces
         * Rationale: Touch targets need more space; 4 actions provide good balance
         * Usage: Tablet apps, touch-first interfaces, mobile productivity
         */

        // === TABLET PORTRAIT/SMALL LANDSCAPE (3 actions) ===
        { 
            width: 834, 
            maxActions: 3 
        },  
        /* iPad Air Landscape (834px+)
         * Devices: iPad Air landscape (2360×1640), iPad 10.9" landscape
         * Context: Medium-sized tablet interfaces, compact touch displays
         * Rationale: Reduced actions for better touch accessibility
         * Usage: Reading apps, media consumption, light productivity
         */

        { 
            width: 768, 
            maxActions: 3 
        },  
        /* iPad Portrait/Standard Tablet (768px+)
         * Devices: All iPad models in portrait, Android tablets, Surface Go
         * Context: Portrait tablet use, compact interfaces
         * Rationale: Standard tablet breakpoint; 3 actions optimal for portrait
         * Usage: Content consumption, basic productivity, tablet-optimized apps
         */

        // === LARGE MOBILE LANDSCAPE (2 actions) ===
        { 
            width: 667, 
            maxActions: 2 
        },  
        /* iPhone Pro Max Landscape (667px+)
         * Devices: iPhone Pro Max in landscape, large phones horizontal
         * Context: Mobile landscape mode, horizontal phone usage
         * Rationale: Limited vertical space requires fewer actions
         * Usage: Video viewing, gaming, landscape-oriented mobile apps
         */

        { 
            width: 640, 
            maxActions: 2 
        },  
        /* Large Mobile Landscape (640px+)
         * Devices: General large mobile devices in landscape orientation
         * Context: Mobile landscape interfaces, small tablet landscape
         * Rationale: Conservative approach for landscape mobile usage
         * Usage: Mobile web apps, games, horizontal mobile interfaces
         */

        // === MOBILE PORTRAIT (1 action) ===
        { 
            width: 430, 
            maxActions: 1 
        },  
        /* iPhone 14 Pro Max Portrait (430px+)
         * Devices: iPhone 14/15 Pro Max (430×932), largest modern iPhones
         * Context: Large phone portrait mode, premium mobile devices
         * Rationale: Even large phones benefit from focused, single-action approach
         * Usage: Mobile apps, one-handed phone use, touch-optimized interfaces
         */

        { 
            width: 414, 
            maxActions: 1 
        },  
        /* iPhone Plus Models (414px+)
         * Devices: iPhone 6/7/8 Plus (414×736), older large iPhones
         * Context: Legacy large iPhone support, older device compatibility
         * Rationale: Consistent mobile experience across iPhone generations
         * Usage: iOS apps on older devices, legacy mobile interfaces
         */

        { 
            width: 393, 
            maxActions: 1 
        },  
        /* iPhone 14/15 Standard (393px+)
         * Devices: iPhone 14/15 standard models (393×852), current mainstream iPhones
         * Context: Modern iPhone portrait mode, current iOS development target
         * Rationale: Primary iOS development breakpoint; single action optimal
         * Usage: Modern iOS apps, current iPhone interface standards
         */

        { 
            width: 375, 
            maxActions: 1 
        },  
        /* iPhone 13 Mini/SE (375px+)
         * Devices: iPhone 13 Mini, iPhone SE 3rd gen, iPhone 12 Mini
         * Context: Compact iPhone models, one-handed mobile use
         * Rationale: Smaller screens require maximum focus on single actions
         * Usage: Compact mobile interfaces, accessibility-focused designs
         */

        { 
            width: 360, 
            maxActions: 1 
        },  
        /* Android Standard (360px+)
         * Devices: Most Android phones, Galaxy S series, Pixel phones
         * Context: Android mobile development, cross-platform mobile apps
         * Rationale: Standard Android viewport; aligns with Material Design
         * Usage: Android apps, cross-platform mobile development
         */

        { 
            width: 320, 
            maxActions: 1 
        },  
        /* Legacy Mobile/Small Devices (320px+)
         * Devices: Older smartphones, budget Android devices, iPhone 5/5S
         * Context: Legacy device support, emerging market devices
         * Rationale: Ensures compatibility with older and budget devices
         * Usage: Progressive enhancement, accessibility, global market support
         */
    ],
    
    /**
     * Conservative default for screens smaller than 320px or when viewport width cannot be determined.
     * Ensures the interface remains functional even on very constrained displays or unknown contexts.
     * 
     * Examples: Feature phones with browsers, very old devices, unusual display configurations
     */
    defaultMaxActions: 1
};