import { isNonNullString, defaultStr, IDict, stringify, isObj, i18n } from "@resk/core";
import getTextContent from "@utils/getTextContent";
import { INotifyMessage, INotifyType } from "./types";
import _Notifiy, { INotifyOptions } from "./Notify";

export * from "./types";
export * from "./Notify";
/**
 * Manages notifications within the application.
 * 
 * The Notify provides static methods to display notifications of various types (info, success, error, warning).
 * It allows for customization of the notification message, title, and settings.
 * 
 * @example
 * Notify.success("Operation completed successfully", "Success");
 * Notify.error("An error occurred", "Error", { interval: 10000 });
 */
export class Notify {
    private static _notifyRef: { current: _Notifiy | null } = { current: null };
    /**
     * Gets the current reference to the Notify component.
     * 
     * @returns {Notify | null} The current Notify reference or null if not set.
     */
    static get notifyRef() {
        return this._notifyRef.current;
    }
    /**
     * Sets the current reference to the Notify component.
     * 
     * @param {Notify | null} value - The Notify component reference or null.
     */
    static set notifyRef(value: _Notifiy | null) {
        if (value instanceof _Notifiy || value === null) {
            this._notifyRef.current = value;
        }
    }
    /**
     * Displays a notification with the specified message, type, title, and settings.
     * 
     * @param {INotifyMessage | INotifyOptions} message - The message to display or options object.
     * @param {INotifyType} [type] - The type of notification (info, success, error, warning).
     * @param {INotifyMessage} [title] - The title of the notification.
     * @param {IDict} [settings] - Additional settings for the notification.
     * 
     * @returns {void} 
     * 
     * @example
     * NotificationManager.notify("This is a notification", "info", "Notification Title");
     */
    static notify(message: INotifyMessage | INotifyOptions, type?: INotifyType, title?: INotifyMessage, settings?: IDict) {
        if (!this.notifyRef) return;
        if (typeof message == 'object' && isObj(message)) {
            settings = message as INotifyOptions;
            type = type || settings.type;
            title = title || settings.title || undefined;
            message = settings.message || settings.msg;
        }
        settings = Object.assign({}, settings);
        type = type || settings.type;
        if (!type) {
            type = 'info';
        }
        if (!(message)) message = ''
        if (!(title)) title = ''
        message = stringify(message).trim();
        if (!message) {
            return;
        }
        settings.title = title || settings.title;
        if (isNonNullString(title)) {
            title = String(title).trim();
        }
        let _t = defaultStr(settings.type, type);
        let defInterval = 5000;
        switch (_t.toLowerCase().trim()) {
            case 'error':
                message = message || settings.error, settings.errorText;
                defInterval = 12000;
                break;
            case 'warning':
                defInterval = 10000;
                break;
        }
        if (!title) {
            if (type === 'error') {
                title = i18n.t("notify.errorTitle");
            } else if (type == 'warn') {
                title = i18n.t("notify.warningTitle");
            } else if (type == 'success') {
                title = i18n.t("notify.successTitle");
            } else if (type == 'info') {
                title = i18n.t("notify.infoTitle");
            } else title = String(type).toUpperCase()
        }
        let interval = settings.interval || defInterval;
        if (Math.abs(interval) <= 200) {
            const ccc = getTextContent(message);
            if (ccc) {
                interval = Math.max(defInterval, (ccc.length * 100));
            }
        }
        const options = { ...settings, type, title, message, interval } as INotifyOptions;
        const { onClose } = options;
        options.onClose = (...args) => {
            if (typeof onClose == "function") return onClose(...args);
            return true;
        }
        return this.notifyRef?.alert(options);
    }
    /**
     *  Displays an error notification with the provided message and title.
        @param message - The message to display in the notification. Can be a string or an INotifyOptions object.
        @param title - The title to display in the notification. Can be a string or an INotifyMessage object.
        @param settings - Additional options to configure the notification, such as the type, interval, and onClose callback.
        @returns The result of calling the `notify` method with the provided parameters.
     */
    static error(message: INotifyMessage | INotifyOptions, title?: INotifyMessage, settings?: INotifyOptions) {
        return this.notify(message, 'error', title, settings);
    }

    /**
     * Displays a success notification with the provided message and title.
     * @param message - The message to display in the notification. Can be a string or an INotifyOptions object.
     * @param title - The title to display in the notification. Can be a string or an INotifyMessage object.
     * @param settings - Additional options to configure the notification, such as the type, interval, and onClose callback.
     * @returns The result of calling the `notify` method with the provided parameters.
     */
    static success(message: INotifyMessage | INotifyOptions, title?: INotifyMessage, settings?: INotifyOptions) {
        return this.notify(message, 'success', title, settings)
    }
    /**
     * Displays an informational notification with the provided message and title.
     * @param message - The message to display in the notification. Can be a string or an INotifyOptions object.
     * @param title - The title to display in the notification. Can be a string or an INotifyMessage object.
     * @param settings - Additional options to configure the notification, such as the type, interval, and onClose callback.
     * @returns The result of calling the `notify` method with the provided parameters.
     */
    static info(message: INotifyMessage | INotifyOptions, title?: INotifyMessage, settings?: INotifyOptions) {
        return this.notify(message, 'info', title, settings)
    }
    /***
     * Displays a warning notification with the provided message and title.
     * @param message - The message to display in the notification. Can be a string or an INotifyOptions object.
     * @param title - The title to display in the notification. Can be a string or an INotifyMessage object.
     * @param settings - Additional options to configure the notification, such as the type, interval, and onClose callback.
     * @returns The result of calling the `notify` method with the provided parameters. 
     */
    static warning(message: INotifyMessage | INotifyOptions, title?: INotifyMessage, settings?: INotifyOptions) {
        return this.notify(message, "warn", title, settings)
    }
    /**
     * Returns the Notifiy component.
     * @returns The Notifiy component.
     */
    static get Component() {
        return _Notifiy;
    }
}

