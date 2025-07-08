import { ISurfaceProps, Surface } from "@components/Surface";
import { isValidElement, ReactNode } from "react";
import { Icon, IIconSource } from "@components/Icon";
import { IVariantPropsIcon } from "@variants/icon";
import { IClassName } from "@src/types";
import { defaultStr, isNonNullString } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { Text } from "@html/Text";
import { Div } from "@html/Div";
import textVariant, { IVariantPropsText } from "@variants/text";
import iconVariants from "@variants/icon";
import alertVariant, { IVariantPropsAlert } from "@variants/alert";

export function Alert({ title, icon, iconClassName, type, titleVariant, iconContainerClassName, iconVariant, variant, messageVariant, titleClassName, testID, message, messageClassName, titleContainerClassName, className, ...rest }: IAlertProps) {
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
            break;
    }
    const computedVariant = alertVariant({ ...variantByType, ...variant });
    const iconContent = Icon.getIcon({ icon: icon ?? iconByType, className: cn("resk-alert-icon", computedVariant.icon(), iconVariants(iconVariant), iconClassName), testID: testID + "-icon" });
    title = isValidElement(title) || isNonNullString(title) ? title : undefined;
    message = isValidElement(message) || isNonNullString(message) ? message : undefined;
    return <Surface {...rest} testID={testID} className={cn("resk-alert flex flex-col justify-start items-start text-start", computedVariant.base(), className)}>
        {iconContent || title ? <Div className={cn("flex flex-row justify-start items-center w-full resk-alert-title-container", computedVariant.titleContainer(), titleContainerClassName)}>
            {iconContent ? <Div className={cn("overflow-hidden align-center items-center justify-center flex flex-col resk-alert-icon-container", iconContainerClassName)} testID={testID + "-icon-container"}>{iconContent}</Div> : null}
            <Text testID={testID + "-title"} className={cn("resk-alert-title", computedVariant.title(), textVariant(titleVariant), titleClassName)}>
                {title}
            </Text>
        </Div> : null}
        {message ? <Text testID={testID + "-message"} className={cn("resk-alert-message w-full", computedVariant.message(), textVariant(messageVariant), messageClassName)}>
            {message}
        </Text> : null}
    </Surface>
}

export interface IAlertProps extends Omit<ISurfaceProps, "title" | "variant"> {
    title?: ReactNode;
    iconVariant?: IVariantPropsIcon;
    titleVariant?: IVariantPropsIcon;
    titleClassName?: IClassName;
    titleContainerClassName?: IClassName;
    message?: ReactNode;
    messageClassName?: IClassName;
    messageVariant?: IVariantPropsText;
    icon?: IIconSource;
    iconClassName?: IClassName;
    iconContainerClassName?: IClassName;
    variant?: IVariantPropsAlert;
    type?: "info" | "warning" | "error" | "success";
}