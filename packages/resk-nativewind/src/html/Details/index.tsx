import { cn } from "@utils/cn";
import { Div } from "../Div";
import { Text } from "../Text";
import { defaultStr } from "@resk/core/utils";
import allVariants from "@variants/all"
import { useDetailsState } from "./state";
import { IHtmlDetailsProps } from "./types";
import { DetailsIcon } from "./Icon";

export function Details({ className, iconProps, iconPosition, disabled, testID, contentClassName, open, summaryClassName, summary, children, ...rest }: IHtmlDetailsProps) {
    testID = defaultStr(testID, "resk-details");
    const { isOpen, toggleOpen } = useDetailsState(open);
    const restProps = !toggleOpen && isOpen ? { open } : {};
    const isIconOnLeft = iconPosition !== "right" ? true : false;
    const icon = <DetailsIcon
        testID={testID + "-icon"}
        {...Object.assign({}, iconProps)}
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


