import { defaultStr } from '@resk/core/utils';
import { Text } from "@html/Text";
import { cn } from "@utils/cn";
import { ISurfaceProps } from '@components/Surface';
import surfaceVariants from "@variants/surface";
import { IHtmlTextProps } from '@html/types';


export interface IBadgeProps extends IHtmlTextProps {
    /**
     * Whether the badge is visible
     */
    visible?: boolean;

    variant?: ISurfaceProps["variant"];
};

export function Badge({
    visible = true,
    testID,
    className,
    variant,
    ...rest
}: IBadgeProps) {
    testID = defaultStr(testID, "resk-badge");
    return (
        <Text
            testID={testID}
            className={cn("text-center overflow-hidden w-5 h-5 rounded-full hover:opacity-50 active:opacity-50", surfaceVariants(variant), visible === false && "hidden", className)}
            {...rest}
        />
    );
};

Badge.displayName = 'Badge';
