import { cn } from "@utils/cn";
import { Div } from "../Div";
import { defaultStr } from "@resk/core/utils";
import allVariants from "@variants/all"
import { useDetailsState } from "./state";
import { IHtmlDetailsProps } from "./types";
import { DetailsIcon } from "./Icon";

/**
 * A component that provides a clickable summary element and a content element
 * that can be toggled open and closed.
 *
 * @param {object} props - The properties for the Details component.
 * @param {string} [props.testID] - Optional test identifier for testing purposes. Defaults to "resk-details".
 * @param {object} [props.iconProps] - Additional properties for the icon component.
 * @param {string} [props.iconPosition] - The position of the icon. Defaults to "left".
 * @param {boolean} [props.disabled] - Flag to indicate if the component is disabled.
 * @param {string} [props.className] - Additional CSS class names to apply to the container element.
 * @param {any} [props.open] - The value of the `open` attribute for the `details` element.
 * @param {string} [props.summaryClassName] - Additional CSS class names to apply to the summary element.
 * @param {ReactElement} [props.summary] - The content of the summary element.
 * @param {ReactElement} [props.children] - The content of the content element.
 * @param {object} [props.contentClassName] - Additional properties for the content element.
 * @param {object} [rest] - Additional props passed to the `Div` component.
 */
export function Details({ className, iconProps, iconPosition, disabled, testID, contentClassName, open, summaryClassName, summary, children, ...rest }: IHtmlDetailsProps) {
    testID = defaultStr(testID, "resk-details");
    const { isOpen, toggleOpen } = useDetailsState(open);
    const restProps = !toggleOpen && isOpen ? { open } : {};
    const isIconOnLeft = iconPosition !== "right" ? true : false;
    const icon = <DetailsIcon
        testID={testID + "-icon"}
        {...iconProps}
        toggleOpen={toggleOpen}
        open={isOpen}
        className={cn("details-icon")}
    />
    return <Div testID={testID} {...rest} disabled={disabled} className={cn("list-none", className, "details-group")} {...restProps} asHtmlTag="details">
        <Div asHtmlTag="summary" className={cn("list-none flex flex-row items-center", !disabled && "cursor-pointer", summaryClassName)} onPress={toggleOpen} testID={testID + "-summary"}>
            {isIconOnLeft ? icon : null}
            {summary}
            {!isIconOnLeft ? icon : null}
        </Div>
        <Div className={cn("w-100 px-[20px] py-[7px]", disabled && "pointer-events-none", contentClassName, toggleOpen && allVariants({ hidden: !isOpen }))} testID={testID + "-content"}>
            {children}
        </Div>
    </Div>
}


export * from "./types";

Details.displayName = "Html.Details";