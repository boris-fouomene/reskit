"use client";
import { useContext } from "react";
import { PortalStateContext } from "./context";
import { IPortalStateContext } from "./types";

/**
 * Custom hook to access the current value of the `PortalStateContext`.
 *
 * @returns {IPortalStateContext} A shallow copy of the current portal context value.
 *
 * @remarks
 * This hook retrieves the context value from `PortalStateContext` using React's `useContext` hook,
 * and returns a new object with the same properties to avoid direct mutation of the context.
 *
 * @example
 * ```tsx
 * const portalContext = usePortalState();
 * ```
 */
export const usePortalState = (): IPortalStateContext => {
    const context = useContext(PortalStateContext);
    return Object.assign({}, context);
};