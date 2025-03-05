///@see : https://github.com/nysamnang/react-native-raw-bottom-sheet
import React, { ReactNode, useImperativeHandle, useMemo } from "react"
import theme from "@theme";
import {defaultObj,defaultStr,Platform as ReskPlatform, isObj} from "@resk/core";
import {KeyboardAvoidingView} from "@components/KeyboardAvoidingView";
import View, { IViewProps } from "@components/View";
import { Portal } from "@components/Portal";
import { ScrollView } from "react-native";
import BackHandler from "@components/BackHandler";
import {
  Pressable,
  Animated,
  PanResponder,
  StyleSheet,
  useAnimatedValue
} from "react-native";
import { ScrollViewProps } from "react-native";
import { AppBar, IAppBarProps } from "@components/AppBar";
import useIsMounted from "@utils/useIsMounted";
import usePrevious from "@utils/usePrevious";
import { useDimensions } from "@dimensions/index";
import Platform from "@platform";
import useStateCallback from "@utils/stateCallback";

const useNativeDriver = Platform.canUseNativeDriver();

const defaultHeight = 300;

export const BottomSheet = React.forwardRef<any,IBottomSheetProps>((props,ref)=> {
    let {
        animationType,
        animationDuration,
        closeOnDragDown,
        dragFromTopOnly,
        closeOnPressMask,
        closeOnPressBack,
        children,
        height:customHeight,
        visible : customVisible,
        openDuration,
        actionMutator,
        closeDuration, 
        contentProps:customChildrenContainerProps,
        onOpen,
        testID:customTestID,
        dismissable = true,
        onDismiss,
        withScrollView,
        elevation:customElevation,
        scrollViewProps : _scrollViewProps,
        containerProps : customContainerProps,
        appBarProps,
        ...rest
    } = props;
    const {height:winHeight} = useDimensions();
    const hasAppBar = isObj(appBarProps);
    appBarProps = Object.assign({},appBarProps);
    const elevation = typeof customElevation == 'number' && customElevation ? customElevation : 5;
    let height = typeof customHeight == 'number' && customHeight ? customHeight : 0;
    if(height >0){
        height = Math.max(height,defaultHeight);
    } else {
        height = Math.max(winHeight/3,defaultHeight);
    }
    const [pan] = React.useState(new Animated.ValueXY());
    const [visible,setVisible] = useStateCallback(typeof customVisible === 'boolean'?customVisible : false);
    const isControlled = useMemo(()=>{
        return typeof customVisible === 'boolean';
    },[customVisible]);
    const heightRef = React.useRef(height);
    heightRef.current = height;
    const isMounted = useIsMounted();
    const prevVisible = usePrevious(visible);
    const animatedHeight = useAnimatedValue(0);
    const visibleRef = React.useRef(visible);
    const animatedValueRef = React.useRef(0);
    visibleRef.current = visible;
    const openBottomSheet = ()=>{
        if(!isMounted() || visibleRef.current || isControlled)return;
        setVisible(true);
    };
    const handleDismiss = ()=>{
        const cb = ()=>{
            if(typeof onDismiss === 'function'){
                onDismiss();
            }
        }
        if(!isMounted() || visibleRef.current || isControlled){
            cb();
            return;
        }
        setVisible(false,cb);
    }
    const subscription = React.useRef<{remove:()=>void}>(null);
    
    const handleBack = React.useCallback(()=>{
      if (dismissable) {
        closeBottomSheet();
      }
      return true;
    },[dismissable])
    const removeListeners = ()=>{
      if (subscription.current?.remove) {
        subscription.current.remove();
      } else {
        BackHandler.removeEventListener('hardwareBackPress', handleBack);
      }
    }
    
    const animate = (options:Omit<Partial<Animated.TimingAnimationConfig>,"toValue"> & {toValue:number},callback?:Function)=>{
        return Animated.timing(animatedHeight, Object.assign({},{useNativeDriver},options) as Animated.TimingAnimationConfig).start(()=>{
           animatedValueRef.current = options.toValue;
           if(typeof callback =="function"){
               callback();
           }
        });
    }
    
    const closeBottomSheet = ()=>{
        removeListeners();
        if(!isMounted()) return;
        pan.setValue({ x: 0, y: 0 });
        animate({toValue:0,duration:closeDuration},handleDismiss)
    }
    const panStateResponder = useMemo(()=>{
        return PanResponder.create({
            onStartShouldSetPanResponder: () => !!closeOnDragDown,
            onPanResponderMove: (e, gestureState) => {
                const diff = gestureState.dy > 0 ? animatedValueRef.current - gestureState.dy : 
                Math.min(heightRef.current,animatedValueRef.current-gestureState.dy);
                if(diff >0 && diff !== animatedValueRef.current){
                    animate({toValue:diff,duration:100});
                }
            },
            onPanResponderRelease: (e, gestureState) => { 
                const height = animatedValueRef.current;
                if (height/3 - gestureState.dy < 0) {
                    closeBottomSheet();
                }
            }
        });
    },[]);
    const [panResponder] = React.useState(panStateResponder)
    const animatedStyles = {
        height : animatedHeight,
        transform :[{ translateX: 0 }],
    };
    const prevCustomVisible = usePrevious(customVisible);
    React.useEffect(()=>{
        if(typeof customVisible !=='boolean' || customVisible == prevCustomVisible || customVisible === visible) return;
        if(customVisible){
            Animated.timing(animatedHeight, {
                toValue: 0,
                duration: 0,
                useNativeDriver,
            }).start(()=>{
                setVisible(true)
            });
        } else {
            closeBottomSheet();
        }
    },[customVisible,visible,customVisible])
    React.useEffect(()=>{
        if(!visible){
            removeListeners();
        }
        if(!isMounted() || prevVisible == visible) return;
        if(visible){
            removeListeners();
            (subscription as any).current = BackHandler.addEventListener('hardwareBackPress', handleBack);
            pan.setValue({ x: 0, y: 0 });
            Animated.timing(animatedHeight, {
                toValue: height,
                duration: openDuration,
                useNativeDriver,
            }).start(()=>{
                if (typeof onOpen === "function") onOpen(props);    
            });
        } else {
            closeBottomSheet();
        }
    },[visible])    

    const panStyle = {
        transform: pan.getTranslateTransform()
    };
    const scrollViewProps = defaultObj(_scrollViewProps);
    const contentProps = defaultObj(customChildrenContainerProps);
    const context: IBottomSheetContext = {
        closeBottomSheet,
        openBottomSheet,
        get isBottomSheetOpened(){
            return visibleRef.current;
        }
    }
    useImperativeHandle(ref,()=>(context));
    React.useEffect(()=>{
        return ()=>{
            removeListeners();
            (ref as any).current = null;
        }
    },[]);
    dragFromTopOnly = typeof dragFromTopOnly ==='boolean' ? dragFromTopOnly : withScrollView !== false ? true : Platform.isTouchDevice();
    const testID = defaultStr(customTestID,"RN_BottomSheet");
    const containerProps = defaultObj(customContainerProps);
    const bStyle = {backgroundColor:theme.colors.backdrop};
    const borderColor = theme.colors.outline,borderWidth = 1;
    return !visible? null :  (
        <Portal>
            <View
                testID = {testID}
                {...rest}
                style = {[styles.modal,bStyle,rest.style]}
            >
                <Pressable
                    testID={testID+"-backdrop"}
                    style={[styles.mask]}
                    onPress={() => (closeOnPressMask && dismissable !== false ? closeBottomSheet() : null)}
                />
                    <Animated.View
                        {...(!dragFromTopOnly && panResponder.panHandlers)}
                        testID = {testID+"-container"} {...containerProps} 
                        style={[styles.container,containerProps.style,{borderTopWidth:borderWidth,borderTopColor:borderColor,backgroundColor:theme.colors.surface},theme.elevations[elevation],panStyle,animatedStyles]}
                    >
                        {closeOnDragDown && (
                            <View
                                {...(dragFromTopOnly && panResponder.panHandlers)}
                                style={[styles.draggableContainer,ReskPlatform.isWeb()?{cursor:'ns-resize'} as any:null]}
                                testID = {testID+"_DraggableIconContainer"}
                            >
                            <View testID = {testID+"_DraggableIcon"} style={[styles.draggableIcon]} />
                            </View>
                        )}
                        <View testID = {testID+"_ContentContainer"} style={[styles.contentContainer]}>
                            {hasAppBar?<AppBar
                                colorScheme="background"
                                {...appBarProps}
                                context = {Object.assign({},context,appBarProps.context)}    
                            />: null}
                            {withScrollView !== false ?
                                <ScrollView testID = {testID+"_ScrollViewContent"}  contentProps = {{style:styles.scrollViewContent}} {...scrollViewProps} style={[styles.scrollView,scrollViewProps.style]} alwaysBounceVertical={false}
                                    contentContainerStyle={[{ flexGrow: 1,margin:0,paddingBottom:30},scrollViewProps.contentContainerStyle]}
                                >
                                    <KeyboardAvoidingView testID={testID+"_KeyboardAvoidingView"}>{children}</KeyboardAvoidingView>
                                </ScrollView>
                            : <View testID = {testID+"_Children"} {...contentProps} style={[styles.childrenNotScroll,contentProps.style]}>
                                <KeyboardAvoidingView testID={testID+"_KeyboardAvoidingView"}>{children}</KeyboardAvoidingView>  
                            </View>}
                        </View>
                    </Animated.View>
            </View>
        </Portal>
    );
});

export interface IBottomSheetContext {
    closeBottomSheet : ()=>void,
    openBottomSheet : ()=>void,
    isBottomSheetOpened : boolean,
}
export interface IBottomSheetProps extends IViewProps {
  animationType?: "slide" | "fade",
  height?: number,
  animationDuration?: number,
  withScrollView?: boolean,
  containerProps?:IViewProps,
  appBarProps?: IAppBarProps<IBottomSheetContext>,
  visible?: boolean,
  openDuration?: number,
  actionMutator : Function, ///Les mutateurs d'action de la bare d'outil appBar
  closeDuration?: number,
  dismissable?: boolean,
  closeOnDragDown?: boolean,
  closeOnPressMask?: boolean,
  dragFromTopOnly?: boolean,
  closeOnPressBack?: boolean,
  keyboardAvoidingViewEnabled?: boolean,
  elevation?:number;
  onOpen?: Function,
  onDismiss?: Function,
  scrollViewProps : ScrollViewProps,
  children: ReactNode,
  /***** les props du container du children du Sheet lorsque la props withScrollView est à false */
  contentProps : IViewProps,
};

BottomSheet.displayName = "BottomSheet";

const styles = StyleSheet.create({
    modal : {
     ...StyleSheet.absoluteFillObject,
    },
    backdrop: {
        flex: 1,
    },
    titleContainer : {
        flexDirection : 'row',
        width : '100%',
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    titleWrapper : {

    },
    scrollView : {
        paddingBottom : 30,
        margin : 0,
        flex : 1,
    },
    scrollViewContent : {
        margin : 0,
    },
    contentContainer : {
        flex : 1,
        height : '100%'
    },
    wrapper: {
      flex: 1,
      backgroundColor : 'transparent',
    },
    mask: {
      flex: 1,
      backgroundColor: "transparent",
      height:'100%',
    },
    container: {
      borderTopRightRadius : 20,
      borderTopLeftRadius : 20,
      width: "100%",
      overflow: "hidden"
    },
    draggableContainer: {
      width: "100%",
      alignItems: "center",
      backgroundColor: "transparent"
    },
    draggableIcon: {
      width: 35,
      height: 5,
      borderRadius: 5,
      margin: 10,
      backgroundColor: "#ccc"
    },
    actionsContainer : {
        alignSelf : 'flex-end',
        justifyContent : 'flex-end',
        alignItems : 'center',
        flexDirection : 'row',
    },
    actions : {
        flexDirection:'row',
        justifyContent : 'flex-start',
        alignItems : 'center'
    },
    title : {
        fontSize : 16,
        marginHorizontal : 20,
    },
    divider : {
        margin : 0,
        marginTop : 10,
        width : '100%'
    },
    childrenNotScroll : {
        flex : 1,
    }
  });

  BottomSheet.displayName = "BottomSheet";
