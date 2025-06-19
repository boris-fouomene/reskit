"use client";
import { Dimensions, ScaledSize } from 'react-native';
import { Breakpoints } from './utils';
import { isNumber } from '@resk/core/utils';
import { IBreakpoints } from './types';
import useStateCallback from '@utils/stateCallback';
import { useEffect } from 'react';
import { isObj } from '@resk/core/utils';
import { getInitialHydrationStatus } from '@utils/useHydrated';

const scaleSized = { width: 0, height: 0, fontScale: 1, scale: 1 };
export const useBreakpoints = (options?: Partial<IBreakpoints>): IUseBreakpointResult => {
    const isHydrated = getInitialHydrationStatus();
    const [state, setState] = useStateCallback<{ window: ScaledSize, screen: ScaledSize, isHydrated: boolean }>(isHydrated ?
        { window: Dimensions.get('window'), screen: Dimensions.get('screen'), isHydrated } : { window: scaleSized, screen: scaleSized, isHydrated: false });
    const { window: { width } } = state;
    useEffect(() => {
        const r = Dimensions.addEventListener('change', function onDimensionChanged(newState) {
            if (isObj(newState) && (newState.window.width !== state.window.width || newState.window.height !== state.window.height)) {
                setState({ ...newState, isHydrated: true })
            }
        });
        if (!isHydrated) {
            setState({ ...state, window: Dimensions.get('window'), screen: Dimensions.get('screen'), isHydrated: true })
        }
        return () => {
            r?.remove();
        };
    }, []);
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
        ...state,
        isMobile,
        isTablet,
        isDesktop,
        isMobileOrTablet: isMobile || isTablet,
    };
};

interface IUseBreakpointResult {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isMobileOrTablet: boolean;
    window: ScaledSize;
    screen: ScaledSize;
    isHydrated: boolean;
}


