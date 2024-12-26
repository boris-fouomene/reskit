import View from "@components/View";
import { defaultStr, extendObj, IFieldType, IResourceName, isEmpty, isNonNullString, isObj, ResourcesManager, uniqid } from "@resk/core";
import { isValidElement, ObservableComponent } from "@utils";
import { FormsManager } from "./FormsManager";
import { IFormField, IForm, IFormFieldsProp, IFormProps, IFormState, IFormEvent, IFormGetDataOptions, IFormData, IFormFields, IFormKeyboardEventHandlerOptions, IFormRenderTabProp, IFormCallbackOptions, IFormTabItemProp, IFormFieldProps, IFormAction, IFormOnSubmitOptions, IFormContext } from "./types";
import React, { ElementType, ReactElement, ReactNode, useMemo } from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "@components/ActivityIndicator";
import Breakpoints from "@breakpoints/index";
import { Tab } from "@components/Tab";
import { useDrawer } from "@components/Drawer/hooks";
import Theme, { useTheme } from "@theme/index";
import { Field } from "./Field";
import { IStyle } from "@src/types";
import { FormContext } from "./context";


/**
 * Represents a form component that manages its state, fields, and validation.
 * The `Form` class extends `ObservableComponent` and implements the `IForm` interface,
 * providing a structured way to handle form-related functionalities in a React application.
 * 
 * @class Form
 * @extends ObservableComponent<IFormProps, IFormState, IFormEvent>
 * @implements IForm
 * 
 * @remarks
 * This class is designed to handle dynamic forms, including field rendering, validation,
 * submission, and tab management. It provides a context for child components to access
 * the form instance and its methods.
 * 
 * @example
 * // Example of using the Form component
 * const MyForm: React.FC = () => {
 *     return (
 *         <Form
 *             name="myForm"
 *             fields={{
 *                 username: { type: "text", label: "Username" },
 *                 password: { type: "password", label: "Password" },
 *             }}
 *             onSubmit={(data) => console.log(data)}
 *         />
 *     );
 * };
 */
export class Form extends ObservableComponent<IFormProps, IFormState, IFormEvent> implements IForm {
    readonly defaultName: string = uniqid("form-name");
    readonly state = { isSubmitting: false } as IFormState;
    private _hasTriedTobeSubmitted?: boolean = false;
    private validationStatus = false;
    private readonly fields: IFormFields = {};
    private errors: string[] = [];
    readonly primaryKeyFields: IFormFieldsProp = {};
    componentProps: IFormProps = {} as IFormProps;
    constructor(props: IFormProps) {
        super(props);
        this.init();
        Object.assign(this.state, this.prepareState());
    }
    init() { }
    /**
     * Prepares the initial state of the form based on the provided props.
     * 
     * @param {IFormProps} [props] - Optional properties to use for state preparation.
     * @returns {IFormState} - The prepared state for the form.
     */
    prepareState(props?: IFormProps): IFormState {
        props = this.getComponentProps(props);
        const fields = (props.fields = this.prepareFields(props));
        const { tabItems, mobile } = this.renderTabItems(props);
        return {
            isSubmitting: this.state.isSubmitting,
            formFields: <Form.Fields form={this}
                {...this.componentProps}
                fields={fields}
                children={undefined}
            />,
            tabs: { mobile, items: tabItems },
            children: this.renderChildren(props),
            header: this.renderHeader(props),
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps: Readonly<IFormProps>, nextContext: any): void {
        this.setState(this.prepareState(nextProps));
    }
    /**
     * Renders the tab items for the form based on the provided options.
     * 
     * @param {IFormProps} options - The properties for rendering tabs.
     * @returns {{ mobile: boolean; tabItems: ReactNode[] }} - The rendered tab items and mobile flag.
     */
    renderTabItems(options: IFormProps): {
        mobile: boolean;
        tabItems: ReactNode[];
    } {
        const isLoading = this.isLoading(options);
        const items: IFormTabItemProp[] | null | undefined =
            typeof options.tabItems == "function" ? options.tabItems(options) : options.tabItems;
        const tabItems: ReactNode[] = [];
        const mobile = this.canRenderMobileTabs(options);
        if (Array.isArray(items)) {
            items.map((item, index) => {
                if (!isObj(item) || !item) return;
                const { children, label, ...rest } = item;
                tabItems.push(
                    <Tab.Item
                        key={String(["string", "number"].includes(typeof label) ? label : "") + index}
                        label={label}
                        children={<>
                            {isLoading
                                ? this.renderLoading(options)
                                : typeof children === "function"
                                    ? children(options)
                                    : children
                            }
                        </>}
                        {...rest}
                        resourceName={isNonNullString(rest.resourceName) ? rest.resourceName : this.getResourceName()}
                    />
                );
            });
        }
        return { tabItems, mobile };
    }
    renderHeader(options: IFormProps): ReactNode {
        const header = typeof options.header == "function" ? options.header(options) : options.header;
        if (header && this.isLoading(options)) return this.renderLoading(options);
        return isValidElement(header) ? header : null;
    }
    renderChildren(options: IFormProps): ReactElement {
        const children =
            typeof options?.children == "function" ? options.children(options) : options?.children;
        if (children && this.isLoading(options)) return this.renderLoading(options);
        return isValidElement(children) ? (children as ReactElement) : <React.Fragment />;
    }
    /***
     * retourne le type de rendu pour le composant Tab
     */
    getRenderTabType(options?: IFormProps): IFormRenderTabProp {
        options = Object.assign({}, options);
        if (isNonNullString(options.renderTabType)) {
            return options.renderTabType as IFormRenderTabProp;
        }
        if (isObj(this.componentProps) && isNonNullString(this.componentProps.renderTabType)) {
            return this.componentProps.renderTabType as IFormRenderTabProp;
        }
        return "auto";
    }
    canRenderMobileTabs(options: IFormProps): boolean {
        const renderTabType = this.getRenderTabType(options);
        return renderTabType === "mobile" || (renderTabType === "auto" ? Breakpoints.isMobileOrTabletMedia() : false)
    }
    getName(): string {
        return defaultStr(this.props.name, this.defaultName);
    }
    getForm(name: string): Form | undefined {
        return FormsManager.getForm(name) as Form;
    }
    isDocEditing(props?: IFormProps): boolean {
        const p: IFormCallbackOptions = {
            ...this.props,
            ...Object.assign({}, props),
            fields: props?.fields || this.componentProps?.fields || undefined,
            form: this
        };
        p.fields = Object.assign({}, p.fields);
        if (this.props.isDocEditing) {
            return this.props.isDocEditing(p);
        }
        return FormsManager.isDocEditing(p);
    }
    isSubmitting(): boolean {
        return !!this.state?.isSubmitting || !!this.props.isSubmitting || false;
    }
    isLoading(options?: IFormProps): boolean {
        return !!options?.isLoading || !!this.componentProps?.isLoading;
    }
    getFields(): { [fieldName: string]: IFormField } {
        return this.fields;
    }
    getField(fieldName: string): IFormField | null {
        if (!isNonNullString(fieldName)) return null;
        return this.getFields()[fieldName] || null;
    }
    isValid(): boolean {
        const fields = this.getFields();
        this.errors = [];
        for (let j in fields) {
            const f = fields[j];
            if (f && !f.isValid()) {
                this.errors.push(`[${f.getLabel()}] : ${f.getErrorText()}`);
            }
        }
        if (this.errors.length) {
            return false;
        }
        return true;
    }
    /*** retourne les données du formulaire
     *  on retourne en plus des données initialement passées en paramètre, la liste des données
     *  qui ont été modifiées
     * @param {IFormGetDataOptions} [options]
     **/
    getData(options?: IFormGetDataOptions): IFormData {
        const data = { ...Object.assign({}, this.componentProps.data) };
        if (options?.handleChange === false) {
            return data;
        }
        const fields = this.getFields();
        if (!fields) return data;
        for (let i in fields) {
            const field = fields[i];
            if (!FormsManager.isField(field)) continue;
            const fName: string = field.getName(),
                fValue = field.isValid() ? field.getValidValue(data) : field.getValue();
            data[fName] = fValue;
            if (fValue === undefined) {
                delete data[fName];
            }
        }
        return data;
    }
    getComponentProps(props?: IFormProps): IFormProps {
        this.componentProps = {} as IFormProps;
        props = props || this.props;
        Object.assign(this.componentProps, {
            ...Object.assign({}, props),
            isUpdate: this.isDocEditing(props),
        });
        return this.componentProps;
    }
    getErrors(): string[] {
        return Array.isArray(this.errors) ? this.errors : [];
    }
    handleKeyboardEvent(options: IFormKeyboardEventHandlerOptions) {
        options = Object.assign({}, options);
        options.formData = this.getData();
        options.form = this;
        if (this.componentProps?.onKeyboardEvent) {
            this.componentProps?.onKeyboardEvent(options);
        }
        if (options?.key === "enter" && this.isValid()) {
            if (
                this.componentProps?.onEnterKeyPress &&
                this.componentProps.onEnterKeyPress(options) === false
            ) {
                return;
            }
            //this.submit();
        }
        return this;
    }
    renderLoading(options?: IFormProps) {
        return <Form.Loading {...Object.assign({}, options)} />;
    }
    mountField(field: IFormField) {
        if (!field) return;
        this.fields[field.getName()] = field;
    }
    unmountField(field: IFormField) {
        if (!field) return;
        delete this.fields[field.getName()];
    }
    isResource() {
        return false;
    }
    /***
     * retourne le nom de la resource, lorsque la form est de type resource
     */
    getResourceName(): IResourceName | undefined {
        return undefined;
    }

    prepareFields(props?: IFormProps): IFormFieldsProp {
        const p = Object.assign({}, props || this.props) as IFormProps;
        p.data = p?.data || {};
        const { responsive } = p;
        const preparedFields: IFormFieldsProp = {};
        const isUpdate = this.isDocEditing(p);
        this.componentProps.isUpdate = isUpdate;
        for (let i in this.primaryKeyFields) {
            delete this.primaryKeyFields[i];
        }
        if (p.fields) {
            for (let i in p.fields) {
                const field: IFormFieldProps | undefined =
                    (p.fields[i] && Object.clone(p.fields[i])) || undefined;
                if (!field || !ResourcesManager.isAllowed(field)) continue;
                if (field.rendable === false) continue;
                delete field.rendable;
                if (field.form) {
                    //on override l'objet field par les propriété personnalisées définis dans le form
                    extendObj(field, field.form);
                    if (isUpdate && field.form.update) {
                        extendObj(field, field.form.update);
                    } else if (!isUpdate && field.form.create) {
                        extendObj(field, field.form.create);
                    }
                }
                if (field.rendable === false) continue;
                if (!("responsive" in field && typeof responsive == "boolean")) {
                    field.responsive = responsive;
                }
                const name = (field.name = field.name || i);
                if (field.primaryKey === true) {
                    field.readOnly = true;
                }
                if (p.disabled) {
                    field.disabled = true;
                }
                const fieldOptions = {
                    ...p,
                    fields: preparedFields,
                    isUpdate,
                    fieldName: name,
                    field,
                };
                if (!this.canRenderField(fieldOptions)) {
                    continue;
                }
                const preparedField = this.prepareField(fieldOptions);
                if (preparedField) {
                    if (p.readonly) {
                        preparedField.readOnly = true;
                    }
                    if (p.disabled) {
                        preparedField.disabled = true;
                    }
                    if (preparedField.primaryKey) {
                        this.primaryKeyFields[name] = field;
                    }
                    preparedField.displayErrors =
                        typeof preparedField.displayErrors === "boolean"
                            ? preparedField.displayErrors
                            : typeof p.displayErrors === "boolean"
                                ? preparedField.displayErrors
                                : undefined;
                    const { onMount, onUnmount } = preparedField;
                    preparedField.onMount = (formField) => {
                        this.mountField(formField);
                        if (onMount) {
                            onMount(formField);
                        }
                    };
                    preparedField.onUnmount = (formField) => {
                        this.unmountField(formField);
                        if (onUnmount) {
                            onUnmount(formField);
                        }
                    };
                    preparedFields[name] = preparedField as IFormFieldProps;
                }
            }
        }
        return preparedFields;
    }

    canRenderField(options: IFormProps & { field: IFormFieldProps; fieldName: string; isUpdate: boolean; }): boolean {
        if (options?.field?.rendable === false) return false;
        if (options?.canRenderField && !options?.canRenderField(options)) return false;
        else if (options?.canRenderField != this.props.canRenderField) {
            if (this.props?.canRenderField && !this.props.canRenderField(options)) return false;
        }
        const { fieldName } = options;
        if (fieldName) {
            if (
                options.renderableFieldsNames &&
                !options.renderableFieldsNames.includes(options?.fieldName)
            )
                return false;
            else if (
                options.renderableFieldsNames != this.props.renderableFieldsNames &&
                this.props.renderableFieldsNames &&
                !this.props.renderableFieldsNames.includes(fieldName)
            ) {
                return false;
            }
        }
        return true;
    }
    prepareField(options: IFormProps & { field: IFormFieldProps; fieldName: string; isUpdate: boolean; }): IFormFieldProps | null {
        return options?.field;
    }
    setHasTriedTobeSubmitted(hasTriedTobeSubmitted: boolean) {
        this._hasTriedTobeSubmitted = hasTriedTobeSubmitted;
    }
    hasTriedTobeSubmitted() {
        return !!this._hasTriedTobeSubmitted;
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        this.setHasTriedTobeSubmitted(false);
        FormsManager.unmountForm(this.getName());
    }
    mountMe() {
        FormsManager.mountForm(this);
        this.toggleValidationStatus();
    }
    getActions(): Record<string, IFormAction> {
        return FormsManager.getActions(this.getName());
    }
    resetFields() {
        const fields = this.getFields();
        for (let i in fields) {
            delete fields[i];
        }
    }
    componentDidMount() {
        super.componentDidMount();
        this.mountMe();
    }
    hasFields(): boolean {
        const fields = this.getFields();
        for (let i in fields) {
            if (FormsManager.isField(fields[i])) return true;
        }
        return false;
    }
    getErrorText(): string {
        return this.errors?.join("\n") || "";
    }
    toggleIsSubmitting(isSubmitting: boolean, callback?: Function) {
        this.toggleActionIsLoading(isSubmitting);
        this.setState({ isSubmitting } as IFormState, () => {
            if (typeof callback === "function") callback();
        });
    }
    toggleActionIsLoading(actionIsLoading: boolean): void {
        const actions = this.getActions();
        for (let i in actions) {
            const action = actions[i];
            if (isObj(action) && action && typeof (action as any).setIsLoading === "function") {
                (action as any).setIsLoading(actionIsLoading);
            }
        }
    }
    onSubmit(options: IFormOnSubmitOptions): Promise<any> {
        if (options) {
            options.isUpdate =
                !!options.isUpdate ||
                this.isDocEditing({ ...this.componentProps, ...Object.assign({}, options) });
        }
        return new Promise<any>((resolve, reject) => {
            const callback = this.componentProps?.onSubmit;
            try {
                resolve(callback ? callback(options) : options);
            } catch (err) {
                //notify.error(err as INotifyMessage);
                reject(err);
            }
        });
    }
    /***
     * la fonction beforeSubmit est appélée immédiatement avant l'initialisation du processus d'envoie du formulaire
     * elle est principalement utilisée, lorsqu'on désire à titre d'exemple modifier les données qu'on souhaite envoyer
     * par le formulaire;
     */
    beforeSubmit(options: IFormOnSubmitOptions): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const callback = this.componentProps?.beforeSubmit;
            try {
                resolve(callback ? callback(options) : options);
            } catch (err) {
                //notify.error(err as INotifyMessage);
                reject(err);
            }
        });
    }
    /***
     * cette fonction permet d'envoyer les données de formulaire au serveur.
     * Elle joue principalement deux roles :
     *  1. désactiver/reactiver les status des butons d'actions liés au formulaire
     *  2. désactiver/reactiver tous les champs du formulaires
     * Elle appelle la props onSubmit en passant en paramètre l'objet data représentant les données du formulaire en l'instant t
     */
    submit(): Promise<any> {
        if (!this.isValid()) {
            this.setHasTriedTobeSubmitted(true);
            this.toggleValidationStatus(false);
            const message = this.getErrorText();
            //notify.error(message);
            const fields = this.getFields();
            for (let i in fields) {
                const field = fields[i];
                if (field?.setFormTriedTobeSubmitted) {
                    field.setFormTriedTobeSubmitted(true);
                }
            }
            return Promise.reject(new Error(message));
        }
        return new Promise((resolve, reject) => {
            const data = this.getData();
            const isUpdate =
                !!this.componentProps?.isUpdate || this.isDocEditing({ ...this.componentProps, data });
            const options = { data, isUpdate, form: this };
            return this.beforeSubmit(options).then(() => {
                this.toggleIsSubmitting(true, () => {
                    return Promise.resolve(this.onSubmit(options))
                        .then(resolve)
                        .catch(reject)
                        .finally(() => {
                            this.toggleIsSubmitting(false);
                        });
                });
            });
        });
    }
    onValidate(...rest: any[]) {
        this.trigger("validate", this.getName(), ...rest);
        FormsManager.trigger("validateForm", this.getName(), ...rest);
    }
    onNoValidate(...rest: any[]) {
        this.trigger("noValidate", this.getName(), ...rest);
        FormsManager.trigger("noValidateForm", this.getName(), ...rest);
    }
    /***
     * met à jour les status des actions associés au composant FormBase
     * @param {boolean} validationStatus, le nouveau status du formulaire, à appliquer à toutes les actions associées à la form
     *      - si validationStatus n'est pas passé en paramètre alors \n
     *          - si tous les champs sont valides, toutes les actions seront activés et \n
     *          - si un seul des champ est invalide, toutes les actions seront désactivées
    @return {boolean} retourne le nouveau status pris par les actions du formulaire. 
    */
    toggleValidationStatus(validationStatus?: boolean, trigger?: boolean): boolean {
        if (!this.hasTriedTobeSubmitted()) return validationStatus as boolean;
        const actions = this.getActions();
        validationStatus = typeof validationStatus !== "boolean" ? this.isValid() : validationStatus;
        for (var k in actions) {
            const action = actions[k];
            if (action) {
                if (validationStatus) {
                    if (typeof (action as any)?.enable === "function") {
                        (action as any).enable();
                    }
                } else if (typeof (action as any)?.disable === "function") {
                    (action as any).disable();
                }
            }
        }
        if (validationStatus !== this.validationStatus || trigger === true) {
            FormsManager.trigger("formValidationStatusChanged", {
                formName: this.getName(),
                isValild: this.isValid(),
                form: this,
            });
            this.validationStatus = validationStatus;
        }
        this.validationStatus = !!this.validationStatus;
        return validationStatus;
    }
    static Loading: React.FC<IFormProps> = (props) => {
        return (
            <View
                testID={`${props?.testID || ""}-form-loading-container`}
                style={styles.loadingContainer}
            >
                <ActivityIndicator size={"large"} />
            </View>
        );
    }

    static Fields: React.FC<IFormProps & IFormContext> = (props) => {
        const theme = useTheme();
        const { fields, data, name: formName, form, windowWidth, isLoading, isSubmitting } = props;
        const { drawer } = useDrawer();
        return useMemo(() => {
            if (!Object.getSize(fields, true)) return null;
            const content: ReactNode[] = [];
            for (let i in fields) {
                const field = fields[i];
                if (!isObj(field)) continue;
                const name = defaultStr(field?.name, i);
                const type = field?.type || "text" as IFieldType;
                let defaultValue = undefined;
                if (isObj(data)) {
                    if (!isEmpty((data as any)[name])) {
                        defaultValue = (data as any)[name];
                    }
                }
                if (isEmpty(defaultValue) && !isEmpty(field?.defaultValue)) {
                    defaultValue = field?.defaultValue;
                } else {
                }
                const fieldProps = {
                    ...field,
                    name,
                    type,
                    formName,
                    data,
                };
                if (isSubmitting) {
                    fieldProps.readOnly = true;
                }
                if (!isEmpty(defaultValue)) {
                    fieldProps.defaultValue = defaultValue;
                } else if (isObj(data) && name in (data as any)) {
                    fieldProps.defaultValue = (data as any)[name];
                }
                const drawerWidth = drawer?.getDrawerWidth();
                fieldProps.windowWidth = fieldProps.windowWidth || windowWidth || drawerWidth || undefined;
                const Component = Field.getRegisteredComponent(type as IFieldType) || Field.getRegisteredComponent("text") || Field;
                content.push(<Component isFormLoading={isLoading} isFormSubmitting={isSubmitting} {...fieldProps} key={name} />);
            }
            return content;
        }, [theme, formName, props.isUpdate, data, fields, isLoading, isSubmitting]) as ReactNode[];
    }

    render() {
        const props = this.componentProps;
        const { formFields, tabs, children: cChildren, header } = this.state;
        const {
            data,
            responsive,
            style,
            tabsProps: tProps,
            mainTabItemProps,
            sessionName,
            ...viewProps
        } = this.componentProps;
        const testID = viewProps.testID || "resk-form";;
        const isSubmitting = this.isSubmitting() || props?.isSubmitting;
        const tabsProps = Object.assign({}, tProps);
        const { items: tabItems, mobile } = tabs;
        const submitStyle = isSubmitting ? [isSubmitting ? styles.submitting : undefined] : [];
        const disabledStyle = isSubmitting ? Theme.styles.disabled : undefined;
        const formContainerStyle = [styles.formContainer, ...submitStyle, disabledStyle];
        const mainFormTabStyle: IStyle = [
            ...formContainerStyle,
            styles.mainFormTab,
            { flexDirection: responsive === false ? "column" : "row" },
        ];
        let children = (<>
            {header}
            {formFields}
            {cChildren}
        </>);
        let tabChildren = null;
        if (tabItems.length) {
            if (mobile) {
                tabItems.unshift(
                    <Tab.Item
                        label={"Principal"}
                        {...mainTabItemProps}
                        key={"principal-main-tab-item"}
                        disabled={isSubmitting}
                        children={
                            <View testID={testID + "-main-form-tab"} style={mainFormTabStyle}>
                                {children}
                            </View>
                        }
                    />
                );
            } else {
                children = (
                    <View testID={testID + "-main-form-tab-desktop"} style={mainFormTabStyle}>
                        {children}
                    </View>
                );
            }
            tabChildren = (
                <Tab
                    sessionName={sessionName}
                    {...tabsProps}
                    disabled={tabsProps.disabled || isSubmitting}
                    style={[tabsProps.style, submitStyle]}
                >
                    {tabItems}
                </Tab>
            );
        }
        return (
            <FormContext.Provider value={{ form: this }}>
                <View
                    {...viewProps}
                    testID={testID}
                    style={[
                        tabItems.length ? styles.tabsContainer : styles.formContainer,
                        responsive !== false && styles.responsiveFormContainer,
                        style,
                        submitStyle,
                    ]}
                >
                    {mobile && tabItems.length ? (
                        tabChildren
                    ) : (
                        <>
                            {children}
                            {tabChildren}
                        </>
                    )}
                </View>
            </FormContext.Provider>
        );
    }
    static readonly Field = Field;
}

Form.Loading.displayName = "Form.Loading";


const styles = StyleSheet.create({
    hidden: { display: "none", opacity: 0 },
    helperTextHidden: { opacity: 0 },
    labelLoading: {
        marginHorizontal: 15,
        marginBottom: -5,
    },
    loadingContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        padding: 10,
    },
    formContainer: {
        padding: 10,
        paddingTop: 15,
        marginVertical: 2,
        rowGap: 5,
    },
    mainFormTab: {
        flexWrap: "wrap",
    },
    submitting: {
        pointerEvents: "none",
    },
    responsiveFormContainer: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tabsContainer: {
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
});