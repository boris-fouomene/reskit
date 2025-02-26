import { StatusBar as RNStatusBar, StatusBarProps } from "react-native";
import { Colors, useTheme } from "@theme";

export function StatusBar(props: StatusBarProps) {
    const theme = useTheme();
    const statusBarColor = theme.dark ? theme.colors.surface : theme.colors.primary;
    return <RNStatusBar
        animated={true}
        barStyle={Colors.isLight(statusBarColor as string) ? "dark-content" : "light-content"}
        backgroundColor={statusBarColor}
        {...props}
    />
}