import { Platform, ViewStyle } from "react-native";

export const absoluteClassName = "w-screen h-screen web:position-fixed position-absolute pointer-events-auto";
export const styles = {
    absoluteFill: {
        position: Platform.select({
            web: "fixed",
            default: "absolute",
        }),
        pointerEvents: "auto",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flex: 1,
    } as ViewStyle,
}