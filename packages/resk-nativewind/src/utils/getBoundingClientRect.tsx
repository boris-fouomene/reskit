
export function getBoundingClientRect(node?: HTMLElement): void | DOMRect {
    if (typeof HTMLElement == "undefined" || typeof document === "undefined" || typeof window === "undefined") return;
    if (node != null && node instanceof HTMLElement) {
        const isElement = node.nodeType === 1; /* Node.ELEMENT_NODE */
        if (isElement && typeof node.getBoundingClientRect === 'function') {
            return node.getBoundingClientRect();
        }
    }
};