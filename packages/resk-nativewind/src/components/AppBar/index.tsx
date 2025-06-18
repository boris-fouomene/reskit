import { Platform } from 'react-native';
import { Surface } from '@components/Surface';
import { IAppBarProps } from './types';
import isValidElement from '@utils/isValidElement';
import ExpandableAppBarAction from './ExpandableAction';
import { AppBarAction } from './Action';
import { BackAction } from "./BackAction";
import { ReactNode } from 'react';
import { defaultStr } from '@resk/core/utils';
import { cn } from '@utils/cn';
import { Div } from '@html/Div';
import { Text } from '@html/Text';
import textVariant from "@variants/text";
import { AppBarActions } from './Actions';


function AppBar<Context = any>({
  actions,
  actionsProps,
  title,
  subtitle,
  titleClassName,
  titleVariant,
  subtitleClassName,
  subtitleVariant,
  onBackActionPress,
  testID,
  backAction: customBackAction,
  backActionClassName,
  children,
  left,
  right,
  contentClassName,
  className,
  context,
  ...appBarProps
}: IAppBarProps<Context>) {
  testID = defaultStr(testID, 'resk-appbar');
  subtitle = subtitle === false ? null : subtitle;
  context = Object.assign({}, context);
  const backAction: ReactNode | false = typeof customBackAction == "function" ? customBackAction({
    ...context, handleBackPress: (event: any) => {
      if (typeof onBackActionPress == "function") {
        onBackActionPress(event);
      }
    }
  }) : customBackAction;
  return (<Surface
    className={cn(`appbar px-[7px] h-[${DEFAULT_APPBAR_HEIGHT}px] px-[7px] z-1 flex flex-row items-center`, className)}
    {...appBarProps}
    testID={testID}
  >
    {(backAction as any) != false ? isValidElement(backAction) ? (backAction as any) :
      <BackAction testID={`${testID}-back-action`} className={cn(backActionClassName)} onPress={onBackActionPress} /> : null}
    {isValidElement(left) ? left as any : null}
    <Div testID={`${testID}-content`} className={cn("flex-1 px-[12px]", contentClassName)}>
      <Text
        numberOfLines={1}
        testID={`${testID}-title`}
        className={cn("font-medium text-lg", textVariant(titleVariant), titleClassName)}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          numberOfLines={1}
          testID={`${testID}-subtitle`}
          className={cn("text-sm opacity-90", textVariant(subtitleVariant), subtitleClassName)}
        >
          {subtitle}
        </Text>
      ) : null}
    </Div>
    {isValidElement(children) ? children : null}
    <AppBarActions testID={testID + "-actions"}  {...Object.assign({}, actionsProps,{context})} actions={actions} />
    {isValidElement(right) ? right : null}
  </Surface>);
};

const DEFAULT_APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;


AppBar.displayName = 'AppBar';



AppBar.Action = AppBarAction;
AppBar.Actions = AppBarActions;
AppBar.BackAction = BackAction;
AppBar.ExpandableAction = ExpandableAppBarAction;

AppBar.displayName = 'AppBar';
AppBar.Action.displayName = 'AppBar.Action';
AppBar.BackAction.displayName = 'AppBar.BackAction';
(AppBar.ExpandableAction as any).displayName = 'AppBar.ExpandableAction';

export { AppBar };

export * from "./types";
