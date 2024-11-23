import { defaultStr } from "@resk/core";
import { MenuItem } from "./Item";
import { Expandable } from "@components/Expandable";
import { IMenuItemContext, IMenuItemProps } from "./types";
import { Divider } from "@components/Divider";
import { forwardRef } from "react";

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
 * "rn-menu-item-expandable" will be used.
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
const ExpandableMenuItem = forwardRef<any, any>(function ExpandableMenuItem<IMenuItemExtendContext = any>({ testID, dividerProps, divider, expandableProps, children, ...props }: IMenuItemProps<IMenuItemExtendContext>, ref?: React.ForwardedRef<IMenuItemContext<IMenuItemExtendContext>>) {
    testID = defaultStr(testID, "rn-menu-item-expandable");
    return <Expandable
        testID={testID + "-expandable"}
        {...Object.assign({}, expandableProps)}
        label={<MenuItem closeOnPress={!!!children} ref={ref} {...props} testID={testID} />}
        children={<>
            {children}
            {divider && <Divider testID={testID + "-divider"} {...Object.assign({}, dividerProps)} />}
        </>}
    />
});
ExpandableMenuItem.displayName = "ExpandableMenuItem";
export default ExpandableMenuItem;