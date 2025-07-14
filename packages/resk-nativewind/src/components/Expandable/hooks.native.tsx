"use client";
import useStateCallback from "@utils/stateCallback";
import { IExpandableProps } from "./types";

export function useExpandable({ expanded: controlledExpanded, onExpandChange }: IExpandableProps): { expanded: boolean, toggleExpand?: () => void, isControlled: boolean } {
    const isControlled = typeof controlledExpanded == "boolean";
    const [internalExpanded, setInternalExpanded] = useStateCallback(isControlled ? controlledExpanded : false);
    const expanded = isControlled ? controlledExpanded : internalExpanded;
    return {
        expanded,
        isControlled,
        toggleExpand: () => {
            const newExpanded = !expanded;
            const cb = (newExpanded: boolean) => {
                if (typeof onExpandChange === "function") {
                    onExpandChange(newExpanded)
                }
            }
            if (!isControlled) {
                setInternalExpanded(newExpanded, cb);
            } else {
                cb(newExpanded)
            }
        }
    }
}