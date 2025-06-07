import { Platform, ViewStyle } from "react-native";

export const absoluteClassName = "w-full h-full web:position-fixed position-absolute";
export const styles = {
    absoluteFill: {
        position: Platform.select({
            web: "fixed",
            default: "absolute",
        }),
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flex: 1,
    } as ViewStyle,
}