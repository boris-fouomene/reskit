import { IThemeManager } from "@theme/index";
import { ITheme, IThemeColorSheme } from "@theme/types";

const getThemeColors = (theme: IThemeManager): IThemeColorSheme => {
    const isDark = theme.dark || theme.dark;
    return theme.getColorScheme(isDark ? "surface" : "primary");
    /*     return {
            color: isDark ? theme.colors.onSurfaceVariant : theme.colors.onPrimary,
            backgroundColor: isDark ? theme.colors.surfaceVariant : theme.colors.primary,
        }; */
};

export default getThemeColors;