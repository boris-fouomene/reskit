import React from 'react';

// Types
interface BreakpointConfig {
    [breakpoint: string]: number; // breakpoint -> maxVisible actions
}

interface Action {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    visibleOnlyOnAppBar?: boolean;
    visibleOnlyOnMenu?: boolean;
    renderable?: (location: 'appbar' | 'menu') => boolean;
}

interface AppBarProps {
    actions: Action[];
    breakpoints: BreakpointConfig;
    viewportWidth?: number;
    children?: React.ReactNode;
    className?: string;
}

// Tailwind breakpoint mappings (min-width values in px)
const BREAKPOINT_VALUES: Record<string, number> = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

// Get active breakpoint based on viewportWidth
function getActiveBreakpoint(viewportWidth: number, breakpoints: BreakpointConfig): string {
    const sortedBreakpoints = Object.keys(breakpoints)
        .filter(bp => BREAKPOINT_VALUES[bp] !== undefined)
        .sort((a, b) => BREAKPOINT_VALUES[a] - BREAKPOINT_VALUES[b]);

    let activeBreakpoint = 'default';

    for (const bp of sortedBreakpoints) {
        if (viewportWidth >= BREAKPOINT_VALUES[bp]) {
            activeBreakpoint = bp;
        }
    }

    return breakpoints[activeBreakpoint] !== undefined ? activeBreakpoint : sortedBreakpoints[0] || 'default';
}

// Generate Tailwind responsive classes for an action
function generateActionClasses(
    actionIndex: number,
    breakpoints: BreakpointConfig,
    totalRenderableActions: number,
    isAppBarAction: boolean
): string {
    const classes: string[] = [];

    Object.keys(breakpoints).forEach(breakpoint => {
        const maxActions = breakpoints[breakpoint];
        const shouldShow = isAppBarAction ? actionIndex < maxActions : actionIndex >= maxActions;

        if (breakpoint === 'default') {
            // Base case (no prefix)
            classes.push(shouldShow ? 'flex' : 'hidden');
        } else {
            // Responsive breakpoint
            classes.push(shouldShow ? `${breakpoint}:flex` : `${breakpoint}:hidden`);
        }
    });

    return classes.join(' ');
}

// Generate classes for overflow menu
function generateMenuClasses(breakpoints: BreakpointConfig, totalRenderableActions: number): string {
    const classes: string[] = [];

    Object.keys(breakpoints).forEach(breakpoint => {
        const maxActions = breakpoints[breakpoint];
        const overflowCount = Math.max(0, totalRenderableActions - maxActions);
        const shouldShowMenu = overflowCount >= 2;

        if (breakpoint === 'default') {
            classes.push(shouldShowMenu ? 'flex' : 'hidden');
        } else {
            classes.push(shouldShowMenu ? `${breakpoint}:flex` : `${breakpoint}:hidden`);
        }
    });

    return classes.join(' ');
}

export default function AppBar({
    actions,
    breakpoints,
    viewportWidth,
    children,
    className = ''
}: AppBarProps) {
    // Filter actions based on renderable property and location constraints
    const getFilteredActions = (location: 'appbar' | 'menu') => {
        return actions.filter(action => {
            // Check renderable function
            if (action.renderable && !action.renderable(location)) {
                return false;
            }

            // Check location constraints
            if (location === 'appbar' && action.visibleOnlyOnMenu) {
                return false;
            }

            if (location === 'menu' && action.visibleOnlyOnAppBar) {
                return false;
            }

            return true;
        });
    };

    const appBarActions = getFilteredActions('appbar');
    const menuActions = getFilteredActions('menu');

    // If viewportWidth is provided, use it to determine active breakpoint
    const activeBreakpoint = viewportWidth
        ? getActiveBreakpoint(viewportWidth, breakpoints)
        : null;

    // For SSR, we need to consider all possible actions that could be rendered
    const allPossibleActions = [...new Set([...appBarActions, ...menuActions])];

    const renderAction = (action: Action, location: 'appbar' | 'menu') => (
        <button
            key={`${action.id}-${location}`}
            onClick={action.onClick}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            type="button"
        >
            {action.icon}
            <span>{action.label}</span>
        </button>
    );

    return (
        <div className={`flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
            {/* Main content */}
            <div className="flex items-center flex-1">
                {children}
            </div>

            {/* Actions container */}
            <div className="flex items-center gap-2">
                {/* App bar actions - render all with responsive classes */}
                {appBarActions.map((action, index) => {
                    const actionClasses = activeBreakpoint
                        ? // Single breakpoint mode
                        index < breakpoints[activeBreakpoint] ? 'flex' : 'hidden'
                        : // Multi-breakpoint mode (full SSR)
                        generateActionClasses(index, breakpoints, appBarActions.length, true);

                    return (
                        <div key={`appbar-${action.id}`} className={actionClasses}>
                            {renderAction(action, 'appbar')}
                        </div>
                    );
                })}

                {/* Overflow menu */}
                <div className={`group relative ${activeBreakpoint
                    ? // Single breakpoint mode
                    Math.max(0, menuActions.length - (breakpoints[activeBreakpoint] - appBarActions.length)) >= 2 ? 'flex' : 'hidden'
                    : // Multi-breakpoint mode (full SSR)
                    generateMenuClasses(breakpoints, allPossibleActions.length)
                    }`}>
                    {/* Menu trigger */}
                    <button
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        type="button"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                        </svg>
                        <span>More</span>
                    </button>

                    {/* Dropdown menu - would typically be shown/hidden with JavaScript */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden group-hover:block">
                        <div className="py-1">
                            {menuActions.map((action, index) => {
                                // Only show actions that would overflow for each breakpoint
                                const menuItemClasses = activeBreakpoint
                                    ? // Single breakpoint mode
                                    index >= breakpoints[activeBreakpoint] - appBarActions.length ? 'block' : 'hidden'
                                    : // Multi-breakpoint mode
                                    generateActionClasses(index + appBarActions.length, breakpoints, allPossibleActions.length, false);

                                return (
                                    <div key={`menu-${action.id}`} className={menuItemClasses}>
                                        {renderAction(action, 'menu')}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Example usage component
export function AppBarExample() {
    const actions: Action[] = [
        {
            id: 'save',
            label: 'Save',
            icon: <span>💾</span>,
            onClick: () => console.log('Save clicked'),
        },
        {
            id: 'edit',
            label: 'Edit',
            icon: <span>✏️</span>,
            onClick: () => console.log('Edit clicked'),
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: <span>🗑️</span>,
            onClick: () => console.log('Delete clicked'),
            visibleOnlyOnMenu: true, // Only appears in overflow menu
        },
        {
            id: 'share',
            label: 'Share',
            icon: <span>📤</span>,
            onClick: () => console.log('Share clicked'),
        },
        {
            id: 'print',
            label: 'Print',
            icon: <span>🖨️</span>,
            onClick: () => console.log('Print clicked'),
            renderable: (location) => location === 'appbar', // Only on app bar
        },
        {
            id: 'export',
            label: 'Export',
            icon: <span>📋</span>,
            onClick: () => console.log('Export clicked'),
        },
    ];

    const breakpoints: BreakpointConfig = {
        default: 2, // Show 2 actions on mobile
        sm: 3,      // Show 3 actions on small screens
        md: 4,      // Show 4 actions on medium screens  
        lg: 5,      // Show 5 actions on large screens
        xl: 6,      // Show 6 actions on extra large screens
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AppBar
                actions={actions}
                breakpoints={breakpoints}
            //viewportWidth={1024} // Example: simulate lg breakpoint
            >
                <h1 className="text-xl font-semibold text-gray-900">
                    Document Editor
                </h1>
            </AppBar>

            <div className="p-6">
                <p className="text-gray-600">
                    This AppBar component adapts to different screen sizes, moving actions
                    to an overflow menu when space is limited. The component is fully SSR-compatible
                    and uses Tailwind's responsive utilities.
                </p>
            </div>
        </div>
    );
}