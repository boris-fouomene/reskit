import { argbFromHex, Scheme, themeFromSourceColor, TonalPalette } from '@material/material-color-utilities';
import color from 'color';
import { IThemeColorsTokens } from '../types';

const opacity = {
    level1: 0.08,
    level2: 0.12,
    level3: 0.16,
    level4: 0.38,
};

const elevations = ['transparent', 0.05, 0.08, 0.11, 0.12, 0.14];

type Palettes = {
    primary: TonalPalette;
    secondary: TonalPalette;
    tertiary: TonalPalette;
    neutral: TonalPalette;
    neutralVariant: TonalPalette;
    error: TonalPalette;
};

export function createMaterial3ThemeFromTokens(schemes: { light: IThemeColorsTokens; dark: IThemeColorsTokens }): { light: IThemeColorsTokens, dark: IThemeColorsTokens } {
    const { light, dark, palettes } = generateSchemesFromSourceColor(schemes.light.primary);
    schemes = {
        light: { ...light, ...schemes.light },
        dark: { ...dark, ...schemes.dark },
    };

    return {
        light: { ...schemes.light, ...generateMissingFields(schemes.light, palettes, 'light') } as IThemeColorsTokens,
        dark: { ...schemes.dark, ...generateMissingFields(schemes.dark, palettes, 'dark') } as IThemeColorsTokens,
    };
}

export function createMaterial3Theme(sourceColor: string): { light: IThemeColorsTokens, dark: IThemeColorsTokens } {
    const { light, dark, palettes } = generateSchemesFromSourceColor(sourceColor);
    return {
        light: { ...light, ...generateMissingFields(light as IThemeColorsTokens, palettes, 'light') } as IThemeColorsTokens,
        dark: { ...dark, ...generateMissingFields(dark as IThemeColorsTokens, palettes, 'dark') } as IThemeColorsTokens,
    };
}

function generateMissingFields(scheme: IThemeColorsTokens, palettes: Palettes, colorScheme: 'light' | 'dark') {
    const elevation = elevations.reduce(
        (acc, value, index) => ({
            ...acc,
            [`level${index}`]: index === 0 ? value : color(scheme.surface).mix(color(scheme.primary), Number(value)).hex(),
        }),
        {}
    ) as IThemeColorsTokens['elevation'];

    const customColors = {
        surfaceDisabled: color(scheme.onSurface).alpha(opacity.level2).rgb().string(),
        onSurfaceDisabled: color(scheme.onSurface).alpha(opacity.level4).rgb().string(),
        backdrop: colorScheme == "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.5)",
        surfaceContainer: color(palettes.neutral.tone(colorScheme === 'dark' ? 12 : 94)).hex(),
        surfaceContainerLow: color(palettes.neutral.tone(colorScheme === 'dark' ? 10 : 96)).hex(),
        surfaceContainerLowest: color(palettes.neutral.tone(colorScheme === 'dark' ? 4 : 100)).hex(),
        surfaceContainerHigh: color(palettes.neutral.tone(colorScheme === 'dark' ? 17 : 92)).hex(),
        surfaceContainerHighest: color(palettes.neutral.tone(colorScheme === 'dark' ? 22 : 90)).hex(),
        surfaceBright: color(palettes.neutral.tone(colorScheme === 'dark' ? 24 : 98)).hex(),
        surfaceDim: color(palettes.neutral.tone(colorScheme === 'dark' ? 6 : 87)).hex(),
        surfaceTint: scheme.primary,
    };

    return { elevation, ...customColors };
}

function generateSchemesFromSourceColor(sourceColor: string) {
    const { schemes, palettes } = themeFromSourceColor(argbFromHex(sourceColor));

    return {
        light: transformScheme(schemes.light),
        dark: transformScheme(schemes.dark),
        palettes,
    };
}

function transformScheme(scheme: Scheme) {
    const jsonScheme = scheme.toJSON();
    type SchemeKeys = keyof typeof jsonScheme;

    return Object.entries(jsonScheme).reduce((acc, [key, value]) => {
        return {
            ...acc,
            [key]: color(value).hex(),
        };
    }, {} as { [key in SchemeKeys]: string });
}