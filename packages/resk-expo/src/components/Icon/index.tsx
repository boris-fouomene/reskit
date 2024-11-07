import Button from "./Button";
import Icon from "./Icon";
export * from "./Font";
export * from "./Icon";
export { default as FontIcon } from "./Font";
export * from "./types";
export * from "./utils";

type IIcon = typeof Icon & {
    Button: typeof Button
};
const IconWithButton = Icon as unknown as IIcon;
IconWithButton.Button = Button;
IconWithButton.displayName = 'Icon.Buttton';
export { IconWithButton as Icon };
export { Button as IconButton }

export * from "./Button";