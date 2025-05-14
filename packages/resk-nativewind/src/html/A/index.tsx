import { IHtmlAprops } from '@html/types';
import { Text } from "../Text";
import { sanitizeHref } from './utils';
import { withAsChild } from '@components/Slot';
export const A = withAsChild(function A({ href, target, download, rel, ...props }: IHtmlAprops) {
    const nativeProps = {
        href: sanitizeHref(href),
        hrefAttrs: {
            target,
            download,
            rel,
        },
    } as any;
    return <Text role="link" {...props} {...nativeProps} />;
}, "Html.A");