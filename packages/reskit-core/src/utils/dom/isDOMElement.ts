/**
 * Checks if the given object is a DOM element.
 *
 * This function performs a series of checks to determine if the object is a DOM element.
 * It first checks if the `window` and `document` objects are available, and if the `HTMLElement` constructor is defined.
 * Then, it checks if the object is an instance of `HTMLElement` or if it has the characteristics of a DOM element (e.g., `nodeType` equals 1 and `nodeName` is defined).
 *
 * @param o The object to check.
 * @returns `true` if the object is a DOM element, `false` otherwise.
 */
export default function isDOMElement(o: any): boolean {
  if (typeof window !== "object" || !window || typeof document === 'undefined' || typeof HTMLElement === "undefined") return false;
  if (o === document) return true;
  //if(o === window) return true;
  if ("HTMLElement" in window) return (!!o && o instanceof HTMLElement);
  return (!!o && typeof o === "object" && o.nodeType === 1 && !!o.nodeName);
}
