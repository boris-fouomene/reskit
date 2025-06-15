"use client";
import { useMemo } from "react";
import { renderMenuItems } from "./utils";
import { IMenuRenderItemsOptions } from "./types";
import { IReactNullableElement } from "@src/types";
import stableHash from "stable-hash";
export function useRenderMenuItems<ItemContext = unknown>({ items, context, render, renderExpandable }: IMenuRenderItemsOptions<ItemContext>): IReactNullableElement[] {
    return useMemo(() => {
        return renderMenuItems<ItemContext>({
            items: (Array.isArray(items) ? items : []),
            context,
            render,
            renderExpandable,
        });
    }, [items, context, stableHash(render), stableHash(renderExpandable)]);
}