"use client";
import iconVariants from "@variants/icon";
import { ActivityIndicator } from '@components/ActivityIndicator';
import { Surface } from '@components/Surface';
import { Text } from '@html/Text';
import { defaultStr, uniqid } from '@resk/core/utils';
import isValidElement from '@utils/isValidElement';
import { Divider } from '@components/Divider';
import { cn } from '@utils/cn';
import { Icon } from '@components/Icon';
import { Div } from '@html/Div';
import buttonVariant from "@variants/button";
import { IButtonBaseProps } from "./types";
import { Fragment } from "react";
import allVariants from "@variants/all";


export function ButtonBase({
    disabled: customDisabled,
    loading: customIsLoading,
    icon: iconProp,
    children,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    testID,
    accessible,
    labelClassName,
    contentClassName,
    leftContainerClassName,
    rightContainerClassName,
    iconPosition,
    iconProps,
    containerClassName,
    label,
    id,
    left,
    right,
    dividerClassName,
    divider: customDivider,
    ref,
    className,
    android_ripple,
    activityIndicatorClassName,
    variant,
    disableRipple,
    rippleContent,
    ...rest
}: IButtonBaseProps) {
    const buttonId = defaultStr(id, testID, "resk-button-base-id");
    testID = defaultStr(testID, "resk-button-base");
    const isLoading = !!customIsLoading;
    const disabled: boolean = !!customDisabled || isLoading;
    const divider = customDivider === true;
    const bVariant = buttonVariant(variant);
    const iconSize = 18;
    iconProps = Object.assign({}, iconProps);
    const disabledClass = disabled && "pointer-events-none";
    iconProps.className = cn("button-icon", bVariant?.icon?.(), iconProps?.variant && iconVariants(iconProps.variant), disabledClass, iconProps.className);
    const icon = Icon.getIcon({ icon: iconProp, size: iconSize, ...iconProps, variant: undefined });
    const iconContent = icon && isLoading !== true ? icon : null;
    const hasRightContent = isValidElement(right) && !!right;
    const rowClassName = cn("flex flex-row items-center self-center justify-center", disabledClass);
    return (<Fragment>
        <Surface
            role="none"
            {...rest}
            id={buttonId}
            testID={`${testID}`}
            ref={ref}
            className={cn("relative overflow-hidden button", allVariants({ disabled }), bVariant?.base?.(), className)}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityRole={accessibilityRole}
            accessibilityState={{ disabled }}
            accessible={accessible}
            disabled={disabled}
        >
            <Div id={`${buttonId}-content`} testID={testID + "-button-content"} className={cn("button-content flex flex-row items-center self-center", bVariant?.content?.(), contentClassName)}>
                <Div className={cn("button-left-container", rowClassName, bVariant?.leftContainer?.(), leftContainerClassName)} testID={testID + "-button-left-container"}>
                    {iconPosition != "right" ? iconContent : null}
                    {isLoading ? (
                        <ActivityIndicator
                            size={iconProps?.size || "small"}
                            className={cn("button-indicator", activityIndicatorClassName)}
                            testID={testID + "-button-activity-indicator"}
                        />
                    ) : null}
                    {left}
                    <Text
                        id={`${buttonId}-label`}
                        selectable={false}
                        numberOfLines={1}
                        testID={`${testID}-button-label`}
                        className={cn("button-label", bVariant?.label?.(), disabledClass, labelClassName)}
                    >
                        {isValidElement(children, true) && children || label}
                    </Text>
                </Div>
                {(hasRightContent) ? <Div testID={testID + "-right-content-wrapper"} id={`${buttonId}-right-content-wrapper`} className={cn("button-right-container", rowClassName, bVariant?.rightContainer?.(), rightContainerClassName)}>
                    {iconPosition == "right" ? iconContent : null}
                    {right}
                </Div> : null}
            </Div>
            {disableRipple || !isValidElement(rippleContent) ? null : rippleContent}
        </Surface>
        {divider ? <Divider id={buttonId + "-divider"} testID={testID + "-button-divider"} className={cn("button-divider", disabledClass, dividerClassName)} /> : null}
    </Fragment>);
};

ButtonBase.displayName = "Button.Base";