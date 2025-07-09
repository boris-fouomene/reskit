import { IAppBarActionProps, IAppBarProps } from "@components/AppBar/types";
import { IModalProps } from "@components/Modal/types";
import { IHtmlTextProps } from "@html/types";
import { IUseDimensionsOptons } from "@utils/dimensions";
import { ReactNode } from "react";
import { IClassName } from "@src/types";
import { IDialogVariant } from "@variants/dialog";


export interface IDialogProps<Context = unknown> extends IModalProps {
  actions?: IAppBarActionProps<IDialogContext<Context>>[];
  titleProps?: IDialogTitleProps;
  title?: ReactNode;
  titleClassName?: IClassName;
  subtitle?: ReactNode;
  subtitleClassName?: IClassName;
  appBarClassName?: IClassName;
  appBarProps?: Omit<IAppBarProps<IDialogContext<Context>>, "title" | "subtitle" | "actions">;

  /**
   * The class name of the content container.
   */
  contentClassName?: IClassName;

  context?: Context;

  /**
   * If true, the dialog will take the full screen
   */
  fullScreen?: boolean;
  /**
   * If true, the dialog will take the full screen on mobile
   */
  fullScreenOnMobile?: boolean;

  /**
   * If true, the dialog will take the full screen on tablet
   */
  fullScreenOnTablet?: boolean;

  /**
   * The dimensions options to pass to the useDimensions hook
   */
  useDimensionsOptions?: IUseDimensionsOptons;
  /**
   * If true, the dialog content will be wrapped in a ScrollView
   */
  withScrollView?: boolean;

  /**
   * The class name of the scroll view.
   * This is used to apply style to the scroll view.
   */
  scrollViewClassName?: IClassName;
  /**
   * The class name of the scroll view content container.
   * This is used to apply contentContainerStyle to the scroll view.
   */
  scrollViewContentContainerClassName?: IClassName;

  variant?: IDialogVariant;
}


export type IDialogContext<Context = unknown> = Context & {
  dialog: { close: (event: any) => void, isFullScreen?: boolean, windowWidth: number, windowHeight: number, isTablet: boolean, isDesktop: boolean, isMobile: boolean }
};

export interface IDialogTitleProps extends IHtmlTextProps { }