import { useState } from "react";
import { IAlertHook } from "./types";

export const useAlert = (): IAlertHook => {
    return {
        isOpen: true,
        shouldRender: true,
    }
}