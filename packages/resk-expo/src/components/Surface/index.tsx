import React from "react";
import Theme, { useTheme } from "@theme";
import View, { IViewProps } from "@components/View";
import { View as RNView } from 'react-native';

/**
 * The Surface component renders a box with shadow, similar to CSS box-shadow.
 * It inherits properties from the View component, adding the elevation property 
 * to specify the shadow level.
 * 
 * Elevation levels range from 0 to 10, defined in the `./Elevations.ts` file 
 * located in the same directory as this component.
 * 
 * By default, the background of the component is set to the surface background color 
 * defined in the theme (theme.colors.surface). To override this, 
 * simply define a `backgroundColor` property in the style prop passed to 
 * this component.
 * 
 * @component Surface
 * @example
 * ```tsx
 * <Surface elevation={3} style={{ padding: 20 }}>
 *   <Text>Hello, World!</Text>
 * </Surface>
 * ```
 */
const Surface = React.forwardRef((props: ISurfaceProps, ref: React.ForwardedRef<RNView>) => {
    const theme = useTheme();
    const { style, elevation, ...rest } = props;
    return <View testID={'RN_SurfaceComponent'} {...rest} ref={ref}
        style={[{ backgroundColor: theme.colors.surface },
        elevation && typeof elevation == 'number' && Theme.elevations[elevation] ? Theme.elevations[elevation] : null,
            style
        ]} />
});
/**
 * Represents the properties for the Surface component.
 * This interface extends all properties from the View component 
 * (see $components/View).
 * 
 * @interface ISurfaceProps
 * @extends IViewProps
 * 
 * @property {number} [elevation] - The elevation level of the surface's shadow.
 *                                     This value determines the intensity of the shadow 
 *                                     effect and should be a number between 0 and 10.
 *                                     A higher value results in a more pronounced shadow.
 *                                     @example
 *                                     ```tsx
 *                                     <Surface elevation={3} style={{ padding: 20 }}>
 *                                       <Text>Sample Surface</Text>
 *                                     </Surface>
 *                                     ```
 */
export interface ISurfaceProps extends IViewProps {
    /***
     * The level of elevation for the surface shadow.
     */
    elevation?: number;
}

Surface.displayName = "Surface";

export { Surface }