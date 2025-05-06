import { Button } from "@components/Button";
import { useBottomSheet } from "./hooks";
import { IBottomSheetItemProps } from "./utils";

/**
 * A React component that represents a bottom sheet item.
 * 
 * This component is used to render a single item in a bottom sheet.
 * It extends the `Button` component and adds additional functionality
 * to handle the closing of the bottom sheet when pressed.
 * 
 * @param {IBottomSheetItemProps} props - The props for the component.
 * @returns {JSX.Element} The rendered bottom sheet item.
 */
export default function BottomSheetItem({ closeOnPress, onPress: customOnPress, ...props }: IBottomSheetItemProps) {
    const bottomSheet = useBottomSheet();
    return <Button
        fullWidth
        testID="resk-bottom-sheet-item"
        {...props}
        onPress={(event, context) => {
            const callback = () => {
                if (typeof customOnPress === 'function') {
                    return customOnPress(event, context);
                }
            };
            closeOnPress !== false && typeof (bottomSheet as any)?.close === "function" ? (bottomSheet as any)?.close(callback) : callback();
        }}
        context={Object.assign({}, props.context, { bottomSheet })}
    />;
}