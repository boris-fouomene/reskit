import FontIcon from "./Font";
export * from "./Font";

type IIcon = /*typeof Icon &*/ {
    //Button: typeof Button;
    Font: typeof FontIcon;
    //CountryFlag: typeof CountryFlag;
};
const IconWithButton = {} as unknown as IIcon;
//IconWithButton.Button = Button;
//IconWithButton.displayName = 'Icon.Buttton';
IconWithButton.Font = FontIcon;
//IconWithButton.CountryFlag = CountryFlag;

export { IconWithButton as Icon };
