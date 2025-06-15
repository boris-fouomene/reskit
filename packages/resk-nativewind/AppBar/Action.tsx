import { StyleSheet } from 'react-native'
import { Button } from "@components/Button";
import { IAppBarAction } from './types';

export function AppBarAction<IAppBarActionContext = unknown>({ colorScheme, containerProps, ...props }: IAppBarAction<IAppBarActionContext>) {
  return <Button
    borderRadius={props.level ? 0 : undefined}
    containerProps={{
      ...containerProps,
    }}
    {...props}
  />
};
AppBarAction.displayName = 'AppBar.Action';

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 7,
    paddingVertical: 0,
    width: undefined,
  },
});
