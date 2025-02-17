/**
 * iOS Colors mapped to Material 3 Theme Structure
 * Combines iOS Human Interface Guidelines colors with Material 3 theme organization
 */

export const iosTheme = {
    colors: {
        light: {
            // Main brand color (iOS Blue)
            primary: '#007AFF',
            onPrimary: '#FFFFFF',
            primaryContainer: '#E5F1FF',
            onPrimaryContainer: '#003166',

            // Secondary actions (iOS Gray)
            secondary: '#8E8E93',
            onSecondary: '#FFFFFF',
            secondaryContainer: '#F2F2F7',
            onSecondaryContainer: '#1C1C1E',

            // Tertiary actions (iOS Purple)
            tertiary: '#AF52DE',
            onTertiary: '#FFFFFF',
            tertiaryContainer: '#F5E1FF',
            onTertiaryContainer: '#4A0063',

            // Error states (iOS Red)
            error: '#FF3B30',
            onError: '#FFFFFF',
            errorContainer: '#FFE5E5',
            onErrorContainer: '#660C00',

            // Background colors
            background: '#FFFFFF',
            onBackground: '#000000',
            surface: '#FFFFFF',
            onSurface: '#000000',
            surfaceVariant: '#F2F2F7',
            onSurfaceVariant: '#3C3C43',

            // Outline and decorative elements
            outline: 'rgba(60, 60, 67, 0.29)', // iOS separator
            outlineVariant: 'rgba(60, 60, 67, 0.18)', // iOS quaternaryLabel

            // System elements
            shadow: 'rgba(0, 0, 0, 0.3)',
            scrim: 'rgba(0, 0, 0, 0.3)',

            // Inverse colors
            inverseSurface: '#1C1C1E',
            inverseOnSurface: '#FFFFFF',
            inversePrimary: '#9CC9FF',
        },
        dark: {
            // Main brand color (iOS Blue)
            primary: '#0A84FF',
            onPrimary: '#FFFFFF',
            primaryContainer: '#153258',
            onPrimaryContainer: '#B8D9FF',

            // Secondary actions (iOS Gray)
            secondary: '#98989F',
            onSecondary: '#FFFFFF',
            secondaryContainer: '#38383A',
            onSecondaryContainer: '#E8E8ED',

            // Tertiary actions (iOS Purple)
            tertiary: '#BF5AF2',
            onTertiary: '#FFFFFF',
            tertiaryContainer: '#4A2358',
            onTertiaryContainer: '#F4DAFF',

            // Error states (iOS Red)
            error: '#FF453A',
            onError: '#FFFFFF',
            errorContainer: '#481A1D',
            onErrorContainer: '#FFD1CF',

            // Background colors
            background: '#000000',
            onBackground: '#FFFFFF',
            surface: '#1C1C1E',
            onSurface: '#FFFFFF',
            surfaceVariant: '#2C2C2E',
            onSurfaceVariant: '#EBEBF0',

            // Outline and decorative elements
            outline: 'rgba(84, 84, 88, 0.65)', // iOS separator dark
            outlineVariant: 'rgba(84, 84, 88, 0.45)', // iOS quaternaryLabel dark

            // System elements
            shadow: 'rgba(0, 0, 0, 0.5)',
            scrim: 'rgba(0, 0, 0, 0.5)',

            // Inverse colors
            inverseSurface: '#F2F2F7',
            inverseOnSurface: '#000000',
            inversePrimary: '#006BE6',
        }
    }
};