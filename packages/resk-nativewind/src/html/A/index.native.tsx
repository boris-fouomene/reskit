"use client";
import { GestureResponderEvent, Linking, Platform } from 'react-native';
import { IHtmlAprops } from '@html/types';
import { Text } from "../Text";
import { sanitizeHref } from './utils';

export function A({ href, target, onPress, download, rel, ...props }: IHtmlAprops) {
    const url = sanitizeHref(href);
    return <Text role="link" {...props}
        onPress={
            (event: GestureResponderEvent) => {
                typeof onPress === 'function' && onPress(event);
                if (url) {
                    Linking.openURL(url);
                }
            }}
    />;
}