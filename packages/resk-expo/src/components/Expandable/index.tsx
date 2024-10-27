import React from "react";
import View, { IViewProps } from "@components/View";
import { StyleSheet, View as RNView, Pressable, GestureResponderEvent, PressableProps } from "react-native";
import Label, { ILabelProps } from "@components/Label";
import { Icon, IIconProps, IIconSource, useGetIcon } from "@components/Icon";
import { defaultObj, isNonNullString, defaultStr } from "@resk/core";
import { Surface } from "@components/Surface";
import Theme, { useTheme, Colors } from "@theme";
import useStateCallback from "@utils/stateCallback";
import { getLabelOrLeftOrRightProps, ILabelOrLeftOrRightProps } from "@hooks/index";
import { lab } from "color";

/**
 * Represents the properties for an expandable component, allowing for rich customization
 * of its behavior, appearance, and content.
 *
 * @interface IExpandableProps
 * @extends Omit<PressableProps, "children"> - Excludes the `children` property from the 
 *   PressableProps, as it is handled separately.
 * @extends ILabelOrLeftOrRightProps<IExpandableCallbackOptions> - Includes additional properties
 *                    related to label handling and options.
 *
 * @property {JSX.Element} [children] - Optional children to be displayed within the expandable
 *                  component. This is typically the content that will be
 *                  revealed when the component is expanded.
 *                  Example:
 *                  ```typescript
 *                  const MyExpandable: React.FC<IExpandableProps> = () => (
 * <ExpandableComponent>
 *     <Text>Expandable Content</Text>
 * </ExpandableComponent>
 *
 * @property {ILabelProps} [labelProps] - Properties useful for rendering the label of the
 *expandable component.
 *Example:
 *```typescript
 *const options: IExpandableProps = {
 *    labelProps: {},
 *};
 *```
 * @property {(options: { event: GestureResponderEvent; expanded?: boolean }) => any} [onToggleExpand] - 
 *Callback function triggered when the component is toggled.
 *It receives an event and the current expanded state.
 *Example:
 *```typescript
 *const options: IExpandableProps = {
 *    onToggleExpand: (options) => {
 *        console.log('Toggled:', options.expanded);
 *    },
 *};
 *```
 *
 * @property {boolean} [expanded] - Indicates whether the expandable component is currently expanded.
 *              Default is `false`.
 *              Example:
 *              ```typescript
 *              const options: IExpandableProps = {
 *                  expanded: true,
 *              };
 *              ```
 *
 * @property {any} [expandedIcon] - Icon to display when the component is expanded.
 *              Example:
 *              ```typescript
 *              const options: IExpandableProps = {
 *                  expandedIcon: <Icon name="chevron-up" />,
 *              };
 *              ```
 *
 * @property {boolean} [defaultExpanded] - If true, the component is expanded by default.
 *Example:
 *```typescript
 *const options: IExpandableProps = {
 *    defaultExpanded: true,
 *};
 *```
 *
 * @property {IIconProps} [expandIconProps] - Properties for the expanded icon.
 *   Example:
 *   ```typescript
 *   const options: IExpandableProps = {
 *       expandIconProps: { },
 *   };
 *   ```
 *
 * @property {any} [unexpandedIcon] - Icon to display when the component is not expanded.
 *                Example:
 *                ```typescript
 *                const options: IExpandableProps = {
 *                    unexpandedIcon: <Icon name="chevron-down" />,
 *                };
 *                ```
 *
 * @property {IIconProps} [unexpandedIconProps] - Properties for the unexpanded icon.
 *      Example:
 *      ```typescript
 *      const options: IExpandableProps = {
 *          unexpandedIconProps: {},
 *      };
 *      ```
 *
 * @property {IViewProps} [leftContainerProps] - Properties to pass to the view rendering the
 *     left content of the expandable.
 *     Example:
 *     ```typescript
 *     const options: IExpandableProps = {
 *         leftContainerProps: { },
 *     };
 *     ```
 *
 * @property {"left" | "right"} [expandIconPosition] - Specifies the position of the expand icon
 *            relative to the label. Defaults to "right".
 *            Example:
 *            ```typescript
 *            const options: IExpandableProps = {
 *                expandIconPosition: " left",
 *            };
 *            ```
 *
 * @property {IIconSource} [expandIcon] - The icon source for the expand icon.
 *                    Example:
 *                    ```typescript
 *                    const options: IExpandableProps = {
 *   expandIcon: {  },
 *                    };
 *                    ```
 *
 * @property {IViewProps} [labelProps] - Properties to pass to the view rendering the
 *       label of the expandable.
 *       Example:
 *       ```typescript
 *       const options: IExpandableProps = {
 *           labelProps: {},
 *       };
 *       ```
 *
 * @property {IViewProps} [contentProps] - Properties to pass to the view rendering the content
 *of the expandable.
 *Example:
 *```typescript
 *const options: IExpandableProps = {
 *    contentProps: { },
 *};
 *```
 *
 * @property {boolean} [autoMountChildren] - If true, the children of the expandable component
 * will be mounted but hidden, and when toggled, they
 * will be displayed.
 * Example:
 * ```typescript
 * const options: IExpandableProps = {
 *     autoMountChildren: true,
 * };
 * ```
 *
 * @property {IViewProps} [rightContainerProps] - Properties to pass to the view rendering the
 *       right content of the expandable.
 *       Example:
 *       ```typescript
 *       const options: IExpandableProps = {
 *           rightContainerProps: {},
 *       };
 *       ```
 *
 * @property {IViewProps} [contentContainerProps] - Properties to pass to the view rendering the
 *          content container of the expandable.
 *          Example:
 *          ```typescript
 *          const options: IExpandableProps = {
 *              contentContainerProps: {},
 *          };
 *          ```
 *
 * @property {boolean} [showExpandIcon] - If true, the expand icon will be visible.
 *                   Example:
 *                   ```typescript
 *                   const options: IExpandableProps = {
 *  showExpandIcon: false,
 *                   };
 *                   ```
 *
 * @property {IViewProps} [containerProps] - Properties to pass to the container component of
 *  the expandable.
 *  Example:
 *  ```typescript
 *  const options: IExpandableProps = {
 *      containerProps: {},
 *  };
 *  ```
 *
 * @property {boolean} [usePrimaryColorWhenExpended] - Specifies whether the primary color should
 *           be used as the text color when the item is expanded.
 *           Example:
 *           ```typescript
 *           const options: IExpandableProps = {
 *               usePrimaryColorWhenExpended: true,
 *           };
 *           ```
 *
 * @remarks 
 * This type provides a comprehensive set of properties to customize the behavior and appearance
 * of an expandable component. It is essential to understand each property's purpose and usage to
 * effectively utilize this type.
 */
export type IExpandableProps = Omit<PressableProps, "children"> & ILabelOrLeftOrRightProps<IExpandableCallbackOptions> & {
  children?: JSX.Element,
  labelProps?: ILabelProps;
  onToggleExpand?: (options: { event: GestureResponderEvent; expanded?: boolean }) => any;
  expanded?: boolean;
  expandedIcon?: any;
  defaultExpanded?: boolean;
  expandIconProps?: IIconProps;
  unexpandedIcon?: any;
  unexpandedIconProps?: IIconProps;
  leftContainerProps?: IViewProps;
  expandIconPosition?: "left" | "right";
  expandIcon?: IIconSource;
  contentProps?: IViewProps;
  autoMountChildren?: boolean;
  rightContainerProps?: IViewProps;
  contentContainerProps?: IViewProps;
  showExpandIcon?: boolean;
  containerProps?: IViewProps;
  usePrimaryColorWhenExpended?: boolean;
}

interface IExpandableCallbackOptions {
  color?: string; //la couleur à l'instant t
}

/***
 * /**
 * A customizable expandable component that allows for toggling visibility of its content.
 * It supports various properties for customization including labels, icons, and styles.
 *
 * @component Expandable
 * @param {IExpandableProps} props - The properties for configuring the expandable component.
 * @param {React.ForwardedRef<RNView>} ref - A ref forwarded to the root view of the component.
 *
 * @returns {JSX.Element} The rendered expandable component.
 *
 * @example
 * Here's a simple example of how to use the Expandable component:
 * ```typescript
 * const MyExpandableComponent = () => {
 *     return (
 *         <Expandable
 *             label="Click to Expand"
 *             expandedIcon={<Icon name="chevron-up" />}
 *             unexpandedIcon={<Icon name="chevron-down" />}
 *             onToggleExpand={({ expanded }) => console.log('Expanded:', expanded)}
 *         >
 *             <Text>This content is revealed when expanded.</Text>
 *         </Expandable>
 *     );
 * };
 * ```
 *
 * @remarks
 * The Expandable component can be controlled externally through the `expanded` prop, or it can manage its own state internally.
 * The component's styles and behavior can be customized through various props, allowing for flexible integration into different UI designs.
 */
export const Expandable = React.forwardRef(({ left: customLeft, right: customRight, expandIcon: customIcon, label: customLabel, usePrimaryColorWhenExpended, onToggleExpand, children, testID, onPress, expanded: expandedProp, expandedIcon, defaultExpanded, expandIconProps, unexpandedIcon, leftContainerProps, rightContainerProps, contentProps, labelProps, contentContainerProps, showExpandIcon, containerProps, autoMountChildren = false, style, expandIconPosition, ...props }: IExpandableProps, ref: React.ForwardedRef<RNView>) => {
  const theme = useTheme();
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
    if (!isControlled) {
      setExpanded((expanded: boolean) => !expanded, (newExpanded) => {
        if (typeof onToggleExpand == "function") {
          onToggleExpand({ expanded: newExpanded as boolean, event });
        }
      });
    };
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
  const eProps = { color: usePrimary ? theme.colors.primary : labelColor };
  const { left, right, label } = getLabelOrLeftOrRightProps({ label: customLabel, left: customLeft, right: customRight }, eProps)
  testID = defaultStr(testID, "RN_Expandable");
  const icon = useGetIcon<{ expanded: boolean }>({ ...Object.assign({}, expandIconProps), ...eProps, size: 24, onPress: handlePressAction, icon: customIcon || isExpanded ? expandedIcon || "chevron-up" : unexpandedIcon || "chevron-down", expanded: isExpanded })
  const expandIcon = showExpandIcon !== false ? icon : null;
  return (
    <View testID={testID + "_ExpandableContainer"} {...containerProps}>
      <Pressable
        ref={ref}
        {...props}
        testID={testID}
        style={(state) => {
          return [styles.container, typeof style == "function" ? style(state) : style]
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
        <View testID={testID + "_Content"} {...contentProps} style={[{ maxWidth: "100%" }, styles.children, contentProps?.style, !isExpanded && { opacity: 0, height: 0 }]}>
          {children}
        </View>
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
  },
  children: {
    marginLeft: 8,
  },
});
