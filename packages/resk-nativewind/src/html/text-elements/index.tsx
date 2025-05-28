import { cn } from "@utils/cn";
import { Text } from "../Text";
import { IHtmlBlockQuoteProps, IHtmlDivProps, IHtmlQuoteProps, IHtmlTextProps } from "../types";
import { Div } from "@html/Div";

/**
 * A convenience wrapper around the Text component that adds default margin top and bottom
 * values (i.e. my-1) to the className. This is useful for creating the typical margin between
 * paragraphs of text.
 *
 * @example
 * <P>Hello, world!</P>
 * <P>This is the second paragraph.</P>
 */
export function P({ className, ...props }: IHtmlTextProps) {
    return <Text asHtmlTag="p" {...props} className={cn("native:my-1", className)} />;
}

export function B({ className, ...props }: IHtmlTextProps) {
    return <Text asHtmlTag="b" {...props} className={cn("text-bold", className)} />;
}

export function S({ className, ...props }: IHtmlTextProps) {
    return <Text asHtmlTag="s" {...props} className={cn("line-through decoration-solid", className)} />;
}

export function I({ className, ...props }: IHtmlTextProps) {
    return <Text asHtmlTag="i" {...props} className={cn("italic", className)} />;
}

export function Q({ children, cite, className, ...props }: IHtmlQuoteProps) {
    return (<I asHtmlTag="q" {...props} />);
}

export function BlockQuote({ className, cite, ...props }: IHtmlBlockQuoteProps) {
    return <Text {...props} asHtmlTag="blockquote" className={["native:my-1", className]} />;
}

export function BR({ className, ...props }: Omit<IHtmlDivProps, "children" | "asHtmlTag">) {
    return <Div asHtmlTag="br" {...props} className={cn("native:w-0 native:h-[7px]", className)} />;
}
P.displayName = "Html.P";
B.displayName = "Html.B";
S.displayName = "Html.S";
I.displayName = "Html.I";
Q.displayName = "Html.Q";
BlockQuote.displayName = "Html.BlockQuote";
BR.displayName = "Html.BR";