import { IHtmlImageProps } from "../types";
import { normalizeHtmlProps } from "../utils";

export function Image({ defaultSource, ...props }: IHtmlImageProps) {
    return <img {...normalizeHtmlProps(props)} onClick={(event) => { }} />;
}
Image.displayName = "Html.Image";