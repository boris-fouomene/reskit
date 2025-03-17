import React, { useImperativeHandle } from "react"
import theme from "@theme";
import { defaultObj, defaultStr, isObj } from "@resk/core";
import View from "@components/View";
import { Portal } from "@components/Portal";
import { Platform, ScrollView } from "react-native";
import { ExpandableItem } from "@components/Menu/ExpandableItem";
import { BottomSheetContext } from "./hooks";
import {
    Pressable,
    Animated,
    StyleSheet,
} from "react-native";
import { AppBar } from "@components/AppBar";
import { useRenderMenuItems } from "@components/Menu";
import { Divider } from "@components/Divider";
import { IBottomSheetItemProps, IBottomSheetMenuItemContext, IBottomSheetProps, usePrepareBottomSheet } from "./utils";
import BottomSheetItem from "./Item";
import { useDimensions } from "@dimensions/index";
import { KeyboardAvoidingView } from "@components/KeyboardAvoidingView";


/**
 * A React component that represents a bottom sheet.
 * 
 * A bottom sheet is a sheet that slides up from the bottom of the screen.
 * It can be used to display a list of items, a form, or any other content.
 * 
 * @example
 * ```typescript
 * <BottomSheet>
 *   <Text>Bottom sheet content</Text>
 * </BottomSheet>
 * ```
 */
const BottomSheet = React.forwardRef<any, IBottomSheetProps>(({ children,
    scrollViewProps: _scrollViewProps, containerProps: customContainerProps,
    testID,
    items: customItems,
    contentProps: customChildrenContainerProps, appBarProps, dividerAfterAppBar, withScrollView, ...props }, ref) => {
    const {
        closeOnDragDownIcon,
        dragFromTopOnly,
        context,
        handleBackPress,
        panResponder,
        backdropStyle,
        animatedProps,
    } = usePrepareBottomSheet(props);
    testID = defaultStr(testID, "resk-bottom-sheet");
    const dimensions = useDimensions();
    const scrollViewProps = defaultObj(_scrollViewProps);
    const contentProps = defaultObj(customChildrenContainerProps);
    useImperativeHandle(ref, () => (context));
    const items = useRenderMenuItems<IBottomSheetMenuItemContext>({
        items: (Array.isArray(customItems) ? customItems : []),
        context: { bottomSheet: context },
        render: renderItem,
        renderExpandable,
    });
    const content = <KeyboardAvoidingView testID={testID + "-keyboard-avoiding-view"} style={[styles.keyboardAvoidingView]}>
        {items}
        {children}
    </KeyboardAvoidingView>;
    const hasAppBar = isObj(appBarProps);
    appBarProps = Object.assign({}, appBarProps);
    const containerProps = defaultObj(customContainerProps);
    return (
        <Portal style={styles.portal} absoluteFill testID={testID + "-portal"} visible={context.isOpened}>
            <BottomSheetContext.Provider value={context}>
                <Pressable
                    testID={testID + "-backdrop"}
                    style={[backdropStyle, { backgroundColor: theme.colors.backdrop }]}
                    onPress={handleBackPress}
                    onAccessibilityEscape={handleBackPress}
                >
                    <View testID={testID + "-content-container"} style={styles.contentContainer}>
                        <Animated.View
                            {...animatedProps}
                            testID={testID + "-container"} {...containerProps}
                            style={[styles.container, animatedProps.style, containerProps.style, { backgroundColor: theme.colors.surface }]}
                        >
                            {closeOnDragDownIcon}
                            <View testID={testID} {...props} style={[styles.main, props.style]}>
                                {hasAppBar ? <>
                                    <AppBar
                                        colorScheme="surface"
                                        statusBarHeight={0}
                                        elevation={0}
                                        backAction={false}
                                        {...appBarProps}
                                        titleProps={Object.assign({}, appBarProps.titleProps, { style: [styles.title, appBarProps.titleProps?.style] })}
                                        context={Object.assign({}, appBarProps.context, { bottomSheet: context })}
                                    />
                                    {dividerAfterAppBar !== false ? <Divider
                                        testID={testID + "-divider"}
                                        style={styles.divider}
                                    /> : null}
                                </> : null}
                                {withScrollView !== false ?
                                    <ScrollView testID={testID + "-scroll-view"} contentProps={{ style: styles.scrollViewContent }} {...scrollViewProps} style={[styles.scrollView, scrollViewProps.style]} alwaysBounceVertical={false}
                                        contentContainerStyle={[{ flexGrow: 1, margin: 0, paddingBottom: 30 }, scrollViewProps.contentContainerStyle]}
                                    >
                                        {content}
                                    </ScrollView>
                                    : <View testID={testID + "-content"} {...contentProps} style={[styles.childrenNotScroll, contentProps.style]}>
                                        {content}
                                    </View>}
                            </View>
                        </Animated.View>
                    </View>
                </Pressable>
            </BottomSheetContext.Provider>
        </Portal >
    );
});

function renderExpandable(props: IBottomSheetItemProps, index: number) {
    return <ExpandableItem {...props} as={BottomSheetItem} key={index} />;
}
function renderItem(props: IBottomSheetItemProps, index: number) {
    return <BottomSheetItem {...props} key={index} />;
}


BottomSheet.displayName = "BottomSheet";

const styles = StyleSheet.create({
    portal: {
        overflow: "hidden",
    },
    keyboardAvoidingView: {
        width: '100%',
        alignSelf: "flex-start",
        //flexGrow: 1,
        flex: 1,
    },
    contentContainer: {
        width: '100%',
        alignSelf: "flex-start",
    },
    titleContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleWrapper: {

    },
    scrollView: {
        paddingBottom: 30,
        margin: 0,
        flex: 1,
    },
    scrollViewContent: {
        margin: 0,
    },
    main: {
        // height: '100%'
        width: "100%",
        flex: 1,
        flexGrow: 1,
    },
    wrapper: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
    },
    actionsContainer: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    title: {
        fontSize: 15,
        fontWeight: "400"
    },
    divider: {
        margin: 0,
        width: '100%'
    },
    childrenNotScroll: {
        flex: 1,
    }
});

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
