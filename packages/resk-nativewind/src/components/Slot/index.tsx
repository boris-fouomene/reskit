import Logger from "@resk/core/logger";
import { defaultStr, isObj } from "@resk/core/utils";
import { isValidElement, ComponentType, ReactNode, FC, cloneElement, JSX } from "react";
import { StyleSheet } from "nativewind";
import { cn } from "@utils/cn";
// Type to extract the props of a component
type PropsOf<T> = T extends ComponentType<infer P> ? P : never;

export interface AsChildProps {
    /**
     * When true, the component will be replaced by its children while preserving its props and behavior
     */
    asChild?: boolean;
}




/**
 * A Higher-Order Component (HOC) that adds the ability to render the wrapped component's children
 * instead of the component itself, while preserving its props and behavior.
 *
 * This HOC is useful when you want to conditionally render a component or dynamically change its
 * children based on props or state.
 *
 * @param {IReactComponent<IProps, IState>} Component - The component to wrap.
 * @param {string} [displayName] - An optional custom display name for the wrapped component.
 * @returns {React.FC<IProps & AsChildProps>} - A functional component that renders the wrapped component
 * with the added `asChild` prop.
 * @example
 * const MyComponent = () => <div>My component</div>;
 * const MyComponentWithAsChild = withAsChild(MyComponent);
 * <MyComponentWithAsChild asChild>
 *   <p>This is the children of the component</p>
 * </MyComponentWithAsChild>;
 */
export function withAsChild<T extends ComponentType<any>>(Component: T, displayName?: string): (props: PropsOf<T> & AsChildProps) => JSX.Element {
    function WithAsChildComponent(props: PropsOf<T> & AsChildProps) {
        const { asChild, ...componentProps } = props;
        if (asChild && isValidElement(componentProps.children)) {
            return <Slot {...componentProps as any}>{componentProps.children}</Slot>;
        }
        const F = Component as any;
        return <F {...componentProps as any} />;
    }
    WithAsChildComponent.displayName = defaultStr(displayName, `WithAsChild(${Component.displayName || Component.name || 'Component'})`);
    return WithAsChildComponent;
}


export interface SlotProps {
    children?: ReactNode;
}

/**
 * A functional component that serves as a slot for rendering child elements with merged props.
 *
 * This component takes props and children, validates the child element, and merges its 
 * properties with the slot's properties. It provides flexibility in overriding or 
 * extending the child's props, supporting functions, styles, and class names.
 *
 * Functions in both slot and child props are combined so both can be executed.
 * Styles and class names are merged using appropriate utilities.
 *
 * @template T - Extends SlotProps, representing the type of props the component can accept.
 * @param {T} props - The properties and children for the Slot component. 
 * Includes the child element and any additional props to merge.
 * @returns {JSX.Element|null} - Returns the cloned child element with merged props, 
 */
export function Slot<T extends SlotProps>(props: T) {
    const { children, ...slotProps } = props;
    if (!isValidElement(children)) {
        Logger.warn(`Slot, Invalid asChild element`)
        return null;
    }
    const compProps = { ...slotProps };
    const childrenProps = isObj((children as any)?.props) ? (children as any).props : {}
    for (const propName in childrenProps) {
        const slotPropValue = (slotProps as any)[propName];
        const childPropValue = childrenProps[propName];
        const isChildFunction = typeof childPropValue == "function";
        const isSlotFunction = typeof slotPropValue == "function";
        const isHandler = (isChildFunction || isSlotFunction);///^on[A-Z]/.test(propName);
        if (isHandler) {
            (compProps as any)[propName] = (...args: unknown[]) => {
                if (isChildFunction) {
                    childPropValue(...args);
                }
                if (isSlotFunction) {
                    slotPropValue(...args);
                }
            };
        } else if (propName === 'style') {
            (compProps as any)[propName] = (childPropValue || slotPropValue) ? StyleSheet.flatten([slotPropValue, childPropValue]) : undefined;
        } else if (propName === 'className') {
            (compProps as any)[propName] = cn(slotPropValue, childPropValue);
        } else {
            (compProps as any)[propName] = childPropValue;
        }
    }
    return cloneElement(children, compProps) as JSX.Element;
}

Slot.displayName = 'Slot';