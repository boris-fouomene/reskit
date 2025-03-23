import * as React from "react";
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
const Surface = React.forwardRef(({ style, shadowOpacity = 0.24, borderRadius, elevation, ...rest }: ISurfaceProps, ref: React.ForwardedRef<RNView>) => {
    const theme = useTheme();
    shadowOpacity = typeof shadowOpacity === 'number' ? shadowOpacity : 0.24;
    borderRadius = typeof borderRadius === 'number' ? borderRadius : 0;
    const shadowElevation = typeof elevation == 'number' && elevation > 0 ? elevation : 0;
    const elvevStyle = shadowElevation && Theme.elevations[shadowElevation] || null;
    return <View testID={'resk-surface'} {...rest} ref={ref}
        style={[
            { backgroundColor: theme.colors.surface },
            elvevStyle,
            shadowElevation && { shadowOpacity },
            borderRadius > 0 && { borderRadius },
            style
        ]}
    />
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

    /***
     * The shadow opacity for the surface shadow.
     * Default is 0.24
     */
    shadowOpacity?: number;

    /***
     * The border radius for the surface.
     * Default is 0
     */
    borderRadius?: number;
}

Surface.displayName = "Surface";

export { Surface }