import { defaultStr, isNonNullString, isNumber } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { ActivityIndicatorProps } from "react-native";
import { StyleSheet } from "react-native";

export function ActivityIndicator({ size, style, testID, id, color, className, children, ...props }: ActivityIndicatorProps) {
    let clx = undefined;
    if (isNumber(size) && size > 0) {
        let borderWidth = Math.max(size / (size > 10 ? 5 : 4), 5);
        if (size >= 40) {
            borderWidth = Math.max(size / 5, 10);
        }
        style = [{ width: size, height: size, borderWidth }, style]
    } else {
        clx = size === "large" ? "h-16 w-16 border-8" : "h-8 w-8 border-4"
    }
    if (isNonNullString(color) && color.trim()) {
        style = [{ borderTopColor: color }, style];
    }
    testID = defaultStr(testID, "resk-nativewind-activity-indicator");
    return <div data-testid={testID} id={id} style={StyleSheet.flatten(style) as any} className={cn("border-gray-300 border-t-primary animate-spin rounded-full", clx, className)} />
}