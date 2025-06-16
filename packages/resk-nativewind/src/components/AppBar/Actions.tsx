import { isNumber } from "@resk/core/utils";
import { IAppBarActionsProps, IAppBarProps } from "./types";
import { Dimensions } from "react-native";

export function AppBarActions<Context = unknown>({ actions, renderAction, renderExpandableAction }: IAppBarActionsProps<Context>) {
    return <></>
}


const getAppBarMaxActions = (windowWidth?: number): number => {
    let iWidth = isNumber(windowWidth) && windowWidth > 200 ? windowWidth : Dimensions.get("window").width - 100;
    return iWidth >= 3000 ? 8 : iWidth >= 2500 ? 7 : iWidth >= 2000 ? 6 : iWidth >= 1600 ? 5 : iWidth >= 1300 ? 4 : iWidth >= 800 ? 2 : iWidth >= 600 ? 1 : 0;
};
