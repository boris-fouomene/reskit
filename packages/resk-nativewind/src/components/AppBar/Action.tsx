import { Button } from "@components/Button";
import { IAppBarAction } from './types';

export function AppBarAction<Context = unknown>(props: IAppBarAction<Context>) {
  return <Button
    variant={{ paddingX: 2 }}
    {...props}
  />
};
AppBarAction.displayName = 'AppBar.Action';