import Button from "./Button";
import FontIcon from "./Font";
import Icon from "./Icon";
import CountryFlag from "./CountryFlag";

export * from "./CountryFlag";
export * from "./Font";
export * from "./Icon";
export { default as FontIcon } from "./Font";
export * from "./types";
export * from "./utils";

type IIcon = typeof Icon & {
    Button: typeof Button;
    Font: typeof FontIcon;
    CountryFlag: typeof CountryFlag;
};
const IconWithButton = Icon as unknown as IIcon;
IconWithButton.Button = Button;
IconWithButton.displayName = 'Icon.Buttton';
IconWithButton.Font = FontIcon;
IconWithButton.CountryFlag = CountryFlag;

export { IconWithButton as Icon };