import { ViewProps } from 'react-native';

export type IAccessibilityEscapeHandler = ViewProps['onAccessibilityEscape'];


export interface IAccessibilityEscapeOptions {
  priority?: number;
  enabled?: boolean;
  stopPropagation?: boolean;
  preventDefault?: boolean;
}