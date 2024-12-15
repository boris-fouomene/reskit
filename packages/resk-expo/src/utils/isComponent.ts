import * as ReactIs from "react-is";

/**
 * Checks if the given component is a class component.
 *
 * A class component is identified by:
 * - Being a function
 * - Having a prototype
 * - Having either `isReactComponent` property on its prototype or a `render` method on its prototype
 *
 * @param component - The component to check.
 * @returns `true` if the component is a class component, otherwise `false`.
 */
export const isReactClassComponent = function isReactClassComponent(component: any) {
    return typeof component === 'function' && component.prototype &&
        (component.prototype.isReactComponent || typeof component.prototype.render === "function") ? true : false;
}

/**
 * Checks if the given component is a react function component.
 *
 * @param component - The component to check.
 * @returns `true` if the component is a function component, `false` otherwise.
 */
export const isReactFunctionComponent = function isReactFunctionComponent(component: any) {
    if (typeof component !== 'function' || !component) return false;
    const str = String(component);
    return typeof component === 'function' && (
        str.includes('return React.createElement')
        || str.includes('children: (0, _jsxRuntime.jsxs)')
        || component.toString().includes('Component(props)')
    )
}


/**
 * Checks if the provided component is a valid React component.
 *
 * This function determines if the given component is a valid React component by checking if it is a valid element type,
 * a class component, a function component, or an element component.
 *
 * @param component - The component to check.
 * @returns `true` if the component is a valid React component, otherwise `false`.
 */
export const isReactComponent = function isReactComponent(component: any) {
    if (component && ReactIs.isValidElementType(component)) return true;
    return isReactClassComponent(component) || isReactFunctionComponent(component) || isReactElementComponent(component);
}

/**
 * Checks if the given component is an element component.
 *
 * An element component is considered to be an object that has a `$$typeof` property
 * and a `render` method.
 *
 * @param component - The component to check.
 * @returns `true` if the component is an element component, otherwise `false`.
 */
export const isReactElementComponent = (component: any) => {
    return typeof component == "object" && component && "$$typeof" in component && typeof component.render == "function";
}