import { ReactNode } from "react";
import isValidElement from "@utils/isValidElement";
import { isRTL } from "@utils/i18nManager";

/**
 * @interface ILabelOrLeftOrRightProps
 * Type definition for props that can contain label, left and right elements.
 * 
 * This type allows for the specification of either a static ReactNode or a 
 * function that returns a ReactNode for both the label, `left` and `right` properties.
 * 
 * @template T - Optional type parameter for the function options.
 * 
 * ### Props:
 *  `label` : A ReactNode or a function that returns a ReactNode. This can be used to render the label for a component.
 * - `left`: A ReactNode or a function that returns a ReactNode. This can be used to render 
 *   content on the left side of a component.
 * - `right`: A ReactNode or a function that returns a ReactNode. This can be used to render 
 *   content on the right side of a component.
 */
export type ILabelOrLeftOrRightProps<T = any> = {
    /**
     * A ReactNode or a function that returns a ReactNode. This can be used to render the label for a component.
     * It represent the label to be displayed alongside the text input.
     * This could be a React element, such as a `Text` component, or any other custom label.
     * @example
     * ```ts
     * label: <Text>Username</Text>
     * ```
     */
    label?: ReactNode | ((options: T) => ReactNode);
    /**A ReactNode or a function that returns a ReactNode. This can be used to render content on the left side of a component.
     * Typically used for icons or buttons.
     * @example
     * ```ts
     * left: <Icon name="search" />
     * ```
     */
    left?: ReactNode | ((options: T) => ReactNode);
    /**
     * A ReactNode or a function that returns a ReactNode. 
     * This can be used to render  content on the right side of a component.
     * Often used for actions such as clearing text or submitting.
     * @example
     * ```ts
     * right: <Icon name="clear" />
     * ```
     */
    right?: ReactNode | ((options: T) => ReactNode);
};

/**
 * A utility function to extract label, left and right properties from the given props?.
 * 
 * This function evaluates the label, `left` and `right` properties from the provided props?.
 * If the properties are functions, it calls them with the given options to obtain the 
 * resulting ReactNode. It also validates the resulting nodes to ensure they are valid 
 * React elements.
 * 
 * @param {ILabelOrLeftOrRightProps<T>} props - The props containing the label, left and right elements.
 * @param {T} options - Optional parameters to pass to the functions for dynamic rendering.
 * @returns {{ label : : ReactNode, left: ReactNode, right: ReactNode }} - An object containing validated label, left and right nodes.
 * 
 * @remarkss : Left and right element are inverted when the application layout direction is Right-To-Left (RTL : I18nManager.getConstants().isRTL).
 * 
 * ### Example Usage:
 * 
 * ```typescript
 * const MyComponent = (props: ILabelOrLeftOrRightProps) => {
 *     const { label, left, right } = getLabelOrLeftOrRightProps(props, { //options });
 *     return (
 *         <div>
 *             <div>{left}</div>
 *             <div>{label}></div>
 *             <div>{right}</div>
 *         </div>
 *     );
 * };
 * ```
 */
export const getLabelOrLeftOrRightProps = <T = any>(props: ILabelOrLeftOrRightProps, options: T): { label: ReactNode, left: ReactNode; right: ReactNode } => {
    // Evaluate the left property, calling it if it's a function
    const left = typeof props?.left === "function" ? props?.left(options) : props?.left;
    // Evaluate the right property, calling it if it's a function
    const right = typeof props?.right === "function" ? props?.right(options) : props?.right;
    const label = typeof props?.label === "function" ? props?.label(options) : props?.label;
    const leftElement = isValidElement(left) ? left : null,
        rightElement = isValidElement(right) ? right : null;
    // Validate and return the left and right properties, ensuring they are valid React elements
    return {
        label: isValidElement(label, true) ? label : null,
        left: isRTL ? right : left,
        right: isRTL ? left : right,
    };
};

