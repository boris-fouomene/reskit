import { Div } from "@html/Div";
import { IHtmlDivProps } from "@html/types";
import { cn } from "@utils/cn";
import { classes } from "@variants/classes";
import { commonVariant } from "@variants/common";

/**
 * Renders a full-screen overlay component.
 *
 * @remarks
 * The `Backdrop` is typically used to create a layer that covers the entire screen,
 * often behind modals, drawers, or pop-ups to focus the user's attention on the foreground element.
 * It can be either transparent or have a semi-transparent dark background.
 *
 * @param {IBackdropProps} props - The properties for the Backdrop component.
 * @param {boolean} [props.transparent=false] - If `false`, the backdrop will have a semi-transparent black background. Defaults to `false`.If `true`, the backdrop will be fully transparent.
 * @returns {JSX.Element} A `Div` element styled as a full-screen backdrop.
 *
 * @example
 * ```tsx
 * import { Backdrop } from './Backdrop';
 * import { View, Button, Text } from 'react-native';
 * import { useState } from 'react';
 *
 * const MyScreen = () => {
 *   const [isModalVisible, setModalVisible] = useState(false);
 *
 *   const showModal = () => setModalVisible(true);
 *   const hideModal = () => setModalVisible(false);
 *
 *   return (
 *     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
 *       <Text>Main Content</Text>
 *       <Button title="Show Modal" onPress={showModal} />
 *
 *       {isModalVisible && (
 *         <>
 *           // A dark backdrop that closes the modal on press
 *           <Backdrop transparent={false} onPress={hideModal} />
 *
 *           // Your modal content here
 *           <View style={{
 *             position: 'absolute',
 *             padding: 20,
 *             backgroundColor: 'white',
 *             borderRadius: 10
 *           }}>
 *             <Text>This is a modal!</Text>
 *             <Button title="Close" onPress={hideModal} />
 *           </View>
 *         </>
 *       )}
 *     </View>
 *   );
 * };
 * ```
 *
 * @see {@link IBackdropProps} for more details on available props.
 */
export function Backdrop({ transparent, ...props }: IBackdropProps) {
    return <Div
        testID="resk-backdrop"
        {...props}
        className={cn(classes.absoluteFill, "overflow-hidden z-0 resk-backdrop flex-1 w-screen h-screen",
            transparent === true ? "bg-transparent" : commonVariant({ backdrop: true }),
            props.className
        )}
    />
}

/**
 * Defines the properties for the `Backdrop` component.
 * It extends the standard HTML Div properties, allowing for all common div attributes.
 *
 * @interface IBackdropProps
 * @extends {IHtmlDivProps}
 */
export interface IBackdropProps extends IHtmlDivProps {
    /**
     * Determines the visibility of the backdrop's background color.
     *
     * @property {boolean} [transparent]
     * @default false
     *
     * @example
     * // Renders a backdrop with a semi-transparent black background.
     * <Backdrop transparent={false} />
     *
     * @example
     * // Renders a completely transparent backdrop. This is the default behavior.
     * <Backdrop transparent={false} />
     * // or simply
     * <Backdrop />
     */
    transparent?: boolean;
}