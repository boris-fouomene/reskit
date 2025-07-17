import { Button as ButtonBase } from "./base";
import { InteractiveButton as ButtonInteractive } from './button';
import { IButtonInteractiveProps, IButtonProps } from "./types";


export function Button<Context = unknown>({ ref, ...props }: IButtonProps<Context>) {
    return <ButtonBase {...props} />
}

Button.Interactive = function InteractiveButton<Context = unknown>(props: IButtonInteractiveProps<Context>) {
    return <>
        <ButtonInteractive {...props} />
    </>
}

Button.displayName = "Button";