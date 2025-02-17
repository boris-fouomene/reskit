import { View } from "react-native";
import { IDrawerItemsProps, IDrawerProps, IDrawerCurrentState } from "@components/Drawer";
import { StyleSheet } from "react-native";
import Label from "@components/Label";
import { DrawerMenuIcon, IDrawerMenuIconProps } from "./DrawerMenuIcon";
import { HStack } from "@components/Stack";
import { useTheme } from "@theme";
import { ScrollView } from "react-native";
import { Divider } from "@components/Divider";
import { isRTL } from "@utils/index";
import { defaultStr } from "@resk/core";
import { isValidElement } from "@utils";
import { ReactNode } from "react";
import DrawerItems from "@components/Drawer/DrawerItems";

/**
 * A functional component that renders the navigation drawer view.
 * 
 * The `DrawerNavigationView` component is responsible for displaying the entire 
 * layout of the drawer navigation, including the header, items, and any additional 
 * children. It integrates the drawer navigation menu icon and manages the state of the drawer.
 * 
 * @param {IDrawerNavigationViewProps} props - The properties for the component.
 * @param {IDrawerNavigationViewHeader | undefined} props.header - An optional header 
 *        for the drawer navigation view, which can be a static JSX element or a function 
 *        that returns a JSX element based on the current drawer state.
 * @param {string} props.testID - A unique identifier for testing purposes.
 * @param {IDrawerItemsProps["items"] | undefined} props.items - An optional array of 
 *        items to be displayed in the drawer.
 * @param {Partial<Omit<IDrawerItemsProps, "items">> | undefined} props.drawerItemsProps - 
 *        Optional properties for customizing the drawer items.
 * @param {React.ReactNode} props.children - Optional additional children to be rendered 
 *        within the drawer view.
 * 
 * @returns {JSX.Element} Returns a JSX element representing the drawer navigation view.
 * 
 * @example
 * // Basic usage of DrawerNavigationView with a header and items
 * <DrawerNavigationView 
 *     testID="drawer-view" 
 *     header={<Text>My Drawer Header</Text>} 
 *     items={[
 *         { label: 'Home', onPress: () => console.log('Home pressed') },
 *         { label: 'Settings', onPress: () => console.log('Settings pressed') },
 *     ]}
 *     drawerItemsProps={{ itemStyle: { padding: 10 } }}
 * >
 *     <Text>Additional Content</Text>
 * </DrawerNavigationView>
 */
export const DrawerNavigationView = ({ children, testID,navigationTitle, header, items, drawerItemsProps, drawerState }: IDrawerNavigationViewProps) => {
    testID = defaultStr(testID, "resk-drawer-layout");
    const theme = useTheme();
    drawerItemsProps = Object.assign({}, drawerItemsProps);
    const menuIconProps: IDrawerMenuIconProps = {
        size: 25,
        testID: `${testID}-back-action-layout`,
        color: theme.colors.onSurface,
        icon: (drawerState) => {
            if (drawerState?.canBePinned) {
                return drawerState?.isPinned ? "pin-off" : "pin";
            }
            return "close";
        },
        onPress: (event, drawerState) => {
            if (!drawerState?.canBePinned) return;
            drawerState?.isPermanent ? drawerState?.context?.unpin() : drawerState?.context?.pin();
        }
    };
    const menuIcon = <DrawerMenuIcon {...menuIconProps} />;
    return <ScrollView>
        <DrawerNavigationHeader title={navigationTitle} drawerState={drawerState} children={header} testID={testID} menuIcon={menuIcon} menuIconProps={menuIconProps} />
        <Divider />
        <DrawerItems testID={testID + "-drawer-items"} items={items} {...drawerItemsProps} />
        {isValidElement(children) ? children : null}
    </ScrollView>
};


/**
 * A functional component that renders the header for the drawer navigation.
 * 
 * The `DrawerNavigationHeader` component is responsible for displaying the header 
 * of the drawer navigation, which can include a logo, drawer navigation menu icon, and 
 * any additional children passed to it. The component adapts its rendering based 
 * on the type of children provided (static JSX or a function).
 * 
 * @param {Object} props - The properties for the component.
 * @param {string} props.testID - A unique identifier for testing purposes.
 * @param {IDrawerNavigationViewHeader | undefined} props.children - Optional children 
 *        for the header, which can be a static JSX element or a function that returns 
 *        a JSX element based on the current drawer state.
 * @param {JSX.Element} props.menuIcon - The drawer navigation view menu icon to be displayed.
 *        to be displayed in the header.
 * @param {IDrawerMenuIconProps} props.menuIconProps - Properties to customize 
 *        the drawer navigation menu icon.
 * 
 * @returns {React.ReactNode} Returns a JSX element representing the drawer navigation 
 *          header, or null if no valid children are provided.
 * 
 * @example
 * // Basic usage of DrawerNavigationHeader with static children
 * <DrawerNavigationHeader 
 *     testID="drawer-header" 
 *     menuIcon={<BackButton />} 
 *     menuIconProps={{ drawerMode: "temporary" }}
 * >
 *     <Text>Custom Header Title</Text>
 * </DrawerNavigationHeader>
 * 
 * @example
 * // Using a function for children to dynamically render header content
 * <DrawerNavigationHeader 
 *     testID="drawer-header" 
 *     menuIcon={<BackButton />} 
 *     menuIconProps={{ drawerMode: "permanent" }}
 * >
 *     {({ drawerState, testID }) => (
 *         <Text testID={testID}>Current State: {drawerState?.isPermanent ? 'Permanent' : 'Temporary'}</Text>
 *     )}
 * </DrawerNavigationHeader>
 */
const DrawerNavigationHeader: React.FC<{ testID: string,title?:ReactNode, children?: IDrawerNavigationViewHeader, drawerState: IDrawerCurrentState, menuIcon: JSX.Element; menuIconProps: IDrawerMenuIconProps }> = ({ children, menuIcon, menuIconProps, testID, drawerState,title }): React.ReactNode => {
    if (isValidElement(children)) {
        return children as ReactNode;
    }
    if (typeof children == "function") {
        const h = children({ drawerState, testID: testID + "-header", menuIcon, menuIconProps });
        return isValidElement(h) ? h : null;
    }
    const left = <>
        <Label textBold style={styles.logoText}>
            {title}
        </Label>
    </>, right = isValidElement(menuIcon) ? menuIcon : null;
    return <View testID={testID + "-header-container"} style={styles.headerContainer}>
        <HStack testID={testID + "-header-left"} style={styles.header}>
            {isRTL ? <>{right}{left}</> : <>{left}{right}</>}
        </HStack>
    </View>;
};
DrawerNavigationHeader.displayName = "DrawerNavigationViewHeader";
const styles = StyleSheet.create({
    logoContainer: {
        paddingTop: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    headerContainer: {
        paddingBottom: 5,
    },
    logoText: {
        fontSize: 24,
        fontWeight: "bold",
    },
    header: {
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    headerLeft: {
        alignItems: "center",
    },
});

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
type IDrawerNavigationViewHeader = JSX.Element | ((options: {
    drawerState: IDrawerCurrentState | null,
    menuIcon: JSX.Element;
    menuIconProps: IDrawerMenuIconProps;
    testID: string;
}) => JSX.Element);

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