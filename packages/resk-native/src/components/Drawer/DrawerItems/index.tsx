import * as React from 'react';
import ExpandableItem from './ExpandableItem';
import DrawerItem from './DrawerItem';
import View from "@components/View";
import { useDrawer } from '../hooks';
import { View as RNView } from "react-native";
import { useTheme } from '@theme';
import { useRenderMenuItems } from '@components/Menu';
import { IDrawerContext, IDrawerItemProps, IDrawerItemsProps } from '../types';
import { StyleSheet } from 'react-native';
import { defaultStr } from '@resk/core/utils';

/**
 * DrawerItems component renders a list of drawer items, including expandable items.
 * 
 * @component
 * @param {IDrawerItemsProps} props - The props for the DrawerItems component.
 * @param {string} [props.testID] - Optional test ID for the component.
 * @param {IDrawerItemProps[]} [props.items] - Custom items to be rendered in the drawer.
 * @param {React.ForwardedRef<RNView>} ref - Forwarded ref to the underlying RNView component.
 * @returns {JSX.Element} The rendered DrawerItems component.
 * 
 * @example
 * <DrawerItems
 *   testID="customDrawerItems"
 *   items={[{ label: 'Item 1' }, { label: 'Item 2', expandable: true }]}
 * />
 * 
 * @see {@link useDrawer} for drawer context.
 * @see {@link useTheme} for theme context.
 * @see {@link useRenderMenuItems} for rendering menu items.
 */
function DrawerItems({ testID, style, items: customItems, ...rest }: IDrawerItemsProps) {
  const { drawer } = useDrawer();
  testID = defaultStr(testID, "resk-draweritems")
  const items = useRenderMenuItems<IDrawerContext>({
    items: (Array.isArray(customItems) ? customItems : []),
    context: { drawer },
    render: renderItem,
    renderExpandable,
  });
  return <View testID={testID} {...rest} style={[styles.container, style]}>
    {items}
    <View testID={testID + "drawer-item-padding-separator"} style={{ height: 30 }}></View>
  </View>
};


function renderExpandable(props: IDrawerItemProps, index: number) {
  return <ExpandableItem {...props} key={index} />;
}
function renderItem(props: IDrawerItemProps, index: number) {
  return <DrawerItem {...props} key={index} />;
}

export default DrawerItems;

DrawerItems.displayName = "DrawerItems";

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
});




