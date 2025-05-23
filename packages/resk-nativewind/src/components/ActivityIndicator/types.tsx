import { IVariantPropsActivityIndicator } from "@variants/activityIndicator";
import { ActivityIndicatorProps } from "react-native";

export interface IActivityIndicatorProps extends ActivityIndicatorProps {
    variant?: IVariantPropsActivityIndicator;
}