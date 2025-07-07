import { IModalProps } from "@components/Modal/types";
import { IHtmlDivProps } from "@html/types";
import { IClassName } from "@src/types";
import { IUseAnimatedVisibilityResult } from "@utils/animations";
import { GestureResponderEvent } from "react-native";


export interface IPortalProps extends IModalProps {
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
     * The class name of the portal content.
     */
    contentClassName?: IClassName;
}

export interface IPortalStateContext extends IUseAnimatedVisibilityResult { }