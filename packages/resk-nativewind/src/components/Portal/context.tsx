import { createContext } from "react";
import { IPortalStateContext } from "./types";

export const PortalStateContext = createContext<IPortalStateContext | undefined>(undefined);

