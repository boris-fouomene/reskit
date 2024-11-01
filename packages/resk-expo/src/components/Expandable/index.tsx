import React, { useMemo, useRef } from "react";
import View, { IViewProps } from "@components/View";
import { StyleSheet, View as RNView, Pressable, GestureResponderEvent, PressableProps, ViewProps, } from "react-native";
import Label, { ILabelProps } from "@components/Label";
import { Icon, IIconProps, IIconSource, useGetIcon } from "@components/Icon";
import { defaultObj, isNonNullString, defaultStr } from "@resk/core";
import Theme, { useTheme, Colors } from "@theme";
import useStateCallback from "@utils/stateCallback";
import { getLabelOrLeftOrRight, ILabelOrLeftOrRightOptions } from "@hooks/index";
import Animated, { AnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

/**
 * Interface for Expandable component props that provides collapsible/expandable functionality with customizable icons and content.
 * 
 * @interface IExpandableProps
 * @component Expandable
 * @param {IExpandableProps} props - The properties for configuring the expandable component.
 * @param {React.ForwardedRef<RNView>} ref - A ref forwarded to the root view of the component.
 *
 * 
 * @returns {JSX.Element} The rendered expandable component.
 * @extends {Omit<PressableProps, "children">}
 * @extends {ILabelOrLeftOrRightOptions<IExpandableCallbackOptions>}
 * 
 * 
 * @example
 * ```tsx
 * <Expandable
 *   label="Settings"
 *   expandedIcon="chevron-up"
 *   unexpandedIcon="chevron-down"
 *   defaultExpanded={true}
 *   expandIconPosition="right"
 * >
 *   <View>
 *     <Text>Expanded Content</Text>
 *   </View>
 * </Expandable>
 * ```
 */
export type IExpandableProps = Omit<PressableProps, "children"> & ILabelOrLeftOrRightOptions<IExpandableCallbackOptions> & {
  /** 
   * The content to be shown/hidden when expanding/collapsing
   * @type {JSX.Element}
   */
  children?: JSX.Element;

  /**
   * Props to customize the label appearance and behavior
   * @type {ILabelProps}
   */
  labelProps?: ILabelProps;

  /**
   * Callback fired when the expandable section is toggled
   * @param {Object} options - Toggle event options
   * @param {GestureResponderEvent} options.event - The native event
   * @param {boolean} [options.expanded] - The new expanded state
   */
  onToggleExpand?: (options: { event: GestureResponderEvent; expanded?: boolean }) => any;

  /**
   * Controls the expanded state when used as a controlled component
   * @type {boolean}
   */
  expanded?: boolean;

  /**
   * Icon to display when the section is expanded
   * @type {IIconSource}
   * @default "chevron-up"
   */
  expandedIcon?: IIconSource;

  /**
   * Initial expanded state when uncontrolled
   * @type {boolean}
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Props applied to the expanded state icon
   * @type {IIconProps}
   */
  expandedIconProps?: IIconProps;

  /**
   * Icon to display when the section is collapsed
   * @type {IIconSource}
   * @default "chevron-down"
   */
  unexpandedIcon?: IIconSource;

  /**
   * Props applied to the unexpanded state icon
   * @type {IIconProps}
   */
  unexpandedIconProps?: IIconProps;

  /**
   * Props for the left container view
   * @type {IViewProps}
   */
  leftContainerProps?: IViewProps;

  /**
   * Position of the expand/collapse icon
   * @type {"left" | "right"}
   * @default "right"
   */
  expandIconPosition?: "left" | "right";

  /**
   * Props for the content wrapper view
   * @type {IViewProps}
   */
  contentProps?: AnimatedProps<ViewProps>;

  /**
   * Whether to mount children even when collapsed
   * @type {boolean}
   * @default false
   */
  autoMountChildren?: boolean;

  /**
   * Props for the right container view
   * @type {IViewProps}
   */
  rightContainerProps?: IViewProps;

  /**
   * Props for the content container view
   * @type {IViewProps}
   */
  contentContainerProps?: IViewProps;

  /**
   * Whether to show the expand/collapse icon
   * @type {boolean}
   * @default true
   */
  showExpandIcon?: boolean;

  /**
   * Props for the main container view
   * @type {IViewProps}
   */
  containerProps?: IViewProps;

  /**
   * Whether to use primary color for expanded state
   * @type {boolean}
   * @default true
   */
  usePrimaryColorWhenExpended?: boolean;
}

/**
 * Configuration options passed to callbacks when the expandable state changes
 * 
 * @interface IExpandableCallbackOptions
 * 
 * @property {string} [color] - The current color value at the time of callback
 * @property {boolean} expanded - The current expanded state
 * 
 * @example
 * ```tsx
 * const handleToggle = ({ expanded, color }: IExpandableCallbackOptions) => {
 *   console.log(`Expandable is now ${expanded ? 'open' : 'closed'}`);
 *   console.log(`Current color: ${color}`);
 * };
 * ```
 */
interface IExpandableCallbackOptions {
  color?: string; //la couleur à l'instant t
  expanded: boolean;
}

/**
 * A highly customizable expandable/collapsible component that supports controlled and uncontrolled modes.
 * 
 * @component
 * @param {IExpandableProps} props - Component properties
 * @param {React.ForwardedRef<RNView>} ref - Forwarded ref for the root View component
 * 
 * @remarks
 * The component supports both left and right content placement, custom icons, and extensive styling options.
 * It can be used in both controlled and uncontrolled modes for expansion state management.
 * 
 * @example
 * ```tsx
 * // Basic uncontrolled usage
 * <Expandable
 *   label="Basic Settings"
 *   defaultExpanded={true}
 * >
 *   <SettingsContent />
 * </Expandable>
 * 
 * // Controlled usage with custom icons and callbacks
 * <Expandable
 *   label="Advanced Settings"
 *   expanded={isExpanded}
 *   expandedIcon="arrow-up"
 *   unexpandedIcon="arrow-down"
 *   expandIconPosition="left"
 *   onToggleExpand={({ expanded, event }) => {
 *     console.log('Expanded state:', expanded);
 *     handleExpand(expanded);
 *   }}
 *   leftContainerProps={{
 *     style: { backgroundColor: '#f5f5f5' }
 *   }}
 * >
 *   <AdvancedSettings />
 * </Expandable>
 * 
 * // With custom left/right content
 * <Expandable
 *   label="Custom Layout"
 *   left={<Icon name="settings" />}
 *   right={<Badge count={3} />}
 *   usePrimaryColorWhenExpended={true}
 * >
 *   <ContentView />
 * </Expandable>
 * ```
 * 
 * @see {@link IExpandableProps} for complete props documentation
 * @see {@link IExpandableCallbackOptions} for callback options
 */

export const Expandable = React.forwardRef(({ left: customLeft, expandedIconProps, children: customChildren, unexpandedIconProps, right: customRight, label: customLabel, usePrimaryColorWhenExpended, onToggleExpand, testID, onPress, expanded: expandedProp, expandedIcon, defaultExpanded, unexpandedIcon, leftContainerProps, rightContainerProps, contentProps, labelProps, contentContainerProps, showExpandIcon, containerProps, autoMountChildren = false, style, expandIconPosition, ...props }: IExpandableProps, ref: React.ForwardedRef<RNView>) => {
  const theme = useTheme();
  const children = useMemo(() => {
    return customChildren;
  }, [customChildren]);

  const opacity = useSharedValue(0); // Starting opacity

  leftContainerProps = defaultObj(leftContainerProps);
  rightContainerProps = defaultObj(rightContainerProps);
  contentProps = defaultObj(contentProps);
  (labelProps = defaultObj(labelProps)), (contentContainerProps = defaultObj(contentContainerProps));
  containerProps = defaultObj(containerProps);
  expandIconPosition = expandIconPosition || "right";
  const isIconPositionLeft = expandIconPosition == "left" ? true : false;
  const isControlled = typeof expandedProp == "boolean" ? true : false;
  const [expanded, setExpanded] = useStateCallback<boolean>(isControlled ? (expandedProp as boolean) : !!defaultExpanded);
  const handlePressAction = (event: GestureResponderEvent) => {
    // Collapse animation
    opacity.value = withTiming(expanded ? 0 : 1, { duration: 300 });
    if (!isControlled) {
      setExpanded((expanded: boolean) => !expanded, (newExpanded) => {
        if (typeof onToggleExpand == "function") {
          onToggleExpand({ expanded: newExpanded as boolean, event });
        }
      });
    } else if (typeof onToggleExpand == "function") {
      onToggleExpand({ expanded: !expanded, event });
    }
    if (typeof onPress == "function") {
      onPress?.(event);
    }
  };
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));


  React.useEffect(() => {
    if (!isControlled) {
      if (typeof expandedProp == "boolean" && expandedProp !== expanded) {
        setExpanded(expandedProp);
      }
    }
  }, [expandedProp]);

  const labelColor = Colors.setAlpha(theme.colors.text, 0.87);
  const isExpanded = expanded ? true : false;
  const usePrimary = isExpanded && usePrimaryColorWhenExpended !== false ? true : false;
  const eProps = { color: usePrimary ? theme.colors.primary : labelColor };
  const { left, right, label } = getLabelOrLeftOrRight({ label: customLabel, left: customLeft, right: customRight }, eProps)
  testID = defaultStr(testID, "RN_Expandable");
  const iconProps = Object.assign({}, expanded ? expandedIconProps : unexpandedIconProps);
  const icon = useGetIcon<{ expanded: boolean }>({ ...iconProps, ...eProps, size: 24, expanded: isExpanded, onPress: handlePressAction, icon: expanded ? (expandedIcon || "chevron-up") : (unexpandedIcon || "chevron-down") })
  const expandIcon = showExpandIcon !== false ? icon : null;

  return (
    <View testID={testID + "_ExpandableContainer"} {...containerProps} style={[styles.container, containerProps.style]}>
      <Pressable
        ref={ref}
        {...props}
        testID={testID}
        style={(state) => {
          return [typeof style == "function" ? style(state) : style]
        }
        }
        onPress={handlePressAction}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View testID={testID + "_ContentContainer"} {...contentContainerProps} style={[styles.row, Theme.styles.cursorPointer, contentContainerProps?.style]}>
          {left || (expandIcon && isIconPositionLeft) ? (
            <View testID={testID + "_Left"} {...leftContainerProps} style={[styles.left]}>
              {isIconPositionLeft ? expandIcon : null}
              {left}
            </View>
          ) : null}
          <Label testID={testID + "_Label"} {...labelProps} style={[styles.item, styles.content, styles.center, labelProps?.style]}>
            {label}
          </Label>
          <View testID={testID + "_Right"} {...rightContainerProps} style={[styles.item, styles.row, rightContainerProps?.style]}>
            {right}
            {!isIconPositionLeft ? expandIcon : null}
          </View>
        </View>
      </Pressable>
      {autoMountChildren !== false || isExpanded ? (
        <Animated.View
          testID={testID + "_Content"} {...contentProps}
          style={[
            styles.content,
            styles.children, contentProps?.style,
            animatedStyle,
          ]} 
        >
          {children}
        </Animated.View>
      ) : null}
    </View>
  );
});

Expandable.displayName = "Expandable";

const styles = StyleSheet.create({
  center: {
    justifyContent: "flex-start",
  },
  container: {
    padding: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  multiline: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  item: {
    margin: 0,
  },
  child: {
    paddingLeft: 64,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    maxWidth: "100%",
    paddingHorizontal: 7,
  },
  children: {
    marginLeft: 8,
  },
});
