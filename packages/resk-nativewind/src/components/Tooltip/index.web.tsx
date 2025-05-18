"use client";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useEffect, useMemo, useRef } from "react";
import { cn, getTextContent, isValidElement, useMergeRefs } from '@utils';
import { getMaxZindex, isDOMElement, uniqid, defaultStr } from "@resk/core/utils";
import Platform from "@resk/core/platform";
import { Pressable, PressableProps } from "react-native";
import { ITooltipProps } from './types';
import { ITouchableProps } from '@src/types';

const TIPPY_THEME = "customtippy-themename";

const typyStyleId = "typy-csss-style-id";

export * from "./types";


export function Tooltip<AsProps extends ITouchableProps = PressableProps>({ children, className, title, tooltip, as, disabled, testID, ref, id, ...rest }: ITooltipProps<AsProps>) {
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
    const Component = useMemo(() => {
        return as && typeof as == "function" ? as : Pressable;
    }, [as])
    if (!isValidElement(children)) {
        return null;
    }
    return <Component {...rest as any} className={cn(className)} disabled={disabled} id={instanceIdRef.current} testID={testID} ref={innerRef}>
        {children}
    </Component>;
};

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