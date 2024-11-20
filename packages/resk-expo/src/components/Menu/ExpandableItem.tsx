import { defaultStr } from "@resk/core";
import { MenuItem } from "./Item";
import { Expandable } from "@components/Expandable";
import { IMenuItemProps } from "./types";
import { Divider } from "@components/Divider";

/***
 * le composant ExpandableMenuItem, affiche un item du drawer de type expandable. 
 * la props children en principe doit contenir la liste des sous items de l'item en question
 */
export default function ExpandableMenuItem<IMenuItemExtendContext>({ testID, dividerProps, divider, expandableProps, children, ...props }: IMenuItemProps<IMenuItemExtendContext>) {
    testID = defaultStr(testID, "rn-menu-item-expandable");
    return <Expandable
        testID={testID + "-expandable"}
        {...Object.assign({}, expandableProps)}
        label={<MenuItem {...props} testID={testID} />}
        children={<>
            {children}
            {divider && <Divider testID={testID + "-divider"} {...Object.assign({}, dividerProps)} />}
        </>}
    />
}
