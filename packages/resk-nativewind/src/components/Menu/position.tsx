"use client";
import { isNonNullString, isNumber, isObj } from "@resk/core/utils";
import { IMenuCalculatedPosition, IMenuPosition, IUseMenuPositionProps } from "./types";
import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useDimensions } from "@utils/dimensions/hooks";
import Platform from "@platform";
import { IPercentage } from "@resk/core/types";

const MENU_MIN_WIDTH = 120;
export const useMenuPosition = ({
    position,
    visible,
    renderAsBottomSheetOnMobile,
    renderAsBottomSheetOnTablet,
    renderAsNavigationMenuOnMobile,
    renderAsNavigationMenuOnTablet,
    sameWidth,
    preferredPositionAxis,
    anchorMeasurements,
    menuWidth,
    menuHeight,
    minWidth: customMinWidth,
    minHeight: customMinHeight,
    maxHeight: customMaxHeight,
}: IUseMenuPositionProps) => {
    const padding = 0;
    const { window: { width: windowWidth, height: windowHeight }, isTablet, isMobile, ...rest } = useDimensions();
    const shouldRenderAsBottomSheet = isMobile && renderAsBottomSheetOnMobile || isTablet && renderAsBottomSheetOnTablet;
    const shouldRenderAsNavigationMenu = isMobile && renderAsNavigationMenuOnMobile || isTablet && renderAsNavigationMenuOnTablet;
    const computedMinWidth = computWidthOrHeight(windowWidth, customMinWidth);
    const computedMinHeight = computWidthOrHeight(windowHeight, customMinHeight);
    const computedMaxHeight = Math.max(computWidthOrHeight(windowHeight, customMaxHeight), 0, computedMinHeight);
    const calculatePosition = useCallback((): IMenuCalculatedPosition => {
        const isValidPosition = position && ["top", "left", "bottom", "right"].includes(String(position));
        let calculatedPosition: IMenuCalculatedPosition = {
            computedPlacement: "bottom",
            xPlacement: "left",
            yPlacement: "top",
            left: 0,
            top: 0,
        };
        // Handle null measurements, fullscreen mode, or navigation menu
        if (!isObj(anchorMeasurements) || !anchorMeasurements || shouldRenderAsBottomSheet || shouldRenderAsNavigationMenu) {
            if (shouldRenderAsNavigationMenu) {
                // Navigation menu positioning - typically slides in from left or right
                const navMenuWidth = Math.min(windowWidth * 0.85, 320); // Max 85% of screen width or 320px
                const preferredSide = anchorMeasurements?.pageX && anchorMeasurements.pageX > windowWidth / 2 ? "right" : "left";

                calculatedPosition.height = windowHeight;
                calculatedPosition.width = navMenuWidth;
                calculatedPosition.computedPlacement = preferredSide;
                calculatedPosition.xPlacement = preferredSide;
                calculatedPosition.yPlacement = "top";
                calculatedPosition.top = 0;
                calculatedPosition.bottom = undefined;

                if (preferredSide === "left") {
                    calculatedPosition.left = 0;
                    calculatedPosition.right = undefined;
                } else {
                    calculatedPosition.left = undefined;
                    calculatedPosition.right = 0;
                }
            } else {
                // Bottom sheet or no anchor measurements
                calculatedPosition.height = windowHeight;
                calculatedPosition.width = windowWidth;
            }
        } else {
            const { pageX: pX, pageY: pY, width: anchorWidth, height: anchorHeight } = anchorMeasurements;
            const pageX = Math.max(0, pX), pageY = Math.max(0, pY);
            let minWidth = Math.max((isNumber(computedMinWidth) && computedMinWidth > 0 ? computedMinWidth : anchorWidth), MENU_MIN_WIDTH);
            if (anchorWidth <= windowWidth - pageX) {
                minWidth = Math.max(minWidth, anchorWidth);
            }
            menuHeight = (typeof menuHeight == 'number' && menuHeight > 0 ? menuHeight : 0);
            const minMenuWidth = Math.max(minWidth, anchorWidth, 50);
            if (sameWidth) {
                menuWidth = minMenuWidth;
            } else {
                menuWidth = Math.max(minWidth, menuWidth);
            }
            menuWidth = Math.max(minWidth, Math.min(menuWidth, windowWidth > padding ? windowWidth - padding : windowWidth));
            // Calculate available space in each direction
            const spaces = {
                top: pageY,
                bottom: Math.max(0, windowHeight - (pageY + anchorHeight)),
                left: pageX,
                right: Math.max(0, windowWidth - (pageX + anchorWidth)),
            };
            const isPreferedHorizontal = preferredPositionAxis == "horizontal";
            const isPreferedVertical = preferredPositionAxis == "vertical";
            const maxVerticalSpace = Math.max(spaces.top, spaces.bottom);
            const maxHorizontalSpace = Math.max(spaces.left, spaces.right);
            const isMaxVerticalSpaceTop = maxVerticalSpace === spaces.top;
            const isMaxVerticalSpaceBottom = maxVerticalSpace === spaces.bottom;
            const isMaxHorizontalSpaceLeft = maxHorizontalSpace === spaces.left;
            const canUseAnchorSpace = menuWidth <= spaces.right + anchorWidth;
            const isMaxHorizontalSpaceRight = maxHorizontalSpace === spaces.right;
            const hasMenuHeight = menuHeight >= 50;
            const maxHorizontalPosition = isMaxHorizontalSpaceLeft ? "left" : "right";
            const maxVerticalPosition = isMaxVerticalSpaceTop ? "top" : "bottom";
            const defaultPreferedPosition = isPreferedHorizontal ? (isMaxHorizontalSpaceLeft ? "left" : "right") : (isPreferedVertical ? (isMaxVerticalSpaceTop ? "top" : "bottom") : ((hasMenuHeight || !isMaxVerticalSpaceTop ? "bottom" : "top")));
            const spacesPos = isPreferedHorizontal ? ["left", "right"] : isPreferedVertical ? ["bottom", "top"] : ["bottom", "left", "top", "right"];
            // Find position with maximum available space
            const preferredPosition: IMenuPosition = isValidPosition && position ? position : spacesPos.reduce((max, pos) =>
                spaces[pos as IMenuPosition] > spaces[max as IMenuPosition] ? pos as IMenuPosition : max
                , defaultPreferedPosition as IMenuPosition) as IMenuPosition;
            const checkFits = (pos: IMenuCalculatedPosition) => ({
                top: isMaxVerticalSpaceTop,
                bottom: hasMenuHeight && isNumber(pos.top) && (pos.top + menuHeight <= windowHeight - padding) || isMaxVerticalSpaceBottom,// (pos.top + menuHeight <= windowHeight - padding),
                left: isMaxHorizontalSpaceLeft,//(pos.left >= padding),// && isMaxHorizontalSpaceLeft,
                right: isNumber(pos.left) && (pos.left + menuWidth <= windowWidth - padding) || isMaxHorizontalSpaceRight,// ,// && isMaxHorizontalSpaceRight,
            });
            let maxHeight = Math.max(spaces.top - 50, spaces.bottom - 50);
            if ((isNumber(computedMaxHeight) && computedMaxHeight > 0)) {
                if (computedMaxHeight >= windowHeight * 0.45) {
                    maxHeight = Math.min(computedMaxHeight, maxHeight);
                } else if (computedMaxHeight < 200) {
                    maxHeight = computedMaxHeight;
                }
            }
            if (maxHeight > windowHeight) {
                maxHeight = windowHeight;
            }
            const rProps: Partial<IMenuCalculatedPosition> = maxHeight > 50 ? {
                // height: maxHeight,
            } : {};
            if (sameWidth) {
                rProps.width = minMenuWidth;
            }
            const bottom = spaces.bottom + anchorHeight + (Platform.isNative() ? -20 : 0),
                top = pageY + anchorHeight;
            const positions: Record<IMenuPosition, IMenuCalculatedPosition> = {
                top: {
                    ...rProps,
                    computedPlacement: "top",
                    top: undefined,// pageY - menuHeight,
                    bottom,
                    left: canUseAnchorSpace ? pageX : isMaxHorizontalSpaceLeft ? undefined : pageX,
                    right: canUseAnchorSpace ? undefined : isMaxHorizontalSpaceLeft ? spaces.right : undefined,
                    yPlacement: 'top',
                    xPlacement: maxHorizontalPosition,
                    maxHeight: spaces.top,
                },
                bottom: {
                    ...rProps,
                    computedPlacement: "bottom",
                    top,
                    bottom: undefined,
                    left: canUseAnchorSpace ? pageX : isMaxHorizontalSpaceLeft ? undefined : pageX,
                    right: canUseAnchorSpace ? undefined : isMaxHorizontalSpaceLeft ? spaces.right : undefined,
                    yPlacement: 'bottom',
                    xPlacement: maxHorizontalPosition,
                    maxHeight: spaces.bottom,
                },
                /***
                 * in case the menu will appear on the left side
                 */
                left: {
                    ...rProps,
                    computedPlacement: "left",
                    xPlacement: 'left',
                    yPlacement: maxVerticalPosition,
                    left: undefined,//Math.max(0, pageX + anchorWidth - padding),
                    right: spaces.right,
                    top: isMaxVerticalSpaceBottom ? top : undefined,// - (menuHeight / 2),
                    bottom: isMaxVerticalSpaceBottom ? undefined : bottom,
                    maxHeight: isMaxVerticalSpaceBottom ? spaces.bottom : spaces.top,
                },
                right: {
                    ...rProps,
                    computedPlacement: "right",
                    left: pageX,// + anchorWidth,
                    right: undefined,
                    top: isMaxVerticalSpaceBottom ? top : undefined,// + (anchorHeight / 2),// - (menuHeight / 2),
                    bottom: isMaxVerticalSpaceBottom ? undefined : bottom,
                    xPlacement: 'right',
                    yPlacement: maxVerticalPosition,
                    maxHeight: isMaxVerticalSpaceBottom ? spaces.bottom : spaces.top,
                }
            };
            position = preferredPosition;
            let bestPosition = positions[preferredPosition];

            // Check if preferred position fits
            const preferredFits = checkFits(bestPosition);
            const toCheck = preferredPositionAxis == "horizontal" ? ["left", "right"] : preferredPositionAxis == "vertical" ? ["bottom", "top"] : ["bottom", "left", "top", "right"];
            // If preferred position doesn't fit, try alternatives
            if (!Object.values(preferredFits).every(fit => fit)) {
                const alternatives: IMenuPosition[] = toCheck as IMenuPosition[];
                for (const pos of alternatives) {
                    const alternative = positions[pos];
                    const altFits = checkFits(alternative);
                    if (Object.values(altFits).every(fit => fit)) {
                        bestPosition = alternative;
                        position = pos;
                        break;
                    }
                }
            }
            calculatedPosition = bestPosition;
        }
        return calculatedPosition;
    }, [anchorMeasurements?.width, shouldRenderAsBottomSheet, shouldRenderAsNavigationMenu, computedMaxHeight, anchorMeasurements?.height, anchorMeasurements?.pageX, anchorMeasurements?.pageY, sameWidth, computedMinWidth, visible, menuWidth, menuHeight, padding, position, windowWidth, windowHeight]);
    const menuPosition = calculatePosition();
    const menuAnchorStyle = useMemo(() => {
        if (!isNumber(anchorMeasurements?.width)) return {};
        const { width, pageX } = anchorMeasurements;
        if (sameWidth) return { width };
        if (isNumber(pageX) && windowWidth >= pageX + width) return { minWidth: width };
        return {};
    }, [anchorMeasurements?.width, sameWidth, visible, windowWidth]);
    const sizeToRemove = useMemo(() => {
        return {
            height: position === "top" ? anchorMeasurements?.height || 0 : 0,
            width: position === "right" ? anchorMeasurements?.width || 0 : 0,
        }
    }, [anchorMeasurements?.width, anchorMeasurements?.height, position, menuPosition]);
    const touchableBackdropStyle = useMemo(() => {
        if (shouldRenderAsNavigationMenu) {
            // Navigation menu should not have backdrop size restrictions
            return {
                maxWidth: windowWidth,
                maxHeight: windowHeight,
            };
        }
        return {
            maxWidth: windowWidth - (shouldRenderAsBottomSheet ? 0 : Math.max(sizeToRemove.width, 10)),
            maxHeight: windowHeight - (shouldRenderAsBottomSheet ? 0 : Math.max(sizeToRemove.height, 10)),
        }
    }, [menuPosition, shouldRenderAsBottomSheet, shouldRenderAsNavigationMenu, windowWidth, windowHeight, sizeToRemove.width, sizeToRemove.height]);
    const { xPlacement, computedPlacement, yPlacement, ...positionStyle } = menuPosition;

    // Navigation menu specific properties
    const navigationMenuSide: 'left' | 'right' | undefined = shouldRenderAsNavigationMenu ? (menuPosition.computedPlacement === "right" ? "right" : "left") : undefined;
    const navigationMenuWidth = shouldRenderAsNavigationMenu ? menuPosition.width : undefined;

    return {
        calculatePosition,
        menuPosition,
        windowWidth,
        windowHeight,
        isTablet,
        isMobile,
        shouldRenderAsBottomSheet,
        shouldRenderAsNavigationMenu,
        navigationMenuSide,
        navigationMenuWidth,
        computedMinWidth,
        computedMinHeight,
        computedMaxHeight,
        ...rest,
        menuStyle: StyleSheet.flatten({
            ...touchableBackdropStyle,
            ...(!shouldRenderAsBottomSheet && !shouldRenderAsNavigationMenu ? {
                ...menuAnchorStyle,
                ...positionStyle,
            } : shouldRenderAsNavigationMenu ? {
                // Navigation menu specific styles
                ...positionStyle,
            } : {}),
        }),
    };
};

const computWidthOrHeight = (widthOrHeight: number, value?: number | IPercentage) => {
    if (isNumber(value)) {
        return value;
    }
    if (isNonNullString(value) && value.trim().endsWith("%")) {
        const v = widthOrHeight * (parseFloat(value.trim().replace("%", "")) / 100);
        return v;
    }
    return 0;
}