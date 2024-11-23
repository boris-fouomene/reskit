import Button from "./Button";
import FontIcon from "./Font";
import Icon from "./Icon";
export * from "./Font";
export * from "./Icon";
export { default as FontIcon } from "./Font";
export * from "./types";
export * from "./utils";

type IIcon = typeof Icon & {
    Button: typeof Button
    Font: typeof FontIcon
};
const IconWithButton = Icon as unknown as IIcon;
IconWithButton.Button = Button;
IconWithButton.displayName = 'Icon.Buttton';
IconWithButton.Font = FontIcon;
IconWithButton.Font.displayName = 'Icon.Font';

export { IconWithButton as Icon };