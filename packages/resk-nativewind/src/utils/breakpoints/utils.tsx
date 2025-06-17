import { isNumber } from '@resk/core/utils';
import { IBreakpoints } from './types';

export class Breakpoints {
    static mobileMaxWidth: number = 768;
    static tabletMaxWidth: number = 1024;
    static update(options: Partial<IBreakpoints>) {
        options = Object.assign({}, options);
        if (isNumber(options.mobileMaxWidth) && options.mobileMaxWidth > 0) Breakpoints.mobileMaxWidth = options.mobileMaxWidth;
        if (isNumber(options.tabletMaxWidth) && options.tabletMaxWidth > 0) Breakpoints.tabletMaxWidth = options.tabletMaxWidth;
    }
}