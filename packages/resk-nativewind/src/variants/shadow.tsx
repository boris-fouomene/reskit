import { tv } from 'tailwind-variants';

// Define the surface component with shadow variants
export const surface = tv({
    base: 'bg-white dark:bg-gray-900 rounded-lg',
    variants: {
        // Shadow variants from subtle to intense
        shadow: {
            // No shadow
            none: 'shadow-none',

            // Subtle shadows
            xs: 'shadow-sm dark:shadow-gray-950/30',
            sm: 'shadow dark:shadow-gray-950/30',

            // Medium shadows
            md: 'shadow-md dark:shadow-gray-950/40',
            lg: 'shadow-lg dark:shadow-gray-950/40',

            // Intense shadows
            xl: 'shadow-xl dark:shadow-gray-950/50',
            '2xl': 'shadow-2xl dark:shadow-gray-950/50',

            // Special purpose shadows
            inner: 'shadow-inner dark:shadow-gray-950/20',

            // Platform-specific shadows for mobile
            // iOS-style shadows (softer, more spread)
            ios: [
                'shadow-lg',
                'shadow-black/10 dark:shadow-gray-950/30',
                'shadow-opacity-50',
                'shadow-offset-[0px_3px]',
                'shadow-radius-[10px]'
            ],

            // Android-style shadows (sharper, more defined)
            android: [
                'shadow-md',
                'shadow-black/25 dark:shadow-gray-950/40',
                'shadow-opacity-70',
                'shadow-offset-[0px_2px]',
                'shadow-radius-[4px]'
            ],

            // Material Design elevation shadows with dark mode
            'elevation-1': [
                'shadow-sm',
                'shadow-black/10 dark:shadow-gray-950/30',
                'shadow-offset-[0px_1px]',
                'shadow-radius-[3px]'
            ],
            'elevation-2': [
                'shadow',
                'shadow-black/15 dark:shadow-gray-950/35',
                'shadow-offset-[0px_2px]',
                'shadow-radius-[6px]'
            ],
            'elevation-3': [
                'shadow-md',
                'shadow-black/20 dark:shadow-gray-950/40',
                'shadow-offset-[0px_3px]',
                'shadow-radius-[8px]'
            ],
            'elevation-4': [
                'shadow-lg',
                'shadow-black/25 dark:shadow-gray-950/45',
                'shadow-offset-[0px_4px]',
                'shadow-radius-[12px]'
            ],
            'elevation-5': [
                'shadow-xl',
                'shadow-black/30 dark:shadow-gray-950/50',
                'shadow-offset-[0px_6px]',
                'shadow-radius-[16px]'
            ],

            // Color variants with dark mode support
            primary: 'shadow-md shadow-primary/20 dark:shadow-primary/30',
            secondary: 'shadow-md shadow-secondary/20 dark:shadow-secondary/30',
            success: 'shadow-md shadow-success/20 dark:shadow-success/30',
            warning: 'shadow-md shadow-warning/20 dark:shadow-warning/30',
            danger: 'shadow-md shadow-danger/20 dark:shadow-danger/30',
            info: 'shadow-md shadow-info/20 dark:shadow-info/30',

            // Directional shadows with dark mode
            top: [
                'shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)]',
                'dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3),0_-2px_4px_-2px_rgba(0,0,0,0.2)]'
            ],
            right: [
                'shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1),2px_0_4px_-2px_rgba(0,0,0,0.1)]',
                'dark:shadow-[4px_0_6px_-1px_rgba(0,0,0,0.3),2px_0_4px_-2px_rgba(0,0,0,0.2)]'
            ],
            bottom: [
                'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]',
                'dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.2)]'
            ],
            left: [
                'shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1),-2px_0_4px_-2px_rgba(0,0,0,0.1)]',
                'dark:shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.3),-2px_0_4px_-2px_rgba(0,0,0,0.2)]'
            ],
        },

        // Add responsive shadow behavior
        responsive: {
            true: 'sm:shadow md:shadow-md lg:shadow-lg',
        },

        // Add interactive shadow behavior
        interactive: {
            true: 'hover:shadow-lg active:shadow-sm transition-shadow duration-200',
        },

        // Shadow color variants for combining with shadow sizes
        shadowColor: {
            none: '',
            primary: 'shadow-primary/20 dark:shadow-primary/30',
            secondary: 'shadow-secondary/20 dark:shadow-secondary/30',
            success: 'shadow-success/20 dark:shadow-success/30',
            warning: 'shadow-warning/20 dark:shadow-warning/30',
            danger: 'shadow-danger/20 dark:shadow-danger/30',
            info: 'shadow-info/20 dark:shadow-info/30',
            purple: 'shadow-purple-500/20 dark:shadow-purple-500/30',
            pink: 'shadow-pink-500/20 dark:shadow-pink-500/30',
            blue: 'shadow-blue-500/20 dark:shadow-blue-500/30',
            indigo: 'shadow-indigo-500/20 dark:shadow-indigo-500/30',
            green: 'shadow-green-500/20 dark:shadow-green-500/30',
            red: 'shadow-red-500/20 dark:shadow-red-500/30',
            yellow: 'shadow-yellow-500/20 dark:shadow-yellow-500/30',
            orange: 'shadow-orange-500/20 dark:shadow-orange-500/30',
        },

        // Add border radius variants (often used with shadows)
        rounded: {
            none: 'rounded-none',
            sm: 'rounded-sm',
            md: 'rounded',
            lg: 'rounded-lg',
            xl: 'rounded-xl',
            full: 'rounded-full',
        },

        // Dark mode specific variant for toggling shadow appearance
        darkModeShadow: {
            enhanced: 'dark:shadow-lg dark:shadow-opacity-80',
            reduced: 'dark:shadow-sm dark:shadow-opacity-30',
            none: 'dark:shadow-none'
        }
    },
    defaultVariants: {
        shadow: 'md',
        rounded: 'lg',
    },

    // Compound variants for common combinations
    compoundVariants: [
        // Colored shadows with different intensities
        {
            shadow: 'md',
            shadowColor: 'primary',
            class: 'shadow-md shadow-primary/20 dark:shadow-primary/30'
        },
        {
            shadow: 'lg',
            shadowColor: 'primary',
            class: 'shadow-lg shadow-primary/25 dark:shadow-primary/35'
        },
        {
            shadow: 'xl',
            shadowColor: 'primary',
            class: 'shadow-xl shadow-primary/30 dark:shadow-primary/40'
        },
        // Repeat pattern for other colors as needed...
    ]
});

// Example usage:
// Basic usage
const cardClass = surface({ shadow: 'md' });

// With dark mode consideration
const darkModeAwareCard = surface({ shadow: 'md', darkModeShadow: 'enhanced' });

// Combining shadow size with shadow color
const blueCard = surface({ shadow: 'lg', shadowColor: 'blue' });

// Using compound variants for predefined combinations
const primaryCard = surface({ shadow: 'xl', shadowColor: 'primary' });

// With interactive states
const buttonSurface = surface({
    shadow: 'md',
    shadowColor: 'success',
    interactive: true,
    darkModeShadow: 'enhanced'
});