"use client";
import { defaultStr } from '@resk/core/utils';
import { IIconButtonProps } from '@components/Icon/types';
import { Text } from "@html/Text";
import IconButton from "@components/Icon/Button";
import { cn } from '@utils/cn';
import { StyleSheet } from 'react-native';
import iconButtonVariants from "@variants/iconButton";

export interface IAvatarProps extends Omit<IIconButtonProps, "size"> {
  /** Renders text in the avatar.
   *
   * @default undefined
   */
  text?: string;
}


export function Avatar({
  text,
  children,
  testID,
  style,
  className,
  ...rest
}: IAvatarProps) {
  testID = defaultStr(testID, "resk-avatar");
  const avatarText = defaultStr(text).substring(0, 2);
  return <IconButton
    className={className}
    testID={testID}
    {...rest}
  >
    {avatarText ? <Text testID={`${testID}-avatar-text`} style={StyleSheet.flatten(style) as any} className={cn("text-center", iconButtonVariants(rest?.variant)?.text?.(), className)}>{avatarText}</Text> : null}
  </IconButton>
};