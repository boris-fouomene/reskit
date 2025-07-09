import { ISurfaceProps, Surface } from "@components/Surface";
import { isValidElement, ReactNode } from "react";
import { Icon, IIconSource } from "@components/Icon";
import { IVariantPropsIcon } from "@variants/icon";
import { IClassName } from "@src/types";
import { defaultStr, isNonNullString, isObj } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { Text } from "@html/Text";
import { Div } from "@html/Div";
import { textVariant, IVariantPropsText } from "@variants/text";
import { iconVariant as iconVariants } from "@variants/icon";
import { alertVariant, IVariantPropsAlert } from "@variants/alert";
import { IHtmlTextProps } from "@html/types";
import { useAlert } from "./hook";
import { CloseAlert } from "./Close";
import { INavItemsProps, Nav } from "@components/Nav";
import { IAlertHook } from "./types";

export function Alert({ title, icon, closeIcon, actions, closeIconVariant, closeIconClassName, closeIconContainerClassName, iconClassName, messageProps, children, type, titleVariant, iconContainerClassName, iconVariant, variant, messageVariant, titleClassName, testID, message, messageClassName, headerClassName, className, ...rest }: IAlertProps) {
    const { isOpen, open, close, shouldRender, className: alertClassName } = useAlert();
    testID = defaultStr(testID, "resk-alert");
    let iconByType: IIconSource | undefined = undefined, variantByType: IVariantPropsAlert | undefined = undefined;
    switch (String(type).toLowerCase()) {
        case "info":
            type = "info";
            iconByType = "material-info" as IIconSource;
            variantByType = { colorScheme: "info" };
            break;
        case "warning":
            type = "warning";
            iconByType = "material-warning" as IIconSource;
            variantByType = { colorScheme: "warning" };
            break;
        case "error":
            type = "error";
            iconByType = "material-error" as IIconSource;
            variantByType = { colorScheme: "error" };
            break;
        case "success":
            type = "success";
            iconByType = "material-check-circle" as IIconSource;
            variantByType = { colorScheme: "success" };
            break;
    }
    const computedVariant = alertVariant({ ...variantByType, ...variant });
    const iconContent = Icon.getIcon({ icon: icon ?? iconByType, className: cn("resk-alert-icon", computedVariant.icon(), iconVariants(iconVariant), iconClassName), testID: testID + "-icon" });
    const closeIContent = Icon.getIcon({ icon: closeIcon ?? "close" as never, className: cn("resk-alert--close-icon", computedVariant.closeIcon(), iconVariants(closeIconVariant), closeIconClassName), testID: testID + "-close-icon" });
    const navItems: INavItemsProps<IAlertHook>["items"] = [];
    (Array.isArray(actions) ? actions : []).map((act) => {
        if (!isObj(act)) return;
        const newAct = Object.clone(act);
        newAct.context = { ...act.context, isOpen, open, close };
        navItems.push(newAct);
    });
    title = isValidElement(title) || isNonNullString(title) ? title : undefined;
    message = isValidElement(message) || isNonNullString(message) ? message : undefined;
    if (!shouldRender) return null;
    return <Surface {...rest} testID={testID} className={cn("resk-alert transform transition-opacity duration-300 flex flex-col justify-start items-start text-start", isOpen ? ["opacity-100 visible"] : ["opacity-0 invisible"], alertClassName, computedVariant.base(), className)}>
        {<Div className={cn("flex flex-row justify-between items-center w-full resk-alert-header", computedVariant.header(), headerClassName)}>
            {iconContent || title ? <Div className={cn("flex flex-row justify-start items-center self-center grow")}>
                {iconContent ? <Div className={cn("overflow-hidden align-center items-center justify-center flex flex-col resk-alert-icon-container", iconContainerClassName)} testID={testID + "-icon-container"}>{iconContent}</Div> : null}
                <Text testID={testID + "-title"} className={cn("resk-alert-title", computedVariant.title(), textVariant(titleVariant), titleClassName)}>
                    {title}
                </Text>
            </Div> : null}
            {closeIContent ? <CloseAlert
                className={cn("overflow-hidden align-center grow-0 items-center justify-center flex flex-col resk-alert-close-icon-container", computedVariant.closeIconContainer(), closeIconContainerClassName)}
                children={closeIContent} isOpen={isOpen} open={open} close={close}
                testID={testID + "-close-icon-container"}
            /> : null}
        </Div>}
        {message ? <Text numberOfLines={10} {...messageProps} testID={testID + "-message"} className={cn("resk-alert-message w-full", computedVariant.message(), textVariant(messageVariant), messageProps?.className, messageClassName)}>
            {message}
        </Text> : null}
        {children ? children : null}
        {navItems?.length ? <Nav.Items<IAlertHook>
            items={navItems}
            className={cn("resk-alert-actions flex flex-row w-full flex-wrap items-start", computedVariant.actionsContainer(), actions?.className)}
        /> : null}
    </Surface>
}

export interface IAlertProps extends Omit<ISurfaceProps, "title" | "variant"> {
    title?: ReactNode;
    iconVariant?: IVariantPropsIcon;
    titleVariant?: IVariantPropsIcon;
    titleClassName?: IClassName;
    headerClassName?: IClassName;
    message?: ReactNode;
    messageClassName?: IClassName;
    messageVariant?: IVariantPropsText;
    icon?: IIconSource;
    iconClassName?: IClassName;
    iconContainerClassName?: IClassName;
    variant?: IVariantPropsAlert;
    type?: "info" | "warning" | "error" | "success";
    messageProps?: Omit<IHtmlTextProps, "variant">;
    closeIcon?: IIconSource;
    closeIconClassName?: IClassName;
    closeIconContainerClassName?: IClassName;
    closeIconVariant?: IVariantPropsIcon;
    /**
     * Actions to display in the alert
     */
    actions?: INavItemsProps<IAlertHook>;
}