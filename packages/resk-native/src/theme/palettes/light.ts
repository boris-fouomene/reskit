import { IThemeColorsTokens } from "@theme/types";

const LightThemeColors: IThemeColorsTokens = {
    primary: '#6750A4', // Deep purple (main brand color)
    onPrimary: '#FFFFFF', // White text/icons on primary
    primaryContainer: '#EADDFF', // Light purple container
    onPrimaryContainer: '#21005D', // Dark text/icons on primary container

    secondary: '#625B71', // Muted purple-gray
    onSecondary: '#FFFFFF', // White text/icons on secondary
    secondaryContainer: '#E8DEF8', // Light purple-gray container
    onSecondaryContainer: '#1D192B', // Dark text/icons on secondary container

    tertiary: '#7D5260', // Muted pink-brown
    onTertiary: '#FFFFFF', // White text/icons on tertiary
    tertiaryContainer: '#FFD8E4', // Light pink-brown container
    onTertiaryContainer: '#31111D', // Dark text/icons on tertiary container

    background: '#FFFBFF', // Very light gray/white background
    onBackground: '#1C1B1F', // Dark text/icons on background

    surface: '#FFFFFF', // White surface
    onSurface: '#1C1B1F', // Dark text/icons on surface

    surfaceVariant: '#E7E0EC', // Slightly darker/lighter surface for differentiation
    onSurfaceVariant: '#49454F', // Dark text/icons on surface variant

    outline: '#79747E', // Light gray outline for borders/dividers
    outlineVariant: '#C4C7C5', // Even lighter gray outline

    inverseSurface: '#313033', // Dark surface for inverted contexts
    inverseOnSurface: '#F4EFF4', // Light text/icons on inverse surface
    inversePrimary: '#D0BCFF', // Light purple for inverted primary

    error: '#B3261E', // Bright red for errors
    onError: '#FFFFFF', // White text/icons on error
    errorContainer: '#F9DEDC', // Light red container for errors
    onErrorContainer: '#410002', // Dark text/icons on error container

    shadow: '#000000', // Black shadow for elevation
    scrim: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black scrim
    backdrop: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black backdrop

    surfaceContainer: '#FFFFFF', // White container for grouping content
    statusBar: '#000000', // Black status bar
    text: '#1C1B1F', // Dark text/icons
    placeholder: '#A3A3A3', // Gray placeholder text
    info: '#2196F3', // Blue for informational messages
    onInfo: '#FFFFFF', // White text/icons on info
    success: '#4CAF50', // Green for success states
    onSuccess: '#FFFFFF', // White text/icons on success
    warning: '#FF9800', // Orange for warnings
    onWarning: '#000000', // Black text/icons on warning
};

export default LightThemeColors;