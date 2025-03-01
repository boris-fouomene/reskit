import React, { ReactNode } from "react";
import View, { IViewProps } from "@components/View";
import { Portal } from "@components/Portal";
import Theme, { Colors } from "@theme";
import Platform from "@platform/index";
import { getTextContent } from "@utils";
import { IFontIconProps } from "@components/Icon/types";
import Font from "@components/Icon/Font";
import { INotifyState, INotifyMessage, INotifyPostion, INotifyAction, INotifyType } from "./types";
import { ILabelProps } from "@components/Label";
import { StyleSheet, Dimensions, Pressable, Animated, StatusBar, PanResponder, Keyboard, Image, PanResponderInstance, EmitterSubscription, GestureResponderEvent, PanResponderGestureState, LayoutChangeEvent } from "react-native";
import { Surface } from "@components/Surface";
import Label from "@components/Label";
import Queue from "./Queue";
import { DEFAULT_IMAGE_DIMENSIONS } from "./utils";
import { IStyle } from "../types";
import { defaultStr, IDict, stringify } from "@resk/core";
import { IDimensions } from "@dimensions/types";

const IS_ANDROID = Platform.isAndroid();
const compareQueues = (a: any, b: any): boolean => {
  return a && typeof a == "object" && b && typeof b == "object" && (a.title || b.title) && a.title === b.title && a.message == b.message ? true : false;
};

const BOTTOM = 50;
const TOP = 50;

/**
 * The Notify class manages application-level notifications.
 * 
 * This component provides a way to display alerts to users, with support for various types of notifications,
 * customizable styles, and interaction options. Notifications can be automatically dismissed or closed by user actions.
 * 
 * @example
 * <Notify
 *   closeInterval={5000}
 *   tapToCloseEnabled={true}
 *   onTap={(options) => console.log("Notification tapped", options)}
 * />
 */
export default class Notify extends React.PureComponent<INotifyProps, INotifyState> {
  panResponder: PanResponderInstance;
  readonly queue: Queue = new Queue();
  __isKeyboardOpen: boolean = false;
  state: INotifyState;
  closeTimeoutID?: any;
  alertData: INotifyOptions = {};
  mainView?: any = null;
  activeData?: IDict;
  static defaultProps: INotifyProps = {
    closeInterval: 4000,
    startDelta: -100,
    endDelta: 0,
    showCancel: false,
    tapToCloseEnabled: true,
    panResponderEnabled: true,
    translucent: false,
    isInteraction: true,
    useNativeDriver: true,
    elevation: 1,
    sensitivity: 20,
    accessible: false,
    onTap: () => { },
  };
  readonly keyBoardEvents: { show: EmitterSubscription; hide: EmitterSubscription } = {
    show: Keyboard.addListener("keyboardDidShow", () => {
      this.__isKeyboardOpen = true;
    }),
    hide: Keyboard.addListener("keyboardDidHide", () => {
      this.__isKeyboardOpen = false;
    }),
  };
  constructor(props: any) {
    super(props);
    this.state = {
      animationValue: new Animated.Value(0),
      isOpen: false,
      bottomValue: BOTTOM,
      height: 0,
    };
    this.alertData = {
      type: undefined,
      message: "",
      title: "",
      interval: props.closeInterval,
      action: undefined,
    };
    this.panResponder = this.getPanResponder();
  }
  /**
   * Checks if the keyboard is currently open.
   * 
   * @returns {boolean} True if the keyboard is open, otherwise false.
   */
  isKeyboardOpen() {
    return this.__isKeyboardOpen;
  }
  componentWillUnmount() {
    if (this.state.isOpen) {
      this.closeAction("programmatic");
    }
    this.keyBoardEvents.show?.remove();
    this.keyBoardEvents.hide?.remove();
  }
  getPanResponder = (): PanResponderInstance => {
    return PanResponder.create({
      onStartShouldSetPanResponder: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => this._onShouldStartPan(),
      onMoveShouldSetPanResponder: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => this._onShouldMovePan(event, gestureState),
      onPanResponderMove: (event, gestureState) => this._onMovePan(event, gestureState),
      onPanResponderRelease: (event, gestureState) => this._onDonePan(event, gestureState),
      onPanResponderTerminate: (event, gestureState) => this._onDonePan(event, gestureState),
    });
  };
  _onShouldStartPan = () => {
    return typeof this.props.panResponderEnabled == "boolean" ? this.props.panResponderEnabled : false;
  };
  _onShouldMovePan = (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    const { sensitivity, panResponderEnabled } = this.props;
    const dx = Math.abs(gestureState.dx);
    const dy = Math.abs(gestureState.dy);
    const isDxSensitivity = dx < sensitivity;
    const isDySensitivity = dy >= sensitivity;
    return isDxSensitivity && isDySensitivity && (panResponderEnabled as boolean);
  };
  _onMovePan = (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    if (gestureState.dy < 0) {
      this.setState({ bottomValue: gestureState.dy });
    }
  };
  _onDonePan = (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    const start = this.getStartDelta(this.state.height, this.props.startDelta || 0);
    const delta = start / 5;
    if (gestureState.dy < delta) {
      this.closeAction("pan");
    }
  };
  getStringValue = (value: any): string => {
    try {
      if (typeof value !== "string") {
        return stringify(value);
      }
      return value;
    } catch (error: any) {
      return error?.toString();
    }
  };
  async alert({ type = undefined, title = "", message = "", interval, ...rest }: INotifyOptions) {
    const { closeInterval } = this.props;
    const data = {
      ...rest,
      type,
      title: this.getStringValue(title),
      message: this.getStringValue(message),
      interval: closeInterval,
    };
    //previous queue data are same to new so do nothing
    if (compareQueues(data, this.queue.firstItem)) {
      return;
    }
    // closeInterval prop is overridden if interval is provided
    if (interval && typeof interval === "number") {
      data.interval = interval;
    }
    this.queue.enqueue(data);
    // start processing queue when it has at least one
    if (this.getQueueSize() === 1) {
      this._processQueue();
    }
  }
  clearQueue = () => {
    this.queue.clear();
  };
  getQueueSize = () => {
    return this.queue.size;
  };
  _processQueue = (): void => {
    const data = this.queue.firstItem;
    if (data && this.activeData) {
      if (data.type == this.activeData.type && getTextContent(data.title) == getTextContent(this.activeData.title) && getTextContent(data.message) == getTextContent(this.activeData.message)) {
        this.queue.dequeue();
        return this._processQueue();
      }
    }
    this.activeData = data;
    if (data) {
      this.open(data);
    }
  };
  open = (data: INotifyOptions = {}) => {
    this.activeData = data;
    this.alertData = data;
    const position = this.isKeyboardOpen() ? "top" : data.position;
    this.setState({ isOpen: true, position }, () => {
      this.animate(1, 450, () => {
        const interval = data.interval || 5000;
        if (interval > 0) {
          this.closeAutomatic(interval);
        }
      });
    });
  };
  closeAction = (action: INotifyAction = "programmatic", onDone = () => { }) => {
    if (this.state.isOpen) {
      this.clearCloseTimeoutID();
      this.close(action, onDone);
    }
  };
  closeAutomatic = (interval: number) => {
    this.clearCloseTimeoutID();
    this.closeTimeoutID = setTimeout(() => {
      this.close("automatic");
    }, interval);
  };
  getRenderedCallbackArgs(): INotifyRenderCallback {
    return {
      data: this.alertData,
      props: this.props,
      context: this,
      style: {
        backgroundColor: this.getBackgroundColorForType(this.alertData.type),
        color: this.getTextColorForType(this.alertData.type),
      },
    };
  }
  close = (action: INotifyAction, onDone = () => { }) => {
    this.animate(0, 250, () => {
      const { onClose, onCancel, onTap } = this.props;
      this.alertData.action = action;
      const latest = this.queue.dequeue();
      const options = this.getRenderedCallbackArgs();
      if (action === "cancel") {
        if (this.alertData.onCancel) {
          this.alertData.onCancel(options);
        }
        onCancel && onCancel(options);
      } else {
        if (action === "tap" && onTap) {
          onTap(options);
        }
        if (this.alertData.onClose) {
          this.alertData.onClose(options);
        }
        onClose && onClose(options);
        if (typeof latest?.onClose === "function") {
          latest?.onClose(options);
        }
      }
      this.setState({ isOpen: false, bottomValue: BOTTOM, height: 0 });
      this._processQueue();
      onDone();
    });
  };
  clearCloseTimeoutID = () => {
    if (this.closeTimeoutID) {
      clearTimeout(this.closeTimeoutID);
    }
  };
  animate = (toValue: number, duration = 450, onComplete = () => { }) => {
    const { useNativeDriver, isInteraction } = this.props;
    Animated.spring(this.state.animationValue, {
      toValue: toValue,
      friction: 9,
      useNativeDriver,
      isInteraction,
    }).start(onComplete);
  };
  getWindowHeight(): number {
    return Dimensions.get("window").height;
  }
  getWindowWidth(): number {
    return Dimensions.get("window").width;
  }
  getStartDelta = (height: number, start: number) => {
    const windowHeight = this.getWindowHeight();
    const startMin = 0 - height;
    const startMax = windowHeight + height;
    if (start < 0 && start !== startMin) {
      return startMin;
    } else if (start > startMax) {
      return startMax;
    }
    return start;
  };
  getEndDelta = (height: number, end: number) => {
    const windowHeight = this.getWindowHeight();
    const endMin = 0;
    const endMax = windowHeight;
    if (end < endMin) {
      return endMin;
    } else if (end >= endMax) {
      return endMax - height;
    }
    return end;
  };
  getOutputRange = (height: number, startDelta: number, endDelta: number) => {
    if (!height) {
      return [startDelta, endDelta];
    }
    const start = this.getStartDelta(height, startDelta);
    const end = this.getEndDelta(height, endDelta);
    return [start, end];
  };
  getValidColor(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      if (Colors.isValid(args[i])) {
        return args[i];
      }
    }
    return undefined;
  }
  getInfoColor() {
    return this.getValidColor(this.props.infoColor, Theme.colors.info);
  }
  getInfoTextColor() {
    return this.getValidColor(this.props.infoTextColor, Theme.colors.onInfo);
  }
  getSuccessColor() {
    return this.getValidColor(this.props.successColor, Theme.colors.success);
  }
  getSuccessTextColor() {
    return this.getValidColor(this.props.successTextColor, Theme.colors.onSuccess);
  }
  getWarnColor() {
    return this.getValidColor(this.props.warnColor, Theme.colors.warning);
  }
  getWarnTextColor() {
    return this.getValidColor(this.props.warnTextColor, Theme.colors.onWarning);
  }
  getErrorColor() {
    return Colors.isValid(this.props.errorColor) ? this.props.errorColor : Theme.colors.error;
  }
  getErrorTextColor() {
    return this.getValidColor(this.props.errorTextColor, Theme.colors.onError);
  }
  getStyleForType = (type: INotifyType | undefined) => {
    switch (type) {
      case "info":
        return [StyleSheet.flatten(styles.mainContainer), { backgroundColor: this.getInfoColor(), borderColor: this.getInfoColor() }];
      case "warn":
        return [StyleSheet.flatten(styles.mainContainer), { backgroundColor: this.getWarnColor(), borderColor: this.getWarnColor() }];
      case "error":
        return [StyleSheet.flatten(styles.mainContainer), { backgroundColor: this.getErrorColor(), borderColor: this.getErrorColor() }];
      case "success":
        return [StyleSheet.flatten(styles.mainContainer), { backgroundColor: this.getSuccessColor(), borderColor: this.getSuccessColor() }];
      default:
        return [StyleSheet.flatten(styles.mainContainer), StyleSheet.flatten(this.props.style), { borderColor: Theme.colors.outline }];
    }
  };
  getBackgroundColorForType = (type: INotifyType | undefined) => {
    switch (type) {
      case "info":
        return this.getInfoColor();
      case "warn":
        return this.getWarnColor();
      case "error":
        return this.getErrorColor();
      case "success":
        return this.getSuccessColor();
      default:
        return StyleSheet.flatten(styles.container).backgroundColor;
    }
  };
  getTextColorForType = (type: INotifyType | undefined) => {
    switch (type) {
      case "info":
        return this.getInfoTextColor();
      case "warn":
        return this.getWarnTextColor();
      case "error":
        return this.getErrorTextColor();
      case "success":
        return this.getSuccessTextColor();
      default:
        return Theme.colors.onError;
    }
  };
  _onLayoutEvent = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > this.state.height) {
      const { startDelta, endDelta } = this.props;
      const start = this.getStartDelta(height, startDelta || 0);
      const end = this.getEndDelta(height, endDelta || 0);
      if (startDelta !== start || endDelta !== end) {
        this.setState({ height });
      }
    }
  };
  _renderTitle = () => {
    const options = this.getRenderedCallbackArgs();
    if (this.alertData.renderTitle) {
      return this.alertData.renderTitle(options);
    }
    if (this.props.renderTitle) {
      return this.props.renderTitle(options);
    }
    const titleProps = this.alertData.titleProps || this.props.titleProps || {};
    return (
      <Label testID={this.getTestID("Title")} numberOfLines={2} {...titleProps} style={[styles.title, { color: this.getTextColorForType(this.alertData?.type) }, titleProps.style]}>
        {this.alertData.title}
      </Label>
    );
  };
  getTestID(testID?: string) {
    return defaultStr(this.props.testID, "resk-notify") + (testID ? "_" + testID : "");
  }
  _renderMessage = () => {
    const options = this.getRenderedCallbackArgs();
    if (this.alertData.renderMessage) {
      return this.alertData.renderMessage(options);
    }
    if (this.props.renderMessage) {
      return this.props.renderMessage(options);
    }
    const messageProps = this.alertData.messageProps || this.props.messageProps || {};
    return (
      <Label testID={this.getTestID("RNNotifyMessage")} numberOfLines={10} {...messageProps} style={[styles.message, { color: this.getTextColorForType(this.alertData?.type) }, messageProps.style]}>
        {this.alertData.message}
      </Label>
    );
  };
  getIconSize(): number {
    return DEFAULT_IMAGE_DIMENSIONS;
  }
  _renderCancel = (show = false) => {
    if (!show) {
      return null;
    }
    const options = this.getRenderedCallbackArgs();
    if (this.alertData?.renderCancel) {
      return this.alertData.renderCancel(options);
    }
    if (this.props.renderCancel) {
      return this.props.renderCancel(options);
    }
    return (
      <Pressable style={[styles.cancelBtn]} onPress={() => this.closeAction("cancel")}>
        <Font name={"material-cancel"} size={this.getIconSize()} color={this.getTextColorForType(this.alertData?.type)} />
      </Pressable>
    );
  };
  /***
   * retourne l'icon principal du composant de notification
   */
  _renderIcon(): ReactNode {
    if (this.props.renderIcon) {
      return this.props.renderIcon(this.getRenderedCallbackArgs());
    }
    const iconProps = this.alertData.iconProps || this.props.iconProps || {};
    let icon: IFontIconProps["name"] | undefined;
    switch (this.alertData.type) {
      case "info":
        icon = "material-info";
        break;
      case "warn":
        icon = "material-warning";
        break;
      case "success":
        icon = "material-check-circle";
        break;
      case "error":
        icon = "material-error";
        break;
      default:
        icon = undefined;
        break;
    }
    if (!icon) return null;
    return <Font name={icon} size={this.getIconSize()} color={this.getTextColorForType(this.alertData?.type)} {...iconProps} />;
  }
  render() {
    const { isOpen } = this.state;
    if (!isOpen) {
      return null;
    }
    const { elevation, wrapperProps, tapToCloseEnabled, testID: customTestId, accessible, startDelta, endDelta, translucent, showCancel } = this.props;
    const testID = defaultStr(customTestId, "resk-notify");
    const { animationValue, bottomValue, height } = this.state;
    const { type } = this.alertData;
    const style: IStyle = (IS_ANDROID && translucent) ? [this.getStyleForType(type), { paddingTop: StatusBar.currentHeight }, styles.border] : this.getStyleForType(type);
    const outputRange = this.getOutputRange(height, startDelta || -100, endDelta || 0);
    const position = (this.state.position || "top").toLowerCase();
    const isTopPosition = position === "top";
    const wrapperAnimStyle = {
      transform: [
        {
          translateY: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange,
          }),
        },
      ],
      position: "absolute",
      [isTopPosition ? "top" : "bottom"]: isTopPosition ? TOP : bottomValue,
      left: 0,
      right: 0,
      elevation: elevation,
    };
    const onPress = !tapToCloseEnabled ? null : () => this.closeAction("tap");
    const wrapProps = wrapperProps || {};
    const breakpointStyle = ({ isMobile, isTablet, width }: IDimensions) => {
      return {
        width: isMobile ? (90 * width) / 100 : isTablet ? Math.max((70 * width) / 100, 350) : 500,
      };
    };
    return (
      <Portal>
        <Animated.View ref={(ref) => (this.mainView = ref)} {...this.panResponder.panHandlers} testID={testID + "_AnimatedView"} {...wrapProps} style={[wrapperAnimStyle, (wrapProps as any).style]}>
          <Surface elevation={5} style={style} testID={testID + "_ContentContainer"} breakpointStyle={breakpointStyle}>
            <Pressable onPress={onPress} testID={testID} style={[styles.main]} disabled={!tapToCloseEnabled} onLayout={(event) => this._onLayoutEvent(event)} accessible={accessible}>
              <View testID={testID + "_ContentWrapper"} style={[styles.contentContainer]}>
                {this._renderIcon()}
                <View testID={testID + "_Content"} breakpointStyle={breakpointStyle} style={styles.content}>
                  {this._renderTitle()}
                  {this._renderMessage()}
                </View>
                {this._renderCancel(showCancel)}
              </View>
            </Pressable>
          </Surface>
        </Animated.View>
      </Portal>
    );
  }
}


/**
 * @interface INotifyOptions
 * 
 * Represents the configuration options for displaying notifications within the application.
 * This interface extends the `INotifyRenderOptions` interface, allowing for additional 
 * customization of notification rendering.
 * 
 * ### Properties:
 * 
 * - **title**: The title of the notification, which can be a simple string or a more complex 
 *   message. This is typically displayed prominently at the top of the notification.
 *   - **Type**: `INotifyMessage`
 *   - **Example**: 
 *     ```typescript
 *     title: "New Message Received"
 *     ```
 * 
 * - **message**: The main content of the notification, providing details or context about the 
 *   notification. This can also be a string or a more complex ReactNode.
 *   - **Type**: `INotifyMessage`
 *   - **Example**: 
 *     ```typescript
 *     message: "You have a new message from John Doe."
 *     ```
 * 
 * - **type**: Specifies the type of notification, which can affect its appearance and behavior. 
 *   Common types include "info", "success", "warning", and "error".
 *   - **Type**: `INotifyType`
 *   - **Example**: 
 *     ```typescript
 *     type: "success"
 *     ```
 * 
 * - **action**: Defines the action associated with the notification, such as automatic dismissal 
 *   or user cancellation. This can help in managing user interactions with the notification.
 *   - **Type**: `INotifyAction`
 *   - **Example**: 
 *     ```typescript
 *     action: "automatic"
 *     ```
 * 
 * - **position**: Determines where the notification will appear on the screen, either at the top 
 *   or bottom. This can be useful for managing the layout of notifications in relation to other UI elements.
 *   - **Type**: `INotifyPostion`
 *   - **Example**: 
 *     ```typescript
 *     position: "top"
 *     ```
 * 
 * - **interval**: The duration (in milliseconds) for which the notification should be displayed 
 *   before automatically dismissing. If not specified, the default behavior will apply.
 *   - **Type**: `number`
 *   - **Example**: 
 *     ```typescript
 *     interval: 5000 // Notification will be displayed for 5 seconds
 *     ```
 * 
 * ### Example Usage:
 * Here’s an example of how to use the `INotifyOptions` interface when creating a notification:
 * 
 * ```typescript
 * const notifyOptions: INotifyOptions = {
 *     title: "New Update Available",
 *     message: "A new version of the app is ready to install.",
 *     type: "info",
 *     action: "automatic",
 *     position: "top",
 *     interval: 3000 // Notification will disappear after 3 seconds
 * };
 * 
 * // Function to display the notification
 * displayNotification(notifyOptions);
 * ```
 * 
 * ### Notes:
 * - Ensure that the `type` property is set appropriately to provide users with visual cues about 
 *   the nature of the notification.
 * - The `interval` property can be omitted if you want the notification to remain until the user 
 *   interacts with it.
 */
export interface INotifyOptions extends INotifyRenderOptions {
  title?: INotifyMessage;
  message?: INotifyMessage;
  type?: INotifyType;
  action?: INotifyAction;
  position?: INotifyPostion;
  interval?: number;
};

/**
 * @interface INotifyRenderCallback
 * 
 * Represents the callback parameters used for rendering notifications within the application.
 * This interface provides essential properties that can be utilized when customizing the 
 * rendering of notifications, allowing for greater flexibility and control over their appearance 
 * and behavior.
 * 
 * ### Properties:
 * 
 * - **props**: The properties associated with the notification component. This includes all 
 *   relevant settings and configurations that dictate how the notification behaves and appears.
 *   - **Type**: `INotifyProps`
 *   - **Example**: 
 *     ```typescript
 *     const props: INotifyProps = {
 *         closeInterval: 5000,
 *         tapToCloseEnabled: true,
 *         // other notification properties...
 *     };
 *     ```
 * 
 * - **context**: The context of the notification, which provides access to the `Notify` class 
 *   instance. This allows for interaction with the notification system, such as triggering 
 *   actions or accessing shared state.
 *   - **Type**: `Notify`
 *   - **Example**: 
 *     ```typescript
 *     const context: Notify = new Notify();
 *     ```
 * 
 * - **data**: A dictionary object containing the data associated with the notification. This 
 *   can include any additional information that may be relevant for rendering or processing 
 *   the notification.
 *   - **Type**: `IDict`
 *   - **Example**: 
 *     ```typescript
 *     const data: IDict = {
 *         message: "You have a new message!",
 *         title: "New Message",
 *         // other relevant data...
 *     };
 *     ```
 * 
 * - **style**: The style object that defines how the notification should be visually presented. 
 *   This can include styles for layout, colors, fonts, and other visual properties.
 *   - **Type**: `IStyle`
 *   - **Example**: 
 *     ```typescript
 *     const style: IStyle = {
 *         backgroundColor: "#fff",
 *         padding: 10,
 *         borderRadius: 5,
 *     };
 *     ```
 * 
 * ### Example Usage:
 * Here’s an example of how to use the `INotifyRenderCallback` interface in a custom render function:
 * 
 * ```typescript
 * const renderNotification = (callback: INotifyRenderCallback) => {
 *     const { props, context, data, style } = callback;
 *     
 *     return (
 *         <View style={style}>
 *             <Text style={{ fontWeight: 'bold' }}>{data.title}</Text>
 *             <Text>{data.message}</Text>
 *             <Button onPress={() => context.closeAction("tap")}>Close</Button>
 *         </View>
 *     );
 * };
 * 
 * // Example of invoking the render function
 * const callback: INotifyRenderCallback = {
 *     props: { closeInterval: 5000, tapToCloseEnabled: true },
 *     context: new Notify(),
 *     data: { title: "New Notification", message: "You have a new message!" },
 *     style: { backgroundColor: "#f0f0f0", padding: 10 },
 * };
 * 
 * renderNotification(callback);
 * ```
 * 
 * ### Notes:
 * - This interface is particularly useful for customizing the rendering of notifications, 
 *   allowing developers to define how notifications should look and behave based on their 
 *   specific requirements.
 * - Ensure that the `context` property is used appropriately to interact with the notification 
 *   system, especially for actions like closing or updating notifications.
 */
export interface INotifyRenderCallback {
  props: INotifyProps;
  context: Notify;
  data: IDict;
  style: IStyle;
};

/**
 * @interface INotifyRenderOptions
 * 
 * Represents the options for customizing the rendering of notifications within the application.
 * This interface provides various callback functions that allow developers to define how 
 * different parts of the notification should be rendered, including the title, message, 
 * icon, and cancel button.
 * 
 * ### Properties:
 * 
 * - **renderCancel**: A callback function that renders the cancel icon for the notification. 
 *   This function receives an `INotifyRenderCallback` object, which provides context and 
 *   data for rendering.
 *   - **Type**: `(options: INotifyRenderCallback) => ReactNode`
 *   - **Example**: 
 *     ```typescript
 *     renderCancel: (options) => <Icon name="cancel" onClick={options.context.closeAction} />
 *     ```
 * 
 * - **renderTitle**: A callback function that renders the title of the notification. 
 *   This allows for custom rendering of the title based on the provided options.
 *   - **Type**: `(options: INotifyRenderCallback) => ReactNode`
 *   - **Example**: 
 *     ```typescript
 *     renderTitle: (options) => <Text style={{ fontWeight: 'bold' }}>{options.data.title}</Text>
 *     ```
 * 
 * - **renderMessage**: A callback function that renders the main content of the notification. 
 *   This function can be used to customize how the message is displayed.
 *   - **Type**: `(options: INotifyRenderCallback) => ReactNode`
 *   - **Example**: 
 *     ```typescript
 *     renderMessage: (options) => <Text>{options.data.message}</Text>
 *     ```
 * 
 * - **renderIcon**: A callback function that renders the main icon for the notification. 
 *   This allows for dynamic rendering of icons based on the notification type or state.
 *   - **Type**: `(options: INotifyRenderCallback) => ReactNode`
 *   - **Example**: 
 *     ```typescript
 *     renderIcon: (options) => <Icon name={options.data.type === 'error' ? 'error' : 'info'} />
 *     ```
 * 
 * - **wrapperProps**: Properties for the animated wrapper component that displays the notification. 
 *   This allows for customization of the animation behavior and style.
 *   - **Type**: `Animated.AnimatedProps<IStyle>`
 *   - **Example**: 
 *     ```typescript
 *     wrapperProps: { style: { opacity: 1 } }
 *     ```
 * 
 * - **titleProps**: Properties for customizing the title of the notification. This can include 
 *   styles, accessibility properties, and other relevant settings.
 *   - **Type**: `ILabelProps`
 *   - **Example**: 
 *     ```typescript
 *     titleProps: { style: { color: 'blue' } }
 *     ```
 * 
 * - **messageProps**: Properties for customizing the message content of the notification. 
 *   Similar to `titleProps`, this can include styles and other settings.
 *   - **Type**: `ILabelProps`
 *   - **Example**: 
 *     ```typescript
 *     messageProps: { style: { fontSize: 14 } }
 *     ```
 * 
 * - **iconProps**: Properties for customizing the icon component used in the notification. 
 *   This allows for additional styling or behavior to be applied to the icon.
 *   - **Type**: `IFontIconProps`
 *   - **Example**: 
 *     ```typescript
 *     iconProps: { size: 20, color: 'red' }
 *     ```
 * 
 * - **onClose**: A callback function that is triggered when the notification is closed. 
 *   This can be used to perform additional actions or cleanup when the notification is dismissed.
 *   - **Type**: `(options: INotifyRenderCallback) => any`
 *   - **Example**: 
 *     ```typescript
 *     onClose: (options) => console.log("Notification closed", options.data)
 *     ```
 * 
 * - **onCancel**: A callback function that is triggered when the cancel action is performed. 
 *   This allows for handling specific logic when the user cancels the notification.
 *   - **Type**: `(options: INotifyRenderCallback) => any`
 *   - **Example**: 
 *     ```typescript
 *     onCancel: (options) => console.log("Notification canceled", options.data)
 *     ```

*/
export interface INotifyRenderOptions {
  renderCancel?: (options: INotifyRenderCallback) => ReactNode; //permet de render l'icone cancel
  renderTitle?: (options: INotifyRenderCallback) => ReactNode; //permet de render le titre de la notification
  renderMessage?: (options: INotifyRenderCallback) => ReactNode; //permet de render le contenu de la notification de la notification
  renderIcon?: (options: INotifyRenderCallback) => ReactNode; //render l'icone principal rendu par le compat
  wrapperProps?: Animated.AnimatedProps<IStyle>; //les props du composant animation, composant wrapper à l'affichage de l'animation
  titleProps?: ILabelProps; //les props du titre de la notification
  messageProps?: ILabelProps; //les props du contenu
  iconProps?: IFontIconProps; //les props du composant icon
  onClose?: (options: INotifyRenderCallback) => any;
  onCancel?: (options: INotifyRenderCallback) => any;
}
/**
 * * @type INotifyProps
 * 
 * Represents the properties for the Notify component. 
 * This type extends `IViewProps` and `INotifyRenderOptions`, allowing for a comprehensive 
 * set of options to customize the behavior, appearance, and interaction of notifications.
 * 
 * ### Properties:
 * 
 * - **closeInterval**: The duration (in milliseconds) for which the notification should be displayed 
 *   before automatically closing. If not specified, the default behavior will apply.
 *   - **Type**: `number`
 *   - **Example**: 
 *     ```typescript
 *     closeInterval: 5000 // Notification will close after 5 seconds
 *     ```
 * 
 * - **startDelta**: The initial offset for the notification's position when it appears. This can 
 *   be used to create a sliding effect or adjust the starting position of the notification.
 *   - **Type**: `number`
 *   - **Example**: 
 *     ```typescript
 *     startDelta: 20 // Notification starts 20 pixels from its final position
 *     ```
 * 
 * - **endDelta**: The final offset for the notification's position when it is fully displayed. 
 *   This can be used in conjunction with `startDelta` for animations.
 *   - **Type**: `number`
 *   - **Example**: 
 *     ```typescript
 *     endDelta: 0 // Notification ends at its final position
 *     ```
 * 
 * - **showCancel**: A boolean indicating whether to show a cancel button on the notification. 
 *   This allows users to dismiss the notification manually.
 *   - **Type**: `boolean`
 *   - **Example**: 
 *     ```typescript
 *     showCancel: true // Show the cancel button
 *     ```
 * 
 * - **tapToCloseEnabled**: A boolean indicating whether tapping the notification should close it. 
 *   This enhances user interaction by allowing dismissal through taps.
 *   - **Type**: `boolean`
 *   - **Example**: 
 *     ```typescript
 *     tapToCloseEnabled: true // Enable tap to close functionality
 *     ```
 * 
 * - **translucent**: A boolean indicating whether the notification should have a translucent background. 
 *   This can be useful for overlay notifications that allow some background visibility.
 *   - **Type**: `boolean`
 *   - **Example**: 
 *     ```typescript
 *     translucent: true // Notification background is translucent
 *     ```
 * 
 * - **useNativeDriver**: A boolean indicating whether to use the native driver for animations. 
 *   This can improve performance for animations on supported platforms.
 *   - **Type**: `boolean`
 *   - **Example**: 
 *     ```typescript
 *     useNativeDriver: true // Use native driver for animations
 *     ```
 * 
 * - **isInteraction**: A boolean indicating whether the notification is currently interactive. 
 *   This can be used to manage user interactions and animations.
 *   - **Type**: `boolean`
 *   - **Example**: 
 *     ```typescript
 *     isInteraction: true // Notification is interactive
 *     ```
 * 
 * - **elevation**: The elevation of the notification, which affects its shadow and depth appearance. 
 *   This can be used to create a layered effect in the UI.
 *   - **Type**: `number`
 *   - **Example**: 
 *     ```typescript
 *     elevation: 5 // Notification has an elevation of 5
 *     ```
 * 
 * - **zIndex**: The z-index of the notification, which determines its stacking order relative to other components. 
 *   Higher values will place the notification above lower values.
 *   - **Type**: `number`
 *   - **Example**: 
 *     ```typescript
 *     zIndex: 100 // Notification appears above other components
 *     ```
 * 
 * - **sensitivity**: A number that defines how sensitive the notification is to user interactions, 
 *   such as swipes or taps. This can be used to adjust the responsiveness of the notification.
 *   - **Type**: `number`
 *   - **Example**: 
 *     ```typescript
 *     sensitivity: 1 // Standard sensitivity for interactions
 *     ```
 * * - **panResponderEnabled**: A boolean indicating whether the notification should respond to pan gestures. 
 *   This can be useful for swipe-to-dismiss functionality.
 *   - **Type**: `boolean`
 *   - **Example**: 
 *     ```typescript
 *     panResponderEnabled: true // Enable pan gesture responses
 *     ```
 * 
 * - **accessible**: A boolean indicating whether the notification is accessible for screen readers. 
 *   This is important for ensuring that all users can interact with the notification.
 *   - **Type**: `boolean`
 *   - **Example**: 
 *     ```typescript
 *     accessible: true // Notification is accessible
 *     ```
 * 
 * - **onTap**: A callback function that is triggered when the notification container is tapped. 
 *   This allows for custom actions to be performed when the notification is interacted with.
 *   - **Type**: `(options: INotifyRenderCallback) => any`
 *   - **Example**: 
 *     ```typescript
 *     onTap: (options) => console.log("Notification tapped", options.data)
 *     ```
 * 
 * - **infoColor**: The background color for notifications of type information. 
 *   This allows for visual differentiation of notification types.
 *   - **Type**: `string`
 *   - **Example**: 
 *     ```typescript
 *     infoColor: '#2196F3' // Blue background for information notifications
 *     ```
 * 
 * - **successColor**: The background color for notifications of type success. 
 *   This helps users quickly identify successful actions.
 *   - **Type**: `string`
 *   - **Example**: 
 *     ```typescript
 *     successColor: '#4CAF50' // Green background for success notifications
 *     ```
 * 
 * - **warnColor**: The background color for notifications of type warning. 
 *   This is used to alert users to potential issues.
 *   - **Type**: `string`
 *   - **Example**: 
 *     ```typescript
 *     warnColor: '#FF9800' // Orange background for warning notifications
 *     ```
 * 
 * - **errorColor**: The background color for notifications of type error. 
 *   This indicates critical issues that need attention.
 *   - **Type**: `string`
 *   - **Example**: 
 *     ```typescript
 *     errorColor: '#F44336' // Red background for error notifications
 *     ```
 * 
 * - **infoTextColor**: The text color for notifications of type information. 
 *   This allows for better readability against the background color.
 *   - **Type**: `string`
 *   - **Example**: 
 *     ```typescript
 *     infoTextColor: '#FFFFFF' // White text for information notifications
 *     ```
 * 
 * - **successTextColor**: The text color for notifications of type success. 
 *   This enhances the visibility of success messages.
 *   - **Type**: `string`
 *   - **Example**: 
 *     ```typescript
 *     successTextColor: '#FFFFFF' // White text for success notifications
 *     ```
 * 
 * - **warnTextColor**: The text color for notifications of type warning. 
 *   This ensures that warning messages are easily readable.
 *   - **Type**: `string`
 *   - **Example**: 
 *     ```typescript
 *     warnTextColor: '#FFFFFF' // White text for warning notifications
 *     ```
 * 
 * - **errorTextColor**: The text color for notifications of type error. 
 *   This is crucial for ensuring that error messages stand out.
 *   - **Type**: `string`
 *   - **Example**: 
 *     ```typescript
 *     errorTextColor: '#FFFFFF' // White text for error notifications
 *     ```
 * 
 * - **positon**: The display position of the notification on the screen. 
 *   This can be used to control where the notification appears (e.g., top, bottom, center).
 *   - **Type**: `INotifyPostion`
 *   - **Example**: 
 *     ```typescript
 *     positon: { top: 50, left: 20 } // Position the notification 50px from the top and 20px from the left
 *     ```

 */
export type INotifyProps = IViewProps &
  INotifyRenderOptions & {
    closeInterval?: number;
    startDelta?: number;
    endDelta?: number;
    showCancel?: boolean;
    tapToCloseEnabled?: boolean;
    translucent?: boolean;
    useNativeDriver: boolean;
    isInteraction: boolean;
    elevation?: number;
    zIndex?: number;
    sensitivity: number;
    panResponderEnabled?: boolean;
    accessible: boolean;
    onTap: (options: INotifyRenderCallback) => any;
    infoColor?: string;
    successColor?: string;
    warnColor?: string;
    errorColor?: string;

    infoTextColor?: string;
    successTextColor?: string;
    warnTextColor?: string;
    errorTextColor?: string;
    positon?: INotifyPostion;
  };

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#202020",
  },
  border: {
    borderWidth: 0.5,
  },
  main: {
    maxWidth: "98%",
    paddingRight: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    maxWidth: "100%",
  },
  content: {
    maxWidth: "100%",
  },
  title: {
    fontSize: 16,
    textAlign: "left",
    maxWidth: "98%",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "transparent",
  },
  message: {
    fontSize: 14,
    maxWidth: "98%",
    flexWrap: "wrap",
    textAlign: "left",
    fontWeight: "normal",
    color: "white",
    backgroundColor: "transparent",
  },
  cancelBtn: {
    width: DEFAULT_IMAGE_DIMENSIONS,
    height: DEFAULT_IMAGE_DIMENSIONS,
  },
  cancelBtnStyle: {
    alignSelf: "center",
  },
  mainContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    flexGrow: 1,
    alignSelf: "flex-end",
    padding: 8,
  },
  defaultTextContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
