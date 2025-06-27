"use client";
import { isNumber, isObj } from "@resk/core/utils";
import { IMenuCalculatedPosition, IMenuPosition, IUseMenuPositionProps } from "./types";
import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useBreakpoints } from "@utils/breakpoints/hooks";

const MENU_MIN_WIDTH = 120;
export const useMenuPosition = ({
    position,
    visible,
    fullScreenOnMobile,
    fullScreenOnTablet,
    sameWidth,
    preferedPositionAxis,
    anchorMeasurements,
    minWidth,
    menuWidth,
    menuHeight,
    maxHeight: customMaxHeight,
}: IUseMenuPositionProps) => {
    const padding = 0;
    const { window: { width: windowWidth, height: windowHeight }, isTablet, isMobile, ...rest } = useBreakpoints();
    const fullScreen = !!(isMobile && fullScreenOnMobile || isTablet && fullScreenOnTablet);
    const calculatePosition = useCallback((): IMenuCalculatedPosition => {
        const isValidPosition = position && ["top", "left", "bottom", "right"].includes(String(position));
        let calculatedPosition: IMenuCalculatedPosition = {
            computedPlacement: "bottom",
            xPosition: "left",
            yPosition: "top",
            left: 0,
            top: 0,
        };
        // Handle null measurements or fullscreen mode
        if (!isObj(anchorMeasurements) || !anchorMeasurements || fullScreen) {
            calculatedPosition.height = windowHeight;
            calculatedPosition.width = windowWidth;
        } else {
            const { pageX: pX, pageY: pY, width: anchorWidth, height: anchorHeight } = anchorMeasurements;
            const pageX = Math.max(0, pX), pageY = Math.max(0, pY);
            minWidth = Math.max(typeof minWidth == 'number' && minWidth > 0 ? minWidth : anchorWidth, MENU_MIN_WIDTH);
            if (anchorWidth <= windowWidth - pageX) {
                minWidth = Math.max(minWidth, anchorWidth);
            }
            menuHeight = (typeof menuHeight == 'number' && menuHeight > 0 ? menuHeight : 0);
            const minMenuWidth = Math.max(minWidth, anchorWidth);
            if (sameWidth) {
                menuWidth = Math.max(minWidth, anchorWidth);
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
            const isPreferedHorizontal = preferedPositionAxis == "horizontal";
            const isPreferedVertical = preferedPositionAxis == "vertical";
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
            if ((isNumber(customMaxHeight))) {
                if (customMaxHeight >= windowHeight * 0.45) {
                    maxHeight = Math.min(customMaxHeight, maxHeight);
                } else if (customMaxHeight < 200) {
                    maxHeight = customMaxHeight;
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
            const bottom = spaces.bottom + anchorHeight,
                top = pageY + anchorHeight;
            const positions: Record<IMenuPosition, IMenuCalculatedPosition> = {
                top: {
                    ...rProps,
                    computedPlacement: "top",
                    top: undefined,// pageY - menuHeight,
                    bottom,
                    left: canUseAnchorSpace ? pageX : isMaxHorizontalSpaceLeft ? undefined : pageX,
                    right: canUseAnchorSpace ? undefined : isMaxHorizontalSpaceLeft ? spaces.right : undefined,
                    yPosition: 'top',
                    xPosition: maxHorizontalPosition,
                    maxHeight: spaces.top,
                },
                bottom: {
                    ...rProps,
                    computedPlacement: "bottom",
                    top,
                    bottom: undefined,
                    left: canUseAnchorSpace ? pageX : isMaxHorizontalSpaceLeft ? undefined : pageX,
                    right: canUseAnchorSpace ? undefined : isMaxHorizontalSpaceLeft ? spaces.right : undefined,
                    yPosition: 'bottom',
                    xPosition: maxHorizontalPosition,
                    maxHeight: spaces.bottom,
                },
                /***
                 * in case the menu will appear on the left side
                 */
                left: {
                    ...rProps,
                    computedPlacement: "left",
                    xPosition: 'left',
                    yPosition: maxVerticalPosition,
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
                    xPosition: 'right',
                    yPosition: maxVerticalPosition,
                    maxHeight: isMaxVerticalSpaceBottom ? spaces.bottom : spaces.top,
                }
            };
            position = preferredPosition;
            let bestPosition = positions[preferredPosition];

            // Check if preferred position fits
            const preferredFits = checkFits(bestPosition);
            const toCheck = preferedPositionAxis == "horizontal" ? ["left", "right"] : preferedPositionAxis == "vertical" ? ["bottom", "top"] : ["bottom", "left", "top", "right"];
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
    }, [anchorMeasurements?.width, fullScreen, customMaxHeight, anchorMeasurements?.height, anchorMeasurements?.pageX, anchorMeasurements?.pageY, sameWidth, minWidth, visible, menuWidth, menuHeight, padding, position, windowWidth, windowHeight]);
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
        return {
            maxWidth: windowWidth - (fullScreen ? 0 : Math.max(sizeToRemove.width, 10)),
            maxHeight: windowHeight - (fullScreen ? 0 : Math.max(sizeToRemove.height, 10)),
        }
    }, [menuPosition, fullScreen, windowWidth, windowHeight, sizeToRemove.width, sizeToRemove.height]);
    const { xPosition, computedPlacement, yPosition, ...positionStyle } = menuPosition;
    return {
        calculatePosition,
        menuPosition,
        windowWidth,
        windowHeight,
        fullScreen,
        isTablet,
        isMobile,
        ...rest,
        menuStyle: StyleSheet.flatten({
            ...touchableBackdropStyle,
            ...(!fullScreen ? {
                ...menuAnchorStyle,
                ...positionStyle,
            } : {}),
        }),
    };
};
