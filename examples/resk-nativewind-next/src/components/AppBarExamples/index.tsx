"use client";
import {
    AppBar,
    IAppBarActionProps,
    IAppBarResponsiveConfig,
} from '@resk/nativewind/components/appBar';



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
                menuProps: {
                    position: "bottom-left" as any, // Note: This would need proper typing
                    className: "custom-menu-style"
                }
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
        {/* <BasicAppBarExample />
        <DrawerAppBarExample />
        <MobileAppBarExample />
        <CustomResponsiveAppBarExample />
         */}<GroupedActionsAppBarExample />
        <AppBar
            backAction={false}
            actionsProps={{
                menuProps: {
                    fullScreenOnMobile: true,
                    renderAsBottomSheetInFullScreen: false,
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
/**
 * Creates a responsive configuration for drawer/modal contexts.
 * 
 * @returns IAppBarResponsiveConfig optimized for constrained containers
 */
export function createConstrainedResponsiveConfig(): IAppBarResponsiveConfig {
    return {
        breakpoints: [
            { width: 600, maxActions: 3 },
            { width: 400, maxActions: 2 },
            { width: 300, maxActions: 1 }
        ],
        defaultMaxActions: 1
    };
}

/**
 * Creates a responsive configuration for mobile-first design.
 * 
 * @returns IAppBarResponsiveConfig optimized for mobile devices
 */
export function createMobileResponsiveConfig(): IAppBarResponsiveConfig {
    return {
        breakpoints: [
            { width: 768, maxActions: 4 },
            { width: 576, maxActions: 3 },
            { width: 480, maxActions: 2 },
            { width: 320, maxActions: 1 }
        ],
        defaultMaxActions: 1
    };
}

/**
 * Creates a responsive configuration for desktop-first design.
 * 
 * @returns IAppBarResponsiveConfig optimized for desktop environments
 */
export function createDesktopResponsiveConfig(): IAppBarResponsiveConfig {
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