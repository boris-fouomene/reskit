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
import { IButtonBaseContext, IButtonProps } from "./types";
import allVariants from "@variants/all";
import { GestureResponderEvent } from "react-native";
import Auth from '@resk/core/auth';
import { classes } from "@variants/classes";


export function ButtonBase<Context = unknown>({
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
    activityIndicatorClassName,
    variant,
    disableRipple,
    rippleContent,
    context,
    perm,
    iconClassName,
    resourceName,
    onPress,
    ...rest
}: IButtonProps<Context>) {
    if (perm !== undefined && !Auth.isAllowed(perm)) return null;
    const buttonId = defaultStr(id, testID, "resk-button-base-id");
    testID = defaultStr(testID, "resk-button-base");
    const isLoading = !!customIsLoading;
    const disabled: boolean = !!customDisabled || isLoading;
    const divider = customDivider === true;
    const computedVariant = buttonVariant(variant);
    const iconSize = 18;
    iconProps = Object.assign({}, iconProps);
    const disabledClass = disabled && "pointer-events-none";
    iconProps.className = cn("button-icon", computedVariant.icon(), iconProps?.variant && iconVariants(iconProps.variant), disabledClass, iconClassName, iconProps.className);
    const icon = Icon.getIcon({ icon: iconProp, size: iconSize, ...iconProps, variant: undefined });
    const iconContent = isLoading ? (
        <ActivityIndicator
            size={iconProps?.size || "small"}
            className={cn("button-indicator mx-[5px]", computedVariant.activityIndicator?.(), activityIndicatorClassName)}
            testID={testID + "-button-activity-indicator"}
        />
    ) : icon || null;
    const buttonContext = Object.assign({}, context, { loading: isLoading, computedVariant }) as IButtonBaseContext<Context>;
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
            className={cn("group/btn btn relative  button select-text cursor-pointer", rippleContent ? "overflow-hidden" : "", classes.active2hoverState, allVariants({ disabled }), computedVariant.base(), className)}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityRole={accessibilityRole}
            accessibilityState={{ disabled }}
            accessible={accessible}
            disabled={disabled}
            onPress={typeof onPress === "function" ? (event: GestureResponderEvent) => {
                const r = onPress(event, buttonContext);
                return r;
            } : undefined}
        >
            <Div id={`${buttonId}-content`} testID={testID + "-button-content"} className={cn("button-content w-full flex flex-row items-center self-center", computedVariant.content?.(), contentClassName)}>
                <Div className={cn("button-left-container", rowClassName, computedVariant.leftContainer(), leftContainerClassName)} testID={testID + "-button-left-container"}>
                    {leftContent}
                    {iconPosition != "right" ? iconContent : null}
                    <Text
                        id={`${buttonId}-label`}
                        selectable={false}
                        testID={`${testID}-button-label`}
                        className={cn("button-label", computedVariant.label(), disabledClass, labelClassName)}
                    >
                        {isValidElement(children, true) && children || label}
                    </Text>
                </Div>
                {(hasRightContent) ? <Div testID={testID + "-right-content-wrapper"} id={`${buttonId}-right-content-wrapper`} className={cn("button-right-container", rowClassName, computedVariant.rightContainer(), rightContainerClassName)}>
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