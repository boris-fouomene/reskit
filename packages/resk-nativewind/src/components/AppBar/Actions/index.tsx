import { IAppBarActionsProps } from "../types";
import { AppBarServerActions } from "./Actions";


export function AppBarActions<Context = unknown>(props: IAppBarActionsProps<Context>) {
    return <AppBarServerActions {...props} />;
}

AppBarActions.displayName = "AppBar.Actions";