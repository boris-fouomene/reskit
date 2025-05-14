import { normalizeHtmlProps } from "@html/utils";
import { IHtmlDivProps } from "../types";
import { withAsChild } from "@components/Slot";
import { defaultStr } from "@resk/core/utils";

/**
 * A wrapper component for the HTML `<div>` element.
 *
 * This component accepts the standard HTML props for the `<div>` element, as well
 * as any additional props supported by the underlying React Native component.
 *
 * @example
 * <Div style={{ backgroundColor: 'red' }}>Hello, world!</Div>
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div}
 * @see {@link https://reactnative.dev/docs/view#props}
 */
export const Div = withAsChild(function Div({ asHtmlTag, ...props }: IHtmlDivProps) {
    const Tag = defaultStr(asHtmlTag, "div");
    return <Tag {...normalizeHtmlProps(props)} />;
}, "Html.Div");