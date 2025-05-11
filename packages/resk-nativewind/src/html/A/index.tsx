import { IHtmlAprops } from '@html/types';
import { Text } from "../Text";
export function A({ href, target, download, rel, ...props }: IHtmlAprops) {
    const nativeProps = {
        href,
        hrefAttrs: {
            target,
            download,
            rel,
        },
    } as any;
    return <Text role="link" {...props} {...nativeProps} />;
}