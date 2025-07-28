import React from 'react';

// Types
export interface AppBarAction {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    visibleOnlyOnAppBar?: boolean;
    visibleOnlyOnMenu?: boolean;
    disabled?: boolean;
    renderable?: (context: 'appbar' | 'menu', viewportView?: string, viewportWidth?: number) => boolean;
    viewportWidth?: number;
}

export interface BreakpointsConfig {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
}

export interface AppBarProps {
    title?: string;
    actions: AppBarAction[];
    breakpoints: BreakpointsConfig;
    className?: string;
    menuIcon?: React.ReactNode;
    viewportView?: string;
    viewportWidth?: number;
}

// Utility function to check if action should be rendered based on viewport constraints
const shouldRenderAction = (
    action: AppBarAction,
    context: 'appbar' | 'menu',
    viewportView?: string,
    viewportWidth?: number
): boolean => {
    // Check viewport width constraint
    if (action.viewportWidth && viewportWidth && viewportWidth < action.viewportWidth) {
        return false;
    }

    // Check renderable function
    if (action.renderable && !action.renderable(context, viewportView, viewportWidth)) {
        return false;
    }

    return true;
};

// Utility function to generate responsive visibility classes
const generateVisibilityClasses = (
    actionIndex: number,
    breakpoints: BreakpointsConfig,
    totalActions: number,
    isOverflow: boolean = false
): string => {
    const classes: string[] = [];

    // Base visibility
    if (isOverflow) {
        classes.push('hidden');
    } else {
        classes.push('flex');
    }

    // For each breakpoint, determine if this action should be visible
    Object.entries(breakpoints).forEach(([breakpoint, maxVisible]) => {
        const shouldBeVisible = actionIndex < maxVisible;

        if (isOverflow) {
            // For overflow menu items, show when action should be hidden from main bar
            if (!shouldBeVisible) {
                classes.push(`${breakpoint}:block`);
            } else {
                classes.push(`${breakpoint}:hidden`);
            }
        } else {
            // For main bar actions
            if (shouldBeVisible) {
                classes.push(`${breakpoint}:flex`);
            } else {
                classes.push(`${breakpoint}:hidden`);
            }
        }
    });

    return classes.join(' ');
};

// Utility to check if overflow menu should be visible at any breakpoint
const generateOverflowMenuClasses = (
    actions: AppBarAction[],
    breakpoints: BreakpointsConfig,
    viewportView?: string,
    viewportWidth?: number
): string => {
    const classes: string[] = ['hidden']; // Hidden by default

    Object.entries(breakpoints).forEach(([breakpoint, maxVisible]) => {
        const overflowActions = actions.filter((action, index) => {
            if (action.visibleOnlyOnAppBar) return false;
            if (!shouldRenderAction(action, 'menu', viewportView, viewportWidth)) return false;
            return index >= maxVisible;
        });

        // Show menu if there are at least 2 overflow actions
        if (overflowActions.length >= 2) {
            classes.push(`${breakpoint}:block`);
        } else {
            classes.push(`${breakpoint}:hidden`);
        }
    });

    return classes.join(' ');
};

const ActionButton: React.FC<{
    action: AppBarAction;
    className?: string;
}> = ({ action, className = '' }) => {
    const baseClasses = `
    inline-flex items-center gap-2 px-3 py-2 text-sm font-medium
    text-gray-700 hover:text-gray-900 hover:bg-gray-100
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `;

    const combinedClasses = `${baseClasses} ${className}`.trim();

    if (action.href) {
        return (
            <a
                href={action.href}
                className={combinedClasses}
                aria-label={action.label}
            >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
            </a>
        );
    }

    return (
        <button
            onClick={action.onClick}
            disabled={action.disabled}
            className={combinedClasses}
            aria-label={action.label}
        >
            {action.icon}
            <span className="hidden sm:inline">{action.label}</span>
        </button>
    );
};

const OverflowMenu: React.FC<{
    actions: AppBarAction[];
    breakpoints: BreakpointsConfig;
    menuIcon?: React.ReactNode;
    viewportView?: string;
    viewportWidth?: number;
}> = ({ actions, breakpoints, menuIcon, viewportView, viewportWidth }) => {
    const menuClasses = generateOverflowMenuClasses(actions, breakpoints, viewportView, viewportWidth);

    return (
        <div className={`relative ${menuClasses}`}>
            {/* Menu trigger - using CSS-only dropdown */}
            <div className="group">
                <button
                    className="
            inline-flex items-center gap-1 px-3 py-2 text-sm font-medium
            text-gray-700 hover:text-gray-900 hover:bg-gray-100
            transition-colors duration-200
          "
                    aria-label="More actions"
                >
                    {menuIcon || (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    )}
                </button>

                {/* Dropdown menu */}
                <div className="
          absolute right-0 top-full mt-1 w-48 
          bg-white border border-gray-200 rounded-md shadow-lg
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 z-50
        ">
                    <div className="py-1">
                        {actions.map((action, index) => {
                            if (action.visibleOnlyOnAppBar) return null;

                            const visibilityClasses = generateVisibilityClasses(
                                index,
                                breakpoints,
                                actions.length,
                                true
                            );

                            return (
                                <div key={action.id} className={visibilityClasses}>
                                    <ActionButton
                                        action={action}
                                        className="w-full justify-start px-4 py-2 hover:bg-gray-50"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AppBar: React.FC<AppBarProps> = ({
    title,
    actions,
    breakpoints,
    className = '',
    menuIcon,
    viewportView,
    viewportWidth
}) => {
    const visibleActions = actions.filter(action =>
        !action.visibleOnlyOnMenu &&
        shouldRenderAction(action, 'appbar', viewportView, viewportWidth)
    );
    const overflowActions = actions.filter(action =>
        !action.visibleOnlyOnAppBar &&
        shouldRenderAction(action, 'menu', viewportView, viewportWidth)
    );

    return (
        <header className={`
      bg-white border-b border-gray-200 px-4 py-3
      flex items-center justify-between
      ${className}
    `}>
            {/* Title */}
            {title && (
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                    {title}
                </h1>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
                {/* Main bar actions */}
                {visibleActions.map((action, index) => {
                    const visibilityClasses = generateVisibilityClasses(
                        index,
                        breakpoints,
                        visibleActions.length
                    );

                    return (
                        <div key={action.id} className={visibilityClasses}>
                            <ActionButton action={action} />
                        </div>
                    );
                })}

                {/* Overflow menu */}
                <OverflowMenu
                    actions={overflowActions}
                    breakpoints={breakpoints}
                    menuIcon={menuIcon}
                    viewportView={viewportView}
                    viewportWidth={viewportWidth}
                />
            </div>
        </header>
    );
};

// Example usage component
export const AppBarExample: React.FC = () => {
    const sampleActions: AppBarAction[] = [
        {
            id: 'search',
            label: 'Search',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            //onClick: () => console.log('Search clicked'),
            renderable: (context, viewportView) => true, // Always renderable
            //viewportWidth: 300 // Requires at least 300px width
        },
        {
            id: 'filter',
            label: 'Filter',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
            ),
            //onClick: () => console.log('Filter clicked'),
            renderable: (context, viewportView) => {
                // Only show on app bar, and hide in drawer viewport
                return context === 'appbar' && viewportView !== 'drawer';
            },
            //viewportWidth: 400 // Requires at least 400px width
        },
        {
            id: 'sort',
            label: 'Sort',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            ),
            //onClick: () => console.log('Sort clicked'),
            renderable: (context, viewportView, viewportWidth) => {
                // Show everywhere except in modal with small width
                if (viewportView === 'modal' && viewportWidth && viewportWidth < 500) {
                    return false;
                }
                return true;
            }
        },
        {
            id: 'export',
            label: 'Export',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            //onClick: () => console.log('Export clicked'),
            renderable: (context, viewportView) => {
                // Only in menu, but not in drawer viewport
                return context === 'menu' && viewportView !== 'drawer';
            },
            viewportWidth: 350 // Requires at least 350px width
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            //onClick: () => console.log('Settings clicked'),
            visibleOnlyOnMenu: true, // This will only appear in overflow menu
            renderable: (context, viewportView) => {
                // Always renderable when in menu, but prefer full viewport
                return viewportView !== 'drawer';
            }
        },
        {
            id: 'help',
            label: 'Help',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            href: '/help',
            renderable: (context, viewportView, viewportWidth) => true // Always renderable
        }
    ];

    const breakpointsConfig: BreakpointsConfig = {
        sm: 2,  // Show 2 actions on small screens
        md: 3,  // Show 3 actions on medium screens
        lg: 4,  // Show 4 actions on large screens
        xl: 5,  // Show 5 actions on extra large screens
        '2xl': 6 // Show all 6 actions on 2xl screens
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main viewport example */}
            <AppBar
                title="Main Dashboard"
                actions={sampleActions}
                breakpoints={breakpointsConfig}
                viewportView="main"
                viewportWidth={1200}
            />

            <main className="p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Responsive App Bar with Viewport Context
                        </h2>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-600 mb-4">
                                The component now supports viewport context and width constraints.
                                Each action can have different behavior based on where the app bar is rendered:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                                <li><strong>Search:</strong> Always renderable, requires 300px+ width</li>
                                <li><strong>Filter:</strong> Only on app bar, hidden in drawer, requires 400px+ width</li>
                                <li><strong>Sort:</strong> Hidden in modals under 500px width</li>
                                <li><strong>Export:</strong> Only in menu, hidden in drawer, requires 350px+ width</li>
                                <li><strong>Settings:</strong> Only in menu, hidden in drawer</li>
                                <li><strong>Help:</strong> Always renderable everywhere</li>
                            </ul>
                        </div>
                    </div>

                    {/* Drawer example */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Drawer Viewport Example (320px width)
                        </h3>
                        <div className="bg-white border rounded-lg overflow-hidden">
                            <AppBar
                                title="Drawer View"
                                actions={sampleActions}
                                breakpoints={{ sm: 1, md: 2, lg: 3 }}
                                viewportView="drawer"
                                viewportWidth={320}
                                className="border-b-0"
                            />
                            <div className="p-4 bg-gray-50 text-sm text-gray-600">
                                Drawer context: Filter, Export, and Settings are hidden due to viewport rules
                            </div>
                        </div>
                    </div>

                    {/* Modal example */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Modal Viewport Example (450px width)
                        </h3>
                        <div className="bg-white border rounded-lg overflow-hidden">
                            <AppBar
                                title="Modal View"
                                actions={sampleActions}
                                breakpoints={{ sm: 1, md: 2, lg: 3 }}
                                viewportView="modal"
                                viewportWidth={450}
                                className="border-b-0"
                            />
                            <div className="p-4 bg-gray-50 text-sm text-gray-600">
                                Modal context: Sort is hidden due to width constraint (&lt;500px), Filter requires 400px+ so it's hidden
                            </div>
                        </div>
                    </div>

                    {/* Wide modal example */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Wide Modal Viewport Example (600px width)
                        </h3>
                        <div className="bg-white border rounded-lg overflow-hidden">
                            <AppBar
                                title="Wide Modal"
                                actions={sampleActions}
                                breakpoints={{ sm: 2, md: 3, lg: 4 }}
                                viewportView="modal"
                                viewportWidth={600}
                                className="border-b-0"
                            />
                            <div className="p-4 bg-gray-50 text-sm text-gray-600">
                                Wide modal context: All width constraints satisfied, Sort is now visible
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};