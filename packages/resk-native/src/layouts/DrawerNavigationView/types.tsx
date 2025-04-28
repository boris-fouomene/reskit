import { ReactNode } from "react";
import { IDrawerCurrentState, IDrawerProps, IDrawerItemsProps } from "../../components/Drawer/types";
import { IBackActionProps } from "@components/AppBar/types";
import { IIconSource, IIconSourceBase } from "@components/Icon/types";
import { GestureResponderEvent } from "react-native";

/**
 * Props for the `DrawerNavigationView` component.
 * 
 * The `IDrawerNavigationViewProps` interface defines the properties that can be passed to the 
 * `DrawerNavigationView` component, which manages the layout and rendering of the navigation 
 * drawer and its items. This interface extends the `IDrawerProps` interface, allowing for 
 * additional customization of the drawer's behavior and appearance.
 * 
 * @extends IDrawerProps - Inherits properties from the `IDrawerProps` interface, 
 *                         providing base functionality for the drawer component.
 * 
 * @property {IDrawerNavigationViewHeader | undefined} header - An optional header for the 
 *        drawer navigation view. This can be a static JSX element or a function that returns 
 *        a JSX element based on the current drawer state.
 * 
 * @property {IDrawerItemsProps["items"] | undefined} items - An optional array of items 
 *        to be displayed in the drawer. This allows for dynamic rendering of navigation 
 *        items based on the application's structure.
 * 
 * @property {Partial<Omit<IDrawerItemsProps, "items">> | undefined} drawerItemsProps - 
 *        Optional properties for customizing the drawer items. This allows for partial 
 *        overrides of the `IDrawerItemsProps` interface, excluding the `items` property.
 * 
 * @example
 * // Basic usage of DrawerNavigationView with a header and items
 * const drawerViewProps: IDrawerNavigationViewProps = {
 *     header: <Text>My Drawer Header</Text>,
 *     items: [
 *         { label: 'Home', onPress: () => console.log('Home pressed') },
 *         { label: 'Settings', onPress: () => console.log('Settings pressed') },
 *     ],
 *     drawerItemsProps: {
 *         itemStyle: { padding: 10 },
 *     },
 * };
 * 
 * @example
 * // Using a function for the header to dynamically render based on drawer state
 * const drawerViewPropsWithDynamicHeader: IDrawerNavigationViewProps = {
 *     header: ({ drawerState, menuIcon, menuIconProps, testID }) => (
 *         <View testID={testID}>
 *             <Text>{drawerState?.isPermanent ? 'Permanent Drawer' : 'Temporary Drawer'}</Text>
 *             {menuIcon}
 *         </View>
 *     ),
 *     items: [
 *         { label: 'Profile', onPress: () => console.log('Profile pressed') },
 *         { label: 'Logout', onPress: () => console.log('Logout pressed') },
 *     ],
 * };
 */
export interface IDrawerNavigationViewProps extends IDrawerProps {
    header?: IDrawerNavigationViewHeader;
    navigationTitle?: ReactNode;
    items?: IDrawerItemsProps["items"];
    drawerItemsProps?: Partial<Omit<IDrawerItemsProps, "items">>;
    drawerState: IDrawerCurrentState;
};

/**
 * Type definition for the header of a drawer navigation component.
 * 
 * The `IDrawerNavigationViewHeader` type can either be a JSX element or a function that returns a 
 * JSX element. This allows for flexible rendering of the drawer navigation header based on 
 * the current state of the drawer and other relevant properties.
 * 
 * @type {JSX.Element | ((options: { drawerState: IDrawerCurrentState | null, menuIcon: JSX.Element, menuIconProps: IDrawerMenuIconProps, testID: string }) => JSX.Element)}
 * 
 * @example
 * // Using a static JSX element as the drawer navigation header
 * const drawerHeader: IDrawerNavigationViewHeader = <Text>Drawer Header</Text>;
 * 
 * @example
 * // Using a function to dynamically render the drawer navigation header based on drawer state
 * const drawerHeader: IDrawerNavigationViewHeader = ({ drawerState, menuIcon, menuIconProps, testID }) => {
 *     return (
 *         <View testID={testID}>
 *             {drawerState?.isPermanent ? menuIcon : <Text>Open Menu</Text>}
 *         </View>
 *     );
 * };
 */
export type IDrawerNavigationViewHeader = JSX.Element | ((options: {
    drawerState: IDrawerCurrentState | null,
    menuIcon: JSX.Element;
    menuIconProps: IDrawerMenuIconProps;
    testID: string;
}) => JSX.Element);


/**
 * Props for the `DrawerMenuIcon` component.
 * 
 * The `IDrawerMenuIconProps` interface defines the properties that can be passed to the 
 * `DrawerMenuIcon` component, which is responsible for rendering a back action button 
 * that interacts with a drawer navigation system. This interface extends the properties 
 * of {@link IBackActionProps}, omitting specific properties to customize the behavior of the 
 * back action based on the drawer's state.
 * 
 * @extends IBackActionProps - Inherits properties from the {@link IBackActionProps} interface, 
 *                             excluding 'onPress', 'iconName', and 'source'.
 * 
 * @property {("permanent" | "temporary") | undefined} drawerMode - Specifies the behavior 
 * of the back action based on the drawer's state. If set to "permanent", the back action 
 * is rendered only when the drawer is in permanent mode. If set to "temporary", it is 
 * rendered only when the drawer is in temporary mode.
 * 
 * @property {((event: GestureResponderEvent, drawerState: IDrawerCurrentState) => any) | undefined} onPress - 
 * A callback function that is triggered when the back action button is pressed. It receives 
 * the event and the current state of the drawer as parameters.
 * 
 * @property {(IIconSourceBase | JSX.Element | ((drawerState?: IDrawerCurrentState) => IIconSource)) | undefined} icon - 
 * The icon to be displayed on the back action button. This can be a static icon source, 
 * a JSX element, or a function that returns an icon source based on the current drawer state.
 * 
 * @example
 * const backActionProps: IDrawerMenuIconProps = {
 *     drawerMode: "temporary",
 *     onPress: (event, drawerState) => {
 *         console.log("Back action pressed", drawerState);
 *     },
 *     icon: "arrow-back" // or <SomeCustomIcon />
 * };
 * 
 * @example
 * // Using a function to determine the icon based on drawer state
 * const backActionPropsWithDynamicIcon: IDrawerMenuIconProps = {
 *     drawerMode: "permanent",
 *     onPress: (event, drawerState) => {
 *         // Handle back action
 *     },
 *     icon: (drawerState) => {
 *         return drawerState.isPermanent ? "arrow-back" : "menu";
 *     }
 * };
 */
export interface IDrawerMenuIconProps extends Omit<IBackActionProps, 'onPress' | 'iconName' | 'source'> {
    drawerMode?: "permanent" | "temporary";
    onPress?: (event: GestureResponderEvent, drawerState: IDrawerCurrentState) => any;
    icon?: IIconSourceBase | JSX.Element | ((drawerState?: IDrawerCurrentState) => IIconSource);
}