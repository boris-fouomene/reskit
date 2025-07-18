import { Div } from "@html/Div";
import { IHtmlImageProps } from "../types";
import { cn } from "@utils/cn"
export function Image({ defaultSource, className, ...props }: IHtmlImageProps) {
    return <Div role="img" {...props} className={cn("resk-image", className)} asHtmlTag="img" />;
}
Image.displayName = "Html.Image";