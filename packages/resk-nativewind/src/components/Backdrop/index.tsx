import { Div } from "@html/Div";
import { IHtmlDivProps } from "@html/types";
import { cn } from "@utils/cn";
import { classes } from "@variants/classes";

export function Backdrop(props: IHtmlDivProps) {
    return <Div
        testID="resk-backdrop"
        {...props}
        className={cn(classes.absoluteFill, "z-0 resk-backdrop flex-1 w-full h-full", props.className)}
    />
}