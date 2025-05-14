import { Div } from "@html/Div";
import { defaultStr, isNonNullString, isNumber } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { ActivityIndicatorProps } from "react-native";
import { StyleSheet } from "react-native";

/**
 * A customizable `ActivityIndicator` component that wraps the standard 
 * `ActivityIndicator` from React Native. This component integrates 
 * with the application's theme to provide a consistent loading indicator 
 * appearance based on the current theme colors.
 * 
 * @param {ActivityIndicatorProps} props - The properties passed to the 
 * `ActivityIndicator` component. This includes all standard 
 * `ActivityIndicatorProps` from React Native, allowing for customization 
 * of the loading indicator's behavior and appearance.
 * 
 * @example
 * Here’s an example of how to use the custom `ActivityIndicator`:
 * 
 */
export function ActivityIndicator({ size, style, testID, id, color, className, children, role, ...props }: ActivityIndicatorProps) {
    let clx = undefined;
    if (isNumber(size) && size > 0) {
        let borderWidth = Math.max(size / (size > 10 ? 5 : 4), 5);
        if (size >= 40) {
            borderWidth = Math.max(size / 10, size < 60 ? 6 : size < 80 ? 8 : 10);
        }
        style = [{ width: size, height: size, borderWidth }, style]
    } else {
        clx = size === "large" ? "h-16 w-16 border-8" : "h-8 w-8 border-4"
    }
    if (isNonNullString(color) && color.trim()) {
        style = [{ borderTopColor: color }, style];
    }
    testID = defaultStr(testID, "resk-activity-indicator");
    return <Div role={defaultStr(role, "progressbar") as any} testID={testID} id={id} style={StyleSheet.flatten(style) as any} className={cn("border-gray-300 border-t-primary animate-spin rounded-full", clx, className)} />
}