import { Pressable } from "react-native";
import React, { useMemo } from "react";
import { ITooltipProps } from "./types";
import { defaultStr, uniqid } from "@resk/core";
import { useMergeRefs } from "@utils/mergeRefs";

export * from "./types";

const Tooltip = React.forwardRef(({
  children, title, tooltip, disabled, as, testID, id, ...rest
}: ITooltipProps, ref) => {
  testID = defaultStr(testID, "rn-tooltip");
  // Reference for instance ID or generate a unique one
  const instanceIdRef = React.useRef(id || uniqid("tippy-instance-id"));
  // Reference for the child element (e.g., button)
  const buttonRef = React.useRef(null);
  // Combine external ref with internal button reference
  const innerRef = useMergeRefs(ref, buttonRef);
  const Component = useMemo(() => {
    return as || Pressable;
  }, [as]);
  return (
    <Component {...rest} disabled={disabled} id={instanceIdRef.current} testID={testID} ref={innerRef}>
      {children}
    </Component>
  );
});

export { Tooltip }

Tooltip.displayName = "TooltipNative";