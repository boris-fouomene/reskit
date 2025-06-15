"use client";
import { isNumber } from '@resk/core/utils';
import { useWindowDimensions } from 'react-native';

interface IUseBreakpointResult {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isMobileOrTablet: boolean;
    windowWidth: number;
    windowHeight: number;
}

interface IUseBreakpointOptions {
    mobileMaxWidth: number;
    tabletMaxWidth: number;
}

const DEFAULT_BREAKPOINTS: IUseBreakpointOptions = {
    mobileMaxWidth: 768,   // Up to 767px is mobileMaxWidth
    tabletMaxWidth: 1024,  // 768px to 1023px is tabletMaxWidth, 1024px+ is desktop
};

export const useBreakpoints = (options?: Partial<IUseBreakpointOptions>): IUseBreakpointResult => {
    const { width, height } = useWindowDimensions();

    const breakpoints = {
        ...DEFAULT_BREAKPOINTS,
        ...Object.assign({}, options),
    };
    breakpoints.mobileMaxWidth = isNumber(breakpoints.mobileMaxWidth) && breakpoints.mobileMaxWidth > 0 ? breakpoints.mobileMaxWidth : DEFAULT_BREAKPOINTS.mobileMaxWidth;
    breakpoints.tabletMaxWidth = isNumber(breakpoints.tabletMaxWidth) && breakpoints.tabletMaxWidth > 0 ? breakpoints.tabletMaxWidth : DEFAULT_BREAKPOINTS.tabletMaxWidth;
    const isMobile = width <= breakpoints.mobileMaxWidth;
    const isTablet = width > breakpoints.mobileMaxWidth && width <= breakpoints.tabletMaxWidth;
    const isDesktop = width > breakpoints.tabletMaxWidth;
    return {
        isMobile,
        isTablet,
        isDesktop,
        isMobileOrTablet: isMobile || isTablet,
        windowWidth: width,
        windowHeight: height,
    };
};