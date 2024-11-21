import { ReactNode } from "react";
import { Divider } from "@components/Divider";
import { IMenuItemContext, IMenuItemProps } from "./types";

const isAllowed = (p: any) => true;


/**
 * Renders either an expandable menu item or a section based on the provided item properties.
 * If the item is a section, it uses the render function to display it; otherwise, it renders
 * the item as expandable.
 *
 * @template ItemExtendContext - A generic type parameter that allows extending the context
 * for menu items.
 *
 * @param {object} props - The properties for the component.
 * @param {IMenuItemProps<ItemExtendContext>} props.item - The menu item to render.
 * @param {ReactNode[]} props.itemsNodes - The child nodes of the current item, rendered
 * using the renderMenuItem method applied to each child item.
 * @param {IMenuItemProps<ItemExtendContext>[]} props.subItems - The sub-items of the parent
 * item, obtained by looping over the item's properties.
 * @param {number} [props.index] - The index of the item in the list.
 * @param {function} props.render - The function used to render a standard menu item.
 * @param {function} props.renderExpandable - The function used to render expandable items.
 * @param {number} [props.level] - The current level of the menu item in the hierarchy.
 * @param {IMenuItemContext<ItemExtendContext>} [props.context] - Additional context options for rendering.
 * @returns {ReactNode | null} Returns a ReactNode representing the rendered item or null
 * if the item is not allowed.
 *
 * @example
 * ```tsx
 * const expandableItem = renderExpandableMenuItemOrSection({
 *   item: myMenuItem,
 *   itemsNodes: childItems,
 *   index: 0,
 *   render: renderMenuItem,
 *   renderExpandable: renderExpandableMenuItem,
 *   level: 1,
 * });
 * ```
 */
export const renderExpandableMenuItemOrSection = function <ItemExtendContext = any>({ item, itemsNodes, index, context, render, renderExpandable, level }: { item: IMenuItemProps<ItemExtendContext>, itemsNodes: ReactNode[], index?: number, render: IMenuItemRenderFunc<ItemExtendContext>, renderExpandable: IMenuItemRenderFunc<ItemExtendContext>, level?: number, context?: IMenuItemContext<ItemExtendContext> }) {
  level = typeof level == "number" && level || 0;
  if (!isAllowed(item)) return null;
  const { section, ...rest } = item;
  if (section) {
    return render({ level, ...rest, context: { ...Object.assign({}, rest.context), ...Object.assign({}, context) } } as IMenuItemProps<ItemExtendContext>, index);
  } else {
    return renderExpandable({ level, ...rest as IMenuItemProps<ItemExtendContext>, children: itemsNodes as ReactNode, context: { ...Object.assign({}, rest.context), ...Object.assign({}, context) } }, index);
  }
}

/**
 * Renders a menu item based on its properties and the provided rendering functions.
 * This function handles the rendering of standard items, dividers, and expandable
 * items, ensuring that the correct rendering logic is applied based on the item type.
 *
 * @template ItemExtendContext - A generic type parameter that allows extending the context
 * for menu items.
 *
 * @param {object} props - The properties for the component.
 * @param {IMenuItemProps<ItemExtendContext>} props.item - The menu item to render.
 * @param {number} props.index - The index of the item in the list.
 * @param {function} props.render - The function used to render a standard menu item.
 * @param {function} props.renderExpandable - The function used to render expandable items.
 * @param {number} [props.level] - The current level of the menu item in the hierarchy.
 * @param {IMenuItemContext<ItemExtendContext>} [props.context] - Additional context options for rendering.
 * @returns {ReactNode | null} Returns a ReactNode representing the rendered item or null
 * if the item is not allowed.
 *
 ```typescript
 * @example
 * ```tsx
 * const menuItem = renderMenuItem({
 *   item: myMenuItem,
 *   index: 0,
 *   render: renderStandardMenuItem,
 *   renderExpandable: renderExpandableMenuItem,
 * });
 * ```
 */
export function renderMenuItem<ItemExtendContext = any>({ item, index, render, renderExpandable, level, context }: { item: IMenuItemProps<ItemExtendContext>, index: number, render: IMenuItemRenderFunc<ItemExtendContext>, renderExpandable: IMenuItemRenderFunc<ItemExtendContext>, level?: number, context?: IMenuItemContext<ItemExtendContext> }): ReactNode {
  level = level || 0;
  if (!item) return null;
  item.level = level;
  if (!isAllowed(item)) return null;
  if (!item.label && !item.icon) {
    if (item.divider === true) {
      const { dividerProps } = item;
      return (<Divider key={index} {...Object.assign({}, dividerProps)} />)
    }
    return null;
  }
  if (Array.isArray(item.items)) {
    const itemsNodes: ReactNode[] = [];
    const subItems: IMenuItemProps<ItemExtendContext>[] = [];
    item.items.map((it, i) => {
      if (!it) return null;
      it.level = level + 1;
      subItems.push(it as IMenuItemProps<ItemExtendContext>);
      itemsNodes.push(renderMenuItem({ level: level + 1, item: it as IMenuItemProps<ItemExtendContext>, context, index: i, render, renderExpandable }));
    });
    if (itemsNodes.length) {
      return renderExpandableMenuItemOrSection({ level, itemsNodes: itemsNodes, index, item, render, renderExpandable, context })
    }
  }
  return render({ ...item, level, context: { ...Object.assign({}, item.context), ...Object.assign({}, context) } }, index);
}

/**
 * Renders a list of menu items based on the provided properties and rendering functions.
 * This function processes each item in the list, applying the appropriate rendering logic
 * for standard and expandable items, and returns an array of React nodes representing the
 * rendered menu items.
 *
 * @template ItemExtendContext - A generic type parameter that allows extending the context
 * for menu items, enabling customization of properties specific to the application.
 *
 * @param {object} props - The properties for the function.
 * @param {(IMenuItemProps<ItemExtendContext> | null | undefined)[]} [props.items] - An optional array
 * of menu item properties. Each item can either be a valid menu item object, null, or undefined.
 * This array is used to render the individual menu items.
 *
 * @param {IMenuItemRenderFunc<ItemExtendContext>} props.render - The function used to render a
 * standard menu item. This function receives the item properties and is responsible for generating
 * the corresponding JSX.
 *
 * @param {IMenuItemRenderFunc<ItemExtendContext>} props.renderExpandable - The function used to
 * render expandable menu items. Similar to the render function, this handles the rendering of
 * items that can expand to show additional content.
 *
 * @param {IMenuItemContext<ItemExtendContext>} [props.context] - Additional context options to pass to the rendering functions.
 * This can include properties such as state or configuration options that influence how the items
 * are rendered.
 *
 * @returns {ReactNode[]} Returns an array of ReactNode representing the rendered items. If no items
 * are provided, an empty array is returned.
 *
 * @example
 * ```tsx
 * const items = [
 *   { title: "Home", onPress: () => console.log("Home pressed") },
 *   { title: "Settings", items: [{ title: "Profile", onPress: () => console.log("Profile pressed") }] },
 * ];
 *
 * const renderedItems = renderMenuItems({
 *   items,
 *   render: renderStandardMenuItem,
 *   renderExpandable: renderExpandableMenuItem,
 * });
 * ```
 *
 * In the example above, a list of menu items is defined, including a nested item under "Settings".
 * The `renderMenuItems` function is called to generate the rendered items, which can then be used
 * in a component's JSX.
 *
 * @remarks
 * This function is particularly useful for creating hierarchical menu structures, such as
 * side navigation or dropdown menus, where items can have sub-items that are displayed
 * when expanded.
 */
export function renderMenuItems<ItemExtendContext = any>({ items, render, renderExpandable, context }: { items?: (IMenuItemProps<ItemExtendContext> | null | undefined)[], render: IMenuItemRenderFunc<ItemExtendContext>, renderExpandable: IMenuItemRenderFunc<ItemExtendContext>, level?: number, context?: IMenuItemContext<ItemExtendContext> }): ReactNode[] {
  const _items: ReactNode[] = [];
  const level = 0;
  if (Array.isArray(items)) {
    items.map((item, index) => {
      if (!item) return null;
      const r = renderMenuItem({ item, index, render, renderExpandable, level, context });
      if (r) {
        _items.push(r);
      }
    });
  }
  return _items as ReactNode[];
}

/**
 * Type definition for a function that renders a menu item.
 * This function receives the properties of the menu item and an optional index,
 * and returns a ReactNode representing the rendered item.
 *
 * @template IExtendContext - A generic type parameter that allows extending the context
 * for menu items. This enables customization of the properties passed to the menu item
 * render function, allowing for additional context-specific data to be included.
 *
 * @param {IMenuItemProps<IExtendContext>} props - The properties of the menu item to render.
 * This includes all relevant data required to display the item, such as its label, icon,
 * and any action handlers.
 *
 * @param {number} [index] - An optional index indicating the position of the item in the
 * list of menu items. This can be useful for applying specific styles or behaviors based
 * on the item's position within the menu.
 *
 * @returns {ReactNode} Returns a ReactNode representing the rendered menu item. This can
 * be any valid React element, including custom components, JSX, or null if the item should
 * not be rendered.
 *
 * @example
 * ```tsx
 * const renderMenuItem: IMenuItemRenderFunc = (props, index) => {
 *   return (
 *     <div key={index} onClick={props.onPress}>
 *       {props.label}
 *     </div>
 *   );
 * };
 * ```
 *
 * In the example above, the `renderMenuItem` function takes menu item properties and an
 * index, returning a JSX element that displays the item's label and attaches an onClick
 * handler to it.
 */
type IMenuItemRenderFunc<IExtendContext = any> = (props: IMenuItemProps<IExtendContext>, index?: number) => ReactNode;