import { typedEntries } from "@resk/core/utils";
import { width2heightClasses } from "./width2height"


type ISize<T> = T extends Record<infer K, infer V> ? { [K in keyof T]: T[K] extends `w-${infer W}` ? `${T[K]} h-${W}` : never } : never;

export const sizesClasses: ISize<typeof width2heightClasses.width> = {} as ISize<typeof width2heightClasses.width>;

typedEntries(width2heightClasses.width).forEach(([key, value]) => {
    value = `${value} ${value.replaceAll("w-", "h-")}` as any;
    (sizesClasses as any)[key] = value;
});