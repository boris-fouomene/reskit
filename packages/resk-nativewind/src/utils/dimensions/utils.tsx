import { isNumber } from '@resk/core/utils';
import { IBreakpoints } from './types';
import { Dimensions } from 'react-native';

export class Breakpoints {
    static mobileMaxWidth: number = 768;
    static tabletMaxWidth: number = 1024;
    static update(options: Partial<IBreakpoints>) {
        options = Object.assign({}, options);
        if (isNumber(options.mobileMaxWidth) && options.mobileMaxWidth > 0) Breakpoints.mobileMaxWidth = options.mobileMaxWidth;
        if (isNumber(options.tabletMaxWidth) && options.tabletMaxWidth > 0) Breakpoints.tabletMaxWidth = options.tabletMaxWidth;
    }
    static getDeviceLayout(options?: Partial<IBreakpoints> & { windowWidth: number }) {
        const { windowWidth, mobileMaxWidth, tabletMaxWidth } = Object.assign({}, options);
        const breakpoints = {
            mobileMaxWidth: isNumber(mobileMaxWidth) && mobileMaxWidth > 0 ? mobileMaxWidth : Breakpoints.mobileMaxWidth,
            tabletMaxWidth: isNumber(tabletMaxWidth) && tabletMaxWidth > 0 ? tabletMaxWidth : Breakpoints.tabletMaxWidth,
        };
        const width = isNumber(windowWidth) && windowWidth > 0 ? windowWidth : Dimensions.get('window').width;
        const isMobile = width <= breakpoints.mobileMaxWidth, isTablet = width <= breakpoints.mobileMaxWidth;
        return {
            isMobile,
            isTablet,
            isDesktop: width > breakpoints.tabletMaxWidth,
            isMobileOrTablet: isMobile || isTablet,
            windowWidth,
            mobileMaxWidth,
            tabletMaxWidth,
            height: Dimensions.get('window').height,
        }
    }
}