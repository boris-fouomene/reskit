import { IThemeFontsConfig } from "./types";

export const defaultFontsConfig: IThemeFontsConfig = {
    web: {
        regular: {
            fontFamily: 'apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif',
            fontWeight: '400' as '400',
        },
        medium: {
            fontFamily: 'apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif',
            fontWeight: '500' as '500',
        },
        light: {
            fontFamily: 'apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif',
            fontWeight: '300' as '300',
        },
        thin: {
            fontFamily: 'apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif',
            fontWeight: '100' as '100',
        },
    },
    ios: {
        regular: {
            fontFamily: 'System',
            fontWeight: '400' as '400',
        },
        medium: {
            fontFamily: 'System',
            fontWeight: '500' as '500',
        },
        light: {
            fontFamily: 'System',
            fontWeight: '300' as '300',
        },
        thin: {
            fontFamily: 'System',
            fontWeight: '100' as '100',
        },
    },
    android: {
        regular: {
            fontFamily: "Roboto-Regular",
        },
        medium: {
            fontFamily: "Roboto-Medium",
        },
        light: {
            fontFamily: "Roboto-Light",
        },
        thin: {
            fontFamily: "Roboto-Thin",
        }
    },
    default: {
        regular: {
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'sans-serif-light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'sans-serif-thin',
            fontWeight: 'normal',
        },
    },
};

export const defaultTextStylesVariants = {
    displayLarge: {
        lineHeight: 64,
        fontSize: 57,
    },
    displayMedium: {
        lineHeight: 52,
        fontSize: 45,
    },
    displaySmall: {
        lineHeight: 44,
        fontSize: 36,
    },
    headlineLarge: {
        lineHeight: 40,
        fontSize: 32,
    },
    headlineMedium: {
        lineHeight: 36,
        fontSize: 28,
    },
    headlineSmall: {
        lineHeight: 32,
        fontSize: 24,
    },
    titleLarge: {
        lineHeight: 28,
        fontSize: 22,
    },
    titleMedium: {
        lineHeight: 24,
        fontSize: 16,
    },
    titleSmall: {
        letterSpacing: 0.1,
        lineHeight: 20,
        fontSize: 14,
    },
    labelLarge: {
        letterSpacing: 0.1,
        lineHeight: 20,
        fontSize: 14,
    },
    labelMedium: {
        letterSpacing: 0.5,
        lineHeight: 16,
        fontSize: 12,
    },
    labelSmall: {
        letterSpacing: 0.5,
        lineHeight: 16,
        fontSize: 11,
    },
    bodyLarge: {
        lineHeight: 24,
        fontSize: 16,
    },
    bodyMedium: {
        letterSpacing: 0.25,
        lineHeight: 20,
        fontSize: 14,
    },
    bodySmall: {
        letterSpacing: 0.4,
        lineHeight: 16,
        fontSize: 12,
    },
}