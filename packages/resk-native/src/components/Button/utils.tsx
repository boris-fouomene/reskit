import { StyleSheet } from 'react-native';
import { Colors } from "@theme";
import color from 'color';
import { IButtonProps, IButtonMode } from './types';
import { ITheme } from '@theme/types';


const getButtonBackgroundColor = ({
  isMode,
  customBackgroundColor,
  theme,
}: IButtonGetBackgroundColorProps) => {
  if (Colors.isValid(customBackgroundColor)) {
    return customBackgroundColor;
  }
  if (isMode('outlined') || isMode('text')) {
    return 'transparent';
  }
  if (isMode('contained')) {
    return theme.colors.primary;
  }
  return 'transparent';
};

const getButtonTextColor = ({ isMode, customTextColor, backgroundColor, dark, theme }: IButtonGetBackgroundColorProps & {
  customTextColor?: string;
  dark?: boolean;
}) => {
  if (Colors.isValid(customTextColor)) {
    return customTextColor;
  }
  if (isMode('contained')) {
    return theme.colors.onPrimary;
  }
  if (backgroundColor !== "transparent" && Colors.isValid(backgroundColor)) {
    return Colors.getContrast(backgroundColor);
  }
  return theme.colors.text;
};

const getButtonBorderColor = ({ isMode, theme }: IButtonGetBackgroundColorProps) => {
  if (isMode('outlined')) {
    return theme.colors.outline;
  }
  if (isMode('outlined')) {
    return Colors.setAlpha(theme.dark ? "white" : "black", 0.29);
  }
  return 'transparent';
};

const getButtonBorderWidth = ({ isMode }: IButtonGetBackgroundColorProps) => {
  if (isMode('outlined')) {
    return 1;
  }
  if (isMode('outlined')) {
    return StyleSheet.hairlineWidth;
  }
  return 0;
};

export const getButtonColors = ({
  mode,
  customBackgroundColor,
  customTextColor,
  dark,
  theme,
  hoverColor: customHoverColor
}: {
  mode: IButtonMode;
  customBackgroundColor?: string;
  customTextColor?: string;
  dark?: boolean;
  theme: ITheme;
  hoverColor?: string;
}) => {
  dark = dark !== undefined ? dark : !!theme.dark;
  const isMode = (modeToCompare: IButtonMode) => {
    return mode === modeToCompare;
  };
  const backgroundColor = getButtonBackgroundColor({
    isMode,
    customBackgroundColor,
    theme,
  });

  const textColor = getButtonTextColor({
    isMode,
    customTextColor,
    backgroundColor,
    dark,
    theme
  });

  const borderColor = getButtonBorderColor({ isMode, theme });

  const borderWidth = getButtonBorderWidth({ isMode, theme });
  return {
    backgroundColor,
    hoverColor: Colors.isValid(customHoverColor) ? customHoverColor : backgroundColor !== "transparent" && Colors.isValid(backgroundColor) ?
      Colors.isDark(backgroundColor) ? Colors.lighten(backgroundColor, 0.5) : Colors.darken(backgroundColor, 0.2) : undefined,
    borderColor,
    textColor,
    borderWidth,
  };
};

type IButtonGetBackgroundColorProps = Partial<IButtonProps> & {
  customBackgroundColor?: string;
  theme: ITheme;
  isMode: (mode: IButtonMode) => boolean
}