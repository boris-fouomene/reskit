import { Button } from "@components/Button";
import { useMenu } from "./context";
import { IMenuItemContext, IMenuItemProps } from "./types";
import { GestureResponderEvent, StyleSheet } from "react-native";
import { forwardRef } from "react";
import { IButtonRef } from "@components/Button/types";
import { useTheme } from "@theme/index";

/**
 * MenuItem component that renders a button as a menu item within a menu context. 
 * This component is designed to be flexible and customizable, allowing for 
 * additional properties and context extensions specific to the menu item.
 * 
 * @template IMenuItemAdditionalProps - A generic type that allows the inclusion 
 * of additional properties specific to the menu item implementation. This can 
 * be any object type, allowing for extensibility of the menu item's functionality.
 * 
 * @template IMenuItemExtendContext - A generic type that allows the inclusion 
 * of additional context properties specific to the menu item's context implementation. 
 * This can also be any object type, allowing for further customization of the context.
 * 
 * @param props - The properties for the MenuItem component. This includes 
 * the standard button properties, as well as additional context and styling options.
 * 
 * @param ref - A forwarded ref to access the button context.
 * 
 * @returns A Button component rendered as a menu item, which integrates 
 * with the menu context and supports custom properties and styles.
 * 
 * @example
 * // Example of using the MenuItem component in a menu
 * const MyMenu = () => {
 *   const menuContext = useMenu();
 *   return (
 *     <Menu>
 *       <MenuItem
 *         label="Item 1"
 *         iconProps={{ name: "home" }}
 *         onPress={() => console.log('Item 1 clicked')}
 *       />
 *       <MenuItem
 *         label="Item 2"
 *         iconProps={{ name: "settings" }}
 *         onPress={() => console.log('Item 2 clicked')}
 *       />
 *     </Menu>
 *   );
 * };
 * 
 * @remarks
 * - The MenuItem component utilizes the `useMenu` hook to access the 
 *   current menu context, ensuring that it behaves correctly within the 
 *   menu structure.
 * - The component allows for custom styling through the `labelProps` 
 *   and `iconProps`, enabling developers to tailor the appearance 
 *   of the menu item as needed.
 * - The `forwardRef` is used to allow parent components to reference 
 *   the underlying button context, providing additional flexibility 
 *   in managing button states and behaviors.
 */
export const MenuItem = forwardRef<any, IMenuItemProps<any>>(function MenuItem<IMenuItemExtendContext extends object = any>({ expandableProps, containerProps, contentProps, closeOnPress, items, ...props }: IMenuItemProps<IMenuItemExtendContext>, ref?: IButtonRef<IMenuItemContext<IMenuItemExtendContext>>) {
    const menuContext = useMenu();
    const theme = useTheme();
    containerProps = Object.assign({}, containerProps);
    contentProps = Object.assign({}, contentProps);
    const itemContext = Object.assign({}, props.context, menuContext);
    return <Button
        testID="menu-item"
        borderRadius={0}
        textColor={theme.colors.text}
        fullWidth
        {...props}
        containerProps={containerProps}
        contentProps={{ ...contentProps, style: [styles.buttonContent, contentProps.style] }}
        iconProps={{ ...Object.assign({}, props.iconProps), style: [styles.icon, props?.iconProps?.style] }}
        context={itemContext}
        onPress={(event, context) => {
            if (typeof props.onPress == "function" && props.onPress(event, Object.assign({}, itemContext, context)) === false) {
                return;
            }
            if (closeOnPress !== false && typeof menuContext?.closeMenu == "function") {
                menuContext.closeMenu();
            }
        }}
        ref={ref}
    />
});

MenuItem.displayName = "MenuItem";


const styles = StyleSheet.create({
    icon: {
        alignItems: "center",
    },
    buttonContent: {
        justifyContent: "flex-start",
    }
});
