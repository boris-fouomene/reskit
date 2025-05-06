import { createContext, useContext } from "react";
import { ITabProps } from "./types";

type ITabContextProps = ITabProps & {
    activeIndex: number;
    defaultTextColor?: string,
    defaultActiveTabItemTextColor?: string;
    setActiveIndex: (options: { index: number, prevIndex?: number }) => any,
};
const TabContext = createContext<ITabContextProps | undefined>(undefined);

export const userTabs = (): ITabContextProps => {
    const context = useContext(TabContext);
    return Object.assign({}, context, { activeIndex: context?.activeIndex || 0 });
}

export default TabContext;