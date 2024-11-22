import { Menu } from "@components/Menu";
import { Button } from "@components/Button";
import { IAppBarAction } from './types';
import { GestureResponderEvent } from "react-native";

/**
 * ExpandableAppBarAction component that renders a button that opens a menu.
 * 
 * This component utilizes the Menu component to create an expandable action 
 * in the AppBar. When the button is pressed, it opens the associated menu 
 * and can also trigger additional actions defined in the button's props.
 *
 * @param {IAppBarAction} props - The properties for configuring the ExpandableAppBarAction.
 * @param {Array} props.items - The menu items to be displayed when the button is pressed.
 * @param {React.ReactNode} props.children - Optional children to be rendered inside the button.
 * 
 * @returns {JSX.Element} The rendered ExpandableAppBarAction component.
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
 *     <ExpandableAppBarAction items={menuItems} onPress={() => console.log('Button pressed')}>
 *       <Text>Open Menu</Text>
 *     </ExpandableAppBarAction>
 *   );
 * };
 */
const ExpandableAppBarAction = ({ items, children, ...rest }: IAppBarAction) => {
    return <Menu
        anchor={({ openMenu }) => {
            return (
                <Button testID='RN_App' {...rest}
                    onPress={(event: GestureResponderEvent) => {
                        openMenu();
                        if (rest.onPress) {
                            return rest.onPress(event);
                        }
                    }}
                />
            )
        }}
        items={items}
    />
}

export default ExpandableAppBarAction