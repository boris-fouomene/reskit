import { IObservable, isObj, observable } from "@resk/core";



declare global {
    interface Window {
        themeEventObservableHandler: IObservable;
    }
}

export const ThemeEvents: IObservable = (isObj(window?.themeEventObservableHandler) && typeof window?.themeEventObservableHandler == "object" && window.themeEventObservableHandler) || {} as IObservable;

if (!isObj(window?.themeEventObservableHandler)) {
    observable(ThemeEvents);
    Object.defineProperties(window, {
        themeEventObservableHandler: {
            value: ThemeEvents,
        },
    });
}

export default ThemeEvents;
