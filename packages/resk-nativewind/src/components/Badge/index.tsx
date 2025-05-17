import { defaultStr } from '@resk/core/utils';
import { Text } from "@html/Text";
import { cn } from "@utils/cn";
import badgeVariants from "@variants/badge";
import { IHtmlTextProps } from '@html/types';
import { IVariantPropsBadge } from '@variants/badge';


export interface IBadgeProps extends IHtmlTextProps {
    /**
     * Whether the badge is visible
     */
    visible?: boolean;

    /***
     * Badge variants
     */
    variant?: IVariantPropsBadge;
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
            className={cn("inline-flex items-center", badgeVariants(variant), visible === false && "hidden", className)}
            {...rest}
        />
    );
};

Badge.displayName = 'Badge';
