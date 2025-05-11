import { IHtmlDivProps } from "./types";
import { cn, normalizeProps } from "@utils";
import { StyleSheet } from "react-native";


const isNonNullString = (value: unknown): value is string => typeof value === "string" && !!value.length;
export function normalizeNativeProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, ...props }: T) {
    return {
        testID: isNonNullString(testID) ? testID : isNonNullString(props["data-testid"]) ? props["data-testid"] : undefined,
        ...normalizeProps(props),
    }
}

export function normalizeHtmlProps<T extends Partial<IHtmlDivProps> = Partial<IHtmlDivProps>>({ testID, style, onPress, ...props }: T) {
    return {
        "data-test-id": isNonNullString(testID) ? testID : isNonNullString(props["data-testid"]) ? props["data-testid"] : undefined,
        style: style ? StyleSheet.flatten(style) : undefined as any,
        ...normalizeProps(props),
        onClick: typeof onPress == "function" ? onPress as any : undefined
    }
}