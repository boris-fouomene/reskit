"use client";
import { useMemo } from "react";
import { renderMenuItems } from "./utils";
import { IMenuRenderItemsOptions } from "./types";
import { IReactNullableElement } from "@src/types";
import stableHash from "stable-hash";
export function useRenderMenuItems<Context = unknown>({ items, context, render, renderExpandable }: IMenuRenderItemsOptions<Context>): IReactNullableElement[] {
    return useMemo(() => {
        return renderMenuItems<Context>({
            items: (Array.isArray(items) ? items : []),
            context,
            render,
            renderExpandable,
        });
    }, [items, context, stableHash(render), stableHash(renderExpandable)]);
}