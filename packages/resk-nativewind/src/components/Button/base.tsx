import { iconVariant } from "@variants/icon";
import { ActivityIndicator } from '@components/ActivityIndicator';
import { Surface } from '@components/Surface';
import { Text } from '@html/Text';
import { defaultStr } from '@resk/core/utils';
import isValidElement from '@utils/isValidElement';
import { Divider } from '@components/Divider';
import { cn } from '@utils/cn';
import { Icon } from '@components/Icon';
import { Div } from '@html/Div';
import { buttonVariant } from "@variants/button";
import { IButtonContext, IButtonProps } from "./types";
import { commonVariant } from "@variants/common";
import { GestureResponderEvent } from "react-native";
import { Auth } from '@resk/core/auth';
import { RippleContent } from "./RippleContent";
import Platform from "@platform";


export function Button<Context = unknown>({
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
    ...rest
}: IButtonProps<Context>) {
    if (perm !== undefined && !Auth.isAllowed(perm)) return null;
    const buttonId = defaultStr(id);
    testID = defaultStr(testID, "resk-button-base");
    const isLoading = !!customIsLoading;
    const disabled: boolean = !!customDisabled || isLoading;
    const divider = customDivider === true;
    const computedVariant = buttonVariant(variant);
    const iconSize = 18;
    iconProps = Object.assign({}, iconProps);

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
    const buttonContext: IButtonContext<Context> = Object.assign({}, context, { disabled, loading: isLoading, computedVariant });
    const leftContent = typeof left === "function" ? left(buttonContext) : left;
    const rightContent = typeof right === "function" ? right(buttonContext) : right;
    const hasRightContent = isValidElement(right) && !!right;
    const rowClassName = cn("flex flex-row items-center self-center justify-center", disabledClass);
    const displayIconAtRight = iconPosition == "right";
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
                return onPress(event, buttonContext);
            } : undefined}
        >
            <Div id={buttonId ? `${buttonId}-content` : undefined} testID={testID + "-button-content"} className={cn("button-content w-full flex flex-row items-center self-center", computedVariant.content?.(), contentClassName)}>
                <Div className={cn("button-left-container", rowClassName, computedVariant.leftContainer(), leftContainerClassName)} testID={testID + "-button-left-container"}>
                    {leftContent}
                    {!displayIconAtRight ? iconContent : null}
                    <Text
                        id={buttonId ? `${buttonId}-label` : undefined}
                        selectable={false}
                        testID={`${testID}-button-label`}
                        className={cn("button-label", computedVariant.label(), disabledClass, labelClassName)}
                    >
                        {isValidElement(children, true) && children || label}
                    </Text>
                </Div>
                {(hasRightContent || (displayIconAtRight)) ? <Div testID={testID + "-right-contentainer"} id={buttonId ? `${buttonId}-right-container` : undefined} className={cn("button-right-container", rowClassName, computedVariant.rightContainer(), rightContainerClassName)}>
                    {displayIconAtRight ? iconContent : null}
                    {rightContent}
                </Div> : null}
            </Div>
            {canRenderRipple ? <RippleContent id={buttonId ? `${id}-ripple` : undefined} rippleDuration={rippleDuration} targetSelector={`.resk-btn-ripple`} className={cn("resk-ripple", computedVariant.ripple(), rippleClassName)} /> : null}
        </Surface>
        {divider ? <Divider id={buttonId ? buttonId + "-divider" : undefined} testID={testID + "-button-divider"} className={cn("button-divider", disabledClass, dividerClassName)} /> : null}
    </>);
};

Button.displayName = "Button.Base";