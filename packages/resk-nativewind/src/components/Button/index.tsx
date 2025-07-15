import { isNonNullString } from "@resk/core/utils";
import { ButtonBase } from "./base";
import { InteractiveButton } from './button';
import { IButtonProps } from "./types";
import { pickTouchableProps } from "@utils/touchHandler";


export function Button<Context = unknown>({ formName, ref, ...props }: IButtonProps<Context>) {
    const isInteractive = isNonNullString(formName) || ref || !!pickTouchableProps(props as any)?.touchableProps;
    if (isInteractive) {
        return <InteractiveButton formName={formName} ref={ref} {...props} />
    }
    return <ButtonBase {...props} />
}

Button.Interactive = InteractiveButton;
Button.displayName = "Button";