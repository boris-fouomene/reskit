import React from 'react';
import { cn } from '@resk/nativewind/utils';

// ====================================================================================
// 1. INTERFACES & TYPES
// ====================================================================================

export interface ISSRAppBarAction {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    // SSR-specific visibility controls
    renderable?: (context: 'appbar' | 'menu', viewportView?: string, viewportWidth?: number) => boolean;
    visibleOnlyOnAppBar?: boolean;
    visibleOnlyOnMenu?: boolean;
    // Optional viewport width constraint for this specific action
    viewportWidth?: number;
}

export interface ISSRAppBarProps {
    title?: string;
    actions: ISSRAppBarAction[];
    // Tailwind-style breakpoints: { sm: 2, md: 3, ... }
    breakpoints: Record<string, number>;
    className?: string;
    menuIcon?: React.ReactNode;
    // Context for the entire AppBar, used in `renderable`
    viewportView?: string;
    // If provided, determines the single active breakpoint. If not, all breakpoints are rendered.
    viewportWidth?: number;
}

// ====================================================================================
// 2. HELPER COMPONENTS & UTILS
// ====================================================================================

/**
 * A simple, reusable button component for rendering actions.
 */
const ActionButton: React.FC<{ action: ISSRAppBarAction; className?: string }> = ({ action, className = '' }) => {
    const baseClasses = `inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200`;
    const combinedClasses = cn(baseClasses, className);

    if (action.href) {
        return (
            <a href={action.href} className={combinedClasses} aria-label={action.label}>
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
            </a>
        );
    }

    return (
        <button onClick={action.onClick} disabled={action.disabled} className={combinedClasses} aria-label={action.label}>
            {action.icon}
            <span className="hidden sm:inline">{action.label}</span>
        </button>
    );
};

const TAILWIND_BREAKPOINTS_WIDTHS: { [key: string]: number } = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };
const TAILWIND_BREAKPOINTS_ORDER = ['sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Determines the active maxActions value based on viewportWidth.
 */
const getActiveMaxActions = (breakpoints: Record<string, number>, viewportWidth: number): number => {
    let activeMax = breakpoints['base'] || 1;
    for (const bp of TAILWIND_BREAKPOINTS_ORDER) {
        if (viewportWidth >= (TAILWIND_BREAKPOINTS_WIDTHS[bp] || 0)) {
            activeMax = breakpoints[bp] || activeMax;
        }
    }
    return activeMax;
};


// ====================================================================================
// 3. CORE SSR APP BAR COMPONENT
// ====================================================================================

export const SSRImprovedAppBar: React.FC<ISSRAppBarProps> = ({
    title,
    actions: allActions,
    breakpoints,
    className = '',
    menuIcon,
    viewportView,
    viewportWidth,
}) => {
    // --- Actions filtered for the app bar context ---
    const appBarVisibleActions = allActions.filter(
        (action) =>
            !action.visibleOnlyOnMenu &&
            (!action.renderable || action.renderable('appbar', viewportView, viewportWidth)) &&
            (!action.viewportWidth || (viewportWidth ? viewportWidth >= action.viewportWidth : true))
    );

    // --- Actions filtered for the menu context ---
    const menuRenderableActions = allActions.filter(
        (action) =>
            !action.visibleOnlyOnAppBar &&
            (!action.renderable || action.renderable('menu', viewportView, viewportWidth)) &&
            (!action.viewportWidth || (viewportWidth ? viewportWidth >= action.viewportWidth : true))
    );

    // --- Class Generation ---
    const generateAppBarActionClasses = (index: number) => {
        // If viewportWidth is fixed, calculate visibility once.
        if (viewportWidth) {
            const maxActions = getActiveMaxActions(breakpoints, viewportWidth);
            return index < maxActions ? 'flex' : 'hidden';
        }

        // Otherwise, generate responsive classes for all breakpoints.
        const classes = [];
        const baseMax = breakpoints['base'] || 0;
        if (index >= baseMax) classes.push('hidden');
        else classes.push('flex');

        for (const bp of TAILWIND_BREAKPOINTS_ORDER) {
            if (breakpoints[bp]) {
                classes.push(index < breakpoints[bp] ? `${bp}:flex` : `${bp}:hidden`);
            }
        }
        return classes.join(' ');
    };

    const generateMenuActionClasses = (action: ISSRAppBarAction) => {
        // Find the index of this action in the app bar list to determine its visibility.
        const indexInAppBarList = appBarVisibleActions.findIndex(a => a.id === action.id);

        // If the action is not in the app bar list (e.g., menu-only), it's always visible in the menu.
        if (indexInAppBarList === -1) return 'block';

        if (viewportWidth) {
            const maxActions = getActiveMaxActions(breakpoints, viewportWidth);
            return indexInAppBarList >= maxActions ? 'block' : 'hidden';

        }

        const classes = [];
        const baseMax = breakpoints['base'] || 0;
        if (indexInAppBarList >= baseMax) classes.push('block');
        else classes.push('hidden');

        for (const bp of TAILWIND_BREAKPOINTS_ORDER) {
            if (breakpoints[bp]) {
                classes.push(indexInAppBarList >= breakpoints[bp] ? `${bp}:block` : `${bp}:hidden`);
            }
        }
        return classes.join(' ');
    };

    const generateOverflowMenuWrapperClasses = () => {
        if (viewportWidth) {
            const maxActions = getActiveMaxActions(breakpoints, viewportWidth);
            const overflowCount = appBarVisibleActions.length - maxActions;
            // Also count actions that are only visible in the menu
            const menuOnlyCount = menuRenderableActions.filter(a => a.visibleOnlyOnMenu).length;
            const totalOverflow = overflowCount + menuOnlyCount;
            return totalOverflow >= 2 ? 'block' : 'hidden';
        }

        const classes = [];
        const baseMax = breakpoints['base'] || 0;
        const menuOnlyCountBase = menuRenderableActions.filter(a => a.visibleOnlyOnMenu).length;
        if ((appBarVisibleActions.length - baseMax + menuOnlyCountBase) >= 2) classes.push('block');
        else classes.push('hidden');

        for (const bp of TAILWIND_BREAKPOINTS_ORDER) {
            if (breakpoints[bp]) {
                const menuOnlyCountBP = menuRenderableActions.filter(a => a.visibleOnlyOnMenu).length;
                const overflowCount = appBarVisibleActions.length - breakpoints[bp];
                const totalOverflow = overflowCount + menuOnlyCountBP;
                classes.push(totalOverflow >= 2 ? `${bp}:block` : `${bp}:hidden`);
            }
        }
        return classes.join(' ');
    }

    return (
        <header className={cn('bg-white border-b px-4 py-3 flex items-center justify-between', className)}>
            {/* Title */}
            {title && <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>}

            {/* Actions Container */}
            <div className="flex items-center gap-1 ml-auto">
                {/* Main bar actions */}
                {appBarVisibleActions.map((action, index) => (
                    <div key={action.id} className={generateAppBarActionClasses(index)}>
                        <ActionButton action={action} />
                    </div>
                ))}

                {/* Overflow Menu */}
                <div className={cn('relative', generateOverflowMenuWrapperClasses())}>
                    <div className="group">
                        <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium" aria-label="More actions">
                            {menuIcon || (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            )}
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="py-1">
                                {menuRenderableActions.map((action) => (
                                    <div key={action.id} className={generateMenuActionClasses(action)}>
                                        <ActionButton action={action} className="w-full justify-start !px-4" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

// ====================================================================================
// 4. EXAMPLE USAGE
// ====================================================================================

export const SSRAppBarExample: React.FC = () => {
    const sampleActions: ISSRAppBarAction[] = [
        { id: 'search', label: 'Search', icon: <p>🔍</p>, visibleOnlyOnAppBar: true },
        { id: 'add', label: 'Add New', icon: <p>➕</p> },
        { id: 'edit', label: 'Edit Item', icon: <p>✏️</p> },
        { id: 'share', label: 'Share', icon: <p>🔗</p> },
        { id: 'export', label: 'Export Data', icon: <p>📄</p>, visibleOnlyOnMenu: true },
        { id: 'settings', label: 'Settings', icon: <p>⚙️</p> },
    ];

    // Breakpoints for a standard, full-width viewport.
    const standardBreakpoints = { base: 1, sm: 2, md: 3, lg: 4 };

    // Breakpoints for a constrained viewport, like a drawer.
    const drawerBreakpoints = { base: 1, sm: 1, md: 2 };

    return (
        <div className="p-8 font-sans bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">SSR AppBar - Correct Implementation</h1>
            <p className="mb-8 text-gray-600">This example demonstrates the fully SSR-compliant AppBar using pure Tailwind classes for responsiveness.</p>

            <div className="space-y-12">
                <div>
                    <h2 className="text-xl font-semibold mb-3">Scenario 1: Full-Width Viewport (No `viewportWidth`)</h2>
                    <p className="text-sm text-gray-500 mb-4">The component renders classes for all breakpoints. Resize your browser to see the effect.</p>
                    <SSRImprovedAppBar title="Dynamic Viewport" actions={sampleActions} breakpoints={standardBreakpoints} />
                </div>

                {/*                 <div>
                    <h2 className="text-xl font-semibold mb-3">Scenario 2: Fixed-Width Drawer (`viewportWidth: 320`)</h2>
                    <p className="text-sm text-gray-500 mb-4">The component's visibility is calculated once based on the fixed width. It will not be responsive to browser resizing.</p>
                    <div className="w-[320px] border shadow-lg rounded-lg">
                        <SSRImprovedAppBar title="Drawer" actions={sampleActions} breakpoints={drawerBreakpoints} viewportWidth={320} viewportView="drawer" />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">Scenario 3: Fixed-Width Tablet View (`viewportWidth: 780`)</h2>
                    <p className="text-sm text-gray-500 mb-4">Visibility is calculated for a 780px-wide container. The `md` breakpoint (3 actions) should be active.</p>
                    <div className="w-[780px] border shadow-lg rounded-lg">
                        <SSRImprovedAppBar title="Tablet View" actions={sampleActions} breakpoints={standardBreakpoints} viewportWidth={780} />
                    </div>
                </div> */}
            </div>
        </div>
    );
};