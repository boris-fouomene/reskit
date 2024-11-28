import React, { useMemo } from "react";
import View, { IViewProps } from "@components/View";
import { StyleSheet, View as RNView, Pressable, GestureResponderEvent, ViewProps, } from "react-native";
import Label, { ILabelProps } from "@components/Label";
import { IIconProps, IIconSource, useGetIcon } from "@components/Icon";
import { defaultStr } from "@resk/core";
import Theme, { useTheme, Colors } from "@theme";
import useStateCallback from "@utils/stateCallback";
import { getLabelOrLeftOrRightProps } from "@hooks/index";
import Animated, { AnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IExpandableProps } from "./types";




/**
 * A highly customizable expandable/collapsible component that supports controlled and uncontrolled modes.
 * 
 * @component Expandable
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

  leftContainerProps = Object.assign({}, leftContainerProps);
  rightContainerProps = Object.assign({}, rightContainerProps);
  contentProps = Object.assign({}, contentProps);
  (labelProps = Object.assign({}, labelProps)), (contentContainerProps = Object.assign({}, contentContainerProps));
  containerProps = Object.assign({}, containerProps);
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
  const eProps = { color: usePrimary ? theme.colors.primary : labelColor, expanded };
  const { left, right, label } = getLabelOrLeftOrRightProps({ label: customLabel, left: customLeft, right: customRight }, eProps)
  testID = defaultStr(testID, "resk-expandable");
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
        }}
        onPress={handlePressAction}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View testID={testID + "-content-container"} {...contentContainerProps} style={[styles.row, theme.styles.cursorPointer, contentContainerProps?.style]}>
          {left || (expandIcon && isIconPositionLeft) ? (
            <View testID={testID + "-left"} {...leftContainerProps} style={[styles.left, leftContainerProps?.style]}>
              {isIconPositionLeft ? expandIcon : null}
              {left}
            </View>
          ) : null}
          <Label testID={testID + "-label"} {...labelProps} style={[styles.item, styles.content, styles.center, labelProps?.style]}>
            {label}
          </Label>
          <View testID={testID + "-right"} {...rightContainerProps} style={[styles.item, styles.row, rightContainerProps?.style]}>
            {right}
            {!isIconPositionLeft ? expandIcon : null}
          </View>
        </View>
      </Pressable>
      {autoMountChildren !== false || isExpanded ? (
        <Animated.View
          testID={testID + "-content"} {...contentProps}
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

export * from "./types";