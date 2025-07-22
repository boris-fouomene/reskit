/**
 * Common Context-Aware Styling Patterns
 * 
 * Examples of the most common use cases for onAppBarClassName and onMenuClassName
 */

// Note: In real usage, import from your actual types path
// import { IAppBarActionProps } from '@resk/nativewind/components/AppBar/types';

// Simplified type definition for the example
type ExampleActionProps = {
    id: string;
    label: string;
    icon?: string;
    visibilityPriority?: number;
    onAppBarClassName?: string;
    onMenuClassName?: string;
    onPress?: () => void;
};

// ===== COMMON STYLING PATTERNS =====

export const primaryActionExample: ExampleActionProps = {
    id: 'save',
    label: 'Save',
    icon: 'save',
    visibilityPriority: 90,

    // Primary button styling when on AppBar
    onAppBarClassName: 'bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90',

    // Primary menu item styling when in menu
    onMenuClassName: 'text-primary hover:bg-primary/10 font-medium',

    onPress: () => console.log('Save')
};

export const destructiveActionExample: ExampleActionProps = {
    id: 'delete',
    label: 'Delete',
    icon: 'trash',
    visibilityPriority: 40,

    // Warning button styling when on AppBar
    onAppBarClassName: 'bg-destructive text-destructive-foreground px-3 py-2 rounded-md hover:bg-destructive/90',

    // Warning menu item styling when in menu
    onMenuClassName: 'text-destructive hover:bg-destructive/10',

    onPress: () => console.log('Delete')
};

export const secondaryActionExample: ExampleActionProps = {
    id: 'share',
    label: 'Share',
    icon: 'share',
    visibilityPriority: 70,

    // Subtle button styling when on AppBar
    onAppBarClassName: 'bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:bg-secondary/80',

    // Standard menu item styling when in menu
    onMenuClassName: 'text-foreground hover:bg-accent hover:text-accent-foreground',

    onPress: () => console.log('Share')
};

export const iconOnlyActionExample: ExampleActionProps = {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    visibilityPriority: 30,

    // Icon button styling when on AppBar (no padding for icon-only)
    onAppBarClassName: 'hover:bg-accent hover:text-accent-foreground rounded-md p-2',

    // Standard menu item with text when in menu
    onMenuClassName: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',

    onPress: () => console.log('Settings')
};

// ===== RESPONSIVE STYLING PATTERNS =====

export const responsiveActionExample: ExampleActionProps = {
    id: 'export',
    label: 'Export',
    icon: 'download',
    visibilityPriority: 50,

    // Show text on larger screens, icon-only on smaller screens
    onAppBarClassName: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-md hidden sm:flex sm:px-4 md:px-6',

    // Full text always visible in menu
    onMenuClassName: 'text-foreground hover:bg-accent flex items-center space-x-2',

    onPress: () => console.log('Export')
};

// ===== BRAND-SPECIFIC STYLING PATTERNS =====

export const brandedActionExample: ExampleActionProps = {
    id: 'upgrade',
    label: 'Upgrade to Pro',
    icon: 'crown',
    visibilityPriority: 80,

    // Premium gold styling when on AppBar
    onAppBarClassName: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-md font-semibold shadow-sm',

    // Premium styling in menu with accent
    onMenuClassName: 'text-yellow-600 hover:bg-yellow-50 font-medium flex items-center space-x-2',

    onPress: () => console.log('Upgrade')
};

// ===== USAGE EXAMPLES =====

export const exampleActionList: ExampleActionProps[] = [
    primaryActionExample,
    secondaryActionExample,
    destructiveActionExample,
    iconOnlyActionExample,
    responsiveActionExample,
    brandedActionExample
];

// ===== TAILWIND CLASS COMBINATIONS =====

export const commonPatterns = {
    // Primary action patterns
    primaryAppBar: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium',
    primaryMenu: 'text-blue-600 hover:bg-blue-50 font-medium',

    // Secondary action patterns  
    secondaryAppBar: 'bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md',
    secondaryMenu: 'text-gray-600 hover:bg-gray-50',

    // Destructive action patterns
    destructiveAppBar: 'bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md',
    destructiveMenu: 'text-red-600 hover:bg-red-50 hover:text-red-700',

    // Icon-only patterns
    iconOnlyAppBar: 'hover:bg-gray-100 p-2 rounded-md transition-colors',
    iconOnlyMenu: 'text-gray-600 hover:bg-gray-50',

    // Responsive patterns
    responsiveAppBar: 'bg-gray-100 hover:bg-gray-200 px-2 py-2 sm:px-4 md:px-6 rounded-md',
    responsiveMenu: 'text-gray-600 hover:bg-gray-50 flex items-center space-x-2'
};

export default {
    primaryActionExample,
    destructiveActionExample,
    secondaryActionExample,
    iconOnlyActionExample,
    responsiveActionExample,
    brandedActionExample,
    exampleActionList,
    commonPatterns
};
