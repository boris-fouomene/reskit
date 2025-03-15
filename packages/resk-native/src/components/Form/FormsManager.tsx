import { IDict, IField, IFieldType, isNonNullString, isObj, isObservable, observableFactory } from "@resk/core";
import { IForm, IFormAction, IFormCallbackOptions, IFormData, IFormField, IFormFields, IFormGetDataOptions, IFormManagerEvent } from "./types";
import "./types/augmented";
/**
 * @group Forms
 * Manages the lifecycle and state of forms within the application.
 * The `FormsManager` class provides static methods to mount, unmount, and interact with forms and their fields.
 * It also handles the validation and retrieval of form data, ensuring a consistent interface for form management.
 *
 * @class FormsManager
 * 
 * @remarks
 * This class is particularly useful in applications that require dynamic form handling,
 * allowing developers to manage multiple forms and their associated fields efficiently.
 */
export class FormsManager {
    /**
     * A collection of forms indexed by their names.
     * 
     * @private
     * @type { { [formName: string]: IForm } }
     */
    private static forms: { [fommName: string]: IForm } = {};
    /**
     * An observable factory for managing form-related events.
     * 
     * @private
     * @type {Observable<IFormManagerEvent>}
     */
    private static observable = observableFactory<IFormManagerEvent>();

    /**
     * A collection of actions associated with forms, indexed by form names and action IDs.
     * 
     * @private
     * @type { { [formName: string]: { [actionId: string]: IFormAction } } }
     */
    private static actions: {
        [fommName: string]: {
            [actionId: string]: IFormAction;
        };
    } = {};
    static isFieldInstance?: (field: any) => boolean;
    static isFormInstance?: (form: any) => boolean;
    /**
     * Checks if the provided variable is an instance of `IFormField`.
     * 
     * @param field - The variable to check.
     * @returns {field is IFormField} - Returns true if the variable is an instance of `IFormField`, otherwise false.
     * 
     * @example
     * const fieldInstance = new SomeFormField();
     * const isField = FormsManager.isField(fieldInstance); // true
     */
    static isField(field: any): field is IFormField {
        if (typeof FormsManager.isFieldInstance == "function") {
            return !!FormsManager.isFieldInstance(field);
        }
        return isObservable(field) && typeof field?.getName === "function" && typeof field?.getForm === "function" && typeof field?.isValid === "function";
    }
    /**
     * Checks if the provided variable is an instance of `IForm`.
     * 
     * @param form - The variable to check.
     * @returns {boolean} - Returns true if the variable is an instance of `IForm`, otherwise false.
     * 
     * @example
     * const formInstance = new SomeForm();
     * const isForm = FormsManager.isForm(formInstance); // true
     */
    static isForm(form: any): boolean {
        if (typeof FormsManager.isFormInstance == "function") {
            return !!FormsManager.isFormInstance(form);
        }
        return isObservable(form) && typeof form?.getName === "function" && typeof form?.isValid === "function" && typeof form?.getData === "function" && typeof form?.getFields === "function";
    }
    /**
     * Checks if the specified form is valid.
     * 
     * @param formName - The name of the form to check.
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     * 
     * @example
     * const isValid = FormsManager.isFormValid("myForm"); // true or false based on validation
     */
    static isFormValid(formName?: string): boolean {
        return this.getForm(formName)?.isValid() || false;
    }
    /**
     * Retrieves the data from the specified form.
     * 
     * @param formName - The name of the form to retrieve data from.
     * @param options - Optional parameters for fetching data.
     * @returns {IFormData} - The data associated with the specified form.
     * 
     * @example
     * const formData = FormsManager.getData("myForm"); // Retrieves data from "myForm"
     */
    static getData(formName?: string, options?: IFormGetDataOptions): IFormData {
        if (!formName) return {} as IFormData;
        const form = this.getForm(formName);
        if (form) return form.getData(options);
        return {};
    }
    /**
     * Mounts a form instance, making it available for management.
     * 
     * @param formInstance - The form instance to mount.
     * 
     * @example
     * const myForm = new MyForm();
     * FormsManager.mountForm(myForm); // Mounts the form instance
     */
    static mountForm(formInstance?: IForm) {
        if (!formInstance || this.isForm(this.forms[formInstance.getName()])) return;
        this.forms[formInstance.getName()] = formInstance;
        this.trigger("mountForm", formInstance);
    }
    /**
    * Unmounts a form by its name, removing it from management.
    * 
    * @param formName - The name of the form to unmount.
    * 
    * @example
    * FormsManager.unmountForm("myForm"); // Unmounts the form named "myForm"
    */
    static unmountForm(formName?: string): void {
        if (!formName) return;
        delete this.forms[formName];
        this.trigger("unmountForm", formName);
    }
    /**
    * Mounts a field instance, making it available for management.
    * 
    * @param field - The field instance to mount.
    * 
    * @example
    * const myField = new MyField();
    * FormsManager.mountField(myField); // Mounts the field instance
    */
    static mountField(field: IFormField) {
        if (!field || this.isField(field)) return;
        this.trigger("mountField", field);
    }
    /**
     * Unmounts a field instance, removing it from management.
     * 
     * @param field - The field instance to unmount.
     * 
     * @example
     * FormsManager.unmountField(myField); // Unmounts the specified field instance
     */
    static unmountField(field: IFormField) {
        if (!field || this.isField(field)) return;
        this.trigger("unmountField", field);
    }
    /**
     * Retrieves the instance of a form by its name.
     * 
     * @param formName - The name of the form to retrieve.
     * @returns {IForm | null} - The form instance if found, otherwise null.
     * 
     * @example
     * const formInstance = FormsManager.getForm("myForm"); // Retrieves the form instance
     */
    static getForm(formName?: string): IForm | null {
        if (!formName) return null;
        return this.forms[formName] || null;
    }

    /**
     * Retrieves the fields associated with a specified form.
     * 
     * @param formName - The name of the form to retrieve fields from.
     * @returns {IFormFields} - The fields associated with the specified form.
     * 
     * @example
     * const fields = FormsManager.getFields("myForm"); // Retrieves fields from "myForm"
     */
    static getFields(formName?: string): IFormFields {
        return this.getForm(formName)?.getFields() || {};
    }
    /**
     * Retrieves a specific field from a form by its name.
     * 
     * @param formName - The name of the form containing the field.
     * @param fieldName - The name of the field to retrieve.
     * @returns {IFormField | null} - The field instance if found, otherwise null.
     * 
     * @example
     * const field = FormsManager.getField("myForm", "myField"); // Retrieves the specified field
     */
    static getField<T extends IFieldType = IFieldType>(formName?: string, fieldName?: string): IFormField<T> | null {
        if (!isNonNullString(formName) || !isNonNullString(fieldName)) return null;
        const fields = this.getFields(formName);
        if (isObj(fields) && fieldName) {
            return fields[fieldName as string] as IFormField<T> || null;
        }
        return null;
    }
    /**
     * Mounts an action associated with a specified form.
     * 
     * @param action - The action to mount.
     * @param formName - The name of the form to associate the action with.
     * 
     * @example
     * const action = { id: "submit", handler: () => { } };
     * FormsManager.mountAction(action, "myForm"); // Mounts the action to "myForm"
     */
    static mountAction(action: IFormAction, formName: string) {
        if (!action || !formName || !isNonNullString(action?.id)) return;
        this.actions[formName] = this.actions[formName] || {};
        this.actions[formName][action?.id] = action;
        //this.getForm(formName)?.toggleValidationStatus();
        this.trigger("mountAction", action, formName);
    }
    /**
     * Unmounts an action from a specified form.
     * 
     * @param actionId - The ID of the action to unmount.
     * @param formName - The name of the form to disassociate the action from.
     * 
     * @example
     * FormsManager.unmountAction("submit", "myForm"); // Unmounts the action from "myForm"
     */
    static unmountAction(actionId: string, formName?: string) {
        if (!formName || !isNonNullString(actionId)) return;
        if (!isObj(this.actions[formName])) return;
        delete this.actions[formName][actionId];
        this.trigger("unmountAction", actionId, formName);
    }

    /**
     * Retrieves the actions associated with a specified form.
     * 
     * @param formName - The name of the form to retrieve actions from.
     * @returns { { [key: string]: IFormAction } } - The actions associated with the specified form.
     * 
     * @example
     * const actions = FormsManager.getActions("myForm"); // Retrieves actions from "myForm"
     */
    static getActions(formName: string) {
        if (!isNonNullString(formName)) return {};
        return this.actions[formName] || {};
    }
    /**
     * Checks if the primary key field has a value in the provided form data.
     * 
     * @param data - The form data to check.
     * @param field - The field representing the primary key.
     * @returns {boolean} - Returns true if the primary key exists in the data, otherwise false.
     * 
     * @example
     * const hasValue = FormsManager.hasPrimaryKeyValue({ id: 1 }, { name: "id", primaryKey: true }); // true
     */
    static hasPrimaryKeyValue({
        data,
        field,
    }: IFormCallbackOptions & { data: IFormData; field: IField }): boolean {
        const fieldName = field?.name || "";
        if (!fieldName || field?.primaryKey !== true) return false;
        if (!data || !fieldName) return false;
        return !(
            !(fieldName in data) ||
            data[fieldName] === null ||
            (!data[fieldName] && typeof data !== "number")
        );
    }
    /**
     * Checks if the provided document is editable based on the primary key fields.
     * 
     * @param data - The data to check for editability.
     * @param fields - The fields to base the check on.
     * @param checkPrimaryKey - A function to check if a field is a valid primary key.
     * @returns {boolean} - Returns true if the document is editable, otherwise false.
     * 
     * @example
     * const isEditable = FormsManager.isDataEditing({ id: 1 }, [{ name: "id", primaryKey: true }]); // true or false
     */
    static isDataEditing({
        data,
        fields,
        checkPrimaryKey,
        ...rest
    }: IFormCallbackOptions & {
        checkPrimaryKey?: (
            options: IFormCallbackOptions & { data: IFormData; field: IField }
        ) => boolean;
    }) {
        if (!isObj(data) || !fields) {
            return false;
        }
        let hasPrimaryFields = false;
        let hasValidated = true;
        checkPrimaryKey = checkPrimaryKey || this.hasPrimaryKeyValue;
        for (let i in fields) {
            const field = fields[i];
            if (!field || !field?.primaryKey) continue;
            field.name = field.name || i;
            hasPrimaryFields = true;
            /***
             * s'il s'agit d'une clé primaire non valide qui n'admet pas de valeur dans l'objet data alors on retourne false
             */
            if (
                checkPrimaryKey({
                    ...rest,
                    data: data as IDict,
                    fields,
                    field,
                }) === false
            ) {
                return false;
            }
        }
        if (hasPrimaryFields) {
            return hasValidated;
        }
        return false;
    }
    /**
     * Triggers an event with the specified arguments.
     * 
     * @param event - The event to trigger.
     * @param args - Additional arguments to pass to the event handler.
     * 
     * @example
     * FormsManager.trigger("mountForm", myForm); // Triggers the "mountForm" event
     */
    static trigger(event: IFormManagerEvent, ...args: any[]) {
        return this.observable.trigger(event, ...args);
    }
    /**
     * Registers a callback for a specific event.
     * 
     * @param event - The event to listen for.
     * @param callback - The function to call when the event is triggered.
     * 
     * @example
     * FormsManager.on("mountForm", (form) => { }); // Registers a callback for "mountForm"
     */
    static on(event: IFormManagerEvent, callback: (...args: any[]) => void) {
        return this.observable.on(event, callback);
    }
    /**
     * Unregisters a callback for a specific event.
     * 
     * @param event - The event to stop listening for.
     * @param callback - The function to remove from the event listener.
     * 
     * @example
     * FormsManager.off("mountForm", myCallback); // Unregisters the callback for "mountForm"
     */
    static off(event: IFormManagerEvent, callback: (...args: any[]) => void) {
        return this.observable.off(event, callback);
    }
    /**
     * Registers a callback that will be called only once for a specific event.
     * 
     * @param event - The event to listen for.
     * @param callback - The function to call when the event is triggered.
     * 
     * @example
     * FormsManager.once("mountForm", (form) => { }); // Registers a one-time callback for "mountForm"
     */
    static once(event: IFormManagerEvent, callback: (...args: any[]) => void) {
        return this.observable.once(event, callback);
    }
    /**
     * Retrieves all registered callbacks for a specific event.
     * 
     * @returns {Array<Function>} - An array of callbacks registered for the event.
     * 
     * @example
     * const callbacks = FormsManager.getEventCallBacks(); // Retrieves all event callbacks
     */
    static getEventCallBacks() {
        return this.observable.getEventCallBacks();
    }
    /**
     * Unregisters all callbacks for all events.
     * 
     * @example
     * FormsManager.offAll(); // Unregisters all event callbacks
     */
    static offAll() {
        return this.observable.offAll();
    }
}