import { defaultStr, isNonNullString } from '@resk/core';
import { IReactComponent, ITouchableProps } from '@src/types';
import { useMemo } from 'react';
import {
  View,
  ImageProps, ViewProps, 
  Pressable,
  Image,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { isReactComponent } from '@utils/isComponent';
import { getTouchableProps } from '@utils/hasTouchHandler';
import { getIcon, IIconProps, IIconSource } from '@components/Icon';
import Label, { ILabelProps } from '@components/Label';
import { IViewProps } from '@components/View';
import {IThemeColorsTokenName } from '@theme/types';
import { JSX } from 'react/jsx-runtime';
import { Colors, useTheme } from '@theme/index';

const avatarSizes: Record<string, number> = {
  small: 34,
  medium: 50,
  large: 75,
  xlarge: 150,
};

export interface IAvatarProps<AsProps extends Partial<ITouchableProps> = ViewProps> extends Partial<ITouchableProps> {
  /** Component for enclosing element (eg: TouchableHighlight, View, etc).
   *
   *  @default `Press handlers present then Pressable else View`
   */
   as ?: IReactComponent<Omit<AsProps,'children'> & {children?:JSX.Element}>;
  
  /***
    * Color scheme token key to apply a theme color to the avatar.
    * This allows for easy theming and consistency across the application.
  */
  colorScheme?:IThemeColorsTokenName;

  /** Image source to be displayed on avatar.
   *
   * @default undefined
   */
  source?: ImageSourcePropType;
  
  /***
    * Props for the image displayed on the avatar.
  */
  imageProps?: ImageProps;
  
  /**
   * Displays an icon as the main content of the Avatar. **Cannot be used alongside text**. When used with the `source` prop it will be used as the placeholder.
   * @default undefined
   */
  icon?: IIconSource;
  
  /***
  * Props for the icon displayed on
  */
  iconProps?:Omit<IIconProps,"name"|"iconName" | "source">;
  
  /**
   * Indicates whether the Avatar is disabled.
   * A disabled avatar will not respond to user interactions and will appear greyed out.
   */
  disabled?: boolean;

  /** Makes the avatar circular.
   *
   * @default true
   */
  rounded?: boolean;

  /** Renders text in the placeholder.
   *
   * @default undefined
   */
  text?: string;

  /** Props used to render the text.
   *
   * @default undefined
   */
  textProps?: ILabelProps;

  /** Size of the avatar.
   *
   * @default small
   */
  size?: ('small' | 'medium' | 'large' | 'xlarge') | number;
  
  /***
    The background color of the avatar.
  */
  backgroundColor?: string;
  
  /***
    The color of the avatar, in case of text avatar or icon avatar.
  */
  color?: string;
  
  children?: JSX.Element;
  
  testID?: string;
  
  style?: ViewStyle;
}

/**
 * Avatars are found all over ui design from lists to profile screens.
 * They are commonly used to represent a user and can contain photos, icons, or even text.
 * */
export function Avatar<AsProps extends Partial<ITouchableProps> = ViewProps>({
  as,
  icon,
  source,
  size = 'small',
  rounded:customRounded,
  text,
  children,
  iconProps,
  colorScheme,
  textProps,
  testID,
  imageProps,
  style,
  backgroundColor,
  color,
  ...rest
}: IAvatarProps<AsProps>) {
  const rounded = typeof customRounded === 'boolean' ? customRounded : true;
  const avatarSize = typeof size === 'number' ? size : isNonNullString(size) && typeof avatarSizes[size] ==="number"
  && avatarSizes[size] || avatarSizes.small;
  const height = avatarSize, width = avatarSize;
  const touchableProps = getTouchableProps(rest);
  const theme = useTheme();
  imageProps = Object.assign({},imageProps);
  const {color:cColor,backgroundColor:cBackgroundColor} = Object.assign({},theme.getColorScheme(colorScheme));
  color = Colors.isValid(color) ? color : cColor;
  backgroundColor = Colors.isValid(backgroundColor) ? backgroundColor : cBackgroundColor;
  testID = defaultStr(testID,"resk-avatar");
  const content = useMemo(()=>{
    if(isNonNullString(text)){
      return <Label 
        testID = {testID+"-text"}
        children ={text}
        {...Object.assign({},textProps)}
        style = {[{fontSize:avatarSize/1.8},textProps?.style]}
      />;
    }
    if(!icon) return null;
    return getIcon({icon,size:avatarSize/2,color,testID:testID+"-icon",...Object.assign({},iconProps)});
  },[avatarSize,colorScheme,rounded,color,backgroundColor,icon,iconProps,textProps,testID,text]);
  const Component = useMemo(()=>{
    if(isReactComponent(as) && as){
      return as;
    }
    if(touchableProps){
        return Pressable;
    }
    return View;
  },[as,touchableProps]);
  return (
    <Component
      testID={testID}
      {...rest as AsProps}
      {...Object.assign({},touchableProps)}
      style={StyleSheet.flatten([
        styles.container,
        { height, width,backgroundColor},
        rounded ? { borderRadius: width / 2, overflow: 'hidden'} : undefined,
        style
      ]) as any}
    >
      <>
        {source ? <Image
            testID={testID+"-image"}
            source={source}
            height={height}
            width={width}
            borderRadius={rounded ? width / 2 : undefined}
            {...imageProps}
            style={StyleSheet.flatten([styles.avatar,imageProps.style])}
          /> : content}
          {children}
      </>
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatar: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    textAlign: 'center',
    zIndex: 1,
    
  },
});