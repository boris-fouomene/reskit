import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { IGridProps } from './types';
import { defaultStr } from '@resk/core';
import { useDimensions } from '@dimensions/index';

/**
 * A responsive grid container component for React Native.
 * 
 * The `Grid` component serves as a container for a responsive grid layout. It supports wrapping child elements
 * and dynamically adjusts its layout based on the `responsive` property and the current screen dimensions.
 * 
 * @component
 * 
 * @param {IGridProps} props - The properties for the grid container.
 * 
 * 
 * @property {boolean} [flexWrap=true] - Specifies whether the child elements should wrap within the grid container.
 * Defaults to `true`, enabling wrapping behavior.
 * 
 * @property {string} [testID="resk-grid"] - A test identifier for the grid container, useful for testing purposes.
 * 
 * @property {ViewStyle} [style] - Additional styles to apply to the grid container.
 * 
 * @returns {ReactElement} - A `View` component styled as a responsive grid container.
 * 
 * @example
 * ```tsx
 * import Grid from '@resk/native';
 * 
 * const App = () => {
 *   return (
 *     <Grid lexWrap={true} style={{ backgroundColor: "lightgray" }}>
 *       <Grid.Col mdSize={6} smSize={12}>Content 1</Grid.Col>
 *       <Grid.Col mdSize={6} smSize={12}>Content 2</Grid.Col>
 *     </Grid>
 *   );
 * };
 * ```
 * 
 * @remarks
 * - The `flexWrap` property controls whether child elements wrap within the grid container.
 * - This component is typically used as a parent container for `Col` components in a responsive grid system.
 * 
 * @see {@link IGridProps} for the interface defining the grid properties.
 * @see {@link useDimensions} for the hook used to handle responsive behavior.
 */
function Grid({ flexWrap = false, testID, style, ...props }: IGridProps) {
    testID = defaultStr(testID, "resk-grid");
    return <View
        {...props}
        testID={testID}
        style={[styles.container, flexWrap && styles.flexWrap, style]}
    />
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: "100%",
    },
    flexWrap: {
        flexWrap: "wrap",
    }
});

export default Grid;