import { IDict, isClass, isNonNullString, isObj, isObservable, observableFactory } from "@resk/core";
import { IForm, IFormAction, IFormCallbackOptions, IFormData, IFormField, IFormFieldProps, IFormGetDataOptions, IFormManagerEvent } from "./types";

export class FormsManager {
    private static forms: { [fommName: string]: IForm } = {};
    private static observable = observableFactory<IFormManagerEvent>();

    private static actions: {
        [fommName: string]: {
            [actionId: string]: IFormAction;
        };
    } = {};
    /***
     * vérifie si la variable passée en paramètre est une instance de IFormField
     */
    static isField(field: any): field is IFormField {
        return isClass(field) && isObservable(field) && typeof field?.getName === "function" && typeof field?.getForm === "function" && typeof field?.isValid === "function";
    }
    /***
     * vérifie si la variable passée en paramètre est une instance de IForm
     */
    static isForm(form: any): boolean {
        return isClass(form) && isObservable(form) && typeof form?.getName === "function" && typeof form?.isValid === "function" && typeof form?.getData === "function" && typeof form?.getFields === "function";
        //return form instanceof IForm;
    }
    static isFormValid(formName?: string): boolean {
        return this.getForm(formName)?.isValid() || false;
    }
    /***
     * retourne les données du formulaire dont le nom est passé en paramètre
     */
    static getData(formName?: string, options?: IFormGetDataOptions): IFormData {
        if (!formName) return {} as IFormData;
        const form = this.getForm(formName);
        if (form) return form.getData(options);
        return {};
    }
    static mountForm(formInstance?: IForm) {
        if (!formInstance || this.isForm(this.forms[formInstance.getName()])) return;
        this.forms[formInstance.getName()] = formInstance;
        this.trigger("mountForm", formInstance);
    }
    static unmountForm(formName?: string): void {
        if (!formName) return;
        delete this.forms[formName];
        this.trigger("unmountForm", formName);
    }
    static mountField(field: IFormField) {
        if (!field || this.isField(field)) return;
        this.trigger("mountField", field);
    }
    static unmountField(field: IFormField) {
        if (!field || this.isField(field)) return;
        this.trigger("unmountField", field);
    }
    /***
     * retourne l'instance form dont le nom est passé en paramètre
     */
    static getForm(formName?: string): IForm | null {
        if (!formName) return null;
        return this.forms[formName] || null;
    }

    /***
     * retourne les champs associés aux formulaire dont le nom est passé en paramètre
     * @param {string} formName, le nom du formulaire
     * @return {[key:string]:IFormField}, les champs associé au formulaire en question
     */
    static getFields(formName?: string): { [key: string]: IFormField } {
        return this.getForm(formName)?.getFields() || {};
    }
    /*** retourne l'instance d'un champ à partir du nom du formulaire et celui du champ en question
     * @param : formName : le nom de la form dans lequel est définit le cham
     * @parm f: string field name : le nom du champ à récupérer
     */
    static getField(formName?: string, fieldName?: string) {
        if (!isNonNullString(formName) || !isNonNullString(fieldName)) return null;
        const fields = this.getFields(formName);
        if (isObj(fields) && fieldName) {
            return fields[fieldName as string] || null;
        }
        return null;
    }
    static mountAction(action: IFormAction, formName: string) {
        if (!action || !formName || !isNonNullString(action?.id)) return;
        this.actions[formName] = this.actions[formName] || {};
        this.actions[formName][action?.id] = action;
        //this.getForm(formName)?.toggleValidationStatus();
        this.trigger("mountAction", action, formName);
    }
    static unmountAction(actionId: string, formName?: string) {
        if (!formName || !isNonNullString(actionId)) return;
        if (!isObj(this.actions[formName])) return;
        delete this.actions[formName][actionId];
        this.trigger("unmountAction", actionId, formName);
    }
    static getActions(formName: string) {
        if (!isNonNullString(formName)) return {};
        return this.actions[formName] || {};
    }

    /***
       * permet de vérifier que le champ primaryKeyField (clé primarire) admet une valeur dans la données data de type IFormData, données du formulaire
         @param {IFormData} data, la données dans laquelle vérifier l'appartenance de la clé primaire
         @param {FieldProps & {context:IForm}} field, l'objet IField representant le champ sur lequel vérifier l'appartenance comme clé primaire à la valeur
      *  @return {boolean} true si la clé primaire existe dans les données, false sinon 
      */
    static hasPrimaryKeyValue({
        data,
        field,
    }: IFormCallbackOptions & { data: IFormData; field: IFormFieldProps }): boolean {
        const fieldName = field?.name || "";
        if (!fieldName || field?.primaryKey !== true) return false;
        if (!data || !fieldName) return false;
        return !(
            !(fieldName in data) ||
            data[fieldName] === null ||
            (!data[fieldName] && typeof data !== "number")
        );
    }
    /*** vérifie si le document passé en paramètre est éditable
     * @param {object} data la données à vérifier
     * @param {object| array} les champs sur lesquels se baser pour vérifier si la donénes est une mise à jour
     * @param {func} checkPrimaryKey la fonction permettant de vérifier s'il s'agit d'une clé primaire pour la données courante. elle doit retourner true s'il s'agit d'une clé primaire ayant une valeur valide dans l'objet data et false le cas contraire
     */
    static isDocEditing({
        data,
        fields,
        checkPrimaryKey,
        ...rest
    }: IFormCallbackOptions & {
        checkPrimaryKey?: (
            options: IFormCallbackOptions & { data: IFormData; field: IFormFieldProps }
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

    static trigger(event: IFormManagerEvent, ...args: any[]) {
        return this.observable.trigger(event, ...args);
    }
    static on(event: IFormManagerEvent, callback: (...args: any[]) => void) {
        return this.observable.on(event, callback);
    }
    static off(event: IFormManagerEvent, callback: (...args: any[]) => void) {
        return this.observable.off(event, callback);
    }
    static once(event: IFormManagerEvent, callback: (...args: any[]) => void) {
        return this.observable.once(event, callback);
    }
    static getEventCallBacks() {
        return this.observable.getEventCallBacks();
    }
    static offAll() {
        return this.observable.offAll();
    }
}