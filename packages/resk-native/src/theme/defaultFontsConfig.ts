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

export const defaultTextStylesVariants= {
    displayLarge: {
        lineHeight: 64,
        letterSpacing: 0,
    },
    displayMedium: {
        fontSize: 45,
        lineHeight: 52,
        letterSpacing: 0,
    },
    displaySmall: {
        fontSize: 36,
        lineHeight: 44,
        letterSpacing: 0,
    },
    headlineLarge: {
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: 0,
    },
    headlineMedium: {
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: 0,
    },
    headlineSmall: {
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 0,
    },
    titleLarge: {
        fontSize: 22,
        lineHeight: 28,
        letterSpacing: 0,
    },
    titleMedium: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.15,
    },
    titleSmall: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    labelLarge: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    labelMedium: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
    },
    labelSmall: {
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.5,
    },
    bodyLarge: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.5,
    },
    bodyMedium: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
    },
    bodySmall: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
    },
}