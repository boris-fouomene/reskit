'use strict';

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { IGridColProps } from './types';
import { defaultStr, isNonNullString, isNumber } from '@resk/core';
import Breakpoints from '@breakpoints/index';
import { IBreakpointColumns, IBreakpointColumnSize, IBreakpointName } from '@breakpoints/types';

const isValidSize = (size: any): size is number => isNumber(size) && 0 <= size && size <= 12;

/**
 * A responsive grid column component for React Native.
 * 
 * The `GridCol` component is a flexible and responsive column that adapts to different screen sizes
 * based on the provided breakpoint sizes. It uses the `Breakpoints` utility to calculate styles dynamically
 * and supports custom gutter spacing and default sizes.
 * 
 * @component
 * 
 * @param {IGridColProps} props - The properties for the grid column.
 * @param {React.Ref<View>} ref - A reference to the underlying `View` component.
 * 
 * @property {IBreakpointColumnSize} [defaultSize] - The default size of the column when no specific breakpoint size is provided.
 * The size is specified as a number between `0` and `12` in a 12-column grid system. If the size is `0`, the column will be hidden.
 * 
 * @property {number} [windowWidth] - The width of the window in pixels. This is used to determine the appropriate breakpoint size for the column.
 * 
 * @property {number | boolean} [gutter] - Specifies the gutter (padding) spacing for the column. If a number is provided, it represents the custom gutter size in pixels.
 * If not provided, the gutter size is determined based on the active breakpoint.
 * 
 * @property {string} [testID] - A test identifier for the column, useful for testing purposes.
 * 
 * @property {ViewStyle} [style] - Additional styles to apply to the column.
 * 
 * @returns {JSX.Element} - A `View` component styled as a responsive grid column.
 * 
 * @example
 * ```tsx
 * import GridCol from './GridCol';
 * 
 * const App = () => {
 *   return (
 *     <GridCol defaultSize={6} gutter={16}>
 *       <Text>Column Content</Text>
 *     </GridCol>
 *   );
 * };
 * ```
 * 
 * @remarks
 * - The `colSizes` array is dynamically generated based on the provided breakpoint sizes and the `defaultSize`.
 * - The `colStyle` is calculated using the `Breakpoints.col` method, which determines the column's width and padding.
 * - The `paddingStyle` is calculated based on the `gutter` property or the active breakpoint's gutter size.
 * - This component is part of a responsive grid system and is typically used as a child of a `Grid` container.
 * 
 * @see {@link Breakpoints.col} for the method used to calculate column styles.
 * @see {@link Breakpoints.getGutter} for the method used to calculate gutter spacing.
 */
const GridCol = React.forwardRef<View, IGridColProps>(({ style, windowWidth, gutter, defaultSize, testID, ...props }, ref) => {
    const currentMedia = Breakpoints.getCurrentMedia();
    const colSizes = useMemo(() => {
        const breakpointsAll = Breakpoints.allBreakpointsNames;
        const colSizes: IBreakpointColumns = [];
        let defSize = defaultSize;
        for (let propName in props) {
            if (isNonNullString(propName) && propName.endsWith("Size") && isValidSize(props[propName as keyof typeof props])) {
                const breakpointName: IBreakpointName = propName.trim().rtrim("Size") as IBreakpointName;
                const colSize = props[propName as keyof typeof props] as IBreakpointColumnSize;
                if (((breakpointName as any) == "default")) {
                    defSize = colSize
                } else if (breakpointsAll.includes(breakpointName)) {
                    colSizes.push(`${breakpointName}-${colSize}`);
                }
            }
        }
        if (isValidSize(defSize)) {
            colSizes.push(`col-${defSize}`);
        }
        return colSizes;
    }, [props, defaultSize]);
    const colStyle = useMemo(() => {
        return Breakpoints.col(colSizes, windowWidth, false);
    }, [colSizes.join(","), currentMedia, windowWidth]);
    const paddingStyle = useMemo(() => {
        const padding = isNumber(gutter) ? gutter : Breakpoints.getGutter(windowWidth);
        return { padding };
    }, [gutter, windowWidth]);
    return <View {...props}
        testID={defaultStr(testID, "resk-grid-column")}
        style={[styles.container, colStyle, colStyle, paddingStyle, style]}
        ref={ref}
    />
});

GridCol.displayName = "Grid.Col";
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    },
    noMargin: {

    },
});

export default GridCol;