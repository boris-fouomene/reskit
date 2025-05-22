import { defaultStr } from "@resk/core";
import { IHtmlTextProps, Text } from "@html";
import { cn } from "@utils/cn";
import { IVariantPropsText } from "@variants/text";
import { variants } from "@variants/index";


/**
 * Renders a helper text component, typically used for displaying validation messages or additional information.
 *
 * @param visible - Controls the visibility of the helper text. Defaults to `true`.
 * @param error - If provided, styles the text to indicate an error state.
 * @param className - Additional class names to apply to the component.
 * @param testID - Optional test identifier for testing purposes. Defaults to `"resk-helper-text"`.
 * @param rest - Additional props passed to the underlying `Text` component.
 * 
 * @returns A styled `Text` component displaying helper information or error messages.
 */
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