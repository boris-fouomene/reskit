import { IBackActionProps } from "@components/AppBar";
import { IDrawerCurrentState, useDrawerCurrentState } from "@components/Drawer";
import { useMemo } from "react";
import { Icon, FontIcon, IIconProps } from "@components/Icon";
import { GestureResponderEvent } from "react-native";
import { isNonNullString } from "@resk/core/utils";
import { useAppBar } from "@components/AppBar";
import { IDrawerMenuIconProps } from "./types";



/**
 * A functional component that renders a back action button for drawer navigation.
 * 
 * The `DrawerMenuIcon` component is designed to provide a customizable back action 
 * button that adapts its behavior and appearance based on the state of the drawer 
 * navigation. It utilizes the `drawerMode` prop to determine when to render the button 
 * and allows for dynamic icons based on the drawer's state.
 * 
 * @param {IDrawerMenuIconProps} props - The properties for the component.
 * @param {("permanent" | "temporary") | undefined} props.drawerMode - Specifies the 
 *        rendering behavior of the back action button based on the drawer's state. 
 *        If set to "permanent", the button is rendered only when the drawer is in 
 *        permanent mode; if "temporary", it is rendered only when the drawer is in 
 *        temporary mode.
 * @param {(IIconSourceBase | ReactElement | ((drawerState?: IDrawerCurrentState) => IIconSource)) | undefined} props.icon - 
 *        The icon to be displayed on the button. This can be a static icon source, 
 *        a JSX element, or a function that returns an icon based on the current drawer state.
 * @param {IIconProps} props - Additional properties for the icon button.
 * 
 * @returns {ReactElement | null} Returns a JSX element representing the back action button 
 *          if it can be rendered; otherwise, returns null.
 * 
 * @example
 * // Basic usage of DrawerMenuIcon with a static icon
 * <DrawerMenuIcon 
 *     drawerMode="temporary" 
 *     icon="arrow-back" 
 *     onPress={(event, drawerState) => {
 *         console.log("Back action pressed", drawerState);
 *     }} 
 * />
 * 
 * @example
 * // Using a function to dynamically determine the icon based on drawer state
 * <DrawerMenuIcon 
 *     drawerMode="permanent" 
 *     icon={(drawerState) => drawerState.isPermanent ? "arrow-back" : "menu"} 
 *     onPress={(event, drawerState) => {
 *         // Handle back action
 *     }} 
 * />
 * @see {@link IDrawerMenuIconProps} for more information on the props.
 * @see {@link IBackActionProps} for more information on the back action props.
 * @see {@link IDrawerCurrentState} for more information on the drawer state options.
 * @see {@link useDrawerCurrentState} for more information on how to use the hook.
 * @see {@link Icon} for more information on the Icon component.
 */
export const DrawerMenuIcon = ({ drawerMode, icon, ...props }: IDrawerMenuIconProps) => {
    const drawerState = useDrawerCurrentState();
    const appBarContext = useAppBar();
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
        color={appBarContext?.textColor}
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

DrawerMenuIcon.displayName = "DrawerMenuIcon";