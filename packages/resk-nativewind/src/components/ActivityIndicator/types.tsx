import { IVariantPropsActivityIndicator } from "@variants/activityIndicator";
import { ActivityIndicatorProps } from "react-native";

export interface IActivityIndicatorProps extends ActivityIndicatorProps {
    variant?: IVariantPropsActivityIndicator;
    /***
     * The border width on web. this is used to calculate the border width on web, when size is a number
     */
    borderWidth?: number;
}