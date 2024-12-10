import React from 'react';
import ExpandableItem from './ExpandableItem';
import DrawerItem from './DrawerItem';
import View from "@components/View";
import { useDrawer } from '../hooks';
import { View as RNView } from "react-native";
import { useTheme } from '@theme';
import { useRenderMenuItems } from '@components/Menu';
import { IDrawerContext, IDrawerItemProps, IDrawerItemsProps } from '../types';


/****
 * Permet de render une liste des drawer items en side bar
 */
const DrawerItems = React.forwardRef(({ testID, items: customItems, ...rest }: IDrawerItemsProps, ref: React.ForwardedRef<RNView>) => {
  const { drawer } = useDrawer();
  testID = testID || "RN_DrawerItems";
  const theme = useTheme();
  const items = useRenderMenuItems<IDrawerContext>({
    items: (Array.isArray(customItems) ? customItems : []),
    context: { drawer },
    render: renderItem,
    renderExpandable,
  });
  return <View testID={testID} ref={ref} {...rest} key={theme.name + '-' + theme.dark}>
    {items}
    <View testID={testID + "_DrawerItemsPaddingSeparator"} style={{ height: 30 }}></View>
  </View>
});


function renderExpandable(props: IDrawerItemProps, index: number) {
  return <ExpandableItem {...props} key={index} />;
}
function renderItem(props: IDrawerItemProps, index: number) {
  return <DrawerItem {...props} key={index} />;
}

export default DrawerItems;

DrawerItems.displayName = "DrawerItems";




