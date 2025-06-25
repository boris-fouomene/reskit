import { ReactNode } from 'react';
import { TouchableOpacityProps } from 'react-native';
import { ICountryCode } from '@resk/core';
import { IClassName } from '@src/types';
import { IIconProps } from '../types';
import { IHtmlTextProps } from '@html/types';

export interface ICountryFlagProps extends TouchableOpacityProps {
    /***
     * The country code for the flag emoji.
     * This is a two-letter country code (ISO 3166-1 alpha-2) that represents the country.
     */
    countryCode: ICountryCode;


    /***
     * The class Name of the icon when the icon is rendered as emoji.
     * This is used to render the icon as emoji in the supported platforms.
     */
    iconClassName?: IClassName;

    /***
     * the variant of the icon when the icon is rendered as emoji.
     */
    iconVariant?: IIconProps['variant'];

    /***
     * The class Name of the text when the text is rendered.
     * This is used to render text as a label in the non-emoji platforms (platform not support emoji flag).
     */
    textClassName?: IClassName;

    /***
     * The variant of the text when the text is rendered.
     * This is used to render text as a label in the non-emoji platforms (platform not support emoji flag).
     */
    textVariant?: IHtmlTextProps["variant"]

    /***
     * The fallback content to display when the flag emoji fails to load.
     * This is a React node that represents the fallback content to display when the flag emoji fails to load.
     */
    fallback?: ReactNode;
}
