import { IThemeColorsTokens } from "@theme/types";

const lightTheme: IThemeColorsTokens = {
    primary: '#007AFF', // iOS blue (matches system blue)
    onPrimary: '#FFFFFF', // White text/icons on primary
    primaryContainer: '#E8F5FE', // Light blue container
    onPrimaryContainer: '#002C66', // Dark blue text/icons on primary container

    secondary: '#595959', // Neutral gray
    onSecondary: '#FFFFFF', // White text/icons on secondary
    secondaryContainer: '#F2F2F7', // Light gray container (matches iOS gray)
    onSecondaryContainer: '#1C1C1E', // Dark gray text/icons on secondary container

    tertiary: '#BF5AF2', // Purple accent (matches iOS purple)
    onTertiary: '#FFFFFF', // White text/icons on tertiary
    tertiaryContainer: '#F3E8FF', // Light purple container
    onTertiaryContainer: '#380061', // Dark purple text/icons on tertiary container

    background: '#FFFFFF', // White background
    onBackground: '#000000', // Black text/icons on background

    surface: '#FFFFFF', // White surface
    onSurface: '#000000', // Black text/icons on surface
    surfaceVariant: '#F2F2F7', // Light gray surface variant
    onSurfaceVariant: '#3A3A3C', // Dark gray text/icons on surface variant

    outline: '#D1D1D6', // Light gray outline
    outlineVariant: '#E5E5EA', // Slightly lighter gray outline

    inverseSurface: '#1C1C1E', // Dark surface for inverted contexts
    inverseOnSurface: '#FFFFFF', // White text/icons on inverse surface
    inversePrimary: '#A0C7FF', // Light blue for inverted primary

    error: '#FF3B30', // Red error color (matches iOS red)
    onError: '#FFFFFF', // White text/icons on error
    errorContainer: '#FFE5E3', // Light red container
    onErrorContainer: '#410002', // Dark red text/icons on error container

    shadow: '#000000', // Black shadow
    scrim: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black scrim
    surfaceDisabled: '#E5E5EA', // Disabled surface (light gray)
    onSurfaceDisabled: '#A3A3A3', // Disabled text/icons (medium gray)
    backdrop: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black backdrop

    surfaceContainer: '#FFFFFF', // White container
    surfaceContainerLow: '#FAFAFA', // Very light gray container
    surfaceContainerLowest: '#FCFCFC', // Almost white container
    surfaceContainerHigh: '#F5F5F5', // Light gray container
    surfaceContainerHighest: '#E0E0E0', // Medium gray container
    surfaceBright: '#FFFFFF', // Bright white surface
    surfaceDim: '#F0F0F0', // Dimmed light gray surface
    surfaceTint: '#007AFF', // Primary blue tint

    elevation: {
        level0: 'none',
        level1: '0px 1px 2px rgba(0, 0, 0, 0.1)',
        level2: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        level3: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        level4: '0px 6px 12px rgba(0, 0, 0, 0.1)',
        level5: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    },

    statusBar: '#000000', // Black status bar text
    text: '#000000', // Black text/icons
    placeholder: '#A3A3A3', // Gray placeholder text
    info: '#007AFF', // Blue info color
    onInfo: '#FFFFFF', // White text/icons on info
    success: '#34C759', // Green success color
    onSuccess: '#FFFFFF', // White text/icons on success
    warning: '#FF9500', // Orange warning color
    onWarning: '#000000', // Black text/icons on warning
};

export default lightTheme;