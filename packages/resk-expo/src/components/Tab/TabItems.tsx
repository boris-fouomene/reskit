import React from 'react';
import View, { IViewProps } from "@components/View";
import {
  Animated,
  StyleSheet,
  Platform as RNPlatform,
  ScrollViewProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import Theme, { Colors, useTheme } from "@theme";
import Platform from "@platform";
import { defaultStr, IDict, isObj } from "@resk/core";
import stableHash from "stable-hash";
import { ScrollView } from 'react-native';
const showScrollBarIndicator = !Platform.isMobileBrowser() && !Platform.isMobileNative();

import { ViewProps } from 'react-native';
import { ITabItemsProps } from './types';
import { userTabs } from './context';
import platform from '@platform';

const TabItems = ({
  children,
  scrollable = true,
  indicatorProps,
  disableIndicator,
  elevation = 7,
  fixed = false,
  testID,
  style,
  onPress,
  scrollViewProps,
  ...rest
}: ITabItemsProps) => {
  const { activeIndex: cIndex, setActiveIndex } = userTabs();
  const activeIndex = cIndex || 0;
  indicatorProps = Object.assign({}, indicatorProps);
  const indicatorStyle: IDict = Object.assign({}, StyleSheet.flatten(indicatorProps.style));
  const animationRef = React.useRef(new Animated.Value(0));
  const scrollViewRef = React.useRef<ScrollView>(null);
  const scrollViewPosition = React.useRef(0);
  const rStyle = Object.assign({}, StyleSheet.flatten(style));
  const tabItemsPosition = React.useRef<{ width: number, position: number }[]>([]);
  const [tabContainerWidth, setTabContainerWidth] = React.useState(0);

  const scrollHandler = React.useCallback(() => {
    if (tabItemsPosition.current.length > activeIndex || 0) {
      let itemStartPosition =
        activeIndex === 0 ? 0 : tabItemsPosition.current[activeIndex - 1].position;
      let itemEndPosition = tabItemsPosition.current[activeIndex].position;

      const scrollCurrentPosition = scrollViewPosition.current;
      const tabContainerCurrentWidth = tabContainerWidth;

      let scrollX = scrollCurrentPosition;

      if (itemStartPosition < scrollCurrentPosition) {
        scrollX += itemStartPosition - scrollCurrentPosition;
      } else if (
        scrollCurrentPosition + tabContainerCurrentWidth <
        itemEndPosition
      ) {
        scrollX +=
          itemEndPosition - (scrollCurrentPosition + tabContainerCurrentWidth);
      }
      scrollViewRef.current?.scrollTo({
        x: scrollX,
        y: 0,
        animated: true,
      });
    }
  }, [tabContainerWidth, activeIndex]);

  React.useEffect(() => {
    Animated.timing(animationRef.current, {
      toValue: activeIndex || 0,
      useNativeDriver: platform.isMobileNative(),
      duration: 170,
    }).start();
    scrollable && requestAnimationFrame(scrollHandler);
  }, [animationRef, scrollHandler, activeIndex, scrollable]);

  const onScrollHandler = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollViewPosition.current = event.nativeEvent.contentOffset.x;
  }, []);
  const activeIndicatorLayout = tabItemsPosition.current[activeIndex];
  const WIDTH = activeIndicatorLayout?.width;
  const getLeftPosition = React.useCallback(() => {
    let left = 0;
    for (let i = 0; i < (activeIndex || 0); i++) {
      if (isObj(tabItemsPosition.current[i]) && typeof tabItemsPosition.current[i].width == 'number') {
        left += tabItemsPosition.current[i].width;
      }
    }
    return left;
  }, [activeIndex])
  indicatorStyle.left = getLeftPosition();
  testID = defaultStr(testID, "resk-tab");
  scrollViewProps = Object.assign({}, scrollViewProps)
  const childrenContent = React.useMemo(() => {
    return React.Children.map(children, (child, index) => {
      const active = index === activeIndex ? true : false;
      return React.cloneElement(child as any,
        {
          onPress: (e: GestureResponderEvent) => {
            if (typeof onPress == "function") {
              onPress(e);
            }
            typeof setActiveIndex == "function" && setActiveIndex({ index, prevIndex: activeIndex as number });
          },
          onLayout: (event: LayoutChangeEvent) => {
            const { width } = event.nativeEvent.layout;
            const previousItemPosition =
              tabItemsPosition.current[index - 1]?.position || 0;

            tabItemsPosition.current[index] = {
              position: previousItemPosition + width,
              width,
            };
          },
          activeIndex,
          index,
          active,
          testID: testID + '-children-' + index
        }
      );
    })
  }, [stableHash({ children, activeIndex })])
  return (<View
    {...rest}
    testID={testID}
    style={[
      elevation && Theme.elevations[elevation],
      styles.viewStyle,
      rStyle,
    ]}
    onLayout={({ nativeEvent: { layout } }) => {
      setTabContainerWidth(layout.width);
    }}
  >
    <ScrollView
      {...scrollViewProps}
      showsHorizontalScrollIndicator={showScrollBarIndicator}
      scrollEventThrottle={0}
      horizontal
      ref={scrollViewRef}
      testID={testID + "-scroll-view"}
      onScroll={onScrollHandler}
    >
      {childrenContent}
      {!disableIndicator && (
        <Animated.View
          {...indicatorProps}
          testID={testID + '-indicator'}
          style={[
            styles.indicator,
            {
              width: WIDTH,
            },
            indicatorStyle,
          ]}
        />
      )}
    </ScrollView>
    <Animated.View
      testID={testID + "-shadow"}
      style={[
        styles.removeTopShadow,
        {
          height: elevation,
          backgroundColor: rStyle.backgroundColor,
          top: -elevation,
        },
      ]}
    />
  </View>);
};

const styles = StyleSheet.create({
  relative: {
    position: 'relative'
  },
  buttonStyle: {
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  titleStyle: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    textTransform: 'uppercase',
  },
  viewStyle: {
    flexDirection: 'row',
    position: 'relative',
    maxWidth: '100%',
    minHeight: 50,
  },
  indicator: {
    display: 'flex',
    position: 'absolute',
    height: 4,
    bottom: 0,
    width: '100%',
    ...RNPlatform.select({
      web: {
        backgroundColor: 'transparent',
        transitionDuration: '150ms',
        transitionProperty: 'all',
        transformOrigin: 'left',
        willChange: 'transform',
      },
      default: {},
    }),
  },
  removeTopShadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  fixedContentContainerStyle: {
    flex: 1,
  },
});

TabItems.displayName = 'TabComponent.Items';


export default TabItems;