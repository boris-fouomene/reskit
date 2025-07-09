import { IAppBarActionProps } from './types';
import { Nav } from "@components/Nav";

export function AppBarAction<Context = unknown>(props: IAppBarActionProps<Context>) {
  return <Nav.Item
    {...props}
  />
};
AppBarAction.displayName = 'AppBar.Action';