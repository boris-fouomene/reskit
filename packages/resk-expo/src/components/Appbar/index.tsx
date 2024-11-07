import React from 'react';
import { BackAction } from './BackAction';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  ColorValue,
} from 'react-native';
import Label from '@components/Label';
import { ISurfaceProps, Surface } from '@components/Surface';
import { Colors, useTheme } from '@theme/index';

// Types for the Appbar components
export interface IAppbarProps extends ISurfaceProps {
  backgroundColor?: ColorValue;
  /**
   * Extra padding to add at the top of header to account for translucent status bar.
   * This is automatically handled on iOS >= 11 including iPhone X using `SafeAreaView`.
   * If you are using Expo, we assume translucent status bar and set a height for status bar automatically.
   * Pass `0` or a custom value to disable the default behaviour, and customize the height.
   */
  statusBarHeight?: number;
}

interface AppbarContentProps {
  title: string;
  subtitle?: string;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  color?: ColorValue;
}

interface IAppbarActionProps {
  icon: React.ReactNode;
  onPress?: () => void;
  color?: ColorValue;
  size?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}


// Main Appbar component
export const Appbar: React.FC<IAppbarProps> & {
  Content: typeof AppbarContent;
  Action: typeof AppbarAction;
  BackAction: typeof BackAction;
} = ({ children, style, elevation = 4, statusBarHeight, backgroundColor, ...rest }) => {
  const theme = useTheme();
  backgroundColor = Colors.isValid(backgroundColor) ? backgroundColor : theme.colors.surface;
  const { top, left, right } = useSafeAreaInsets();
  //statusBarHeight = Platform.OS === 'ios' ? StatusBar.currentHeight || 0 : 0
  const containerStyle = {
    paddingTop: typeof statusBarHeight === "number" ? statusBarHeight : top,
    paddingHorizontal: Math.max(left, right),
  }
  return (
    <Surface
      {...rest}
      elevation={elevation}
      style={[
        styles.appbar,
        {
          backgroundColor,
          elevation,
          shadowOpacity: elevation / 20,
        },
        containerStyle,
        style,
      ]}
    >
      {children}
    </Surface>
  );
};

// Content component for title and subtitle
const AppbarContent: React.FC<AppbarContentProps> = ({
  title,
  subtitle,
  titleStyle,
  subtitleStyle,
  color = '#000000',
}) => {
  return (
    <View style={styles.content}>
      <Label
        numberOfLines={1}
        style={[styles.title, { color }, titleStyle]}
      >
        {title}
      </Label>
      {subtitle ? (
        <Label
          numberOfLines={1}
          style={[styles.subtitle, subtitleStyle]}
        >
          {subtitle}
        </Label>
      ) : null}
    </View>
  );
};

// Action component for icons/buttons
const AppbarAction: React.FC<IAppbarActionProps> = ({
  icon,
  onPress,
  size = 24,
  disabled = false,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.action, style]}
      testID={testID}
    >
      {React.isValidElement(icon)
        ? icon
        : <View style={{ width: size, height: size }}>{icon}</View>
      }
    </TouchableOpacity>
  );
};

// Attach components to Appbar
Appbar.Content = AppbarContent;
Appbar.Action = AppbarAction;
Appbar.BackAction = BackAction;

const DEFAULT_APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  appbar: {
    height: DEFAULT_APPBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
  },
  action: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backAction: {
    marginLeft: 4,
  },
});
