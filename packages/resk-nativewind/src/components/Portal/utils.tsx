import { Platform, ViewStyle, StyleSheet } from "react-native";

export const classes = {
    hidden: "opacity-0 z-0 pointer-events-none invisible",
}
export const styles = {
    absoluteFill: {
        position: Platform.select({
            web: "fixed",
            default: "absolute",
        }),
        ...(Platform.select({
            native: {
                ...StyleSheet.absoluteFillObject,
            },
            web: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                pointerEvents: "auto",
            }
        })),
        flex: 1,
    } as ViewStyle,
}