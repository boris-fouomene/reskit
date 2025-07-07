import { Div } from "@html/Div";
import { IHtmlDivProps } from "@html/types";
import { cn } from "@utils/cn";
import { classes } from "@variants/classes";

export function Backdrop(props: IHtmlDivProps) {
    return <Div
        testID="resk-backdrop"
        {...props}
        className={cn("resk-backdrop absolute flex-1 w-screen h-screen left-0 right-0 top-0 bottom-0", props.className)}
    />
}