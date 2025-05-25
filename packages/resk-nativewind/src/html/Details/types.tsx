

import { ReactElement } from "react";
import { IHtmlDivProps, IHtmlTextProps } from "@html/types";
import { IClassName, ITouchableProps } from "@src/types";
import { IFontIconName, IFontIconProps } from "@components/Icon/types";
export interface IHtmlDetailsProps extends IHtmlDivProps {
    summary: ReactElement;
    summaryClassName?: IClassName;
    children?: ReactElement | null;
    contentClassName?: IClassName;
    /**
     * Whether the details are open
     * @type {boolean}
     * @default false
     */
    open?: boolean;

    iconPosition?: "left" | "right";
    iconProps?: IHtmlDetailsIconProps;
}
export interface IHtmlDetailsIconProps extends Omit<IFontIconProps, keyof ITouchableProps | "name"> {
    openedIcon?: IFontIconName;
    closedIcon?: IFontIconName;
}