import { ReactNode } from "react";
import isValidElement from "@utils/isValidElement";

/**
 * @interface ILeftOrRightProps
 * Type definition for props that can contain left and right elements.
 * 
 * This type allows for the specification of either a static ReactNode or a 
 * function that returns a ReactNode for both the `left` and `right` properties.
 * 
 * @template T - Optional type parameter for the function options.
 * 
 * ### Props:
 * - `left`: A ReactNode or a function that returns a ReactNode. This can be used to render 
 *   content on the left side of a component.
 * - `right`: A ReactNode or a function that returns a ReactNode. This can be used to render 
 *   content on the right side of a component.
 */
export type ILeftOrRightProps<T = any> = {
    left?: ReactNode | ((options?: T) => ReactNode);
    right?: ReactNode | ((options?: T) => ReactNode);
};

/**
 * A utility function to extract left and right properties from the given props?.
 * 
 * This function evaluates the `left` and `right` properties from the provided props?.
 * If the properties are functions, it calls them with the given options to obtain the 
 * resulting ReactNode. It also validates the resulting nodes to ensure they are valid 
 * React elements.
 * 
 * @param {ILeftOrRightProps<T>} props - The props containing the left and right elements.
 * @param {T} options - Optional parameters to pass to the functions for dynamic rendering.
 * @returns {{ left: ReactNode, right: ReactNode }} - An object containing validated left and right nodes.
 * 
 * ### Example Usage:
 * 
 * ```typescript
 * const MyComponent = (props: ILeftOrRightProps) => {
 *     const { left, right } = getLeftOrRightProps(props, { //options });
 *     return (
 *         <div>
 *             <div>{left}</div>
 *             <div>{right}</div>
 *         </div>
 *     );
 * };
 * ```
 */
export const getLeftOrRightProps = <T = any>(props: ILeftOrRightProps, options: T): { left: ReactNode; right: ReactNode } => {
    // Evaluate the left property, calling it if it's a function
    const left = typeof props?.left === "function" ? props?.left(options) : props?.left;
    // Evaluate the right property, calling it if it's a function
    const right = typeof props?.right === "function" ? props?.right(options) : props?.right;

    // Validate and return the left and right properties, ensuring they are valid React elements
    return {
        left: isValidElement(left) ? left : null,
        right: isValidElement(right) ? right : null,
    };
};

