import { Dimensions, View } from "react-native";
import BottomSheet from "./BottomSheet";
import BottomSheetProvider from "./Provider";
import BottomSheetItem from "./Item";
import { measureContentHeight } from "./measureContentHeight";
export * from "./BottomSheet";
export * from "./Provider";
export * from "./utils";
export { useBottomSheet } from "./hooks";

type IBottomSheetExported = typeof BottomSheet & {
    Provider: typeof BottomSheetProvider;
    measureContentHeight: typeof measureContentHeight;
    Item: typeof BottomSheetItem;
}

const BottomSheetExported: IBottomSheetExported = BottomSheet as IBottomSheetExported;
BottomSheetExported.Provider = BottomSheetProvider;
BottomSheetExported.measureContentHeight = measureContentHeight;
BottomSheetExported.Item = BottomSheetItem;

export { BottomSheetExported as BottomSheet };