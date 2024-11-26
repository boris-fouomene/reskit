import { useMemo } from "react";
import { Divider } from "@components/Divider";
import { IMenuItemBase, IMenuRenderItemOptions, IMenuItemsBase, IMenuRenderItemsOptions } from "./types";
import { useTheme } from "@theme/index";
import { IReactNullableElement } from "../../types";
import stableHash from "stable-hash";
import { cloneObject, isObj } from "@resk/core";

const isAllowed = (p: any) => true;

/**
 * Renders either an expandable menu item or a section based on the provided properties.
 * This function determines whether the item is a section or a standard menu item and
 * invokes the appropriate rendering function accordingly.
 *
 * @template MenuItemContext - A generic type parameter that allows extending the context
 * for menu items, enabling customization of properties specific to the application.
 *
 * @param {object} props - The properties for rendering the menu item or section.
 * @param {IMenuItemBase<MenuItemContext>} props.item - The menu item to render, which includes
 * all relevant data required to display the item, such as its label, icon, and any action handlers.
 * 
 * @param {IReactNullableElement[]} props.itemsNodes - The child nodes to be rendered for expandable items.
 * 
 * @param {number} props.index - The index of the item in the list, useful for applying specific styles.
 * 
 * @param {MenuItemContext} props.context - Additional context options for rendering, which can include
 * state or configuration options that influence how the item is rendered.
 * 
 * @param {IMenuItemRenderFunc<MenuItemContext>} props.render - The function used to render a standard menu item.
 * 
 * @param {IMenuItemRenderFunc<MenuItemContext>} props.renderExpandable - The function used to render expandable menu items.
 * 
 * @param {number} [props.level] - An optional property indicating the current level of the menu item in the hierarchy.
 *
 * @returns {IReactNullableElement | null} Returns a IReactNullableElement representing the rendered menu item or section, or null if not allowed.
 *
 * @example
 * const renderedItem = renderExpandableMenuItemOrSection({
 *   item: { label: "Settings", section: true },
 *   itemsNodes: [],
 *   index: 0,
 *   context: {},
 *   render: (props) => <MenuItem {...props} />,
 *   renderExpandable: (props) => <ExpandableMenuItem {...props} />,
 *   level: 1,
 * });
 */
const renderExpandableMenuItemOrSection = function <MenuItemContext = any>({ item, itemsNodes, index, context, render, renderExpandable, level }: IMenuRenderItemOptions<MenuItemContext>) {
  level = typeof level == "number" && level || 0;
  if (!isAllowed(item)) return null;
  const { section, items, ...rest } = item;
  if (section) {
    return render({ level, ...rest, context: { ...Object.assign({}, rest.context), ...Object.assign({}, context) } } as IMenuItemBase<MenuItemContext>, index);
  } else {
    return renderExpandable({ level, ...rest as IMenuItemBase<MenuItemContext>, children: itemsNodes, context: { ...Object.assign({}, rest.context), ...Object.assign({}, context) } }, index);
  }
}

/**
 * Renders a menu item based on the provided properties and rendering functions.
 * This function processes each item, applying the appropriate rendering logic
 * for standard and expandable items, and returns the rendered React node.
 *
 * @template MenuItemContext - A generic type parameter that allows extending the context
 * for menu items, enabling customization of properties specific to the application.
 *
 * @param {object} props - The properties for rendering the menu item.
 * @param {IMenuItemBase<MenuItemContext>} props.item - The menu item to render, which includes
 * all relevant data required to display the item, such as its label, icon, and any action handlers.
 *
 * @param {number} props.index - The index of the item in the list, useful for applying specific styles.
 *
 * @param {IMenuItemRenderFunc<MenuItemContext>} props.render - The function used to render a standard menu item.
 *
 * @param {IMenuItemRenderFunc<MenuItemContext>} props.renderExpandable - The function used to render expandable menu items.
 *
 * @param {number} [props.level] - An optional property indicating the current level of the menu item in the hierarchy.
 *
 * @param {MenuItemContext} [props.context] - Additional context options for rendering, which can include
 * state or configuration options that influence how the item is rendered.
 *
 * @returns {IReactNullableElement | null} Returns a IReactNullableElement representing the rendered menu item, or null if not allowed.
 *
 * @example
 * const renderedItem = renderMenuItem({
 *   item: { label: "Settings", items: [{ label: "Profile" }] },
 *   index: 0,
 *   render: (props) => <MenuItem {...props} />,
 *   renderExpandable: (props) => <ExpandableMenuItem {...props} />,
 * });
 */
function renderMenuItem<MenuItemContext = any>({ item, index, render, renderExpandable, level, context }: IMenuRenderItemOptions<MenuItemContext>): IReactNullableElement {
  level = typeof level == "number" && level || 0;
  if (!item) return null;
  item.level = level;
  if (!isAllowed(item)) return null;
  if (!item.label && !item.icon && !item.children && item.divider === true) {
    const { dividerProps } = item;
    return (<Divider key={index} {...Object.assign({}, dividerProps)} />)
  }
  if (Array.isArray(item.items)) {
    const itemsNodes: IReactNullableElement[] = [];
    item.items.map((it, i) => {
      if (!it) return null;
      it.level = (level as number) + 1;
      itemsNodes.push(renderMenuItem({ level: (level as number) + 1, item: it as IMenuItemBase<MenuItemContext>, context, index: i, render, renderExpandable }));
    });
    if (itemsNodes.length) {
      return renderExpandableMenuItemOrSection({ level, itemsNodes: itemsNodes, index, item, render, renderExpandable, context })
    }
  }
  return render({ ...item, level, context: { ...Object.assign({}, item.context), ...Object.assign({}, context) } }, index);
}


/**
 * 
 * Renders a list of menu items based on the provided properties and rendering functions.
 * This function processes each item in the list, applying the appropriate rendering logic
 * for standard and expandable items, and returns an array of React nodes representing the
 * rendered menu items.
 *
 * @template MenuItemContext - A generic type parameter that allows extending the context
 * for menu items, enabling customization of properties specific to the application.
 *
 * @param {object} props - The properties for the function.
 * @param {(IMenuItemBase<MenuItemContext> | null | undefined)[]} [props.items] - An optional array
 * of menu item properties. Each item can either be a valid menu item object, null, or undefined.
 * This array is used to render the individual menu items.
 *
 * @param {IMenuItemRenderFunc<MenuItemContext>} props.render - The function used to render a
 * standard menu item. This function receives the item properties and is responsible for generating
 * the corresponding JSX.
 *
 * @param {IMenuItemRenderFunc<MenuItemContext>} props.renderExpandable - The function used to
 * render expandable menu items. Similar to the render function, this handles the rendering of
 * items that can expand to show additional content.
 *
 * @param {MenuItemContext} [props.context] - Additional context options to pass to the rendering functions.
 * This can include properties such as state or configuration options that influence how the items
 * are rendered.
 *
 * @returns {IReactNullableElement[]} Returns an array of IReactNullableElement representing the rendered items. If no items
 * are provided, an empty array is returned.
 *
 * @example
 * const items = [
 *   { title: "Home", onPress: () => console.log("Home pressed") },
 *   { title: "Settings", items: [{ title: "Profile", onPress: () => console.log("Profile pressed") }] },
 * ];
 *
 * const renderedItems = renderMenuItems({
 *   items,
 *   render: (props) => <MenuItem {...props} />,
 *   renderExpandable: (props) => <ExpandableMenuItem {...props} />,
 * });
 */
export function renderMenuItems<MenuItemContext = any>({ items, render, renderExpandable, context }: IMenuRenderItemsOptions<MenuItemContext>): IReactNullableElement[] {
  const _items: IReactNullableElement[] = [];
  const level = 0;
  if (Array.isArray(items)) {
    items.map((item, index) => {
      if (!item || !isObj(item)) return null;
      const clonedItem = cloneObject(item);
      clonedItem.level = level;
      const r = renderMenuItem({ item: clonedItem, index, render, renderExpandable, level, context });
      if (r) {
        _items.push(r);
      }
    });
  }
  return _items;
}

/**
 * Custom React hook that renders a list of menu items based on the provided properties and rendering functions.
 * This hook leverages the theme context to ensure that the rendered menu items are styled consistently according
 * to the application's design system. It utilizes memoization to optimize performance by preventing unnecessary
 * re-renders when the input parameters do not change.
 * 
 * @template MenuItemContext - A generic type parameter that allows extending the context for menu items. 
 * This enables customization of the properties passed to the menu item render function, allowing for additional 
 * context-specific data to be included.
 * 
 * @param {object} props - The properties for rendering menu items.
 * @param {(IMenuItemBase<MenuItemContext> | null | undefined)[]} [props.items] - An optional array of menu item properties. 
 * Each item can either be a valid menu item object, null, or undefined. This array is used to render the individual menu items.
 * 
 * @param {MenuItemContext} [props.context] - Additional context options to pass to the rendering functions. 
 * This can include properties such as state or configuration options that influence how the items are rendered.
 * 
 * @param {IMenuItemRenderFunc<MenuItemContext>} props.render - The function used to render a standard menu item. 
 * This function receives the item properties and is responsible for generating the corresponding JSX.
 * 
 * @param {IMenuItemRenderFunc<MenuItemContext>} props.renderExpandable - The function used to render expandable menu items. 
 * Similar to the render function, this handles the rendering of items that can expand to show additional content.
 * 
 * @returns {IReactNullableElement[]} Returns an array of IReactNullableElement representing the rendered menu items. 
 * If no items are provided, an empty array is returned.
 * 
 * @example
 * const items = [
 *   { label: "Home", onPress: () => console.log("Home pressed") },
 *   { label: "Settings", onPress: () => console.log("Settings pressed") },
 *   { label: "Help", items: [{ label: "FAQ", onPress: () => console.log("FAQ pressed") }] },
 * ];
 * 
 * const renderedItems = useRenderMenuItems({
 *   items,
 *   render: (props) => <MenuItem {...props} />,
 *   renderExpandable: (props) => <ExpandableMenuItem {...props} />,
 * });
 * 
 * // Usage in a component
 * const MyMenu = () => {
 *   return (
 *     <View>
 *       {renderedItems}
 *     </View>
 *   );
 * };
 * 
 * @remarks
 * This hook is particularly useful in scenarios where the menu items need to be dynamically generated or updated 
 * based on user interactions or application state. By using this hook, developers can ensure that the menu items 
 * are rendered efficiently and correctly according to the specified rendering logic.
 */
export function useRenderMenuItems<MenuItemContext = any>({ items, context, render, renderExpandable }: IMenuRenderItemsOptions<MenuItemContext>): IReactNullableElement[] {
  const theme = useTheme();
  return useMemo(() => {
    return renderMenuItems<MenuItemContext>({
      items: (Array.isArray(items) ? items : []),
      context,
      render,
      renderExpandable,
    });
  }, [items, theme, context, stableHash(render), stableHash(renderExpandable)]);
}