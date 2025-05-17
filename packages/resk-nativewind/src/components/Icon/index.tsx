import FontIcon from "./Font";
import Icon from "./Icon";
import Button from "./Button";
export * from "./Font";
export * from "./Icon";
export * from "./types";

type IIcon = typeof Icon & {
    Button: typeof Button;
    Font: typeof FontIcon;
    //CountryFlag: typeof CountryFlag;
};
const IconWithButton = Icon as IIcon;
IconWithButton.Button = Button;
//IconWithButton.displayName = 'Icon.Buttton';
IconWithButton.Font = FontIcon;
//IconWithButton.CountryFlag = CountryFlag;

export { IconWithButton as Icon };
