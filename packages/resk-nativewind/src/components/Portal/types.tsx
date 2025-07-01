import { IHtmlDivProps } from "@html/types";
import { IUseAnimatedVisibilityResult } from "@utils/animations";
import { GestureResponderEvent } from "react-native";

/**
 * Props for the Portal component.
 *
 * @property children - The content to be rendered inside the portal.
 * @property className - Optional CSS class name(s) for the portal container.
 * @property testID - Optional test identifier for testing purposes.
 * @property id - Optional unique identifier for the portal container.
 * @property absoluteFill - If true, the portal will fill its parent absolutely.
 * @property visible - Controls the visibility of the portal content.
 * @property withBackdrop - If true, the portal will have a backdrop.
 */
export interface IPortalProps {
    children: IHtmlDivProps["children"];
    className?: IHtmlDivProps["className"];
    testID?: IHtmlDivProps["testID"];
    id?: IHtmlDivProps["id"];
    absoluteFill?: boolean;
    /***
     * If true, the portal will have a backdrop.
     */
    withBackdrop?: boolean;

    /**
    * Controls the visibility of the portal content.
    * When `true`, content is mounted immediately.
    * When `false`, content is unmounted after the specified delay.
    */
    visible?: boolean;

    /**
   * Delay in milliseconds before unmounting the portal content when `visible` becomes `false`.
   * 
   * This prop is essential for implementing smooth exit animations in portal content.
   * It ensures the portal remains mounted long enough for CSS transitions or animations
   * to complete before the component is removed from the DOM.
   * 
   * @default 0
   * 
   * @example
   * ```tsx
   * // No delay - content disappears immediately
   * <Portal visible={isOpen} animationDuration={0}>
   *   <div>Content</div>
   * </Portal>
   * 
   * // 300ms delay - allows time for exit animations
   * <Portal visible={isOpen} animationDuration={300}>
   *   <div className="transition-opacity duration-300">
   *     Animated content
   *   </div>
   * </Portal>
   * ```
   * 
   * @remarks
   * - When `visible` changes from `false` to `true`, content mounts immediately regardless of this value
   * - When `visible` changes from `true` to `false`, a timeout is set for this duration
   * - The timeout is automatically cleared if `visible` becomes `true` again before the delay expires
   * - Setting this to 0 or omitting it results in immediate unmounting (no animation support)
   * - This value should typically match or slightly exceed your CSS animation/transition duration
   */
    animationDuration?: number;
    /***
     * The callback function to be called when the portal is pressed.
     */
    onPress?: (event: GestureResponderEvent) => void;

    /***
        Additional styles to be applied to the portal container.
    */
    style?: IHtmlDivProps["style"];

    onAccessibilityEscape?: IHtmlDivProps["onAccessibilityEscape"];

    /**
     * If true, the portal will mount its children immediately.
     * This is useful for cases where the portal is used to render a modal or a dialog.
     * In such cases, the portal should be mounted immediately to ensure proper rendering.
     * @default false
     */
    autoMountChildren?: boolean;
}

export interface IPortalStateContext extends IUseAnimatedVisibilityResult { }