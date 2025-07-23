import { isNumber } from '@resk/core/utils';
import { IBreakpoints } from './types';
import { Dimensions } from 'react-native';

export class Breakpoints {
    /***
     * 
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
     */
    static mobileMaxWidth: number = 768;
    static tabletMaxWidth: number = 1024;
    static update(options: Partial<IBreakpoints>) {
        options = Object.assign({}, options);
        if (isNumber(options.mobileMaxWidth) && options.mobileMaxWidth > 0) Breakpoints.mobileMaxWidth = options.mobileMaxWidth;
        if (isNumber(options.tabletMaxWidth) && options.tabletMaxWidth > 0) Breakpoints.tabletMaxWidth = options.tabletMaxWidth;
    }
    static getDeviceLayout(options?: Partial<IBreakpoints> & { viewportWidth: number }) {
        const { viewportWidth, mobileMaxWidth, tabletMaxWidth } = Object.assign({}, options);
        const breakpoints = {
            mobileMaxWidth: isNumber(mobileMaxWidth) && mobileMaxWidth > 0 ? mobileMaxWidth : Breakpoints.mobileMaxWidth,
            tabletMaxWidth: isNumber(tabletMaxWidth) && tabletMaxWidth > 0 ? tabletMaxWidth : Breakpoints.tabletMaxWidth,
        };
        const windowWidth = Dimensions.get('window').width;
        const width = isNumber(viewportWidth) && viewportWidth > 0 ? viewportWidth : windowWidth;
        const isMobile = width <= breakpoints.mobileMaxWidth, isTablet = width <= breakpoints.mobileMaxWidth;
        return {
            isMobile,
            isTablet,
            isDesktop: width > breakpoints.tabletMaxWidth,
            isMobileOrTablet: isMobile || isTablet,
            mobileMaxWidth,
            tabletMaxWidth,
            windowWidth,
            viewportWidth: width,
            windowHeight: Dimensions.get('window').height,
        }
    }
}