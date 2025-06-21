import { Div } from "@html/Div";
import { IHtmlDivProps } from "@html/types";
import { cn } from "@utils/cn";
/**
 * A horizontal stack layout component.
 *
 * This component is a thin wrapper around the Div component, with some default styles set
 * to create a horizontal stack layout. It can be used as a drop-in replacement for the Div
 * component when you want to create a horizontal stack layout.
 *
 * @example
 * <HStack>
 *     <Div className="bg-red-500" style={{ width: 50, height: 50 }} />
 *     <Div className="bg-green-500" style={{ width: 50, height: 50 }} />
 *     <Div className="bg-blue-500" style={{ width: 50, height: 50 }} />
 * </HStack>
 *
 * @param {IHtmlDivProps} props - The properties for the HStack component.
 * @returns {JSX.Element} A JSX element representing the HStack component.
 */
export function HStack(props: IHtmlDivProps) {
    return <Div testID="hstack" {...props} className={cn("flex flex-wrap flex-row items-center justify-start", props.className)} />
};

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * VStack is a component that arranges its children in a vertical stack.
 * This component leverages the flexbox layout model to align children one below the other.
 * 
 * It inherits all properties from the HtmlDiv component, allowing for extensive customization.
 * 
 * @param {IHtmlDivProps} props - The properties for the VStack, including any valid HtmlDiv properties.
 *   - **style**: Optional additional styles to apply to the component.
 *   - **...props**: Any additional props that should be passed to the underlying HtmlDiv.
 * 
 * @returns {JSX.Element} A JSX element representing the VStack, styled as a vertical stack.
 * 
 *
 * @example
 * <VStack>
 *     <Div className="bg-red-500" style={{ width: 50, height: 50 }} />
 *     <Div className="bg-green-500" style={{ width: 50, height: 50 }} />
 *     <Div className="bg-blue-500" style={{ width: 50, height: 50 }} />
 * </VStack>
 */
export function VStack(props: IHtmlDivProps) {
    return <Div testID="resk-vstack" {...props} className={cn("flex flex-wrap flex-col items-start justify-start", props.className)} />
};