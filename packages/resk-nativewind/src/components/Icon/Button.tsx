"use client";
import { ActivityIndicator } from '@components/ActivityIndicator';
import { Surface } from '@components/Surface';
import FontIcon from "./Font";
import { defaultStr, isNumber } from '@resk/core/utils';
import { IIconButtonProps } from './types';
import Icon from "./Icon";
import { cn } from '@utils/cn';

const PADDING = 8;

export default function IconButton(
    {
        size,
        disabled,
        style,
        testID,
        isLoading = false,
        iconName,
        source,
        containerClassName,
        containerSize,
        className,
        ref,
        ...rest
    }: IIconButtonProps) {
    testID = defaultStr(testID, "resk-icon-button");
    size = isNumber(size) ? size : FontIcon.DEFAULT_SIZE;
    containerSize = isNumber(containerSize) && containerSize > size ? containerSize : (size + 2 * PADDING);
    return (
        <Surface
            testID={`${testID}-container`}
            className={cn("overflow-hidden align-center justify-center flex flex-col", containerClassName)}
            style={{
                width: containerSize,
                height: containerSize,
                borderRadius: containerSize / 2,
            }}
            ref={ref}
        >
            {isLoading ? <ActivityIndicator size={size} /> : Icon.getIcon({
                ...rest,
                className: cn("self-center", className),
                containerClassName: cn("self-center"),
                style,
                icon: source || iconName || undefined,
                testID,
                disabled,
                size,
            })}
        </Surface>
    );
};
IconButton.displayName = 'Icon.Button';

