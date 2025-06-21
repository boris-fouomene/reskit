import { IAppBarActionProps } from './types';
import { Nav } from "@components/Nav";

export function AppBarAction<Context = unknown>(props: IAppBarActionProps<Context>) {
  return <Nav.Item
    variant={{ paddingX: "2" }}
    {...props}
  />
};
AppBarAction.displayName = 'AppBar.Action';