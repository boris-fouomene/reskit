import React, { forwardRef } from 'react';
import { BackAction } from './BackAction';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import getThemeColors from './getThemeColor';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StyleProp,
  TextStyle,
  ColorValue,
  GestureResponderEvent,
} from 'react-native';
import Label from '@components/Label';
import { Surface } from '@components/Surface';
import Theme, { Colors, ITheme, IThemeColorSheme, IThemeColorTokenKey, useTheme } from '@theme/index';
import { IAppBarProps } from './types';
import { getLabelOrLeftOrRightProps } from '@hooks/index';
import { useDimensions } from '@dimensions/index';
import { defaultStr } from '@resk/core';
import { splitAppBarActions } from './utils';
import Action from './Action';
import isValidElement from '@utils/isValidElement';
import { Menu } from '@components/Menu';
import { FontIcon, IconButton } from '@components/Icon';
import ExpandableAppBarAction from './ExpandableAction';



// Main AppBar component
const AppBar = forwardRef<any, IAppBarProps<any>>(function AppBar<AppBarActionContext = any>({
  bindResizeEvent, color, backgroundColor, context, colorScheme: customColorScheme,
  renderAction, renderExpandableAction, maxActions,
  actions: customActions, title, subtitle, titleProps, subtitleProps, windowWidth, onBackActionPress, testID,
  backAction: customBackAction,
  backActionProps,
  children, style, elevation = 4, statusBarHeight,
  left: customLeft,
  right: customRight,
  contentProps,
  ...appBarProps
}: IAppBarProps<AppBarActionContext>, ref: React.ForwardedRef<View>) {
  useDimensions(bindResizeEvent !== false); //pour le rendu responsive de l'AppBar
  const theme = useTheme();
  contentProps = Object.assign({}, contentProps);
  const { color: tColor, backgroundColor: tBackgroundColor } = getThemeColors(theme);
  testID = testID || 'rn-appbar';
  const colorScheme = Theme.getColorScheme(customColorScheme as IThemeColorTokenKey);
  const flattenStyle = (StyleSheet.flatten(style) || {});
  backgroundColor = (
    Colors.isValid(backgroundColor) ? backgroundColor : Theme.getColor(backgroundColor as IThemeColorTokenKey)
      || colorScheme.backgroundColor || flattenStyle?.backgroundColor || tBackgroundColor || theme.colors.surface
  ) as string;
  color = (Colors.isValid(color) ? color : Theme.getColor(color as IThemeColorTokenKey) || colorScheme.color || (flattenStyle as any)?.color || tColor) as string;
  const titleTextColor = Colors.isValid(color) ? color : undefined;
  titleProps = Object.assign({}, titleProps);
  subtitleProps = Object.assign({}, subtitleProps);
  subtitle = subtitle === false ? null : subtitle;
  const subtitleColor = titleTextColor ? Colors.setAlpha(titleTextColor, 0.7) : undefined;
  const webStyle = Theme.styles.webFontFamily;
  backActionProps = Object.assign({}, backActionProps);
  const { onPress } = backActionProps;
  backActionProps.onPress = (e: GestureResponderEvent) => {
    if (onPress) onPress(e);
    if (onBackActionPress) onBackActionPress(e);
  }
  const backAction = typeof customBackAction == "function" ? customBackAction(backActionProps) : customBackAction;
  const { actions, menus } = splitAppBarActions<AppBarActionContext>({
    color,
    backgroundColor,
    actions: customActions,
    isAppBarAction: true,
    maxActions,
    windowWidth,
    renderAction: function (props, index) {
      if (typeof renderAction === 'function') return renderAction(props, index);
      return <Action {...props} key={index} />;
    },
    renderExpandableAction: function (props, index) {
      if (typeof renderExpandableAction === 'function') return renderExpandableAction(props, index);
      return <ExpandableAppBarAction
        {...props}
        key={index}
      />;
    }
  });
  const { top, left, right } = useSafeAreaInsets();
  //statusBarHeight = Platform.OS === 'ios' ? StatusBar.currentHeight || 0 : 0
  const containerStyle = {
    paddingTop: typeof statusBarHeight === "number" ? statusBarHeight : top,
    paddingHorizontal: Math.max(left, right, 7),
  }
  const { left: leftContent, right: rightContent } = getLabelOrLeftOrRightProps({ left: customLeft, right: customRight }, { color, backgroundColor, context })

  return (
    <Surface
      {...appBarProps}
      testID={testID}
      elevation={typeof elevation == "number" ? elevation : 0}
      style={[
        styles.appbar,
        {
          backgroundColor,
          elevation,
        },
        containerStyle,
        style,
      ]}
    >
      {backAction != false ? isValidElement(backAction) ? backAction : <BackAction testID={`${testID}-back-action`} color={color} {...backActionProps} /> : null}
      {isValidElement(leftContent) ? leftContent : null}
      <View testID={`${testID}-content`} {...contentProps} style={[styles.content, contentProps?.style]}>
        <Label
          numberOfLines={1}
          splitText
          testID={`${testID}-title`}
          {...titleProps}
          style={[styles.title, { color },
          titleTextColor ? {
            color: titleTextColor,
          } : undefined,
            webStyle,
          titleProps.style
          ]}
        >
          {title}
        </Label>
        {subtitle ? (
          <Label
            numberOfLines={1}
            splitText
            testID={`${testID}-subtitle`}
            {...subtitleProps}
            style={[styles.subtitle, subtitleColor && { color: subtitleColor } || undefined, webStyle, subtitleProps?.style]}
          >
            {subtitle}
          </Label>
        ) : null}
      </View>
      {actions}
      {menus.length ? <Menu
        testID={`${testID}-menu`}
        anchor={({ closeMenu, openMenu }) => {
          return <IconButton
            size={24}
            iconName={FontIcon.MORE}
            color={color}
            onPress={(event) => {
              openMenu();
            }}
          />
        }}
        items={menus}
      /> : null}
      {isValidElement(right) ? right : null}
    </Surface>
  );
});



const DEFAULT_APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  appbar: {
    height: DEFAULT_APPBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
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

AppBar.displayName = 'AppBar';