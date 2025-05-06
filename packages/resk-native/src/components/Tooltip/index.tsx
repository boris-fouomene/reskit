import { Pressable } from "react-native";
import { useMemo, useRef } from "react";
import { ITooltipProps } from './types';
import { defaultStr, uniqid } from "@resk/core";
import { useMergeRefs } from "@utils/mergeRefs";
import { isValidElement } from "@utils";

export * from "./types";

export function Tooltip ({children, title, tooltip, disabled, as, testID, id,ref, ...rest}:ITooltipProps){
  testID = defaultStr(testID, "resk-tooltip");
  // Reference for instance ID or generate a unique one
  const instanceIdRef = useRef(id || uniqid("tippy-instance-id"));
  // Reference for the child element (e.g., button)
  const buttonRef = useRef(null);
  // Combine external ref with internal button reference
  const innerRef = useMergeRefs(ref, buttonRef);
  const content = useMemo(() => {
    return isValidElement(tooltip, true) ? tooltip : isValidElement(title, true) ? title : null;
  }, [title, tooltip]);
  const Component = useMemo(() => {
    return as || Pressable;
  }, [as]);
  return (
    <Component {...rest} disabled={disabled} id={instanceIdRef.current} testID={testID} ref={innerRef}>
      {children}
    </Component>
  );
};

Tooltip.displayName = "TooltipNative";