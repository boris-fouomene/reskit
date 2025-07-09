import { IActivityIndicatorVariant } from "@variants/activityIndicator";
import { ActivityIndicatorProps } from "react-native";

export interface IActivityIndicatorProps extends ActivityIndicatorProps {
    variant?: IActivityIndicatorVariant;
    /***
     * The border width on web. this is used to calculate the border width on web, when size is a number
     */
    borderWidth?: number;
}