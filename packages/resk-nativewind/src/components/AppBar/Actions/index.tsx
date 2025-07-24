import { IAppBarActionsProps } from "../types";
import { AppBarServerActions } from "./ServerActions";

export function AppBarActions<Context = unknown>(props: IAppBarActionsProps<Context>) {
    return <AppBarServerActions {...props} />;
}

AppBarActions.displayName = "AppBar.Actions";
