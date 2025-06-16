"use client";
import { useMemo } from "react";
import { renderNavItems } from "./utils";
import { IReactNullableElement } from "@src/types";
import stableHash from "stable-hash";
import { INavItemsProps } from "./types";
export function useRenderNavItems<Context = unknown>({ items, context, renderItem, renderExpandableItem, ...rest }: INavItemsProps<Context>): IReactNullableElement[] {
    return useMemo(() => {
        return renderNavItems<Context>({
            items: (Array.isArray(items) ? items : []),
            context,
            renderItem,
            renderExpandableItem,
        });
    }, [items, context, stableHash(renderItem), stableHash(renderExpandableItem)]);
}