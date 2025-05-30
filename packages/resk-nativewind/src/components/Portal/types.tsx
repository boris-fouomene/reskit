import { IHtmlDivProps } from "@html/types";

/**
 * Props for the Portal component.
 *
 * @property children - The content to be rendered inside the portal.
 * @property className - Optional CSS class name(s) for the portal container.
 * @property testID - Optional test identifier for testing purposes.
 * @property id - Optional unique identifier for the portal container.
 * @property absoluteFill - If true, the portal will fill its parent absolutely.
 * @property visible - Controls the visibility of the portal content.
 */
export interface IPortalProps {
    children: IHtmlDivProps["children"];
    className?: IHtmlDivProps["className"];
    testID?: IHtmlDivProps["testID"];
    id?: IHtmlDivProps["id"];
    absoluteFill?: boolean;
    visible?: boolean;
}