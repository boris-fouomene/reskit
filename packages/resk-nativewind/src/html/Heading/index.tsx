import { Text } from "@html/Text";
import { IHtmlHeadingProps } from "@html/types";
import heading from "@variants/heading";
import { cn } from "@utils/cn";
import { isNumber } from "@resk/core/utils";

/**
 * The `Heading` component is a wrapper around the `h1` - `h6` HTML elements.
 * It supports the standard `level` prop, which must be one of the following:
 * - A number between 1 and 6 (inclusive)
 * - A string in the format `"hX"` (where `X` is a number between 1 and 6 inclusive)
 *
 * This component also supports the standard `variant` and `className` props.
 *
 * @example
 * // Using the level prop
 * <Heading level={3}>Heading level 3</Heading>
 *
 * @example
 * // Using the level prop with a number
 * <Heading level={6}>Heading level 6</Heading>
 *
 * @example
 * // Using the level prop with a string
 * <Heading level="h5">Heading level 5</Heading>
 *
 * @example
 * // Using the variant and className props
 * <Heading variant="primary" className="text-lg">Heading with variant and custom class</Heading>
 */
export function Heading({ level, variant, className, ...props }: IHtmlHeadingProps & { level: IHHeadingLevel; }) {
    level = isNumber(level) && [1, 2, 3, 4, 5, 6].includes(level) ? level : 1;
    return <Text role={"heading"} className={cn(heading({ level: `h${level}` }), heading(variant), className)} accessibilityRole="header" {...props} asHtmlTag={`h${level}`} />
}

/**
 * A shortcut for `<Heading level={1}>`.
 * @example
 * <H1>Heading level 1</H1>
 */
export function H1(props: IHtmlHeadingProps) {
    return <Heading level={1} {...props} />
}
/**
 * A shortcut for `<Heading level={2}>`.
 * @example
 * <H2>Heading level 2</H2>
 */
export function H2(props: IHtmlHeadingProps) {
    return <Heading  {...props} level={2} />
}
/**
 * A shortcut for `<Heading level={3}>`.
 * @example
 * <H3>Heading level 3</H3>
 */
export function H3(props: IHtmlHeadingProps) {
    return <Heading {...props} level={3} />
}
/**
 * A shortcut for `<Heading level={4}>`.
 * @example
 * <H4>Heading level 4</H4>
 */
export function H4(props: IHtmlHeadingProps) {
    return <Heading  {...props} level={4} />
}
/**
 * A shortcut for `<Heading level={5}>`.
 * @example
 * <H5>Heading level 5</H5>
 */
export function H5(props: IHtmlHeadingProps) {
    return <Heading {...props} level={5} />
}
/**
 * A shortcut for `<Heading level={6}>`.
 * @example
 * <H6>Heading level 6</H6>
 */
export function H6(props: IHtmlHeadingProps) {
    return <Heading {...props} level={6} />
}
type IHHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;