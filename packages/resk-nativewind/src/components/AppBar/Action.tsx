import { Button } from "@components/Button";
import { IAppBarActionProps } from './types';

export function AppBarAction<Context = unknown>(props: IAppBarActionProps<Context>) {
  return <Button
    variant={{ paddingX: "2"}}
    {...props}
  />
};
AppBarAction.displayName = 'AppBar.Action';