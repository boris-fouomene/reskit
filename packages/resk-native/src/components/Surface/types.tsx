import { IViewProps } from "../View/types";

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