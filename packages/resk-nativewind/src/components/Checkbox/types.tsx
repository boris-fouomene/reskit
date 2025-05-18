import { IToggleableProps } from '@components/Switch/types';
import { ITooltipBaseProps } from '@components/Tooltip';
import { IClassName } from "@src/types";
import { IFontIconName, IFontIconProps } from '@components/Icon/types';


export interface ICheckboxProps extends IToggleableProps, ITooltipBaseProps, Omit<IFontIconProps, "variant"> {
    /**
     * Callback that is invoked when the user presses the checkbox.
     * @param value A boolean indicating the new checked state of the checkbox.
     */
    onValueChange?: (value: boolean) => void;

    /***
     * The icon name to display when the checkbox is checked.
     */
    checkedIconName?: IFontIconName;

    /**
     * The icon name to display when the checkbox is unchecked.
     */
    uncheckedIconName?: IFontIconName;

    /**
     * The className of the icon when the checkbox is checked.
     */
    checkedClassName?: IClassName;


    /***
     * The className of the icon when the checkbox is unchecked
     */
    uncheckedClassName?: IClassName;

    /***
     * The variant of the icon when the checkbox is checked
     */
    checkedVariant?: IFontIconProps['variant'];

    /**
     * The variant of the icon when the checkbox is unchecked
     */
    uncheckedVariant?: IFontIconProps['variant'];
}