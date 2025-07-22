import { cn } from "@utils/cn";
import { ScrollViewProps, ScrollView } from "react-native";

export function SSRScrollView({ enableWindowScrollBridge, ...props }: ISSRScrollViewProps) {
    return <ScrollView
        {...props}
        className={cn("resk-ssr-scroll-view", props.className)}
    />
}
export interface ISSRScrollViewProps extends ScrollViewProps {
    enableWindowScrollBridge?: boolean;
}