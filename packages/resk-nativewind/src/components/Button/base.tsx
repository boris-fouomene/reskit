"use client";
import iconVariants from "@variants/icon";
import { ActivityIndicator } from '@components/ActivityIndicator';
import { Surface } from '@components/Surface';
import { Text } from '@html/Text';
import { defaultStr } from '@resk/core/utils';
import isValidElement from '@utils/isValidElement';
import { Divider } from '@components/Divider';
import { cn } from '@utils/cn';
import { Icon } from '@components/Icon';
import { Div } from '@html/Div';
import buttonVariant from "@variants/button";
import { IButtonLeftOrRightFuncOptions, IButtonBaseProps } from "./types";
import { Fragment } from "react";
import allVariants from "@variants/all";


/**
 * A functional component that renders a basic button with customizable properties.
 * It supports loading states and can display either an icon or an image icon.
 *
 * @param {IButtonBaseProps} props - The properties to configure the ButtonBase.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {boolean} [props.loading=false] - Indicates if a loading spinner should be shown instead of the icon.
 * @param {string} [props.icon] - The name of the font icon to display.
 * @param {ReactNode} [props.children] - The content of the button.
 * @param {string} [props.accessibilityLabel] - The accessibility label for the button.
 * @param {string} [props.accessibilityHint] - The accessibility hint for the button.
 * @param {string} [props.testID] - Optional test identifier for the button.
 * @param {string} [props.id] - Optional id for the button.
 * @param {boolean} [props.accessible=true] - Whether the button is accessible.
 * @param {string} [props.labelClassName] - Additional class names for the label.
 * @param {string} [props.contentClassName] - Additional class names for the content.
 * @param {string} [props.leftContainerClassName] - Additional class names for the left container.
 * @param {string} [props.rightContainerClassName] - Additional class names for the right container.
 * @param {string} [props.iconPosition="left"] - The position of the icon.
 * @param {object} [props.iconProps] - The properties to configure the icon.
 * @param {string} [props.containerClassName] - Additional class names for the button container.
 * @param {string} [props.className] - Additional class names for the button.
 * @param {React.Ref} [props.ref] - A reference to the button container.
 * @param {object} [props.context] - Additional context properties to pass to the label and icon.
 * @param {boolean} [props.disableRipple=false] - Whether to disable the ripple effect.
 * @param {ReactNode} [props.rippleContent] - The content for the ripple effect.
 *
 * @returns {JSX.Element} The rendered ButtonBase component.
 */
export function ButtonBase<IButtonExtendContext = unknown>({
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
    context,
    ...rest
}: IButtonBaseProps) {
    const buttonId = defaultStr(id, testID, "resk-button-base-id");
    testID = defaultStr(testID, "resk-button-base");
    const isLoading = !!customIsLoading;
    const disabled: boolean = !!customDisabled || isLoading;
    const divider = customDivider === true;
    const computedVariant = buttonVariant(variant);
    const iconSize = 18;
    iconProps = Object.assign({}, iconProps);
    const disabledClass = disabled && "pointer-events-none";
    iconProps.className = cn("button-icon", computedVariant.icon?.(), iconProps?.variant && iconVariants(iconProps.variant), disabledClass, iconProps.className);
    const icon = Icon.getIcon({ icon: iconProp, size: iconSize, ...iconProps, variant: undefined });
    const iconContent = isLoading ? (
        <ActivityIndicator
            size={iconProps?.size || "small"}
            className={cn("button-indicator mx-[5px]", computedVariant.activityIndicator?.(), activityIndicatorClassName)}
            testID={testID + "-button-activity-indicator"}
        />
    ) : icon || null;
    const buttonContext = Object.assign({}, context, { loading: isLoading, computedVariant }) as IButtonLeftOrRightFuncOptions<IButtonExtendContext>;
    const leftContent = typeof left === "function" ? left(buttonContext) : left;
    const rightContent = typeof right === "function" ? right(buttonContext) : right;
    const hasRightContent = isValidElement(right) && !!right;
    const rowClassName = cn("flex flex-row items-center self-center justify-center", disabledClass);
    return (<>
        <Surface
            role="none"
            {...rest}
            id={buttonId}
            testID={`${testID}`}
            ref={ref}
            className={cn("group/btn btn relative overflow-hidden button select-text", !disabled && "hover:opacity-90 active1:animate-ping active:scale-[0.97]", allVariants({ disabled }), computedVariant.base?.(), className)}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityRole={accessibilityRole}
            accessibilityState={{ disabled }}
            accessible={accessible}
            disabled={disabled}
        >
            <Div id={`${buttonId}-content`} testID={testID + "-button-content"} className={cn("button-content flex flex-row items-center self-center", computedVariant.content?.(), contentClassName)}>
                <Div className={cn("button-left-container", rowClassName, computedVariant.leftContainer?.(), leftContainerClassName)} testID={testID + "-button-left-container"}>
                    {leftContent}
                    {iconPosition != "right" ? iconContent : null}
                    <Text
                        id={`${buttonId}-label`}
                        selectable={false}
                        testID={`${testID}-button-label`}
                        className={cn("button-label", computedVariant.label?.(), disabledClass, labelClassName)}
                    >
                        {isValidElement(children, true) && children || label}
                    </Text>
                </Div>
                {(hasRightContent) ? <Div testID={testID + "-right-content-wrapper"} id={`${buttonId}-right-content-wrapper`} className={cn("button-right-container", rowClassName, computedVariant.rightContainer?.(), rightContainerClassName)}>
                    {iconPosition == "right" ? iconContent : null}
                    {rightContent}
                </Div> : null}
            </Div>
            {disableRipple || !isValidElement(rippleContent) ? null : rippleContent}
        </Surface>
        {divider ? <Divider id={buttonId + "-divider"} testID={testID + "-button-divider"} className={cn("button-divider", disabledClass, dividerClassName)} /> : null}
    </>);
};

ButtonBase.displayName = "Button.Base";