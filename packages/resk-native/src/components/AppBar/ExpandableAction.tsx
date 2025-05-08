import { Menu } from "@components/Menu";
import { IAppBarAction } from './types';
import { AppBarAction } from "./Action";


/**
 * ExpandableAppBarAction component that renders a button that opens a menu.
 * 
 * This component utilizes the Menu component to create an expandable action 
 * in the AppBar. When the button is pressed, it opens the associated menu 
 * and can also trigger additional actions defined in the button's props.
 *
 * @param {IAppBarAction<IAppBarActionContext>} props - The properties for configuring the ExpandableAppBarAction.
 * 
 * @param {Array} props.items - The menu items to be displayed when the button is pressed. Each item should 
 *                               contain a label and an onPress function to handle item selection.
 * 
 * @param {React.ReactNode} props.children - Optional children to be rendered inside the button. This can be 
 *                                            any valid React node, such as text or icons, to enhance the button's appearance.
 * 
 * @param {React.ForwardedRef<IButtonContext<IAppBarContext<IAppBarActionContext>>>} ref - A ref for 
 * accessing the underlying Button component. This allows parent components to interact with the 
 * button, such as focusing or measuring its dimensions.
 * 
 * @returns {ReactElement} The rendered ExpandableAppBarAction component, which includes a button that opens a menu.
 * 
 * @example
 * // Example usage of the ExpandableAppBarAction component
 * const MyAppBar = () => {
 *   const menuItems = [
 *     { label: "Profile", onPress: () => console.log("Profile clicked") },
 *     { label: "Settings", onPress: () => console.log("Settings clicked") },
 *   ];
 *   
 *   return (
 *     <ExpandableAppBarAction 
 *       items={menuItems} 
 *       onPress={() => console.log('Button pressed')}
 *     >
 *       <Text>Open Menu</Text>
 *     </ExpandableAppBarAction>
 *   );
 * };
 * 
 * @remarks
 * The ExpandableAppBarAction component is designed to provide a simple way to create expandable actions 
 * within the AppBar. It leverages the Menu component to manage the display of items and their associated 
 * actions. This component is useful for grouping related actions under a single button, improving the 
 * user interface's cleanliness and usability.
 */
function ExpandableAppBarAction<IAppBarActionContext = any>({ items, children, ...rest }: IAppBarAction<IAppBarActionContext>) {
    return <Menu
        anchor={({ openMenu }) => {
            return (
                <AppBarAction testID='resk-expandable-appbar-action-anchor'
                    {...rest}
                    onPress={(event, context) => {
                        openMenu();
                        if (typeof rest.onPress == "function") {
                            rest.onPress(event, context);
                        }
                    }}
                />
            )
        }}
        items={items}
    />
};

export default ExpandableAppBarAction