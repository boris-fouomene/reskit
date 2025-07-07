import { IModalBaseProps } from "@components/ModalBase/types";
import { IHtmlDivProps } from "@html/types";
import { IClassName } from "@src/types";
import { IUseAnimatedVisibilityResult } from "@utils/animations";
import { GestureResponderEvent } from "react-native";


export interface IPortalProps extends IModalBaseProps {
    /***
     * The backdrop class name(s) for the portal
     */
    //backdropClassName?: IHtmlDivProps["className"];
    testID?: IHtmlDivProps["testID"];
    id?: IHtmlDivProps["id"];
    //absoluteFill?: boolean;
    /***
     * If true, the portal will have a backdrop.
     */
    //withBackdrop?: boolean;

    /**
    * Controls the visibility of the portal content.
    * When `true`, content is mounted immediately.
    * When `false`, content is unmounted after the specified delay.
    */
    //visible?: boolean;

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
   * <Portal visible={isOpen}>
   *   <div>Content</div>
   * </Portal>
   * 
   * // 300ms delay - allows time for exit animations
   * <Portal visible={isOpen}>
   *   <div className="transition-opacity duration-300">
   *     Animated content
   *   </div>
   * </Portal>
    /***
     * The callback function to be called when the portal is pressed.
     */
    //onPress?: (event: GestureResponderEvent) => void;

    /***
        Additional styles to be applied to the portal container.
    */
    style?: IHtmlDivProps["style"];


    /**
     * The class name of the portal content.
     */
    contentClassName?: IClassName;
}

export interface IPortalStateContext extends IUseAnimatedVisibilityResult { }