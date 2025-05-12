import { Div, IHtmlDivProps } from "@html";
import { cn } from "@utils/cn";
import { variants } from "@variants/index";

/**
 * A div with a background color defined by the surface variants, suitable as a
 * background for cards, modals, and other UI elements.
 *
 * The background color can be changed by setting the `className` prop to one
 *
 * @example
 */
export function Surface(props: IHtmlDivProps) {
    return <Div
        testID={"resk-nativewind-surface"}
        {...props} className={cn(variants.surface(), props.className)}
    />
}