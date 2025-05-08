import { defaultStr, isDOMElement } from "@resk/core/utils";
import { ReactElement } from "react";
import isValidElement from "./isValidElement";
/**
 * Traverses all `props.children` to obtain their combined textual content.
 *
 * This function does not add spaces for readability: 
 * `<p>Hello <em>world</em>!</p>` produces `Hello world!` as expected, 
 * but `<p>Hello</p><p>world</p>` returns `Helloworld`, similar to 
 * the behavior of https://mdn.io/Node/textContent.
 *
 * @param {ReactElement} elem - The React element from which to extract textual content. Can be a React element, string, number, or boolean.
 * @param {string} [childContentSeparator=""] - A string used to separate the child values. Defaults to an empty string.
 * 
 * @returns {string} A combined string containing the textual content of the provided React element's children.
 *
 * @example
 * const element = (
 *   <div>
 *     <p>Hello <em>world</em>!</p>
 *     <p>How are you?</p>
 *   </div>
 * );
 * 
 * const textContent = getTextContent(element, ' '); // Returns "Hello world! How are you?"
 */
export default function getTextContent(elem: any, childContentSeparator: string = ""): string {
    if (!elem) {
        return '';
    }
    if (typeof elem === 'string' || typeof elem === 'number' || typeof elem === 'boolean') {
        return String(elem);
    }
    if (isDOMElement(elem)) {
        return getTextContent(defaultStr((elem as HTMLElement).innerText, (elem as HTMLElement).textContent));
    }
    if (!(isValidElement(elem, true))) {
        return (typeof elem?.toString == "function" ? elem?.toString() : '');
    }
    elem = elem as ReactElement;
    const children = elem.props && elem.props.children;
    childContentSeparator = defaultStr(childContentSeparator, " ");
    if (children instanceof Array) {
        return children.map((e: ReactElement, index: number) => getTextContent(e, childContentSeparator)).join(childContentSeparator);
    }
    return (getTextContent(children, childContentSeparator));
}