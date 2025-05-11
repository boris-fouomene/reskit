"use client";
import { GestureResponderEvent, Linking, Platform } from 'react-native';
import { IHtmlAprops } from '@html/types';
import { Text } from "../Text";

export function A({ href, target, onPress, download, rel, ...props }: IHtmlAprops) {
    return <Text role="link" {...props}
        onPress={
            (event: GestureResponderEvent) => {
                typeof onPress === 'function' && onPress(event);
                if (Platform.OS !== 'web' && href !== undefined) {
                    Linking.openURL(href);
                }
            }}
    />;
}