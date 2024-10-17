// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { getCurrentMedia } from '../dimensions';
import breakpoints from "../dimensions/breakpoints";
import { Dimensions } from 'react-native';
import { IStyle } from '../types';
import { isObj, IDict } from '@resk/core';


const canBeNumber = function isNumeric(value: any): boolean {
    if (typeof value !== "string") return false;
    return /^-?\d+$/.test(value);
}


let colWidth = 100 / 12;
export const medias = {
    sp: 3,//maxWidth = 320
    mp: 4, //maxWidth = 399
    xs: 5,//575, // Small devices (landscape phones, 576px and up)
    sm: 6,//767,// Medium devices (tablets, 768px and up)
    md: 7,//1024,,
    lg: 8,//1199, // Extra large devices (large desktops, 1200px and up)
}

const isNumber = (value: any) => typeof value === 'number';

function rowCol(width?: number) {
    const winWidth = Dimensions.get("window").width;
    const hasWidth = isNumber(width) && Math.abs((width as number) - winWidth) > 10 && (width as number) > MIN_WIDTH ? true : false;
    width = hasWidth ? width : winWidth;
    let cMedia = breakpoints.current && breakpoints.current.name ? breakpoints.current.name : undefined;
    let currentMedia: string = "lg";
    if (cMedia == "xl") cMedia = "lg";
    if (!hasWidth && cMedia && medias[cMedia]) {
        currentMedia = cMedia;
    } else {
        currentMedia = (hasWidth || !cMedia ? getCurrentMedia(width) : cMedia) || "lg";
    }
    let gutter = medias[currentMedia as keyof typeof medias];
    if (!isNumber(gutter)) {
        gutter = 0;
    }
    return {
        row: { flexDirection: 'row', flexWrap: 'wrap', marginRight: -1 * gutter, gutter, currentMedia },
        col: { paddingRight: gutter * 1.8, gutter, currentMedia },
    }
}

const MIN_WIDTH = 300;

const getWidth = (width?: number) => {
    const _width = Dimensions.get("window").width;
    if (typeof width == 'number' && width > MIN_WIDTH && width < (_width - 100)) {
        return width;
    }
    return _width;
}


/**
 * Determines the appropriate styles for a column based on the current screen dimensions.
 * This function interprets the provided media queries and calculates the column width accordingly.
 * 
 * Example usage:
 * ```typescript
 * const columnStyle = col("md-5 xs-3 lg-8 sm-10");
 * console.log(columnStyle.width); // Outputs the width of the column based on the screen size.
 * ```
 * 
 * @param {string} mediaQuery - The media queries to use for column subdivision. 
 * Default: "col-4 phone-12 tablet-6 desktop-4".
 * 
 * @param {number} width - The size of the window (optional). If not provided, the current window size is used.
 * 
 * @param {boolean} withMultiplicater - Whether to return the multiplicater used for the column calculation.
 * 
 * @returns {IDict} An object containing the computed styles for the column, including width and any additional styles.
 */
function col(mediaQuery: string = "col-4 phone-12 tablet-6 desktop-4", width?: number, withMultiplicater?: boolean) {
    width = getWidth(width ? width : undefined);
    let { gutter, currentMedia, ...rest } = rowCol(width).col;
    const otherStyle = {} as IStyle;
    let commonMultiplicater: number = 0;

    // Split the media query string into an array
    const split = String(mediaQuery || "col-4 phone-12 tablet-6 desktop-4").trim().split(" ");
    const opts: IDict = {};

    split.map((s) => {
        if (!s) return;
        const sp = s.replace("_", "-").trim().toLowerCase();
        if (sp) {
            const spSplit = sp.split("-");
            let media = spSplit[0], mediaValue = spSplit[1];

            // Normalize media query values
            if (media == "small-phone" || media == "s-phone") {
                media = "sp";
            } else if (media == "medium-phone" || media == "m-phone") {
                media = "mp";
            } else if (media === 'phone') {
                media = currentMedia == 'xs' ? 'xs' : currentMedia == 'sp' ? 'sp' : 'mp';
            } else if (media == "tablet") {
                media = currentMedia == "sm" ? "sm" : "md";
            } else if (media == 'xl' || media == "desktop") {
                media = "lg";
            }

            // Determine the appropriate styles based on media queries
            if (currentMedia === media && spSplit.length === 2) {
                if (mediaValue === "hidden") {
                    otherStyle.display = "none";
                } else if (canBeNumber(mediaValue)) {
                    opts[currentMedia] = parseFloat(mediaValue);
                }
            } else if ((media == "col" || media == "column") && canBeNumber(mediaValue)) {
                const v: number = parseFloat(mediaValue);
                if (!isNaN(v) && v <= 12) {
                    commonMultiplicater = v;
                }
            }
        }
    });

    let hasFound = false, multiplicater = 12;

    // Calculate the multiplicater based on options found
    if (isObj(opts)) {
        for (let i in opts) {
            if (i == "col" || i == "column") {
                if (isNumber(opts[i]) && opts[i] <= 12) {
                    commonMultiplicater = opts[i];
                }
            } else if (i == currentMedia) {
                if (isNumber(opts[i]) && opts[i] <= 12) {
                    multiplicater = opts[i];
                    hasFound = true;
                    break;
                }
            }
        }
    }

    if (!hasFound && isNumber(commonMultiplicater)) {
        multiplicater = commonMultiplicater;
    }

    // Return the computed styles for the column
    const ret = {
        ...rest,
        ...otherStyle,
        width: (colWidth * multiplicater).toFixed(8) + '%'
    } as IDict;

    if (withMultiplicater) {
        ret.multiplicater = multiplicater;
    }

    return ret;
}

/**
 * Returns the number of columns available in the current view.
 * This function calculates how many columns can fit based on the provided media query and width.
 * 
 * Example usage:
 * ```typescript
 * const numberOfCols = cols("md-5 xs-3 lg-8 sm-10");
 * console.log(numberOfCols); // Outputs the number of columns based on the screen size.
 * ```
 * 
 * @param {string} mediaQuery - The media queries to use for the column calculation (optional).
 * 
 * @param {number} width - The size of the window (optional). If not provided, the current window size is used.
 * 
 * @returns {number} The number of columns currently available in the view, ensuring a minimum of 1 column.
 */
function cols(mediaQuery?: string, width?: number) {
    const { multiplicater } = col(mediaQuery, width, true);
    let cols = 1;

    if (multiplicater && multiplicater > 0) {
        cols = Math.trunc(12 / multiplicater);
    }

    return Math.max(cols, 1);
}


export default {
    numColumns: cols,
    col
}
