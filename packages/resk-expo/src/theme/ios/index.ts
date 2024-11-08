import { DynamicColorIOS } from 'react-native';

const material3Theme = {
    colors: {
        /** Main brand color, used for prominent UI elements */
        primary: DynamicColorIOS({ light: '#6200EE', dark: '#BB86FC' }),

        /** Secondary color for highlights or less prominent actions */
        secondary: DynamicColorIOS({ light: '#03DAC6', dark: '#03DAC6' }),

        /** Primary background color for main views */
        background: DynamicColorIOS({ light: '#FFFFFF', dark: '#121212' }),

        /** Surface color for components like cards or modals */
        surface: DynamicColorIOS({ light: '#FFFFFF', dark: '#1E1E1E' }),

        /** Divider and outline color to separate content subtly */
        outline: DynamicColorIOS({ light: '#E0E0E0', dark: '#373737' }),

        /** High-emphasis text color for primary information */
        textPrimary: DynamicColorIOS({ light: '#000000', dark: '#FFFFFF' }),

        /** Medium-emphasis text for secondary information */
        textSecondary: DynamicColorIOS({ light: '#757575', dark: '#B3B3B3' }),

        /** Color for error messages or error states */
        error: DynamicColorIOS({ light: '#B00020', dark: '#CF6679' }),

        /** Color for success messages or confirmations */
        success: DynamicColorIOS({ light: '#388E3C', dark: '#66BB6A' }),
    },

    spacing: {
        /** Small spacing, useful for compact padding or margins */
        small: 4,

        /** Medium spacing for moderate separation of UI elements */
        medium: 8,

        /** Large spacing for significant separation between elements */
        large: 16,
    },

    typography: {
        fontSize: {
            /** Small font size for captions or helper text */
            small: 12,

            /** Default font size for body text */
            medium: 16,

            /** Large font size for titles or headings */
            large: 24,
        },
        fontWeight: {
            /** Regular font weight, generally used for body text */
            regular: '400',

            /** Medium font weight for subheadings or highlighted text */
            medium: '500',

            /** Bold font weight for headings and titles */
            bold: '700',
        },
    },

    elevation: {
        /** Low elevation for subtle shadows, used on components like cards */
        low: {
            shadowColor: '#000000',
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },

        /** Medium elevation for more prominent shadows, like on modals */
        medium: {
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
        },

        /** High elevation for floating elements, such as a floating action button */
        high: {
            shadowColor: '#000000',
            shadowOpacity: 0.3,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 4 },
        },
    },
};

export default material3Theme;
