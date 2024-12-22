import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import View, { IViewProps } from "@components/View";
import { IResourceActionName } from "@resk/core";
import { getTextContent, isValidElement, ObservableComponent } from "@utils";


export class FormBase<EventType extends string = IResourceActionName> extends ObservableComponent<any, any, EventType> {

}   