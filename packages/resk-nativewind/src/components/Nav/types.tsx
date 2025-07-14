import { IButtonProps } from "@components/Button/types";
import { IExpandableProps } from "@components/Expandable/types";
import { IHtmlDivProps } from "@html/types";
import { IClassName, IReactComponent, IReactNullableElement } from "@src/types";
import { ReactNode } from "react";

export interface INavItemProps<Context = unknown> extends IButtonProps<Context> {
    /***
     * if true, the menu item will be rendered as a section, if false, it will be rendered as an item
     */
    section?: boolean;
    /***
     * Props for the sub items. In case of existance of sub items.  If provided, the menu item will be expandable.
     */
    items?: INavItemProps<Context>[];
    /**
     * Props for the expandable component that will be used to expand the menu item. In case of existance of sub items.
     */
    expandableProps?: IExpandableProps;

    /***
     * level of the menu item in the hierarchy. 
     * this is used to determine the indentation of the menu item.
     * this value is auto calculated by the menu items component.
     */
    level?: number;

    /***
     * if true, the menu will be closed when the button is pressed.
     */
    closeOnPress?: boolean;

    dividerClassName?: IClassName;

    linkProps?: INavLinkProps;
};

/**
 * Represents a list of navigation items for the navigation menu.
 *
 * @typeParam ItemType - The type of each navigation item. Defaults to `unknown`.
 *
 * @example
 * // Example usage with INavItemProps:
 * const navItems: INavItems<INavItemProps> = [
 *   { label: "Home", onPress: () => navigate("/") },
 *   { label: "About", onPress: () => navigate("/about") },
 *   undefined, // Allows for optional or conditional items
 *   null,      // Allows for optional or conditional items
 * ];
 *
 * @remarks
 * This type allows for arrays containing navigation items, as well as `undefined` or `null` values.
 * This is useful when conditionally rendering menu items or when mapping over data that may include
 * optional entries.
 */
export type INavItems<ItemType = unknown> = (ItemType | undefined | null)[];

export interface INavContext<Context = unknown> {
    /**
     * additioonal parameters that allows extending the context
    * for menu items. This enables customization of the properties passed to the menu item
    * render function, allowing for additional context-specific data to be included.
    *
    */
    context?: Context;
}
export interface INavItemsProps<Context = unknown> extends IHtmlDivProps, INavContext<Context> {

    items?: INavItems<INavItemProps<Context>>;

    /****
     * The class name to apply to each nav item.
     */
    itemClassName?: IClassName;

    /**
     * The function used to render a
    * standard menu item. This function receives the item properties and is responsible for generating
    * the corresponding JSX.
     */
    renderItem?: INavRenderItemFunc<Context>,

    /**
     * The function used to
    * render expandable menu items. Similar to the render function, this handles the rendering of
    * items that can expand to show additional content.
     */
    renderExpandableItem?: INavRenderItemFunc<Context>,
}


export interface INavRenderItemOptions<Context = unknown> extends Omit<INavItemsProps<Context>, "items"> {
    /**
     * The menu item to render. This includes
    * all relevant data required to display the item, such as its label, icon, and any action handlers.
     */
    item: INavItemProps<Context>,
    /**
     * The index of the item in the list. This can be useful for applying
    * specific styles or behaviors based on the item's position within the menu.
     */
    index: number,



    /**
     * An optional property indicating the current level of the menu item
        * in the hierarchy. This value can be used to determine the indentation of the menu item.
     */
    level?: number,


    /**
     * The child nodes of the current item, rendered
    * using the renderNavItem method applied to each child item.
     */
    itemsNodes?: IReactNullableElement[];
};

export type INavRenderItemFunc<Context = unknown> = (props: INavItemProps<Context>, index: number) => IReactNullableElement;


export interface INavLinkProps {
    /**
     * Used to customize the `Link` component. It will forward all props to the
     * first child of the `Link`. Note that the child component must accept
     * `onPress` or `onClick` props. The `href` and `role` are also
     * passed to the child.
     *
     * @example
     * ```tsx
     * import { Link } from 'expo-router';
     * import { Pressable, Text } from 'react-native';
     *
     * export default function Route() {
     *  return (
     *   <Div>
     *    <Link href="/home" asChild>
     *      <Pressable>
     *       <Text>Home</Text>
     *      </Pressable>
     *    </Link>
     *   </Div>
     *  );
     *}
     * This is equivalent to props passHref on Next.js Link
     * @see {@link https://nextjs.org/docs/pages/api-reference/components/link}
     * ```
     */
    asChild?: boolean;

    /**
     * The children of the link
     */
    children?: ReactNode;

    /**
     * The testID of the link
     */
    testID?: string;
}

export type INavLinkComponent<NavState = unknown> = IReactComponent<INavLinkProps, NavState>;