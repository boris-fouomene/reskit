"use client";
import { Dimensions, ScaledSize} from 'react-native';
import { Breakpoints } from './utils';
import { isNumber } from '@resk/core/utils';
import { IBreakpoints } from './types';
import useStateCallback from '@utils/stateCallback';
import { useEffect } from 'react';
import { isObj } from '@resk/core/utils';

const scaleSized = { width: 0, height: 0,fontScale:1, scale: 1 };
export const useBreakpoints = (options?: Partial<IBreakpoints>): IUseBreakpointResult => {
    const isClientSide = typeof window !== "undefined" && window ? true : false;
    const [dims, setDims] = useStateCallback<{window:ScaledSize,screen:ScaledSize}>(isClientSide ? 
    {window: Dimensions.get('window'),screen: Dimensions.get('screen'),} : {window : scaleSized,screen: scaleSized});
    const {window:{width,height}} = dims;
    useEffect(()=>{
        const r =  Dimensions.addEventListener('change', function onDimensionChanged(dims:{window: ScaledSize, screen: ScaledSize}) {
            if(isObj(dims)) {
                setDims({...dims})
            }
        });
        return () => {
          r?.remove();
        };
    },[]);
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
        ...dims,
        isClientSide,
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
    isClientSide: boolean;
}


