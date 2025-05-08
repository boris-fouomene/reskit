import { MenuItem } from './Item';
import { View } from "@components/View";
import { useRenderMenuItems } from './utils';
import { IMenuItemBase, IMenuItemContext, IMenuItemsProps } from './types';
import ExpandableMenuItem from './ExpandableItem';
import { useMenu } from './context';

/**
 * A functional component that renders a list of menu items, which can include both
 * standard and expandable menu items. This component is designed to display a dynamic
 * menu based on the provided items array, allowing for a flexible and customizable
 * navigation experience.
 *
 * @template IMenuItemExtendContext - A generic type parameter that allows extending the
 * context for each menu item in the list. This can be useful for passing additional properties or context
 * relevant to specific menu item implementations.
 *
 * @param {object} props - The properties for the component.
 * @param {string} [props.testID] - An optional identifier for testing purposes. This can be
 * used in automated tests to locate the component. If not provided, a default value of
 * "resk-menu-item" will be used.
 * 
 * @param {IMenuItemProps<IMenuItemExtendContext>[]} [props.items] - An optional array of
 * menu item properties. Each item can either be a valid menu item object or undefined/null.
 * This array is used to render the individual menu items.
 *
 * @returns {ReactElement} Returns a JSX element representing the menu items wrapped in a View.
 *
 * @example
 * ```tsx
 * const menuItems = [
 *   { title: "Home", onPress: () => console.log("Home pressed") },
 *   { title: "Settings", onPress: () => console.log("Settings pressed") },
 *   { title: "Help", expandable: true, children: <HelpContent /> }
 * ];
 *
 * <MenuItems items={menuItems} testID="custom-menu-items" />
 * ```
 *
 * In the example above, a `MenuItems` component is created with a custom test ID. The
 * `items` array contains different menu items, including a standard item and an expandable
 * item that displays additional content when expanded.
 *
 * @remarks
 * This component utilizes the `useTheme` hook to apply theming and styles consistently
 * across the menu items. The `renderMenuItems` utility function is used to generate
 * the appropriate JSX for each item based on its properties.
 */
export function MenuItems<IMenuItemExtendContext = any>({ items: customItems, context, testID, ...rest }: IMenuItemsProps<IMenuItemExtendContext>) {
  testID = testID || "resk-menu-item";
  const menuContext = useMenu();
  const items = useRenderMenuItems<IMenuItemContext<IMenuItemExtendContext>>({
    items: (Array.isArray(customItems) ? customItems : []),
    context: Object.assign({}, menuContext, context),
    render: renderItem,
    renderExpandable,
  });
  return <View testID={testID} {...rest}>
    {items}
  </View>
};

function renderExpandable<IMenuItemExtendContext = any>(props: IMenuItemBase<IMenuItemContext<IMenuItemExtendContext>>, index: number) {
  return <ExpandableMenuItem {...props} key={index} />;
}
function renderItem<IMenuItemExtendContext = any>(props: IMenuItemBase<IMenuItemContext<IMenuItemExtendContext>>, index: number) {
  return <MenuItem {...props} key={index} />;
}

export default MenuItems;

MenuItems.displayName = "MenuItems";





