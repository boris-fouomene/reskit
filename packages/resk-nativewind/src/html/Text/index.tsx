import { withAsChild } from "@components/Slot";
import { IHtmlTextProps } from "@html/types";
import { normalizeHtmlProps } from "@html/utils";

export const Text = withAsChild(function Text(props: IHtmlTextProps) {
    return <div {...normalizeHtmlProps(props)} />;
}, "Html.Text");