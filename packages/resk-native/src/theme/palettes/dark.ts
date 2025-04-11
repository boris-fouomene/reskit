import { IThemeColorsTokens } from "@theme/types";

const DarkThemeColors: IThemeColorsTokens = {
    primary: '#D0BCFF', // Light purple (main brand color in dark mode)
    onPrimary: '#381E72', // Dark text/icons on primary
    primaryContainer: '#4F378B', // Dark purple container
    onPrimaryContainer: '#EADDFF', // Light text/icons on primary container

    secondary: '#CCC2DC', // Light purple-gray
    onSecondary: '#332D41', // Dark text/icons on secondary
    secondaryContainer: '#4A4458', // Dark purple-gray container
    onSecondaryContainer: '#E8DEF8', // Light text/icons on secondary container

    tertiary: '#EFB8C8', // Light pink-brown
    onTertiary: '#492532', // Dark text/icons on tertiary
    tertiaryContainer: '#633B48', // Dark pink-brown container
    onTertiaryContainer: '#FFD8E4', // Light text/icons on tertiary container

    background: '#1C1B1F', // Dark gray background
    onBackground: '#E6E1E5', // Light text/icons on background

    surface: '#1C1B1F', // Dark surface
    onSurface: '#E6E1E5', // Light text/icons on surface

    surfaceVariant: '#49454F', // Darker surface for differentiation
    onSurfaceVariant: '#CAC4D0', // Light text/icons on surface variant

    outline: '#938F99', // Light gray outline for borders/dividers
    outlineVariant: '#49454F', // Even lighter gray outline

    inverseSurface: '#E6E1E5', // Light surface for inverted contexts
    inverseOnSurface: '#313033', // Dark text/icons on inverse surface
    inversePrimary: '#6750A4', // Dark purple for inverted primary

    error: '#F2B8B5', // Light red for errors
    onError: '#601410', // Dark text/icons on error
    errorContainer: '#8C1D18', // Dark red container for errors
    onErrorContainer: '#F9DEDC', // Light text/icons on error container

    shadow: '#000000', // Black shadow for elevation
    scrim: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black scrim
    backdrop: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black backdrop

    surfaceContainer: '#1C1B1F', // Dark container for grouping content

    statusBar: '#FFFFFF', // White status bar
    text: '#E6E1E5', // Light text/icons
    placeholder: '#A3A3A3', // Gray placeholder text
    info: '#2196F3', // Blue for informational messages
    onInfo: '#FFFFFF', // White text/icons on info
    success: '#4CAF50', // Green for success states
    onSuccess: '#FFFFFF', // White text/icons on success
    warning: '#FF9800', // Orange for warnings
    onWarning: '#000000', // Black text/icons on warning
};

export default DarkThemeColors;