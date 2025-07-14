import { IExpandableProps } from "./types";

export function useExpandable({ expanded: controlledExpanded, onExpandChange }: IExpandableProps): { expanded: boolean, toggleExpand?: () => void, isControlled: boolean } {
    const isControlled = typeof controlledExpanded == "boolean";;
    return {
        expanded: isControlled ? controlledExpanded : false,
        toggleExpand: undefined,
        isControlled,
    }
}