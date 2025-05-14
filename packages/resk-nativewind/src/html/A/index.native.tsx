"use client";
import { GestureResponderEvent, Linking } from 'react-native';
import { IHtmlAprops } from '@html/types';
import { Text } from "../Text";
import { sanitizeHref } from './utils';
import { withAsChild } from '@components/Slot';

export const A = withAsChild(function A({ href, target, onPress, download, rel, ...props }: IHtmlAprops) {
    const url = sanitizeHref(href);
    return <Text role="link" {...props}
        onPress={(event: GestureResponderEvent) => {
            typeof onPress === 'function' && onPress(event);
            if (url) {
                Linking.openURL(url);
            }
        }}
    />;
}, "Html.A");