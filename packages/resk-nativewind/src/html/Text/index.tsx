import { withAsChild } from "@components/Slot";
import { Div } from "../Div";
import { IHtmlTextProps } from "@html/types";

export const Text = withAsChild(function Text(props: IHtmlTextProps) {
    return <Div {...props} />;
}, "Html.Text");