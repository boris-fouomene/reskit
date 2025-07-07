import { Div } from "@html/Div";
import { IHtmlDivProps } from "@html/types";
import { cn } from "@utils/cn";
import { classes } from "@variants/classes";

export function Backdrop(props: IHtmlDivProps) {
    return <Div
        testID="resk-backdrop"
        {...props}
        className={cn(classes.absoluteFill, "resk-backdrop flex-1 w-screen h-screen", props.className)}
    />
}