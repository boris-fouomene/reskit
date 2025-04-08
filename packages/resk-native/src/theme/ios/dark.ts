import { IThemeColorsTokens } from "@theme/types";

const darkTheme: IThemeColorsTokens = {
    primary: '#0A84FF', // Bright blue for dark mode
    onPrimary: '#FFFFFF', // White text/icons on primary
    primaryContainer: '#004BA5', // Dark blue container
    onPrimaryContainer: '#A0C7FF', // Light blue text/icons on primary container

    secondary: '#AEAEB2', // Light gray
    onSecondary: '#000000', // Black text/icons on secondary
    secondaryContainer: '#2C2C2E', // Dark gray container
    onSecondaryContainer: '#E5E5EA', // Light gray text/icons on secondary container

    tertiary: '#D2A8FF', // Light purple
    onTertiary: '#000000', // Black text/icons on tertiary
    tertiaryContainer: '#4B0082', // Dark purple container
    onTertiaryContainer: '#EAD1FF', // Light purple text/icons on tertiary container

    background: '#000000', // Black background
    onBackground: '#FFFFFF', // White text/icons on background

    surface: '#1C1C1E', // Dark surface
    onSurface: '#FFFFFF', // White text/icons on surface
    surfaceVariant: '#2C2C2E', // Dark gray surface variant
    onSurfaceVariant: '#AEAEB2', // Light gray text/icons on surface variant

    outline: '#3A3A3C', // Dark gray outline
    outlineVariant: '#48484A', // Slightly lighter gray outline

    inverseSurface: '#FFFFFF', // White surface for inverted contexts
    inverseOnSurface: '#000000', // Black text/icons on inverse surface
    inversePrimary: '#004BA5', // Dark blue for inverted primary

    error: '#FF453A', // Bright red error color
    onError: '#FFFFFF', // White text/icons on error
    errorContainer: '#410002', // Dark red container
    onErrorContainer: '#FFDAD6', // Light red text/icons on error container

    shadow: '#000000', // Black shadow
    scrim: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black scrim
    surfaceDisabled: '#2C2C2E', // Disabled surface (dark gray)
    onSurfaceDisabled: '#48484A', // Disabled text/icons (medium gray)
    backdrop: 'rgba(255, 255, 255, 0.4)', // Semi-transparent white backdrop

    surfaceContainer: '#1C1C1E', // Dark container
    surfaceContainerLow: '#252528', // Slightly lighter dark container
    surfaceContainerLowest: '#1C1C1E', // Darkest container
    surfaceContainerHigh: '#3A3A3C', // Medium dark container
    surfaceContainerHighest: '#48484A', // Lighter dark container
    surfaceBright: '#2C2C2E', // Bright dark surface
    surfaceDim: '#1C1C1E', // Dimmed dark surface
    surfaceTint: '#0A84FF', // Bright blue tint

    elevation: {
        level0: 'none',
        level1: '0px 1px 2px rgba(255, 255, 255, 0.1)',
        level2: '0px 2px 4px rgba(255, 255, 255, 0.1)',
        level3: '0px 4px 8px rgba(255, 255, 255, 0.1)',
        level4: '0px 6px 12px rgba(255, 255, 255, 0.1)',
        level5: '0px 8px 16px rgba(255, 255, 255, 0.1)',
    },

    statusBar: '#FFFFFF', // White status bar text
    text: '#FFFFFF', // White text/icons
    placeholder: '#48484A', // Medium gray placeholder text
    info: '#0A84FF', // Bright blue info color
    onInfo: '#FFFFFF', // White text/icons on info
    success: '#30D158', // Bright green success color
    onSuccess: '#000000', // Black text/icons on success
    warning: '#FF9F0A', // Bright orange warning color
    onWarning: '#000000', // Black text/icons on warning
};

export default darkTheme;
