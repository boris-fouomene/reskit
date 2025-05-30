import { Button } from "./button";
import { ButtonBase } from "./base";

const ButtonExported: typeof Button & {
    Base: typeof ButtonBase
} = Button as any;

ButtonExported.Base = ButtonBase;

export { ButtonExported as Button };

export * from "./types";