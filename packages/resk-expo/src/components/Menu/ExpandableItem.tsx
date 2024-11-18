import { GestureResponderEvent } from "react-native";
import { defaultStr } from "@resk/core";
import { MenuItem } from "./Item";
import { Expandable, IExpandableProps } from "@components/Expandable";
import { IExpandableMenuItemProps, IMenuItem } from "./types";
import { useMenu } from "./context";

/***
 * le composant ExpandableMenuItem, affiche un item du drawer de type expandable. 
 * la props children en principe doit contenir la liste des sous items de l'item en question
 */
export default function ExpandableMenuItem({ testID, ...props }: IExpandableMenuItemProps) {
    testID = defaultStr(testID, "RN_ExpandableMenuItemComponent")
    const menuContext = useMenu();
    /**
     * return <ExpandableMenuItemComponent
        as={MenuItem}
        expandIconSize={15}
        testID={testID}
        {...props}
    />
     */
    return null;
}

