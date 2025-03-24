import Platform from "@resk/core/platform";
import { StyleSheet } from "react-native";

export default function View({ children, testID, style }: { children: any; testID: string, style: any }) {
    const newStyle = Platform.isClientSide() ? StyleSheet.flatten(style) : {};
    return <div
        className={testID || "resk-context-wrapper"}
        suppressHydrationWarning
        data-testid={testID || "resk-context-wrapper"}
        style={{ flex: 1, width: "100%", height: "100%", justifyContent: "flex-start", alignItems: "flex-start", ...Object.assign({}, newStyle) }}
    >{children}</div>;
}