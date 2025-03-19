import { Colors } from "@theme/index";
import { ITheme } from "@theme/types";

export const getColors = ({ rippleColor: customRippleColor, hoverColor: customHoverColor, theme }: { rippleColor?: string, hoverColor?: string, disabled?: boolean, theme: ITheme }) => {
    const rippleColor = Colors.isValid(customRippleColor) ? customRippleColor : theme?.dark ? RippleColors.dark : RippleColors.light;
    const hoverColor = Colors.isValid(customHoverColor) ? customHoverColor : Colors.mix(rippleColor as string, theme.colors.surface, 0.75);
    return { rippleColor, hoverColor }
}

export const RippleColors = {
    dark: "rgba(255,255,255, 0.3)",
    light: "rgba(0,0,0, 0.2)",
}