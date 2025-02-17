import { defaultStr } from "@resk/core";
import { MenuItem } from "./Item";
import { Expandable, useExpandable } from "@components/Expandable";
import { IMenuItemBase, IMenuItemContext, IMenuItemProps } from "./types";
import { Divider } from "@components/Divider";
import { forwardRef, useMemo } from "react";
import { IButtonRef } from "@components/Button";
import { StyleSheet } from "react-native";
import Theme from "@theme/index";
import isValidElement from "@utils/isValidElement";
import { IReactComponent } from "@src/types";
import { useMenu } from "./context";

/**
 * A functional component that renders an expandable menu item within a navigation menu.
 * This component allows for the inclusion of child elements that can be shown or hidden
 * based on user interaction, enhancing the user experience by organizing content in a
 * collapsible format.
 * 
 * @template IMenuItemExtendContext - A generic type parameter that allows for extending the
 * context of the menu item. This can be used to pass additional properties or context that
 * are relevant to the specific implementation of the menu item.
 * 
 * @param {object} props - The properties for the component.
 * @param {string} [props.testID] - An optional identifier for testing purposes. This can be
 * used in automated tests to locate the component. If not provided, a default value of
 * "resk-expandable-item" will be used.
 * 
 * @param {React.ComponentType} [props.as] - A component type that can be used to render the
 * label of the expandable item. If not provided, the default `MenuItem` component will be used.
 * 
 * @param {object} [props.dividerProps] - Optional properties to customize the divider's
 * appearance. This allows for flexibility in styling the divider that separates the menu item
 * from other elements.
 * 
 * @param {boolean} [props.divider] - A boolean value indicating whether to display a divider
 * below the expandable menu item. If set to true, a divider will be rendered.
 * 
 * @param {object} [props.expandableProps] - Additional properties passed to the expandable
 * component, allowing for further customization of the expand/collapse behavior.
 * 
 * @param {React.ReactNode} props.children - The content to be displayed within the expandable
 * section. This can include any valid React nodes, allowing for rich content to be displayed
 * when the menu item is expanded.
 * 
 * @param {object} [props.contentProps] - Additional properties for customizing the content
 * wrapper of the expandable item.
 * 
 * @returns {JSX.Element} Returns a JSX element representing the expandable menu item,
 * including the label and the expandable content.
 * 
 * @example
 * ```tsx
 * <ExpandableItem
 *   testID="custom-expandable-item"
 *   divider={true}
 *   expandableProps={{ onExpand: () => console.log('Expanded!') }}
 *   as={CustomMenuItem} // Optional custom component for the label
 * >
 *   <Text>This is the expandable content.</Text>
 * </ExpandableItem>
 * ```
 * 
 * In the example above, an `ExpandableItem` is created with a custom test ID. A divider
 * is shown below the menu item, and the `expandableProps` are used to log a message when
 * the item is expanded. The content of the expandable section is a simple text element.
 * 
 * @remarks
 * This component is particularly useful in navigation menus where space is limited, and
 * users may want to reveal additional options or information without cluttering the interface.
 * The use of generics allows for flexibility in extending the component's functionality
 * based on specific requirements.
 * @see {@link IMenuItemBase} for the base properties of the menu item.
 * @see {@link IMenuItemExtendContext} for extending the context of the menu item.
 * @see {@link IMenuItemProps} for the properties of the menu item.
 * @see {@link IMenuItemContext} for the context of the menu item.
 * @see {@link IMenuItemRenderFunc} for the rendering function of the menu item.
 * @see {@link IMenuRenderItemsOptions} for the options of the menu render function.
 * @see {@link useGetExpandableItemProps} for the hook that retrieves the properties of the expandable item.
 */
export const ExpandableItem = forwardRef<any, any>(function ExpandableMenuItem<IMenuItemExtendContext = any>({ testID, as, dividerProps, items, divider, expandableProps, children, contentProps, ...props }: IMenuItemBase<IMenuItemExtendContext> & { as: IReactComponent<IMenuItemBase<IMenuItemExtendContext> & { ref?: IButtonRef<IMenuItemExtendContext> }> }, ref: IButtonRef<IMenuItemExtendContext>) {
    testID = defaultStr(testID, "resk-expandable-item");
    expandableProps = Object.assign({}, expandableProps);
    const containerProps = Object.assign({}, expandableProps.containerProps);
    const expandableLabelProps = Object.assign({}, expandableProps.labelProps);
    contentProps = Object.assign({}, contentProps);
    return <Expandable
        testID={testID + "-expandable-item"}
        {...expandableProps}
        labelProps={{ ...expandableLabelProps, style: [Theme.styles.noMargin, Theme.styles.noPadding, expandableLabelProps.style] }}
        containerProps={{ ...containerProps, style: [styles.expandable, containerProps.style] }}
        showExpandIcon={false}
        label={<ExpandableItemLabel as={as} {...props} ref={ref} />}
        children={<>
            {children}
            {divider && <Divider testID={testID + "-divider"} {...Object.assign({}, dividerProps)} />}
        </>}
    />
});

const ExpandableItemLabel = forwardRef<any, any>(function ExpandableMenuItem<IMenuItemExtendContext = any>({ as, ...rest }: IMenuItemBase<IMenuItemExtendContext> & { as: IReactComponent<IMenuItemBase<IMenuItemExtendContext> & { ref?: IButtonRef<IMenuItemExtendContext> }> }, ref: IButtonRef<IMenuItemExtendContext>) {
    const Component = useMemo(() => {
        return as || MenuItem;
    }, [as]);
    const props = useGetExpandableItemProps<IMenuItemExtendContext>(rest);
    return <Component
        ref={ref}
        isExpandable
        {...props}
    />
});
ExpandableItemLabel.displayName = "ExpandableMenuItemLabel";
ExpandableItem.displayName = "ExpandableMenuItem";

/**
 * A functional component that renders an expandable menu item within a navigation menu.
 * This component allows for the inclusion of child elements that can be shown or hidden
 * based on user interaction, enhancing the user experience by organizing content in a
 * collapsible format.
 *
 * @template IMenuItemExtendContext - A generic type parameter that allows for extending the
 * context of the menu item. This can be used to pass additional properties or context that
 * are relevant to the specific implementation of the menu item.
 *
 * @param {object} props - The properties for the component.
 * @param {string} [props.testID] - An optional identifier for testing purposes. This can be
 * used in automated tests to locate the component. If not provided, a default value of
 * "resk-menu-item-expandable" will be used.
 * 
 * @param {object} [props.dividerProps] - Optional properties to customize the divider's
 * appearance. This allows for flexibility in styling the divider that separates the menu item
 * from other elements.
 * 
 * @param {boolean} [props.divider] - A boolean value indicating whether to display a divider
 * below the expandable menu item. If set to true, a divider will be rendered.
 * 
 * @param {object} [props.expandableProps] - Additional properties passed to the expandable
 * component, allowing for further customization of the expand/collapse behavior.
 * 
 * @param {React.ReactNode} props.children - The content to be displayed within the expandable
 * section. This can include any valid React nodes, allowing for rich content to be displayed
 * when the menu item is expanded.
 * 
 * @returns {JSX.Element} Returns a JSX element representing the expandable menu item,
 * including the label and the expandable content.
 *
 * @example
 * ```tsx
 * <ExpandableMenuItem
 *   testID="custom-menu-item"
 *   divider={true}
 *   expandableProps={{ onExpand: () => console.log('Expanded!') }}
 * >
 *   <Text>This is the expandable content.</Text>
 * </ExpandableMenuItem>
 * ```
 *
 * In the example above, an `ExpandableMenuItem` is created with a custom test ID. A divider
 * is shown below the menu item, and the `expandableProps` are used to log a message when
 * the item is expanded. The content of the expandable section is a simple text element.
 *
 * @remarks
 * This component is particularly useful in navigation menus where space is limited, and
 * users may want to reveal additional options or information without cluttering the interface.
 * The use of generics allows for flexibility in extending the component's functionality
 * based on specific requirements.
 */
const ExpandableMenuItem = forwardRef<any, any>(function ExpandableMenuItem<IMenuItemExtendContext = any>({ testID, context, ...props }: IMenuItemProps<IMenuItemExtendContext>, ref: IButtonRef<IMenuItemContext<IMenuItemExtendContext>>) {
    const menuContext = useMenu();
    return <ExpandableItem
        context={Object.assign({}, context, menuContext)}
        testID={testID}
        {...props}
        as={MenuItem}
        ref={ref}
    />
});


ExpandableMenuItem.displayName = "ExpandableMenuItem";
export default ExpandableMenuItem;

const styles = StyleSheet.create({
    expandable: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        //marginRight: 5,
    },
    expandableItem: {
        //paddingVertical: 4,
    },
    expandableItemContent: {
        paddingVertical: 0,
    }
});

/**
 * A custom hook that retrieves and constructs properties for an expandable menu item.
 * This hook integrates with the `ExpandableContext` to provide necessary props for rendering
 * an expandable item, including accessibility roles and styles.
 * 
 * @template IMenuItemExtendContext - A generic type parameter that allows for extending the
 * context of the menu item. This can be used to pass additional properties or context that
 * are relevant to the specific implementation of the menu item.
 * 
 * @param {object} props - The properties for the expandable item.
 * @param {string} [props.testID] - An optional identifier for testing purposes. This can be
 * used in automated tests to locate the component.
 * 
 * @param {React.ReactNode | ((options: any) => React.ReactNode)} [props.right] - A component or
 * function that renders the right side content of the expandable item. If it's a function, it
 * receives options as an argument.
 * 
 * @param {object} [props.contentProps] - Additional properties for customizing the content
 * wrapper of the expandable item.
 * 
 * @param {object} [rest] - Any additional properties that should be included in the returned
 * object.
 * 
 * @returns {IMenuItemBase<IMenuItemExtendContext>} An object containing the constructed properties
 * for the expandable item, including the role, testID, contentProps, and right content.
 * 
 * @example
 * ```tsx
 * const MyExpandableItem: React.FC = () => {
 *   const itemProps = useGetExpandableItemProps({
 *     testID: "my-expandable-item",
 *     right: (options) => <Icon name="chevron-down" />,
 *     contentProps: { style: { padding: 10 } },
 *   });
 * 
 *   return (
 *     <ExpandableItem {...itemProps}>
 *       <Text>This is the expandable content.</Text>
 *     </ExpandableItem>
 *   );
 * };
 * ```
 * 
 * In the example above, the `useGetExpandableItemProps` hook is used to create properties for an
 * `ExpandableItem`. The `right` property is a function that returns an icon, and the `contentProps`
 * are customized with additional styles.
 * 
 * @remarks
 * This hook is particularly useful for managing the props of expandable items in a consistent
 * manner, ensuring that all necessary properties are included and properly formatted. It also
 * leverages the `ExpandableContext` to access the expand icon, enhancing the integration of
 * expandable items within the menu structure.
 */
function useGetExpandableItemProps<IMenuItemExtendContext = any>({ testID, expandableProps, right, contentProps, ...rest }: IMenuItemBase<IMenuItemExtendContext>) {
    const ExpandableContext = useExpandable();
    contentProps = Object.assign({}, contentProps);
    return {
        role: "tree",
        ...rest,
        testID,
        style: [styles.expandableItem, rest.style],
        contentProps: { ...contentProps, style: [styles.expandableItemContent, contentProps.style] },
        expandableProps: expandableProps,
        right: (options) => {
            const r = typeof right == "function" ? right(options) : right;
            return <>
                {isValidElement(r) ? r : null}
                {ExpandableContext?.expandIcon}
            </>
        }
    } as IMenuItemBase<IMenuItemExtendContext>;
}

