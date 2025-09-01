import { IActivityIndicatorVariant } from "@variants/activityIndicator";
import { ActivityIndicatorProps } from "react-native";

/**
 * Props for the ActivityIndicator component.
 *
 * This interface extends React Native's ActivityIndicatorProps to provide
 * web-compatible loading indicator functionality with additional styling options.
 */
export interface IActivityIndicatorProps extends ActivityIndicatorProps {
  /**
   * Variant configuration for theming the activity indicator.
   * Supports color, size, thickness, and margin variants from the theme.
   */
  variant?: IActivityIndicatorVariant;

  /**
   * CSS className for additional styling using Tailwind CSS or custom classes.
   * Can be used to override or extend the default styling.
   */
  className?: string;
}
