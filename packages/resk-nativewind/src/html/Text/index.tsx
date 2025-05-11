import { IHtmlTextProps } from "@html/types";
import { normalizeHtmlProps } from "@html/utils";

export function Text(props: IHtmlTextProps) {
    return <div {...normalizeHtmlProps(props)} />;
}