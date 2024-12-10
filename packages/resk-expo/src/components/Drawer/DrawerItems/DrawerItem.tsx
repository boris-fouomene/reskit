import React, { useMemo } from 'react';
import { GestureResponderEvent, StyleSheet, TextStyle, } from 'react-native';
import { Colors } from "@theme";
import { defaultStr, setQueryParams } from "@resk/core";
import { MINIMIZED_ICON_SIZE, ICON_SIZE, getBackgroundColor } from '../utils';
import { useTheme } from '@theme';
import { IDrawerItemProps } from '../types';
import { useDrawer } from '../hooks';
import { Button } from '@components/Button';



/** 
 * update by @borisFouomene. for usage, @see : https://callstack.github.io/react-native-paper/drawer-item.html
 */
const DrawerItem = ({
  active: customActive,
  testID,
  routePath,
  routeParams,
  section,
  textColor: color,
  style,
  labelProps,
  iconProps,
  borderRadius,
  onPress: customOnPress,
  closeOnPress,
  ...rest
}: IDrawerItemProps) => {
  const theme = useTheme();
  const { drawer } = useDrawer();
  borderRadius = typeof borderRadius == 'number' ? borderRadius : 18;
  style = StyleSheet.flatten(style) || {};
  labelProps = Object.assign({}, labelProps);
  iconProps = Object.assign({}, iconProps);
  const minimized = drawer ? !!drawer?.isMinimizable() : false;
  testID = defaultStr(testID, section ? "resk-drawer-item-section" : "resk-drawer-item");
  const active: boolean = useMemo(() => {
    if (typeof customActive == 'function') {
      return typeof customActive == 'function' ? !!customActive() : customActive as boolean
    }
    if (typeof customActive == 'boolean') return !!customActive;
    return false;
  }, [customActive, routePath, theme]) as boolean;
  const contentColor = active ? theme.colors.primary : Colors.isValid(color) ? color : Colors.isValid((style as TextStyle).color) ? (style as TextStyle).color : section ? theme.colors.text : Colors.setAlpha(theme.colors.text);
  const backgroundColor = getBackgroundColor({ active, theme });
  const fontWeight = section ? "bold" : active ? '400' : 'normal';
  const onPress = (event: GestureResponderEvent) => {
    const callback = () => {
      if (typeof customOnPress === 'function') {
        customOnPress(event);
      }
    };
    closeOnPress !== false ? drawer?.close({ callback }) : callback();
  }
  return <Button
    onPress={onPress}
    testID={testID}
    context={{ drawer }}
    labelProps={{ ...labelProps, style: [{ fontWeight }, minimized && styles.hidden, minimized && section && styles.drawerSectionLabelMinimized, labelProps.style] }}
    accessibilityState={{ selected: active }}
    iconProps={{ ...iconProps, size: minimized ? MINIMIZED_ICON_SIZE : iconProps.size || ICON_SIZE, style: [minimized ? styles.iconMinimized : styles.icon, iconProps.style] }}
    {...rest}
    textColor={contentColor as string}
    backgroundColor={backgroundColor}
    style={[
      styles.ripple,
      active ? { borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius } : null,
      minimized ? styles.cMinimized : null,
      style,
    ]}
  />
};


DrawerItem.displayName = 'DrawerItemComponent';

const styles = StyleSheet.create({
  cMinimized: {
    marginRight: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginLeft: 0,
    paddingLeft: 2,
    paddingRight: 2,
  },
  hidden: {
    opacity: 0,
    display: "none",
  },
  drawerSectionContainer: { marginVertical: 0, marginBottom: 0, marginTop: 5 },
  drawerSectionLabelMinimized: {
    alignItems: 'center',
    textAlign: 'center',
  },
  iconMinimized: { alignItems: 'center' },
  icon: {
    alignItems: 'flex-start'
  },
  ripple: {
    marginRight: 5,
  }
});

export default DrawerItem;