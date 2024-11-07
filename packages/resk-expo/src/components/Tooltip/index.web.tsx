import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import React, { useMemo } from "react";
import { getTextContent, isValidElement, setRef, useMergeRefs } from '@utils';
import { getMaxZindex, isDOMElement } from "@resk/core";
import { TIPPY_THEME } from '@theme/updateNative/utils';
import { uniqid, defaultStr } from "@resk/core";
import { Pressable } from "react-native";
import { ITooltipProps } from './types';

export * from "./types";

/**
 * Tooltip component provides a hover or press-triggered tooltip for child elements, using Tippy.js for tooltips.
 * It supports dynamic content from the `tooltip` or `title` properties and can be customized with additional props.
 *
 * @example
 * ```tsx
 * <Tooltip title="Tooltip Title" tooltip="Detailed tooltip content">
 *   <Button>Hover or press me</Button>
 * </Tooltip>
 * ```
 *
 * @param {ITooltipProps} props - Props for configuring the Tooltip component.
 * @param {React.ReactNode} props.children - The element to which the tooltip is attached.
 * @param {string} [props.title] - A brief title shown in the tooltip.
 * @param {string} [props.tooltip] - The main content displayed in the tooltip.
 * @param {boolean} [props.disabled] - If true, disables the tooltip functionality.
 * @param {React.ElementType} [props.as] - Optionally defines a different component to use instead of `Pressable`.
 * @param {string} [props.testID] - A unique identifier for testing purposes.
 * @param {string} [props.id] - A unique ID for the tooltip instance. Auto-generated if not provided.
 * @param {React.Ref} ref - A forwarded ref for accessing the underlying element or tooltip instance.
 * @returns {React.ReactElement | null} - The rendered Tooltip component.
 */
const Tooltip = React.forwardRef(({
    children, title, tooltip, disabled, as, testID, id, ...rest
}: ITooltipProps, ref) => {
    // Set a default testID if none is provided
    testID = defaultStr(testID, "RN_TooltipTooltip");

    // Reference for instance ID or generate a unique one
    const instanceIdRef = React.useRef(id || uniqid("tippy-instance-id"));

    // Reference for the child element (e.g., button)
    const buttonRef = React.useRef(null);

    // Combine external ref with internal button reference
    const innerRef = useMergeRefs(ref, buttonRef);

    // Determine the DOM selector based on button reference or instance ID
    const selector = isDOMElement(buttonRef.current) ? buttonRef.current : "#" + instanceIdRef.current;

    React.useEffect(() => {
        // Do nothing if disabled
        if (disabled) return;

        // Prepare tooltip content, allowing for HTML formatting
        const content = String(getTextContent(tooltip) || getTextContent(title)).replaceAll("\n", "<br/>");
        if (!content) return;

        // Initialize Tippy.js with the selector and content
        const tpI = tippy(selector as any, {
            content,
            allowHTML: true,
            theme: TIPPY_THEME,
            onShow: (instance) => {
                if (instance && typeof instance.setProps === "function") {
                    instance.setProps({ zIndex: getMaxZindex() });
                }
            }
        });

        // Store the Tippy.js instance (if there are multiple, use the first)
        const instance = Array.isArray(tpI) ? tpI[0] : tpI;

        // Clean up the instance on unmount
        return () => {
            setRef(ref, null);
            if (instance && instance.destroy) {
                instance.destroy();
            }
        }
    }, [tooltip, title, disabled]);

    // Return null if the children element is not valid
    if (!isValidElement(children)) {
        console.warn("is not valid children ", children);
        return null;
    }

    // Determine the component to render (Pressable by default or a custom one)
    const Component = useMemo(() => {
        return as || Pressable;
    }, [as]);
    // Render the Tooltip component, passing down props and attaching the inner reference
    return (
        <Component {...rest} disabled={disabled} id={instanceIdRef.current} testID={testID} ref={innerRef}>
            {children}
        </Component>
    );
});

Tooltip.displayName = "Tooltip";
export { Tooltip }