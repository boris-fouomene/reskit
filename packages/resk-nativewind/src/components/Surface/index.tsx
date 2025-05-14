import { Div, IHtmlDivProps } from "@html";
import { isObj } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { variants } from "@variants/index";
import { IVariantPropsSurface } from "@variants/surface";

/**
 * A Div with a background color defined by the surface variants, suitable as a
 * background for cards, modals, and other UI elements.
 *
 * The background color can be changed by setting the `className` prop to one
 * @see {@link variants.surface} for more information about the surface variants.
 * @see {@link Div} for more information about the Div component.
 * @see {@link IHtmlDivProps} for more information about the Div props.
 */
export function Surface({ variant, className, ...props }: ISurfaceProps) {
    return <Div
        testID={"resk-surface"}
        {...props}
        className={cn(isObj(variant) && variants.surface(variant), className)}
    />
}

export interface ISurfaceProps extends IHtmlDivProps {
    variant?: IVariantPropsSurface;
}