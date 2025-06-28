import { Div } from "@html/Div";
import { IHtmlDivProps } from "@html/types";
import { cn } from "@utils/cn";
import "./styles.css";
export function ProgressBarIndeterminateFill({ className, ...props }: IHtmlDivProps) {
    return <Div
        {...props}
        className={cn("progress-bar-indeterminate w-full h-full", className)}
    />
}