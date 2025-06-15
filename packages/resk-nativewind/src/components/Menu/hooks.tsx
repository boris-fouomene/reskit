"use client";
import { useMemo } from "react";
import { renderItems } from "./utils";
import { IMenuRenderItemsOptions } from "./types";
import { IReactNullableElement } from "@src/types";
import stableHash from "stable-hash";
export function useRenderItems<ItemContext = unknown>({ items, context, render, renderExpandable }: IMenuRenderItemsOptions<ItemContext>): IReactNullableElement[] {
    return useMemo(() => {
        return renderItems<ItemContext>({
            items: (Array.isArray(items) ? items : []),
            context,
            render,
            renderExpandable,
        });
    }, [items, context, stableHash(render), stableHash(renderExpandable)]);
}