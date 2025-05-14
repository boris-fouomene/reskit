"use client";
import { defaultStr, isNonNullString, isNumber } from '@resk/core/utils';
import { IIconButtonProps } from '@components/Icon/types';
import { Text } from "@html/Text";
import iconButtonVariant from '@variants/iconButton';
import IconButton from "@components/Icon/Button";
import { cn } from '@utils/cn';
import { StyleSheet } from 'react-native';

const avatarSizes: Record<string, number> = {
  small: 34,
  medium: 50,
  large: 75,
  xlarge: 150,
};
const fontSizeClassName: Record<keyof typeof avatarSizes, string> = {
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
  xlarge: "text-lg",
};
export interface IAvatarProps extends Omit<IIconButtonProps, "size"> {
  /** Renders text in the placeholder.
   *
   * @default undefined
   */
  text?: string;
  /** Size of the avatar.
   *
   * @default small
   */
  size?: ('small' | 'medium' | 'large' | 'xlarge') | number;
}


export function Avatar({
  size = 'small',
  text,
  children,
  testID,
  style,
  className,
  ...rest
}: IAvatarProps) {
  const avatarSize = isNumber(size) && size > 0 ? size : isNonNullString(size) && typeof avatarSizes[size] === "number"
    && avatarSizes[size] || avatarSizes.small;
  testID = defaultStr(testID, "resk-avatar");
  const avatarText = defaultStr(text).substring(0, 2);
  return <IconButton
    size={avatarSize}
    className={className}
    testID={testID}
    {...rest}
  >
    {avatarText ? <Text testID={`${testID}-avatar-text`} style={StyleSheet.flatten(style) as any} className={cn("text-center", isNonNullString(size) && fontSizeClassName[size] || `text-[${avatarSize}px]`, iconButtonVariant(rest?.variant)?.icon, className)}>{avatarText}</Text> : null}
  </IconButton>
};