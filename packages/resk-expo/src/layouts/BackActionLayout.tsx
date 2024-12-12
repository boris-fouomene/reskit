import { useTheme } from "@theme";
import { IBackActionProps } from "@components/AppBar/types";
import { IDrawerStateOptions, useGetDrawerState } from "@components/Drawer";
import { useMemo } from "react";
import { Icon, IIconSource, FontIcon, IIconButtonProps, IIconSourceBase } from "@components/Icon";
import { GestureResponderEvent } from "react-native";
import { isNonNullString } from "@resk/core";


export interface IBackActionLayoutProps extends Omit<IBackActionProps, 'onPress' | 'iconName' | 'source'> {
    /***
     * le mode spécifie le comportement du backAction en fonction de l'état du drawer. 
     * en drawer mode permanent, le backAction est rendu uniquement lorsque le drawer est en mode permanent, 
     * en drawer mode temparay, le back action est rendu uniquement lorsque l'état du drawer est temporaire
     */
    drawerMode?: "permanent" | "temporary";
    onPress?: (event: GestureResponderEvent, drawerState: IDrawerStateOptions) => any;
    icon?: IIconSourceBase | JSX.Element | ((drawerState?: IDrawerStateOptions) => IIconSource);
}


const BackActionLayout = ({ drawerMode, icon, ...props }: IBackActionLayoutProps) => {
    const theme = useTheme();
    const drawerState = useGetDrawerState();
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
    const rProps: IIconButtonProps = (isIconName || !iconSource ? { iconName: (iconSource || "menu") } : { source: iconSource as React.ReactNode }) as IIconButtonProps;
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

export default BackActionLayout;