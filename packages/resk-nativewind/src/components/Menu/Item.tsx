import { Button } from "@components/Button";
import { useMenu } from "./context";
import { IMenuContext, IMenuItemContext, IMenuItemProps } from "./types";


export function MenuItem<ItemContext = unknown>({ expandableProps, closeOnPress, items, ...props }: IMenuItemProps<IMenuItemContext>) {
    const menu = useMenu() as IMenuContext;
    const itemContext = Object.assign({}, props.context)
    const context = {
        ...itemContext,
        menu
    } as IMenuItemContext<ItemContext>;
    return <Button
        testID="menu-item"
        {...props}
        context={context}
        onPress={(event, context) => {
            if (typeof props.onPress == "function" && props.onPress(event, context) === false) {
                return;
            }
            if (closeOnPress !== false && typeof menu?.close == "function") {
                menu.close();
            }
        }}
    />
};

MenuItem.displayName = "MenuItem";