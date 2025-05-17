"use client";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useEffect, useRef } from "react";
import { getTextContent, isValidElement, useMergeRefs } from '@utils';
import { getMaxZindex, isDOMElement, uniqid, defaultStr } from "@resk/core/utils";
import Platform from "@resk/core/platform";
import { Pressable } from "react-native";
import { ITooltipProps } from './types';
import { withAsChild } from '@components/Slot';

const TIPPY_THEME = "customtippy-themename";

const typyStyleId = "typy-csss-style-id";

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
 * @param {string} [props.testID] - A unique identifier for testing purposes.
 * @param {string} [props.id] - A unique ID for the tooltip instance. Auto-generated if not provided.
 * @returns {React.ReactElement | null} - The rendered Tooltip component.
 */
export const Tooltip = withAsChild(function Tooltip({ children, title, tooltip, disabled, testID, ref, id, ...rest }: ITooltipProps) {
    testID = defaultStr(testID, "resk-tooltip");
    testID = defaultStr(testID, "resk-tooltip");
    const instanceId = defaultStr(id, uniqid("tippy-instance-id"));
    const instanceIdRef = useRef(instanceId);
    const buttonRef = useRef(null);
    const innerRef = useMergeRefs(ref, buttonRef);
    const selector = isDOMElement(buttonRef.current) ? buttonRef.current : "#" + instanceIdRef.current;
    useEffect(() => {
        initCss();
        if (disabled || !Platform.isClientSide()) return;
        const content = String(getTextContent(tooltip) || getTextContent(title)).replaceAll("\n", "<br/>");
        if (!content) return;
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
        const instance = Array.isArray(tpI) ? tpI[0] : tpI;
        return () => {
            (buttonRef as any).current = null;
            if (instance && typeof instance?.destroy === "function") {
                instance.destroy();
            }
        }
    }, [tooltip, title, disabled, selector]);
    if (!isValidElement(children)) {
        return null;
    }
    return <Pressable {...rest} disabled={disabled} id={instanceIdRef.current} testID={testID} ref={innerRef}>
        {children}
    </Pressable>;
}, "Tooltip");

const initCss = function () {
    if (!Platform.isWeb() || typeof document == "undefined") return;
    let elem = document.querySelector(`#${typyStyleId}`);
    if (elem) return;
    elem = document.createElement("style");
    elem.id = typyStyleId;
    document.body.appendChild(elem);
    elem.textContent = `
        .tippy-box[data-theme~='${TIPPY_THEME}'] {
            background-color: var(--color-primary);
            color: var(--color-primary-foreground);
            font-weight: 400;
            text-shadow: none;
            box-shadow: none;
        }

        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='top']>.tippy-arrow::before {
            border-top-color: var(--color-primary);
        }

        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='bottom']>.tippy-arrow::before {
            border-bottom-color: var(--color-primary);
        }

        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='left']>.tippy-arrow::before {
            border-left-color: var(--color-primary);
        }

        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='right']>.tippy-arrow::before {
            border-right-color: var(--color-primary);
        }

        /* dark colors for theme*/
        .dark .tippy-box[data-theme~='${TIPPY_THEME}'] {
            background-color: var(--color-dark-primary);
            color: var(--color-dark-primary-foreground);
            font-weight: 400;
            text-shadow: none;
            box-shadow: none;
        }

        .dark .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='top']>.tippy-arrow::before {
            border-top-color: var(--color-dark-primary);
        }

        .dark .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='bottom']>.tippy-arrow::before {
            border-bottom-color: var(--color-dark-primary);
        }

        .dark .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='left']>.tippy-arrow::before {
            border-left-color: var(--color-dark-primary);
        }

        .dark .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='right']>.tippy-arrow::before {
            border-right-color: var(--color-dark-primary);
        }
    `;
    return elem;
}