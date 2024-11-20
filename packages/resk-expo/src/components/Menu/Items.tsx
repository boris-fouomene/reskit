import React, { useMemo } from 'react';
import { MenuItem } from './Item';
import View, { IViewProps } from "@components/View";
import { renderMenuItems } from './utils';
import { View as RNView } from "react-native";
import { IMenuItemProps } from './types';
import { useTheme } from '@theme/index';
import ExpandableMenuItem from './ExpandableItem';


export const MenuItems = React.forwardRef<any, any>(function <IMenuItemExtendContext = any>({ items: customItems, testID, ...rest }: IMenuItemsProps<IMenuItemExtendContext>, ref?: React.ForwardedRef<RNView>) {
  testID = testID || "RN_MenuItemsComponent";
  const theme = useTheme();
  const items = useMemo(() => {
    return renderMenuItems<IMenuItemExtendContext>({
      items: (Array.isArray(customItems) ? customItems : []),
      render: (props, index) => <MenuItem {...props} key={index} />,
      renderExpandable: (props, index) => <ExpandableMenuItem {...props} key={index} />,
    });
  }, [customItems, theme]);
  return <View testID={testID} ref={ref} {...rest}>
    {items}
  </View>
});


export default MenuItems;

MenuItems.displayName = "MenuItems";

/***
 * les porps du composant IMenuItems
 */
export type IMenuItemsProps<IMenuItemExtendContext = any> = IViewProps & {
  items?: (IMenuItemProps<IMenuItemExtendContext> | undefined | null)[]
}



