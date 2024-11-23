import React from "react";
import { IAppBarContext } from "./types";

export const AppBarContext = React.createContext<IAppBarContext<any>>({} as IAppBarContext<any>);

export function useAppBar<IAppBarActionContext = any>(): IAppBarContext<IAppBarActionContext> {
    return React.useContext(AppBarContext) as IAppBarContext<IAppBarActionContext>;
};