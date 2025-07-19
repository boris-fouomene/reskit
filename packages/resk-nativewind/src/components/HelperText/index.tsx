import { defaultStr } from "@resk/core/utils";
import { IHtmlTextProps, Text } from "@html";
import { cn } from "@utils/cn";
import { ITextVariant } from "@variants/text";
import { commonVariant } from "@variants/common";


export function HelperText({ visible = true, error, variant, className, testID, ...rest }: IHelperTextProps) {
    testID = defaultStr(testID, "resk-helper-text");
    return <Text
        {...rest}
        variant={{ ...variant, color: error ? "error" : variant?.color }}
        className={cn("resk-helper-text", error && "resk-text-helper-error", commonVariant({ hidden: visible === false }), className)}
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

    variant?: ITextVariant;
};