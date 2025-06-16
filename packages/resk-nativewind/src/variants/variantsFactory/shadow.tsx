import { VariantsGeneratedColors } from "@variants/generated-variants-colors";


export const ShadowClasses = {
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
};

export const ShadowColorsClasses = VariantsGeneratedColors.shadow;