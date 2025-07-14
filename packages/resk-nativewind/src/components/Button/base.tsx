import { iconVariant } from "@variants/icon";
import { ActivityIndicator } from '@components/ActivityIndicator';
import { Surface } from '@components/Surface';
import { Text } from '@html/Text';
import { defaultStr, isNumber } from '@resk/core/utils';
import isValidElement from '@utils/isValidElement';
import { Divider } from '@components/Divider';
import { cn } from '@utils/cn';
import { Icon } from '@components/Icon';
import { Div } from '@html/Div';
import { buttonVariant } from "@variants/button";
import { IButtonBaseContext, IButtonProps } from "./types";
import { commonVariant } from "@variants/common";
import { GestureResponderEvent, PressableProps } from "react-native";
import { Auth } from '@resk/core/auth';
import { RippleContent } from "./RippleContent";
import Platform from "@platform";
import { useId } from "react";
//import { useId, useState } from "react";



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
    enableRipple,
    rippleClassName,
    context,
    perm,
    iconClassName,
    resourceName,
    onPress,
    rippleDuration,
    android_ripple,
    expandable,
    expanded: controlledExpanded,
    onExpandChange,
    //expandedIcon = "chevron-up",
    //collapsedIcon = "chevron-down",
    ...rest
}: IButtonProps<Context>) {
    const generatedId = useId();


    if (perm !== undefined && !Auth.isAllowed(perm)) return null;
    const buttonId = defaultStr(id, generatedId);
    testID = defaultStr(testID, "resk-button-base");
    const isLoading = !!customIsLoading;
    const disabled: boolean = !!customDisabled || isLoading;
    const divider = customDivider === true;
    const computedVariant = buttonVariant(variant);
    const iconSize = 18;
    iconProps = Object.assign({}, iconProps);

    // For expandable buttons, default icon position to right if not specified
    const effectiveIconPosition = expandable && !iconPosition ? "right" : iconPosition;
    const disabledClass = disabled && "pointer-events-none";
    iconProps.className = cn("button-icon", computedVariant.icon(), iconProps?.variant && iconVariant(iconProps.variant), disabledClass, iconClassName, iconProps.className);

    // Handle expandable icon logic
    //const finalIcon = expandable ? (expanded ? expandedIcon : collapsedIcon) : iconProp;
    //const icon = Icon.getIcon({ icon: finalIcon, size: iconSize, ...iconProps, variant: undefined });
    const icon = Icon.getIcon({ icon: iconProp, size: iconSize, ...iconProps, variant: undefined });
    const isAndroid = Platform.OS === 'android';
    const isRippleEnabled = (typeof enableRipple === "boolean" ? enableRipple : isAndroid) && !disabled;
    const canRenderRipple = isRippleEnabled && Platform.isWeb();
    const restProps = isAndroid && isRippleEnabled ? {
        android_ripple
    } : {};
    const iconContent = isLoading ? (
        <ActivityIndicator
            size={iconProps?.size || "small"}
            className={cn("button-indicator mx-[5px]", computedVariant.activityIndicator?.(), activityIndicatorClassName)}
            testID={testID + "-button-activity-indicator"}
        />
    ) : icon || null;
    const buttonContext = Object.assign({}, context, { loading: isLoading, computedVariant }) as IButtonBaseContext<Context>;

    /* const buttonContext = Object.assign({}, context, {
        loading: isLoading,
        disabled,
        computedVariant,
        expanded: expandable ? expanded : undefined
    }) as IButtonBaseContext<Context>; */
    const leftContent = typeof left === "function" ? left(buttonContext) : left;
    const rightContent = typeof right === "function" ? right(buttonContext) : right;
    const hasRightContent = isValidElement(right) && !!right;
    const rowClassName = cn("flex flex-row items-center self-center justify-center", disabledClass);

    // Handle expandable button press
    /* const handlePress = (event: GestureResponderEvent) => {
        if (expandable) {
            const newExpanded = !expanded;
            if (!isControlled) {
                setInternalExpanded(newExpanded);
            }
            if (onExpandChange) {
                onExpandChange(newExpanded);
            }
        }

        if (typeof onPress === "function") {
            return onPress(event, buttonContext);
        }
    }; */
    return (<>
        <Surface
            role="button"
            {...rest}
            {...restProps}
            id={buttonId}
            testID={`${testID}`}
            ref={ref}
            className={cn(canRenderRipple && "resk-btn-ripple", "group/btn btn relative resk-btn   button select-text cursor-pointer", commonVariant({ disabled }), computedVariant.base(), className)}
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
                    {effectiveIconPosition != "right" ? iconContent : null}
                    <Text
                        id={`${buttonId}-label`}
                        selectable={false}
                        testID={`${testID}-button-label`}
                        className={cn("button-label", computedVariant.label(), disabledClass, labelClassName)}
                    >
                        {isValidElement(children, true) && children || label}
                    </Text>
                </Div>
                {(hasRightContent || (expandable && effectiveIconPosition === "right")) ? <Div testID={testID + "-right-contentainer"} id={`${buttonId}-right-container`} className={cn("button-right-container", rowClassName, computedVariant.rightContainer(), rightContainerClassName)}>
                    {effectiveIconPosition == "right" ? iconContent : null}
                    {rightContent}
                </Div> : null}
            </Div>
            {canRenderRipple ? <RippleContent id={`${id}-ripple`} rippleDuration={rippleDuration} targetSelector={`#${id}`} className={cn("resk-ripple", computedVariant.ripple(), rippleClassName)} /> : null}
        </Surface>
        {divider ? <Divider id={buttonId + "-divider"} testID={testID + "-button-divider"} className={cn("button-divider", disabledClass, dividerClassName)} /> : null}
    </>);
};

ButtonBase.displayName = "Button.Base";