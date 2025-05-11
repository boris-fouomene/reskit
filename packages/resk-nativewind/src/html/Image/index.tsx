import { IHtmlImageProps } from "../types";
import { normalizeHtmlProps } from "../utils";

export function Image(props: IHtmlImageProps) {
    return <img {...normalizeHtmlProps(props)} />;
}