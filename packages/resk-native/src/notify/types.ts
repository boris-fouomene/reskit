import { ReactNode } from "react";
import { Animated } from "react-native";

/**
 * @interface INotifyMessage
 * Represents a message that can be displayed in a notification.
 * 
 * This type can either be a simple string or a ReactNode, allowing for 
 * flexible content in notifications, such as text, icons, or other 
 * React components.
 * 
 * @example
 * const message1: INotifyMessage = "This is a simple notification message.";
 * const message2: INotifyMessage = <Text>This is a <Text style={{ fontWeight: 'bold' }}>bold</Text> message.</Text>;
 */
export type INotifyMessage = string | ReactNode;

/**
 * @interface INotifyState
 * Represents the state of a notification component.
 * 
 * This interface defines the properties that manage the visibility and 
 * animation of the notification.
 * 
 * @property {Animated.Value} animationValue - The current animation value for the notification.
 * @property {boolean} isOpen - Indicates whether the notification is currently open.
 * @property {number | undefined} [bottomValue] - The bottom position of the notification, if applicable.
 * @property {number} height - The height of the notification.
 * @property {string | undefined} [position] - The position of the notification (top or bottom).
 * 
 * @example
 * const notifyState: INotifyState = {
 *   animationValue: new Animated.Value(0),
 *   isOpen: true,
 *   height: 100,
 *   position: 'top',
 * };
 */
export interface INotifyState {
  animationValue: Animated.Value;
  isOpen: boolean;
  bottomValue?: number;
  height: number;
  position?: string;
}

/**
 * @interface INotifyType
 * Represents the type of notification.
 * 
 * This type defines the various categories of notifications that can be displayed.
 * 
 * @example
 * const notificationType: INotifyType = "success"; // Indicates a successful operation
 */
export type INotifyType = "info" | "warn" | "error" | "success" | "custom";


/**
 * @interface INotifyPostion
 * Represents the position of the notification on the screen.
 * 
 * This type defines where the notification will appear, either at the top or bottom of the screen.
 * 
 * @example
 * const notificationPosition: INotifyPostion = 'top'; // Notification will appear at the top
 */
export type INotifyPostion = 'top' | 'bottom';


/**
 * Represents the action associated with the notification.
 * 
 * This type defines the various actions that can be triggered by the notification, 
 * such as automatic dismissal, user cancellation, or programmatic control.
 * 
 * @example
 * const notificationAction: INotifyAction = "tap"; // Indicates the notification can be dismissed by tapping
 */
export type INotifyAction = "automatic" | "cancel" | "pan" | "programmatic" | "tap";
