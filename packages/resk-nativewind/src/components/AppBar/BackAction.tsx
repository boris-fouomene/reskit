import FontIcon from "@components/Icon/Font";
import IconButton from "@components/Icon/Button";
import { IBackActionProps } from "./types";

export function BackAction({ accessibilityLabel = 'Appbar.BackAction', ...rest }: IBackActionProps) {
  return <IconButton
    accessibilityLabel={accessibilityLabel}
    iconName={FontIcon.BACK as any}
    size={30}
    {...rest}
  />;
};

BackAction.displayName = 'AppBar.BackAction';

