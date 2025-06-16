import { Button } from "@components/Button";
import { useMenu } from "./context";
import { IMenuContext, IMenuItemProps } from "./types";


export function MenuItem<Context = unknown>({ expandableProps, closeOnPress, items, ...props }: IMenuItemProps<IMenuContext>) {
    const menuContext = useMenu() as IMenuContext<Context>;
    const itemContext = Object.assign({}, props.context)
    return <Button
        testID="menu-item"
        {...props}
        context={Object.assign({}, itemContext, menuContext)}
        onPress={(event, context) => {
            if (typeof props.onPress == "function" && props.onPress(event, context) === false) {
                return;
            }
            if (closeOnPress !== false && typeof menuContext?.menu?.close == "function") {
                menuContext.menu.close();
            }
        }}
    />
};

MenuItem.displayName = "MenuItem";