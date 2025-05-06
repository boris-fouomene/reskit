import { StyleSheet, View } from 'react-native';
import { Colors } from '@theme';
import { defaultStr, IDict } from "@resk/core";
import { TouchableRipple } from '@components/TouchableRipple';
import Label from "@components/Label";
import { useGetIcon } from '@components/Icon';
import { ITabItemProps } from './types';
import { userTabs } from './context';
import { useCallback } from 'react';


/**
 * TabItem component represents an individual tab in a tabbed interface.
 * 
 * The `TabItem` is designed to display a label and an optional icon,
 * allowing users to interact with it to switch between different tabs.
 * It supports various customization options such as color, icon position,
 * and accessibility features.
 * 
 * @param {ITabItemProps} props - The properties for the TabItem component.
 * @param {boolean} [props.active] - Indicates whether the tab is currently active.
 * @param {string} [props.color] - The color of the tab item. If not provided, it defaults to the theme text color.
 * @param {boolean} [props.secondary] - Indicates if the tab item should be styled as secondary.
 * @param {string} [props.iconPosition='top'] - Position of the icon relative to the label ('top' or 'bottom').
 * @param {ReactNode} props.label - The label to display for the tab item.
 * @param {string} [props.testID] - An optional test ID for testing purposes.
 * @param {JSX.Element} [props.children] - Optional children to render inside the tab item.
 * @param {IIconSource} [props.icon] - The icon to display in the tab item.
 * @param {IIconProps} [props.iconProps] - Additional properties for the icon.
 * @param {number} [props.index] - The index of the tab item in the tab list.
 * @param {number} [props.activeIndex] - The currently active tab index.
 * @param {ITouchableRippleProps} [rest] - Additional props for the TouchableRipple component.
 * 
 * @returns {JSX.Element} Returns a JSX element representing the TabItem component.
 * 
 * @example
 * // Example usage of the TabItem component
 * const MyTabItem = () => (
 *   <TabItem
 *     active={true}
 *     label="Home"
 *     icon={myHomeIcon}
 *     iconPosition="top"
 *     onPress={() => console.log('Tab pressed')}
 *   />
 * );
 */
const TabItem = ({
  active,
  color: customColor,
  secondary,
  iconPosition = 'top',
  label,
  testID,
  children,
  icon: customIcon,
  iconProps,
  index,
  rippleColor,
  labelProps,
  style: customStyle,
  ...rest
}: ITabItemProps) => {
  const tabContext = userTabs();
  const { defaultActiveTabItemTextColor, activeIndex, defaultTextColor } = Object.assign({}, tabContext);
  const isActive = index === activeIndex;
  const style: IDict = Object.assign({}, StyleSheet.flatten(customStyle));

  const activeStyle =useCallback((type: any) => {
    return (typeof type === 'function' ? type(active) : type);
  }, [active]);
  const backgroundColor: string = Colors.isValid(style.backgroundColor) ? style.backgroundColor : 'transparent';
  const color = Colors.isValid(customColor) ? customColor : Colors.isValid(style.color) ? style.color : isActive ? defaultActiveTabItemTextColor : backgroundColor !== "transparent" ? Colors.getContrast(backgroundColor) : defaultTextColor;
  rippleColor = Colors.isValid(rippleColor) ? rippleColor : Colors.setAlpha(color as string, 0.32);
  testID = defaultStr(testID, "resk-tab-item");;
  iconProps = Object.assign({}, iconProps);
  iconProps = { testID: testID + "-icon", ...iconProps, color, style: [iconProps.style] }
  labelProps = Object.assign({}, labelProps);
  const icon = useGetIcon({ ...Object.assign({}, iconProps, { style: [styles.icon, iconProps?.style] }), icon: customIcon, color })
  const isIconTop = iconPosition == 'top' ? true : false;
  return (<TouchableRipple
    role="tab"
    accessibilityState={{ selected: active }}
    accessibilityValue={
      typeof label === 'string' ? { text: label } : undefined
    }
    {...rest}
    rippleColor={rippleColor}
    style={[styles.button, { backgroundColor }, activeStyle(style)]}
    testID={testID}
  >
    <View testID={testID + '-content-container'} style={[style.contentContainer]}>
      {isIconTop && icon ? icon : null}
      <Label uppercase  {...labelProps} color={color} testID={testID + "-label"} style={[[styles.label, { color, paddingVertical: !icon ? 8 : 2, }, activeStyle(labelProps.style)]]}>
        {label}
      </Label>
      {!isIconTop && icon ? icon : null}
    </View>
  </TouchableRipple>)
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: 5,
  },
  label: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  indicator: {
    display: 'flex',
    position: 'absolute',
    height: 2,
    bottom: 0,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    alignSelf: "center",
  }
});


export default TabItem;