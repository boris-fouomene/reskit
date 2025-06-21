import { IHtmlDivProps } from "@html/types";
import { ViewProps } from "react-native";
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
    visible?: boolean;
    /***
     * The callback function to be called when the portal is pressed.
     */
    onPress?: (event: GestureResponderEvent) => void;

    style?: IHtmlDivProps["style"];

    onAccessibilityEscape?: ViewProps["onAccessibilityEscape"];
}