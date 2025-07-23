"use client";
import {
    AppBar,
    IAppBarActionProps,
    IAppBarResponsiveConfig,
} from '@resk/nativewind/components/appBar';
import { H2 } from '@resk/nativewind/html';



// Example 1: Basic AppBar with visibilityPriority-based actions
export function BasicAppBarExample() {
    const actions: IAppBarActionProps[] = [
        {
            id: 'save',
            label: 'Save',
            visibilityPriority: 100,
            alwaysVisible: true,
            onPress: () => console.log('Save pressed'),
            accessibility: {
                label: 'Save document',
                hint: 'Saves the current document'
            }
        },
        {
            id: 'share',
            label: 'Share',
            visibilityPriority: 100,
            onPress: () => console.log('Share pressed'),
            minViewportWidth: 480 // Only show on viewports >= 480px
        },
        {
            id: 'export',
            label: 'Export',
            visibilityPriority: 20,
            onPress: () => console.log('Export pressed'),
            group: 'file-operations'
        },
        {
            id: 'print',
            label: 'Print',
            visibilityPriority: 10,
            onPress: () => console.log('Print pressed'),
            group: 'file-operations'
        },
        {
            id: 'help',
            label: 'Help',
            visibilityPriority: 15,
            onPress: () => console.log('Help pressed')
        }
    ];

    return (
        <AppBar
            title="My Document"
            subtitle="Edited 5 minutes ago"
            actions={actions}
            onBackActionPress={() => console.log('Back pressed')}
            actionsProps={{ responsiveConfig: createDesktopResponsiveConfig() }}
        />
    );
}

// Example 2: AppBar in a drawer context with constrained width
export function DrawerAppBarExample() {
    const actions: IAppBarActionProps[] = [
        {
            id: 'close',
            label: 'Close',
            visibilityPriority: 100,
            alwaysVisible: true,
            onPress: () => console.log('Close drawer')
        },
        {
            id: 'settings',
            label: 'Settings',
            visibilityPriority: 100,
            onPress: () => console.log('Settings pressed')
        }
    ];

    return (
        <AppBar
            title="Navigation"
            actions={actions}
            actionsProps={{
                viewportWidth: 350, // Drawer width
                responsiveConfig: createConstrainedResponsiveConfig(),
                overflowMenuAccessibilityLabel: "More navigation options"
            }}
        />
    );
}



// Example 3: Mobile-optimized AppBar
export function MobileAppBarExample() {
    const actions: IAppBarActionProps[] = [
        {
            id: 'search',
            label: 'Search',
            visibilityPriority: 100,
            onPress: () => console.log('Search pressed'),
            accessibility: {
                label: 'Search content',
                hint: 'Opens search interface'
            }
        },
        {
            id: 'filter',
            label: 'Filter',
            visibilityPriority: 20,
            onPress: () => console.log('Filter pressed')
        },
        {
            id: 'sort',
            label: 'Sort',
            visibilityPriority: 10,
            onPress: () => console.log('Sort pressed')
        }
    ];

    return (
        <AppBar
            title="Items"
            actions={actions}
            actionsProps={{
                enableVirtualization: true,
                accessibilityLabel: "Item management actions"
            }}
        />
    );
}

// Example 4: Custom responsive configuration
export function CustomResponsiveAppBarExample() {
    const customConfig = {
        breakpoints: [
            { width: 1000, maxActions: 5 },
            { width: 600, maxActions: 3 },
            { width: 400, maxActions: 2 }
        ],
        defaultMaxActions: 1
    };

    const actions: IAppBarActionProps[] = [
        {
            id: 'edit',
            label: 'Edit',
            visibilityPriority: 100,
            onPress: () => console.log('Edit pressed')
        },
        {
            id: 'duplicate',
            label: 'Duplicate',
            visibilityPriority: 20,
            onPress: () => console.log('Duplicate pressed')
        },
        {
            id: 'archive',
            label: 'Archive',
            visibilityPriority: 10,
            onPress: () => console.log('Archive pressed')
        },
        {
            id: 'delete',
            label: 'Delete',
            visibilityPriority: 10,
            onPress: () => console.log('Delete pressed')
        }
    ];

    return (
        <AppBar
            title="Custom Responsive"
            subtitle="Breakpoints: 1000px, 600px, 400px"
            actions={actions}
            actionsProps={{
                responsiveConfig: customConfig,
            }}
        />
    );
}

// Example 5: AppBar with grouped actions
export function GroupedActionsAppBarExample() {
    const actions: IAppBarActionProps[] = [
        // Edit group
        {
            id: 'undo',
            label: 'Undo',
            visibilityPriority: 100,
            group: 'edit',
            onPress: () => console.log('Undo pressed')
        },
        {
            id: 'redo',
            label: 'Redo',
            visibilityPriority: 100,
            group: 'edit',
            onPress: () => console.log('Redo pressed')
        },
        // Format group
        {
            id: 'bold',
            label: 'Bold',
            visibilityPriority: 20,
            group: 'format',
            onPress: () => console.log('Bold pressed')
        },
        {
            id: 'italic',
            label: 'Italic',
            visibilityPriority: 20,
            group: 'format',
            onPress: () => console.log('Italic pressed')
        },
        // View group
        {
            id: 'zoom-in',
            label: 'Zoom In',
            visibilityPriority: 10,
            group: 'view',
            minViewportWidth: 768,
            onPress: () => console.log('Zoom in pressed')
        },
        {
            id: 'zoom-out',
            label: 'Zoom Out',
            visibilityPriority: 10,
            group: 'view',
            minViewportWidth: 768,
            onPress: () => console.log('Zoom out pressed')
        }
    ];

    return (
        <AppBar
            title="Text Editor"
            actions={actions}
        />
    );
}
export function AppBarExamples() {
    return <>
        <H2>
            App Bar examples
        </H2>
        <BasicAppBarExample />
        <DrawerAppBarExample />
        <MobileAppBarExample />
        <CustomResponsiveAppBarExample />
        <GroupedActionsAppBarExample />
        <EnhancedVisibilityPriorityDemo />
        <AppBar
            backAction={false}
            actionsProps={{
                menuProps: {
                    renderAsNavigationMenuOnMobile: true,
                    anchorOpenIconName: "close",
                    anchorClosedIconName: "menu",
                }
            }}
            actions={[
                {
                    id: 'home',
                    label: 'Home',
                    icon: 'home'
                },
                {
                    id: 'send-money',
                    label: 'Send Money',
                    icon: 'send',
                },
                {
                    id: 'receive-money',
                    label: 'Receive Money',
                    icon: 'download'
                },
                {
                    id: 'rates',
                    label: 'Exchange Rates',
                    icon: 'trending-up'
                },
                {
                    id: 'business',
                    label: 'Business',
                    icon: 'briefcase',
                    items: [
                        {
                            id: 'business-send',
                            label: 'Mass Payments',
                            icon: 'account-multiple'
                        },
                        {
                            id: 'business-reports',
                            label: 'Reports',
                            icon: 'chart-bar'
                        }
                    ]
                },
                {
                    id: 'help',
                    label: 'Help & Support',
                    icon: 'help-circle'
                }
            ]}
        />
    </>
}

function createConstrainedResponsiveConfig(): IAppBarResponsiveConfig {
    return {
        breakpoints: [
            { width: 600, maxActions: 3 },
            { width: 400, maxActions: 2 },
            { width: 300, maxActions: 1 }
        ],
        defaultMaxActions: 1
    };
}

function createDesktopResponsiveConfig(): IAppBarResponsiveConfig {
    return {
        breakpoints: [
            { width: 1400, maxActions: 10 },
            { width: 1200, maxActions: 8 },
            { width: 992, maxActions: 6 },
            { width: 768, maxActions: 4 },
            { width: 576, maxActions: 3 },
            { width: 480, maxActions: 2 }
        ],
        defaultMaxActions: 3
    };
}


function EnhancedVisibilityPriorityDemo() {
    // Example actions with different priorities
    const actionsWithPriority = [
        {
            id: 'action1',
            label: 'First Action',
            visibilityPriority: 50, // Normal priority
            onPress: () => console.log('Action 1')
        },
        {
            id: 'action2',
            label: 'High Priority Action',
            visibilityPriority: 90, // High priority - should stay visible longer
            onPress: () => console.log('Action 2')
        },
        {
            id: 'action3',
            label: 'Low Priority Action',
            visibilityPriority: 20, // Low priority - first to go to overflow menu
            onPress: () => console.log('Action 3')
        },
        {
            id: 'action4',
            label: 'Medium Priority Action',
            visibilityPriority: 60, // Medium priority
            onPress: () => console.log('Action 4')
        },
        {
            id: 'action5',
            label: 'Another Low Priority',
            visibilityPriority: 30, // Low priority
            onPress: () => console.log('Action 5')
        }
    ];

    // Just 3 actions to test the "single menu item prevention" scenario
    const threeActions = [
        {
            id: 'action1',
            label: 'First Action',
            visibilityPriority: 50,
            onPress: () => console.log('Action 1')
        },
        {
            id: 'action2',
            label: 'High Priority',
            visibilityPriority: 90,
            onPress: () => console.log('Action 2')
        },
        {
            id: 'action3',
            label: 'Low Priority',
            visibilityPriority: 20,
            onPress: () => console.log('Action 3')
        }
    ];

    return (
        <div className="space-y-8 p-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Enhanced AppBar Overflow Logic</h1>
                <p className="text-gray-600">
                    This demo showcases the improved logic that prevents inefficient single-item overflow menus
                    and intelligently applies priority-based sorting only when it makes sense.
                </p>
            </div>

            <div className="grid gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3">✅ All Actions Fit (No Overflow)</h2>
                    <p className="text-gray-600 mb-4">
                        Wide container: Original order preserved, no priority sorting needed.
                    </p>
                    <div className="w-full border border-gray-300 rounded">
                        <AppBar
                            title="Wide Container"
                            actions={actionsWithPriority}
                            actionsProps={{
                                viewportWidth: 1200,
                                maxVisibleActions: 10
                            }}
                        />
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3">⚡ Smart Single-Item Prevention</h2>
                    <p className="text-gray-600 mb-4">
                        <strong>The Key Fix:</strong> 3 actions, space for 2. Instead of showing 1 action + menu with 1 item
                        (inefficient), it shows all 3 actions directly!
                    </p>
                    <div className="w-80 border border-gray-300 rounded">
                        <AppBar
                            title="Smart Logic Demo"
                            actions={threeActions}
                            actionsProps={{
                                viewportWidth: 350,
                                maxVisibleActions: 2 // Would normally create menu with 1 item - prevented!
                            }}
                        />
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                        💡 Result: All 3 actions shown directly instead of 2 actions + menu with 1 item
                    </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3">🎯 Meaningful Overflow with Priority</h2>
                    <p className="text-gray-600 mb-4">
                        5 actions, space for 3. Multiple items will go to menu, so priority sorting is applied.
                        High (90) and Medium (60) priority actions stay visible.
                    </p>
                    <div className="w-96 border border-gray-300 rounded">
                        <AppBar
                            title="Priority-Based Overflow"
                            actions={actionsWithPriority}
                            actionsProps={{
                                viewportWidth: 400,
                                maxVisibleActions: 3
                            }}
                        />
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                        📋 Menu contains: First (50), Another Low (30), Low Priority (20)
                    </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3">🔒 Very Constrained Space</h2>
                    <p className="text-gray-600 mb-4">
                        3 actions, space for only 1. Shows highest priority (90) directly, others go to menu.
                    </p>
                    <div className="w-48 border border-gray-300 rounded">
                        <AppBar
                            title="Tiny Space"
                            actions={threeActions}
                            actionsProps={{
                                viewportWidth: 280,
                                maxVisibleActions: 1
                            }}
                        />
                    </div>
                    <p className="text-sm text-orange-600 mt-2">
                        📋 Menu contains: First (50), Low Priority (20)
                    </p>
                </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">🧠 Smart Logic Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-medium text-green-700 mb-2">Prevention Logic:</h4>
                        <ul className="space-y-1 text-green-600">
                            <li>• Detects when overflow would create single-item menu</li>
                            <li>• Shows that item directly instead (more efficient)</li>
                            <li>• Saves user a click and visual clutter</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-green-700 mb-2">Priority Logic:</h4>
                        <ul className="space-y-1 text-green-600">
                            <li>• Only applies when meaningful overflow occurs</li>
                            <li>• Preserves original order when all fit</li>
                            <li>• High priority actions stay visible longer</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}