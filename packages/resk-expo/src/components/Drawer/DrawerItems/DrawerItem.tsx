
import { useMemo } from 'react';
import { StyleSheet, TextStyle, } from 'react-native';
import { Colors } from "@theme";
import { defaultStr } from "@resk/core";
import { MINIMIZED_ICON_SIZE, ICON_SIZE, getBackgroundColor } from '../utils';
import { useTheme } from '@theme';
import { IDrawerItemProps } from '../types';
import { useDrawer } from '../hooks';
import { Button } from '@components/Button';



/**
 * DrawerItem component renders a button with customizable properties for use in a drawer navigation.
 * It supports various states such as active, minimized, and sectioned, and allows for custom styling and behavior.
 *
 * @param {boolean | (() => boolean)} customActive - Custom active state or a function returning the active state.
 * @param {string} testID - Test identifier for the component.
 * @param {string} routePath - Path of the route associated with the drawer item.
 * @param {object} routeParams - Parameters for the route.
 * @param {boolean} section - Indicates if the item is a section header.
 * @param {string} color - Custom text color for the item.
 * @param {object} style - Custom style for the item.
 * @param {object} labelProps - Properties for the label.
 * @param {object} iconProps - Properties for the icon.
 * @param {number} borderRadius - Border radius for the item.
 * @param {function} customOnPress - Custom onPress handler.
 * @param {boolean} closeOnPress - Indicates if the drawer should close on press.
 * @param {object} rest - Additional properties.
 *
 * @returns {JSX.Element} The rendered DrawerItem component.
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
  contentProps,
  containerProps,
  ...rest
}: IDrawerItemProps) => {
  const theme = useTheme();
  const drawerContext = useDrawer();
  const { drawer } = drawerContext;
  contentProps = Object.assign({}, contentProps);
  containerProps = Object.assign({}, containerProps);
  borderRadius = typeof borderRadius == 'number' ? borderRadius : 18;
  style = StyleSheet.flatten(style) || {};
  labelProps = Object.assign({}, labelProps);
  iconProps = Object.assign({}, iconProps);
  const minimized = drawer ? !!drawer?.isMinimizable() : false;
  testID = defaultStr(testID, section ? "resk-drawer-item-section" : "resk-drawer-item");
  const active: boolean = useMemo(() => {
    if (typeof customActive == 'function') {
      return typeof customActive == 'function' ? !!customActive(drawerContext) : customActive as boolean
    }
    if (typeof customActive == 'boolean') return !!customActive;
    return false;
  }, [customActive, routePath, theme, drawerContext?.drawer]) as boolean;
  const contentColor = active ? theme.colors.primary : Colors.isValid(color) ? color : Colors.isValid((style as TextStyle).color) ? (style as TextStyle).color : section ? theme.colors.text : Colors.setAlpha(theme.colors.text);
  const backgroundColor = getBackgroundColor({ active, theme });
  const fontWeight = section ? "bold" : active ? '400' : 'normal';
  return <Button
    onPress={(event, context) => {
      const callback = () => {
        if (typeof customOnPress === 'function') {
          return customOnPress(event, context);
        }
      };
      closeOnPress !== false ? drawer?.close({ callback }) : callback();
    }}
    testID={testID}
    uppercase={false}
    context={{ drawer }}
    labelProps={{ ...labelProps, style: [{ fontWeight }, minimized && styles.hidden, minimized && section && styles.drawerSectionLabelMinimized, labelProps.style] }}
    accessibilityState={{ selected: active }}
    iconProps={{ ...iconProps, size: minimized ? MINIMIZED_ICON_SIZE : iconProps.size || ICON_SIZE, style: [minimized ? styles.iconMinimized : styles.icon, iconProps.style] }}
    fullWidth
    {...rest}
    label={minimized ? undefined : rest.label}
    containerProps={containerProps}
    contentProps={{ ...contentProps, style: [styles.content, contentProps.style] }}
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
  content: {
    justifyContent: "flex-start",
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
    width: '100%',
    //paddingVertical: 7,
  }
});

export default DrawerItem;