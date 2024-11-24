import { ITheme, IThemeColorSheme } from "@theme/types";

const getThemeColors = (theme: ITheme): IThemeColorSheme => {
    const isDark = theme.dark || theme.dark;
    return {
        color: isDark ? theme.colors.onSurface : theme.colors.onPrimary,
        backgroundColor: isDark ? theme.colors.surface : theme.colors.primary,
    };
};

export default getThemeColors;