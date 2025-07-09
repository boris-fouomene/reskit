import { defaultStr } from '@resk/core/utils';
import { Text } from "@html/Text";
import { cn } from "@utils/cn";
import { badgeVariant } from "@variants/badge";
import { IHtmlTextProps } from '@html/types';
import { IVariantPropsBadge } from '@variants/badge';


export interface IBadgeProps extends Omit<IHtmlTextProps, "variant"> {
    /**
     * Whether the badge is visible
     */
    visible?: boolean;

    /***
     * Badge variants
     */
    variant?: IVariantPropsBadge;
};

/**
 * Renders a badge component with customizable visibility, styling, and variant.
 *
 * @param visible - Controls the visibility of the badge. If `false`, the badge is hidden. Defaults to `true`.
 * @param testID - Optional test identifier for testing purposes. Defaults to `"resk-badge"` if not provided.
 * @param className - Additional CSS class names to apply to the badge.
 * @param variant - The visual variant of the badge, used to determine its style.
 * @param rest - Additional props to be spread onto the underlying `Text` component.
 * @returns A styled badge component.
 */
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
            className={cn("inline-flex items-center", badgeVariant(variant), visible === false && "hidden", className)}
            {...rest}
        />
    );
};

Badge.displayName = 'Badge';
