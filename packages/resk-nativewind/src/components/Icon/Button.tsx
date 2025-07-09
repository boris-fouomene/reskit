import { ActivityIndicator } from '@components/ActivityIndicator';
import FontIcon from "./Font";
import { defaultStr, isNonNullString, isNumber } from '@resk/core/utils';
import { IIconButtonProps } from './types';
import Icon from "./Icon";
import { cn } from '@utils/cn';
import { pickTouchableProps } from '@utils/touchHandler';
import { iconButtonVariant } from '@variants/iconButton';
import { isValidElement } from 'react';
import { Tooltip } from '@components/Tooltip';

const PADDING = 8;

/**
 * A functional component that renders an icon button with customizable properties.
 * It supports loading states and can display either a font icon or an image icon.
 *
 * @param {IIconButtonProps} props - The properties to configure the IconButton.
 * @param {number} [props.size] - The size of the icon to display.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {object} [props.style] - The custom styles to apply to the icon.
 * @param {string} [props.testID] - Optional test identifier for the button.
 * @param {boolean} [props.isLoading=false] - Indicates if a loading spinner should be shown instead of the icon.
 * @param {string} [props.fontIconName] - The name of the font icon to display.
 * @param {object} [props.source] - The image source for the icon.
 * @param {string} [props.containerClassName] - Additional class names for the button container.
 * @param {number} [props.containerSize] - The size of the button container.
 * @param {string} [props.className] - Additional class names for the icon.
 * @param {React.Ref} [props.ref] - A reference to the button container.
 * @param {object} [props.rest] - Additional properties passed to the icon component.
 *
 * @returns {JSX.Element} The rendered IconButton component.
 */
export default function IconButton(
    {
        size,
        disabled,
        style,
        testID,
        isLoading = false,
        fontIconName,
        source,
        variant: buttonVariant,
        containerClassName,
        containerSize,
        className,
        ref,
        children,
        ...rest
    }: IIconButtonProps) {
    testID = defaultStr(testID, "resk-icon-button");
    size = isNumber(size) ? size : FontIcon.DEFAULT_SIZE;
    const computedVariant = iconButtonVariant(buttonVariant);
    const { touchableProps, ...restProps } = pickTouchableProps(rest);
    containerSize = isNumber(containerSize) && containerSize > size ? containerSize : (size + 2 * PADDING);
    return (
        <Tooltip
            testID={`${testID}-container`}
            disabled={disabled}
            className={cn("overflow-hidden align-center items-center justify-center flex flex-col", computedVariant.container(), containerClassName)}
            style={isNonNullString(buttonVariant?.size) ? {
                flexShrink: 0,
                flexGrow: 0,
            } : {
                width: containerSize,
                height: containerSize,
                flexShrink: 0,
                flexGrow: 0,
            }}
            ref={ref}
            {...touchableProps}
        >
            <>
                {isLoading ? <ActivityIndicator className={cn("self-center")} size={size} /> : Icon.getIcon({
                    ...restProps,
                    className: cn("self-center", disabled && "pointer-events-none", computedVariant?.icon?.(), className),
                    style,
                    icon: source || fontIconName || undefined,
                    testID,
                    size,
                }) || (isValidElement(children) ? children : null)}
            </>
        </Tooltip>
    );
};
IconButton.displayName = 'Icon.Button';

