import FontIcon from "./Font";
import Icon from "./Icon";
import Button from "./Button";
import { CountryFlag } from "./CountryFlag";
export * from "./types";
export * from "./Font/icons";

type IIcon = typeof Icon & {
    Button: typeof Button;
    Font: typeof FontIcon;
    CountryFlag: typeof CountryFlag;
};
const IconWithButton = Icon as IIcon;
IconWithButton.Button = Button;
IconWithButton.Font = FontIcon;
IconWithButton.CountryFlag = CountryFlag;

IconWithButton.Button.displayName = 'Icon.Buttton';
(IconWithButton as any).Font.displayName = "Icon.Font";

export { IconWithButton as Icon };
