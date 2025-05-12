import { defaultStr } from "@resk/core";
import { IHtmlTextProps, Text } from "@html";
import { cn } from "@utils/cn";
import { IVariantPropsText } from "@variants/text";
import { variants } from "@variants/index";


export function HelperText({ visible = true, error, className, testID, ...rest }: IHelperTextProps & IVariantPropsText) {
    testID = defaultStr(testID, "resk-helper-text");
    return <Text
        {...rest}
        className={cn(variants.all({ hidden: visible === false }), variants.text({ error: !!error }), className)}
    />
}

export interface IHelperTextProps extends IHtmlTextProps {
    /**
     * Determines whether the helper text is visible.
     * @default true
     * @example true
     */
    visible?: boolean;

    /**
     * Specifies if the helper text represents an error.
     * If true, the text color will change to the error color.
     * @default false
     * @example true
     */
    error?: boolean;

    /**
     * Optional custom color for the helper text.
     */
    color?: string;
};