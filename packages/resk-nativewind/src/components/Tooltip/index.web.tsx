"use client";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useEffect, useId, useMemo, useRef } from "react";
import { cn, getTextContent, isValidElement, useMergeRefs } from '@utils';
import { getMaxZindex, isDOMElement, defaultStr } from "@resk/core/utils";
import Platform from "@resk/core/platform";
import { TouchableOpacity, PressableProps } from "react-native";
import { ITooltipProps } from './types';
import { ITouchableProps } from '@src/types';
import { TIPPY_THEME } from './constants';


export * from "./types";


export function Tooltip<AsProps extends ITouchableProps = PressableProps>({ children, className, title, as, disabled, testID, ref, id, ...rest }: ITooltipProps<AsProps>) {
    testID = defaultStr(testID, "resk-tooltip");
    testID = defaultStr(testID, "resk-tooltip");
    const uId = useId();
    const instanceIdRef = useRef(defaultStr(id, uId));
    const buttonRef = useRef(null);
    const innerRef = useMergeRefs(ref, buttonRef);
    const selector = isDOMElement(buttonRef.current) ? buttonRef.current : "#" + instanceIdRef.current;
    useEffect(() => {
        if (disabled || !Platform.isClientSide()) return;
        const content = String(getTextContent(title)).replaceAll("\n", "<br/>");
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
    }, [title, disabled, selector]);
    const Component = useMemo(() => {
        return as || TouchableOpacity;
    }, [as])
    if (!isValidElement(children)) {
        return null;
    }
    return <Component {...rest as any} className={cn(className)} disabled={disabled} id={instanceIdRef.current} testID={testID} ref={innerRef}>
        {children}
    </Component>;
};
