import { DependencyList } from "react";

export function useMemo<T>(factory: () => T, deps: DependencyList): T {
    return factory();
}