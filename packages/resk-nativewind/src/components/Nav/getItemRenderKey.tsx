import { isNonNullString, isObj } from "@resk/core/utils";
import { INavItemProps } from "./types";

export function getItemRenderKey(item: INavItemProps<any>, index: number) {
    return isObj(item) && isNonNullString(item.id) ? item.id : `nav-item-${index}`;
}