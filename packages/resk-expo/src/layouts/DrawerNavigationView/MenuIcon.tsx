import { useTheme } from "@theme";
import { IBackActionProps } from "@components/AppBar/types";
import { IDrawerCurrentState, useDrawerCurrentState } from "@components/Drawer";
import { useMemo } from "react";
import { Icon, IIconSource, FontIcon, IIconProps, IIconSourceBase } from "@components/Icon";
import { GestureResponderEvent } from "react-native";
import { isNonNullString } from "@resk/core";

/**
 * Props for the `DrawerNavigationViewMenuIcon` component.
 * 
 * The `IDrawerNavigationViewMenuIconProps` interface defines the properties that can be passed to the 
 * `DrawerNavigationViewMenuIcon` component, which is responsible for rendering a back action button 
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
 * const backActionProps: IDrawerNavigationViewMenuIconProps = {
 *     drawerMode: "temporary",
 *     onPress: (event, drawerState) => {
 *         console.log("Back action pressed", drawerState);
 *     },
 *     icon: "arrow-back" // or <SomeCustomIcon />
 * };
 * 
 * @example
 * // Using a function to determine the icon based on drawer state
 * const backActionPropsWithDynamicIcon: IDrawerNavigationViewMenuIconProps = {
 *     drawerMode: "permanent",
 *     onPress: (event, drawerState) => {
 *         // Handle back action
 *     },
 *     icon: (drawerState) => {
 *         return drawerState.isPermanent ? "arrow-back" : "menu";
 *     }
 * };
 */
export interface IDrawerNavigationViewMenuIconProps extends Omit<IBackActionProps, 'onPress' | 'iconName' | 'source'> {
    drawerMode?: "permanent" | "temporary";
    onPress?: (event: GestureResponderEvent, drawerState: IDrawerCurrentState) => any;
    icon?: IIconSourceBase | JSX.Element | ((drawerState?: IDrawerCurrentState) => IIconSource);
}

/**
 * A functional component that renders a back action button for drawer navigation.
 * 
 * The `DrawerNavigationViewMenuIcon` component is designed to provide a customizable back action 
 * button that adapts its behavior and appearance based on the state of the drawer 
 * navigation. It utilizes the `drawerMode` prop to determine when to render the button 
 * and allows for dynamic icons based on the drawer's state.
 * 
 * @param {IDrawerNavigationViewMenuIconProps} props - The properties for the component.
 * @param {("permanent" | "temporary") | undefined} props.drawerMode - Specifies the 
 *        rendering behavior of the back action button based on the drawer's state. 
 *        If set to "permanent", the button is rendered only when the drawer is in 
 *        permanent mode; if "temporary", it is rendered only when the drawer is in 
 *        temporary mode.
 * @param {(IIconSourceBase | JSX.Element | ((drawerState?: IDrawerCurrentState) => IIconSource)) | undefined} props.icon - 
 *        The icon to be displayed on the button. This can be a static icon source, 
 *        a JSX element, or a function that returns an icon based on the current drawer state.
 * @param {IIconProps} props - Additional properties for the icon button.
 * 
 * @returns {JSX.Element | null} Returns a JSX element representing the back action button 
 *          if it can be rendered; otherwise, returns null.
 * 
 * @example
 * // Basic usage of DrawerNavigationViewMenuIcon with a static icon
 * <DrawerNavigationViewMenuIcon 
 *     drawerMode="temporary" 
 *     icon="arrow-back" 
 *     onPress={(event, drawerState) => {
 *         console.log("Back action pressed", drawerState);
 *     }} 
 * />
 * 
 * @example
 * // Using a function to dynamically determine the icon based on drawer state
 * <DrawerNavigationViewMenuIcon 
 *     drawerMode="permanent" 
 *     icon={(drawerState) => drawerState.isPermanent ? "arrow-back" : "menu"} 
 *     onPress={(event, drawerState) => {
 *         // Handle back action
 *     }} 
 * />
 * @see {@link IDrawerNavigationViewMenuIconProps} for more information on the props.
 * @see {@link IBackActionProps} for more information on the back action props.
 * @see {@link IDrawerCurrentState} for more information on the drawer state options.
 * @see {@link useDrawerCurrentState} for more information on how to use the hook.
 * @see {@link Icon} for more information on the Icon component.
 */
export const DrawerNavigationViewMenuIcon = ({ drawerMode, icon, ...props }: IDrawerNavigationViewMenuIconProps) => {
    const theme = useTheme();
    const drawerState = useDrawerCurrentState();
    console.log(drawerState, " is drawer state");
    const canRender = useMemo(() => {
        if (!drawerState) return false;
        if (!drawerMode) return true;
        const state = drawerState?.isPermanent;
        return drawerMode === "permanent" ? state : !state;
    }, [drawerMode, drawerState]);
    if (!canRender || !drawerState) {
        return null;
    }
    const iconSource = typeof icon == "function" ? icon(drawerState) : icon;
    const isIconName = isNonNullString(iconSource) && FontIcon.isValidName(iconSource as string);
    const rProps: IIconProps = (isIconName || !iconSource ? { iconName: (iconSource || "menu") } : { source: iconSource as React.ReactNode }) as IIconProps;
    return <Icon.Button
        size={30}
        {...props}
        onPress={(e: GestureResponderEvent) => {
            if (props.onPress) {
                props.onPress(e, drawerState);
            }
            drawerState?.context?.toggle();
        }}
        {...rProps}
    />;
}

DrawerNavigationViewMenuIcon.displayName = "DrawerNavigationViewMenuIcon";