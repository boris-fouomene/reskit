"use client";
import { useWindowDimensions } from 'react-native';
import { Breakpoints } from './utils';
import { isNumber } from '@resk/core/utils';
import { IBreakpoints } from './types';
export const useBreakpoints = (options?: Partial<IBreakpoints>): IUseBreakpointResult => {
    const { width, height } = useWindowDimensions();
    const breakpoints = {
        mobileMaxWidth: Breakpoints.mobileMaxWidth,
        tabletMaxWidth: Breakpoints.tabletMaxWidth,
        ...Object.assign({}, options),
    };
    breakpoints.mobileMaxWidth = isNumber(breakpoints.mobileMaxWidth) && breakpoints.mobileMaxWidth > 0 ? breakpoints.mobileMaxWidth : Breakpoints.mobileMaxWidth;
    breakpoints.tabletMaxWidth = isNumber(breakpoints.tabletMaxWidth) && breakpoints.tabletMaxWidth > 0 ? breakpoints.tabletMaxWidth : Breakpoints.tabletMaxWidth;
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

interface IUseBreakpointResult {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isMobileOrTablet: boolean;
    windowWidth: number;
    windowHeight: number;
}


