import { Div } from "@html/Div";
import { defaultStr, isNonNullString, isNumber } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { StyleSheet } from "react-native";
import { activityIndicatorVariant } from "@variants/activityIndicator";
import { IActivityIndicatorProps } from "./types";

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
export function ActivityIndicator({ size, borderWidth, style, variant, testID, id, color, className, children, ...props }: IActivityIndicatorProps) {
    const clx = [];
    if (isNumber(size) && size > 0) {
        const hasBorderWidth = isNumber(borderWidth) && borderWidth > 0;
        borderWidth = hasBorderWidth ? borderWidth : size >= 30 ? 3 : 4;
        if (!hasBorderWidth && size >= 40) {
            borderWidth = Math.max(size / 10, size < 60 ? 5 : size < 80 ? 6 : size < 90 ? 9 : 10);
        }
        style = [{ width: size, height: size, borderWidth }, style]
    } else {
        clx.push(size === "large" ? "h-16 w-16 border-8" : "h-[20px] w-[20px] border-[3px]")
    }
    if (isNonNullString(color) && color.trim()) {
        style = [{ borderTopColor: color }, style];
    }
    testID = defaultStr(testID, "resk-activity-indicator");
    // Remove any role from props to avoid SSR hydration errors
    const { role: _role, ...restProps } = props;
    // Accessibility attributes for a loading spinner
    return (
        <Div
            role="progressbar"
            aria-busy
            aria-label="loading"
            aria-valuetext="Loading..."
            {...restProps}
            testID={testID}
            id={id}
            style={StyleSheet.flatten(style) as any}
            className={cn("resk-activity-indicator animate-spin rounded-full", clx, activityIndicatorVariant(variant), className)}
        />
    );
}

export * from "./types";