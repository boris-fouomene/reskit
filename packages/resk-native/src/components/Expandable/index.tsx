import * as React from "react";
import { useMemo, useRef } from "react";
import View from "@components/View";
import { StyleSheet, View as RNView, Pressable, Animated, GestureResponderEvent, } from "react-native";
import Label from "@components/Label";
import { Icon, useGetIcon } from "@components/Icon";
import { defaultStr } from "@resk/core/utils";
import { useTheme, Colors } from "@theme";
import useStateCallback from "@utils/stateCallback";
import { getLabelOrLeftOrRightProps } from "@hooks/label2left2right";
import { IExpandableContext, IExpandableProps } from "./types";
import { isRTL } from "@utils/i18nManager";

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

export const Expandable = React.forwardRef(({ left: customLeft, expandIconSize, expandedIconProps, children: customChildren, unexpandedIconProps, right: customRight, label: customLabel, usePrimaryColorWhenExpended, onToggleExpand, testID, onPress, expanded: expandedProp, expandedIcon, defaultExpanded, unexpandedIcon, leftContainerProps, rightContainerProps, contentProps, labelProps, contentContainerProps, showExpandIcon, containerProps, autoMountChildren = false, style, expandIconPosition, ...props }: IExpandableProps, ref: React.ForwardedRef<RNView>) => {
  const theme = useTheme();
  const children = useMemo(() => {
    return customChildren;
  }, [customChildren]);

  const opacity = useRef(new Animated.Value(0)).current; // Starting opacity

  leftContainerProps = Object.assign({}, leftContainerProps);
  rightContainerProps = Object.assign({}, rightContainerProps);
  contentProps = Object.assign({}, contentProps);
  (labelProps = Object.assign({}, labelProps)), (contentContainerProps = Object.assign({}, contentContainerProps));
  containerProps = Object.assign({}, containerProps);
  expandIconPosition = expandIconPosition || "right";
  const isIconPositionLeft = expandIconPosition == "left" ? true : false;
  const isControlled = typeof expandedProp == "boolean" ? true : false;
  const [expanded, setExpanded] = useStateCallback<boolean>(isControlled ? (expandedProp as boolean) : !!defaultExpanded);
  const toggleExpand = (event?: GestureResponderEvent, callback?: (newExpanded: boolean) => void) => {
    // Collapse animation
    opacity.setValue(expanded ? 0 : 1);
    if (!isControlled) {
      setExpanded((expanded: boolean) => !expanded, (newExpanded) => {
        if (typeof onToggleExpand == "function") {
          onToggleExpand({ expanded: newExpanded as boolean, event });
        }
        if (typeof callback == "function") {
          callback(newExpanded as boolean);
        }
      });
    } else if (typeof onToggleExpand == "function") {
      const newExpanded = !expanded;
      onToggleExpand({ expanded: newExpanded, event });
      if (typeof callback == "function") {
        callback(newExpanded);
      }
    }
  };
  const handlePressAction = (event: GestureResponderEvent) => {
    toggleExpand(event);
    if (typeof onPress == "function") {
      onPress?.(event);
    }
  };

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
  const iconSize = useMemo(() => typeof expandIconSize == "number" ? expandIconSize : 20, [expandIconSize]);
  const icon = useGetIcon<{ expanded: boolean }>({ IconComponent: Icon.Button, size: iconSize, ...iconProps, ...eProps, style: [styles.expandableIcon, iconProps.style], expanded: isExpanded, onPress: handlePressAction, icon: expanded ? (expandedIcon || "chevron-up") : (unexpandedIcon || "chevron-down") })
  const expandIcon = showExpandIcon !== false ? icon : null;
  return (
    <ExpandableContext.Provider value={{ expanded, toggleExpand, expandIcon: icon }}>
      <View testID={testID + "-container"} {...containerProps} style={[styles.container, containerProps.style]}>
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
              { opacity },
            ]}
          >
            {children}
          </Animated.View>
        ) : null}
      </View>
    </ExpandableContext.Provider>
  );
});

Expandable.displayName = "Expandable";

/**
 * Creates a context for managing the expanded/collapsed state of an expandable component.
 * 
 * The `ExpandableContext` provides a way to share the expanded state and the function to toggle
 * that state across different components in the application. It is initialized with an empty object
 * cast to `IExpandableContext`, which should be properly provided by a context provider higher in the component tree.
 * 
 * @constant ExpandableContext
 * @type {React.Context<IExpandableContext>}
 * 
 * @remarks
 * This context is typically used in conjunction with the `IExpandableContext` interface to manage
 * the state of expandable components. Ensure that a provider is used to wrap components that need access
 * to this context.
 * 
 * @example
 * // Example of providing the ExpandableContext in a component
 * 
 * import React, { useState } from 'react';
 * import { ExpandableContext } from './ExpandableContext';
 * 
 * const ExpandableProvider: React.FC = ({ children }) => {
 *   const [expanded, setExpanded] = useState(false);
 * 
 *   return (
 *     <ExpandableContext.Provider value={{ expanded, setExpanded }}>
 *       {children}
 *     </ExpandableContext.Provider>
 *   );
 * };
 */
const ExpandableContext = React.createContext<IExpandableContext>({} as IExpandableContext);

/**
 * A custom hook that provides access to the `ExpandableContext`.
 * 
 * This hook allows components to easily access the current expanded state and the function to toggle
 * that state without needing to use the `useContext` hook directly.
 * 
 * @returns {IExpandableContext} The current context value, which includes the `expanded` state and
 * the `setExpanded` function.
 * 
 * @example
 * // Example of using the useExpandable hook in a component
 * 
 * import * as React from 'react';
 * import { useExpandable } from './ExpandableContext';
 * 
 * const MyExpandableComponent: React.FC = () => {
 *   const { expanded, toggleExpand } = useExpandable();
 *   return (
 *     <div>
 *       <button onPress={(event) => toggleExpand(event)}>
 *         {expanded ? 'Collapse' : 'Expand'}
 *       </button>
 *       {expanded && <div>Here is the expandable content!</div>}
 *     </div>
 *   );
 * };
 */
export const useExpandable = () => React.useContext(ExpandableContext);

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
    [isRTL ? "paddingRight" : "paddingLeft"]: 64,
  },
  expandableIcon: {
    marginHorizontal: 7,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    maxWidth: "100%",
    paddingLeft: 7,
  },
  children: {
    marginLeft: 8,
  },
});

export * from "./types";
