import { IModalProps } from "@components/Modal/types";
import { IHtmlDivProps } from "@html/types";


export interface IPortalProps extends IHtmlDivProps {

    absoluteFill?: boolean;
    /***
     * If true, the portal will have a backdrop.
     */
    withBackdrop?: boolean;
}