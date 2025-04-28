import * as React from "react";
import Theme, { useTheme } from "@theme";
import View from "@components/View";
import { View as RNView } from 'react-native';
import { ISurfaceProps } from "./types";

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
export * from "./types";

Surface.displayName = "Surface";

export { Surface }