import IconButton from "@components/Icon/Button";
import { IBackActionProps } from "./types";
import { FONT_ICONS } from "@components/Icon/Font/icons";

export function BackAction({ accessibilityLabel = 'Appbar.BackAction', ...rest }: IBackActionProps) {
  return <IconButton
    accessibilityLabel={accessibilityLabel}
    iconName={FONT_ICONS.BACK as any}
    size={30}
    {...rest}
  />;
};

BackAction.displayName = 'AppBar.BackAction';

