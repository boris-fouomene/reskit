import { Colors } from "@theme/index";
import { ITheme } from "@theme/types";

export const getColors = ({ rippleColor: customRippleColor, hoverColor: customHoverColor, theme }: { rippleColor?: string, hoverColor?: string, disabled?: boolean, theme: ITheme }) => {
    const rippleColor = Colors.isValid(customRippleColor) ? customRippleColor : Colors.setAlpha(theme.colors.onSurface, 0.12)
    const hoverColor = Colors.isValid(customHoverColor) ? customHoverColor : (!theme.dark ? Colors.darken(rippleColor as string, 0.5) : Colors.lighten(rippleColor as string, 0.5));
    return { rippleColor, hoverColor }
}