import { IAppBarActionsProps } from "../types";
import { AppBarClientActions } from "./ClientActions";

export function AppBarActions<Context = unknown>(props: IAppBarActionsProps<Context>) {
    return <>
        <AppBarClientActions {...props} />
    </>
}


