import { Platform } from 'react-native';
import { Surface } from '@components/Surface';
import { IAppBarProps } from './types';
import isValidElement from '@utils/isValidElement';
import ExpandableAppBarAction from './ExpandableAction';
import { AppBarAction } from './Action';
import { BackAction } from "./BackAction";
import { act, ReactNode } from 'react';
import { defaultStr, isNumber } from '@resk/core/utils';
import { cn } from '@utils/cn';
import { Div } from '@html/Div';
import { Text } from '@html/Text';
import { textVariant } from "@variants/text";
import { AppBarActions } from './Actions';
import { appBarVariant } from "@variants/appBar";


function AppBar<Context = unknown>({
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
  maxVisibleActions,
  context,
  variant,
  actionsClassName,
  backActionProps,
  backActionPosition,
  ...appBarProps
}: IAppBarProps<Context>) {
  testID = defaultStr(testID, 'resk-appbar');
  const computedVariant = appBarVariant(variant);
  subtitle = subtitle === false ? null : subtitle;
  const backActionClx = cn(computedVariant.backAction(), backActionProps?.className, backActionClassName);
  const callOptions = {
    ...context as Context,
    computedAppBarVariant: computedVariant,
    handleBackPress: (event: any) => {
      if (typeof onBackActionPress == "function") {
        onBackActionPress(event);
      }
    }
  };
  const isBackActionLeft = backActionPosition !== "right";
  const backAction: ReactNode | false = typeof customBackAction == "function" ? customBackAction({
    ...callOptions,
    backActionProps: { ...backActionProps, className: backActionClx },
    className: backActionClx,
  }) : customBackAction;
  const leftContent = typeof left == "function" ? left(callOptions) : left;
  const rightContent = typeof right == "function" ? right(callOptions) : right;
  const backActionContent = (backAction as any) != false ? isValidElement(backAction) ? (backAction as any) :
    <BackAction testID={`${testID}-back-action`} className={backActionClx}  {...backActionProps} onPress={onBackActionPress} /> : null;
  return (<Surface
    className={cn(`resk-app-bar overflow-hidden flex flex-row items-center max-w-full w-full`, Platform.OS === 'ios' ? "h-[44px]" : "h-[56px]", computedVariant.base(), className)}
    {...appBarProps}
    testID={testID}
  >
    {isBackActionLeft ? backActionContent : null}
    {isValidElement(leftContent) ? leftContent : null}
    <Div testID={`${testID}-content`} className={cn("px-[12px] flex-1 basis-0 min-w-0 native:flex-1", computedVariant.content(), contentClassName)}>
      <Text
        numberOfLines={1}
        testID={`${testID}-title`}
        className={cn("resk-appbar-title", computedVariant.title(), textVariant(titleVariant), titleClassName)}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          numberOfLines={1}
          testID={`${testID}-subtitle`}
          className={cn("resk-appbar-subtitle", computedVariant.subtitle(), textVariant(subtitleVariant), subtitleClassName)}
        >
          {subtitle}
        </Text>
      ) : null}
    </Div>
    {isValidElement(children) ? children : null}
    <AppBarActions<Context> testID={testID + "-actions"}
      context={{ ...Object.assign({}, context), appBarVariant: Object.assign({}, variant) }}
      {...actionsProps}
      actions={actions}
      className={cn("resk-app-bar-actions", computedVariant.actions(), actionsProps?.className, actionsClassName)}
      maxVisibleActions={isNumber(maxVisibleActions) && maxVisibleActions > 0 ? maxVisibleActions : actionsProps?.maxVisibleActions}
      actionClassName={cn(computedVariant.action(), actionsProps?.actionClassName)}
      actionMenuItemClassName={cn(computedVariant.actionMenuItem(), actionsProps?.actionMenuItemClassName)}
      menuProps={{
        ...actionsProps?.menuProps,
        anchorClassName : cn(computedVariant.icon(), actionsProps?.menuProps?.anchorClassName),
      }}
    />
    {isValidElement(rightContent) ? rightContent : null}
    {!isBackActionLeft ? backActionContent : null}
  </Surface>);
};


AppBar.displayName = 'AppBar';



AppBar.Action = AppBarAction;
AppBar.Actions = AppBarActions;
AppBar.BackAction = BackAction;
AppBar.ExpandableAction = ExpandableAppBarAction;

AppBar.displayName = 'AppBar';
AppBar.Action.displayName = 'AppBar.Action';
AppBar.BackAction.displayName = 'AppBar.BackAction';
(AppBar.ExpandableAction as any).displayName = 'AppBar.ExpandableAction';

export {DEFAULT_APPBAR_RESPONSIVE_CONFIG} from './Actions/utils';

export { AppBar };

export * from "./types";