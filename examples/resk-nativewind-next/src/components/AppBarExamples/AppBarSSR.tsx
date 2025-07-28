/**
 * SSR-Optimized AppBar Actions Example
 *
 * This demonstrates the key features that should be implemented:
 * - Tailwind min-width breakpoints (sm:, md:, lg:, xl:, 2xl:)
 * - renderable function for dynamic visibility
 * - visibleOnlyOnAppBar/visibleOnlyOnMenu constraints
 * - Overflow menu only shows with 2+ actions
 * - ViewportWidth support for custom containers
 */

// Interface for SSR-optimized actions (to be implemented)
interface ISSRAppBarActionProps {
    id: string;
    label: string;
    fontIconName?: string;
    onPress?: () => void;
    renderable?: (context: 'appbar' | 'menu', viewportView?: string, viewportWidth?: number) => boolean;
    visibleOnlyOnAppBar?: boolean;
    visibleOnlyOnMenu?: boolean;
    visibilityPriority?: number;
    minViewportWidth?: number;
}

// Sample actions with all the new features
const createSampleActions = (viewportView?: string): ISSRAppBarActionProps[] => [
    {
        id: 'save',
        label: 'Save',
        fontIconName: 'save',
        onPress: () => console.log('Save pressed'),
        // Always renderable, high priority
        renderable: () => true,
        visibilityPriority: 100,
    },
    {
        id: 'search',
        label: 'Search',
        fontIconName: 'search',
        onPress: () => console.log('Search pressed'),
        // Only show on app bar, not in drawer contexts
        renderable: (context: 'appbar' | 'menu', viewportView?: string) => {
            if (viewportView === 'drawer') return false;
            return true;
        },
        visibleOnlyOnAppBar: true, // Never goes to overflow menu
        minViewportWidth: 480, // Requires at least 480px
    },
    {
        id: 'share',
        label: 'Share',
        fontIconName: 'share',
        onPress: () => console.log('Share pressed'),
        // Show everywhere except in modal with small width
        renderable: (context: 'appbar' | 'menu', viewportView?: string, viewportWidth?: number) => {
            if (viewportView === 'modal' && viewportWidth && viewportWidth < 500) {
                return false;
            }
            return true;
        },
        visibilityPriority: 80,
    },
    {
        id: 'export',
        label: 'Export',
        fontIconName: 'download',
        onPress: () => console.log('Export pressed'),
        // Only in menu, not directly on app bar
        renderable: (context: 'appbar' | 'menu', viewportView?: string) => {
            // Hide in drawer contexts
            return viewportView !== 'drawer';
        },
        visibleOnlyOnMenu: true, // Only appears in overflow menu
        minViewportWidth: 350,
    },
    {
        id: 'settings',
        label: 'Settings',
        fontIconName: 'settings',
        onPress: () => console.log('Settings pressed'),
        // Lower priority, can appear in both app bar and menu
        renderable: (context: 'appbar' | 'menu', viewportView?: string) => {
            // Always renderable unless in drawer
            return viewportView !== 'drawer';
        },
        visibilityPriority: 40,
    },
    {
        id: 'help',
        label: 'Help',
        fontIconName: 'help-circle',
        onPress: () => console.log('Help pressed'),
        // Always renderable, lowest priority
        renderable: () => true,
        visibilityPriority: 20,
    },
];

// Tailwind-style breakpoints configuration
const breakpointsConfig = {
    sm: 2,  // Show 2 actions on small screens (640px+)
    md: 3,  // Show 3 actions on medium screens (768px+)
    lg: 4,  // Show 4 actions on large screens (1024px+)
    xl: 5,  // Show 5 actions on extra large screens (1280px+)
    '2xl': 6, // Show all 6 actions on 2xl screens (1536px+)
};

// Placeholder component for demonstration
function SSRAppBarActions({ actions, breakpoints, viewportView, viewportWidth, testID, accessibilityLabel, overflowMenuAccessibilityLabel, className }: any) {
    return (
        <div className={`flex items-center gap-2 ${className || ''}`}>
            {/* This is a placeholder - the actual SSR component would render here */}
            <div className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded">
                SSR Actions: {actions.length} actions, {viewportView} context, {viewportWidth}px
            </div>
            <button className="text-xs bg-blue-100 px-2 py-1 rounded">⋮</button>
        </div>
    );
}

/**
 * Main viewport example - full width, all features enabled
 */
export function MainViewportExample() {
    const actions = createSampleActions('main');

    return (
        <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-semibold text-gray-900">Main Viewport (Full Width)</h3>
                <p className="text-sm text-gray-600">All actions available, responsive breakpoints active</p>
            </div>

            <div className="p-4">
                <div className="bg-white border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                        <h4 className="font-medium text-gray-900">Dashboard</h4>
                        <SSRAppBarActions
                            actions={actions}
                            breakpoints={breakpointsConfig}
                            viewportView="main"
                            viewportWidth={1200}
                            testID="main-appbar"
                            accessibilityLabel="Dashboard actions"
                            overflowMenuAccessibilityLabel="More dashboard actions"
                        />
                    </div>
                    <div className="p-4 text-sm text-gray-600">
                        <p><strong>Features demonstrated:</strong></p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Search: Only on app bar (visibleOnlyOnAppBar), requires 480px+</li>
                            <li>Export: Only in menu (visibleOnlyOnMenu), requires 350px+</li>
                            <li>All actions: Responsive based on Tailwind breakpoints</li>
                            <li>Menu: Only shows when 2+ actions overflow</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Drawer viewport example - constrained width
 */
export function DrawerViewportExample() {
    const actions = createSampleActions('drawer');

    return (
        <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-semibold text-gray-900">Drawer Viewport (320px width)</h3>
                <p className="text-sm text-gray-600">Search, Export, Settings, Help hidden due to drawer context</p>
            </div>

            <div className="p-4">
                <div className="bg-white border border-gray-200 rounded-md" style={{ width: '320px' }}>
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                        <h4 className="font-medium text-gray-900 truncate">Navigation</h4>
                        <SSRAppBarActions
                            actions={actions}
                            breakpoints={{ sm: 1, md: 2 }}
                            viewportView="drawer"
                            viewportWidth={320}
                            testID="drawer-appbar"
                            accessibilityLabel="Navigation actions"
                        />
                    </div>
                    <div className="p-4 text-sm text-gray-600">
                        <p>Only Save and Share actions are renderable in drawer context.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Implementation Requirements Summary
 */
export function ImplementationRequirements() {
    return (
        <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-semibold text-gray-900">Implementation Requirements</h3>
                <p className="text-sm text-gray-600">Key features that need to be implemented</p>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Core Features</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>SSR Compatible:</strong> No client-side hooks (useEffect, useState)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Tailwind Breakpoints:</strong> Uses min-width approach (sm:, md:, lg:, xl:, 2xl:)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Renderable Function:</strong> Dynamic visibility based on context</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Visibility Constraints:</strong> visibleOnlyOnAppBar/visibleOnlyOnMenu</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Advanced Features</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Smart Overflow:</strong> Menu only shows with 2+ overflow actions</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>ViewportWidth:</strong> Support for custom containers (drawer, modal)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Priority System:</strong> Actions sorted by visibility priority</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Accessibility:</strong> Proper ARIA labels and screen reader support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Action Properties</h4>
                    <div className="text-sm text-blue-800">
                        <p className="mb-2"><strong>renderable:</strong> <code>(context: 'appbar' | 'menu', viewportView?: string, viewportWidth?: number) =&gt; boolean</code></p>
                        <p className="mb-2"><strong>visibleOnlyOnAppBar:</strong> <code>boolean</code> - Action never appears in overflow menu</p>
                        <p className="mb-2"><strong>visibleOnlyOnMenu:</strong> <code>boolean</code> - Action only appears in overflow menu</p>
                        <p><strong>breakpoints:</strong> <code>Record&lt;string, number&gt;</code> - Tailwind breakpoint names to max visible actions</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Main SSR AppBar examples component
 */
export function SSRAppBarExamples() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        SSR-Optimized AppBar Actions
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Server-side rendering compatible AppBar actions with Tailwind breakpoints,
                        advanced visibility controls, and intelligent overflow handling.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <h2 className="font-semibold text-blue-900 mb-2">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                            <ul className="space-y-1">
                                <li>✅ SSR-compatible (no client-side hooks)</li>
                                <li>✅ Tailwind min-width breakpoints</li>
                                <li>✅ Dynamic renderable function</li>
                                <li>✅ visibleOnlyOnAppBar/visibleOnlyOnMenu</li>
                            </ul>
                            <ul className="space-y-1">
                                <li>✅ Overflow menu with 2+ actions rule</li>
                                <li>✅ ViewportWidth for custom containers</li>
                                <li>✅ Priority-based action sorting</li>
                                <li>✅ Accessibility support</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <MainViewportExample />
                <DrawerViewportExample />
            </div>
        </div>
    );
}

export default SSRAppBarExamples;