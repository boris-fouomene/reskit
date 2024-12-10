import { IReactComponent } from "@src/types";
import React, { ReactNode } from "react";


export interface IWithHOCOptions {
    displayName?: string; //le nom d'affichage du composant overrwité,
    fallback?: ReactNode | null | ((...args: any[]) => boolean | null); //l'élément fallback ou la fonction permettant de tester le rendu du fallBack,si cette fonction retourne null ou un élément react, alors le composant n'est pas rendu
}


export function withHOC<T>(Component: IReactComponent<T>, options: IWithHOCOptions = {}) {
    options = Object.assign({}, options);
    const { displayName, fallback } = options;
    const fn = React.forwardRef(function (props?: T, ref?): ReactNode {
        props = (props || {}) as T;
        if (fallback !== undefined) {
            if (typeof fallback === "function") {
                return fallback();
            }
            return fallback;
        }
        return <Component {...props} ref={ref} />;
    });
    if (Component?.displayName) {
        fn.displayName = Component.displayName + "_WithAuth";
    } else if (displayName) {
        fn.displayName = displayName;
    }
    return fn;
}