import { IBreakpointColumnSize, IBreakpointName } from "@breakpoints/types";
import { ViewProps } from "react-native";


/**
 * Represents the properties for a responsive grid container.
 * 
 * The `IGridProps` interface defines the configuration options for a grid container in a responsive layout system.
 * It extends the `ViewProps` from React Native, allowing additional customization for the grid container.
 * 
 * @interface IGridProps
 * 
 * @property {boolean} [responsive] - Indicates whether the grid container should be responsive. 
 * If `true`, the children of the grid container are expected to be `Col` components that adapt to breakpoints.
 * @property {boolean} [flexWrap] - controls whether child elements wrap within the grid container.
 *
 * @example
 * ```tsx
 * // Example usage of IGridProps:
 * const gridProps: IGridProps = {
 *   responsive: true,
 * };
 * 
 * <Grid {...gridProps}>
 *   <Col mdSize={6} smSize={12}>Content</Col>
 *   <Col mdSize={6} smSize={12}>Content</Col>
 * </Grid>
 * ```
 * 
 * @remarks
 * - The `responsive` property is useful for creating layouts that adapt to different screen sizes.
 */
export interface IGridProps extends ViewProps {
    responsive?: boolean;
    /***
     * controls whether child elements wrap within the grid container.
     * Default is true
     */
    flexWrap?: boolean;
}

/**
 * Represents the properties for a grid column in a responsive layout system.
 * 
 * The `IGridColProps` interface defines the configuration options for a grid column. It extends the `ViewProps`
 * (excluding the `breakpointStyle` property) and allows for additional customization, such as specifying column sizes
 * for different breakpoints, flex properties, and gutter spacing.
 * 
 * @interface IGridColProps
 * 
 * @property {number} [flex] - Specifies the flex value for the column. This determines how the column grows or shrinks
 * relative to its siblings.
 * 
 * @property {IBreakpointColumnSize} [defaultSize] - Defines the default size of the column when no specific breakpoint size is provided.
 * The size is specified as a number between `0` and `12` in a 12-column grid system. If size is zero, the column will be hidden
 * 
 * @property {number} [gutter] - Specifies the gutter (padding) spacing for the column.
 * If a number is provided, it represents the custom gutter size in pixels.
 * If not provided, the gutter size is determined based on the active breakpoint.
 * 
 * @property {number} [windowWidth] - The width of the window in pixels. This is used to determine the appropriate breakpoint size for the column.
 * 
 * @example
 * ```tsx
 * // Example usage of IGridColProps:
 * const colProps: IGridColProps = {
 *   defaultSize: 6,
 *   gutter: 16,
 * };
 * 
 * <Col {...colProps}>
 *   <Text>Column Content</Text>
 * </Col>
 * ```
 * 
 * @remarks
 * - The `defaultSize` property is useful for defining a fallback size when no specific breakpoint size is provided.
 * - The `gutter` property controls the spacing between columns, allowing for flexible layout adjustments.
 * - The `elevation` property can be used to add depth and visual hierarchy to the column.
 */
export interface IGridColProps extends ViewProps, Partial<Record<`${IBreakpointName}Size`, IBreakpointColumnSize>> {
    defaultSize?: IBreakpointColumnSize;
    gutter?: number;
    windowWidth?: number;
}