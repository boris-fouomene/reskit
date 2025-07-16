"use client";
import { IHtmlDivProps } from "@html/types";
import { ObservableComponent } from "@utils/Component";
import { IFormData, IFormEvent, IFormOnSubmitOptions } from "./types";
import { Auth, IAuthPerm } from "@resk/core/auth";
import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import { IField, IFields } from "@resk/core/types";
import { Fragment, isValidElement, ReactElement, ReactNode, useCallback, useEffect, useId, useMemo, useRef } from "react";
import { IClassName } from "@src/types";
import { defaultStr, extendObj, isEmpty, isObj, typedEntries } from "@resk/core/utils";
import useStateCallback from "@utils/stateCallback";
import { IObservable, observableFactory } from "@resk/core/observable";
import stableHash from 'stable-hash';
import { IKeyboardEventHandlerEvent } from "@components/KeyboardEventHandler";
import { IFormSubmitOptions } from '../../../../../../webAppV2/shared/src/components/Form/types';

export function Form({ name, fields, isLoading, disabled, beforeSubmit: customBeforeSubmit, onKeyboardEvent, onEnterKeyPress, prepareField, readOnly, header, isEditingData, data: customData, ...props }: IFormProps) {
    const generatedId = useId();
    isLoading = !!isLoading;
    const [formState, setFormState] = useStateCallback<IFormState>({ isSubmitting: false });
    const stateRef = useRef<IFormState>(formState);
    stateRef.current = formState;
    const data = useMemo(() => {
        return isObj(customData) ? customData : {};
    }, [customData]);
    const dataRef = useRef<IFormData>(data);
    dataRef.current = data;
    const isLoadingRef = useRef(isLoading);
    isLoadingRef.current = isLoading;
    const formName = useMemo(() => {
        return defaultStr(name, "form-" + generatedId);
    }, [name, generatedId]);
    const { fields: prePreparedFields, primaryKeys } = useMemo(() => {
        const preparedFields: IFields = {} as IFields;
        const primaryKeys: string[] = [];
        if (fields && isObj(fields)) {
            typedEntries(fields).map(([name, _field]) => {
                if (!_field || !isObj(_field) || _field.rendable === false) return;
                if (_field.perm !== undefined && !Auth.isAllowed(_field.perm)) return;
                const field = Object.clone(_field);
                delete field.rendable;
                field.name = defaultStr(field.name, name);
                if (field.primaryKey === true) {
                    primaryKeys.push(name);
                }
                preparedFields[field.name] = field;
            })
        }
        return { fields: preparedFields, primaryKeys };
    }, [formName, fields]);
    const primaryKeysRef = useRef<string[]>(primaryKeys);
    primaryKeysRef.current = primaryKeys;
    const isUpdate = useMemo(() => {
        if (typeof isEditingData === "function") {
            return isEditingData({
                data,
                primaryKeys,
            });
        }
        if (!primaryKeys.length) return false;
        for (const key of primaryKeys) {
            if (!isEmpty((data as any)[key])) return true;
        }
        return false;
    }, [data, isEditingData, primaryKeys]);
    const isUpdateRef = useRef<boolean>(isUpdate);
    isUpdateRef.current = isUpdate;



    const preparedFields = useMemo(() => {
        const preparedFields: IFields = {} as IFields;
        typedEntries(prePreparedFields).map(([name, field]) => {
            if (isObj(field.createOrUpdate)) {
                extendObj(field, field.createOrUpdate);
            }
            if (isUpdate && isObj(field.update)) {
                extendObj(field, field.update);
            } else if (!isUpdate && isObj(field.create)) {
                extendObj(field, field.create);
            }
            if (field.primaryKey === true && isUpdate) {
                field.readOnly = true;
            }
            if (disabled) {
                field.disabled = true;
            }
            if (readOnly) {
                field.readOnly = true;
            }
            if (typeof prepareField == "function") {
                const prepared = prepareField({
                    fields: preparedFields,
                    isUpdate,
                    field,
                    data,
                });
                if (!isObj(prepared)) return;
                preparedFields[name] = prepared;
            }
        });
        return preparedFields;
    }, [disabled, readOnly, isUpdate, data, stableHash(prepareField)]);

    const beforeSubmit = useCallback(async (options: IFormSubmitOptions): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            const callback = typeof customBeforeSubmit == "function" ? customBeforeSubmit : undefined;
            try {
                resolve(callback ? callback(options as any) : options);
            } catch (err) {
                //Notify.error(err as INotifyMessage);
                reject(err);
            }
        });
    }, [customBeforeSubmit]);
    const beforeSubmitRef = useRef(beforeSubmit);
    beforeSubmitRef.current = beforeSubmit;
    const form = useMemo<IForm>(() => {
        const form = observableFactory<IFormEvent>();

        const isValid = () => false;
        const getData = () => dataRef.current;
        (form as IForm).getName = () => formName;
        ((form as IForm)).isValid = isValid;
        (form as IForm).isEditing = () => isUpdateRef.current;
        (form as IForm).getData = getData;
        (form as IForm).isSubmitting = () => stateRef.current.isSubmitting;
        (form as IForm).getPrimaryKeys = () => primaryKeysRef.current;
        (form as IForm).getFields = () => preparedFields;
        (form as IForm).isLoading = () => isLoadingRef.current;
        (form as IForm).submit = () => {
            if (!isValid()) {
                //this.setHasTriedTobeSubmitted(true);
                //this.toggleValidationStatus(false);
                /* const message = this.getErrorText();
                if (this.props?.displayErrorsWhenSubmitting) {
                    Notify.error(message);
                } */
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
                const data = getData();
                const isUpdate = isUpdateRef.current;
                return beforeSubmitRef.current(options).then(() => {
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
        return form;
    }, [formName]);
    useEffect(() => {
        return () => {
            form?.offAll?.();
        }
    }, [form]);
    const handleKeyboardEvent = useCallback(function (options: IFormKeyboardEventHandlerOptions) {
        options = Object.assign({}, options);
        options.formData = form.getData();
        options.form = form;
        if (typeof onKeyboardEvent == "function") {
            onKeyboardEvent(options);
        }
        if (options?.key === "enter" && form.isValid()) {
            if (typeof onEnterKeyPress == "function" && onEnterKeyPress(options) === false) {
                return;
            }
            form.submit();
        }
    }, [onKeyboardEvent, onEnterKeyPress]);
    const headerContent = useMemo(() => {
        const h = typeof header == "function" ? header() : header;
        if (header && isLoading) return this.renderLoading(options);
        return isValidElement(header) ? header : null;
    }, [header, isLoading]);
}


export interface IForm extends IObservable<IFormEvent> {
    getName(): string;
    isValid(): boolean;
    isEditing(): boolean;
    getData(): IFormData;
    getFields(): IFields;
    isSubmitting(): boolean;
    getPrimaryKeys(): string[];
    isLoading(): boolean;
    submit(): Promise<any>;
    isValid(): boolean;
    /* getErrors(): string[];
    renderLoading(options?: IFormProps): ReactNode;
    mountField(field: IFormField): void; */
}

export interface IFormKeyboardEventHandlerOptions {
    key: IKeyboardEventHandlerKey;
    event: IKeyboardEventHandlerEvent;
    formData: IFormData;
    form: IForm;
    isFormField?: boolean;
    value?: any;
};
export interface IFormState {
    isSubmitting: boolean;
}
export class FormClass extends ObservableComponent<IFormProps, IFormState, IFormEvent> {
    private _hasTriedTobeSubmitted?: boolean = false;
    private validationStatus = false;
    private readonly fields: IFormFields = {};
    private errors: string[] = [];


    renderChildren(options: IFormProps): ReactElement {
        const children =
            typeof options?.children == "function" ? options.children(options) : options?.children;
        if (children && this.isLoading(options)) return this.renderLoading(options);
        return isValidElement(children) ? (children as ReactElement) : <Fragment />;
    }

    getForm(name: string): Form | undefined {
        return FormsManager.getForm(name) as any;
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
        const data = { ...Object.assign({}, this.props.data) };
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
    getErrors(): string[] {
        return Array.isArray(this.errors) ? this.errors : [];
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

    canRenderField(options: IFormProps & { field: IField; fieldName: string; isUpdate: boolean; }): boolean {
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
    prepareField(options: IFormProps & { field: IField; fieldName: string; isUpdate: boolean; }): IField | null {
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
                this.isDataEditing({ ...this.props, ...Object.assign({}, options) });
        }
        return new Promise<any>((resolve, reject) => {
            const callback = this.props?.onSubmit;
            try {
                resolve(callback ? callback(options) : options);
            } catch (err) {
                Notify.error(err as INotifyMessage);
                reject(err);
            }
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
    static Loading: FC<IFormProps> = (props) => {
        return (
            <View
                testID={`${props?.testID || ""}-form-loading-container`}
                style={styles.loadingContainer}
            >
                <ActivityIndicator size={"large"} />
            </View>
        );
    }

    static Fields: FC<IFormProps & IFormContext> = (props) => {
        const theme = useTheme();
        const { fields, data, name: formName, testID: cTestID, form, windowWidth, isLoading, isSubmitting } = props;
        const testID = defaultStr(cTestID, "resk-form");
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
                    testID: `${testID}-field-${name}`,
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
                const drawerWidth = drawer?.isProvider() && drawer?.getDrawerWidth() || undefined;
                fieldProps.windowWidth = fieldProps.windowWidth || windowWidth || typeof drawerWidth === "number" && drawerWidth || undefined
                const Component = Field.getRegisteredComponent(type as IFieldType) || Field.getRegisteredComponent("text") || Field as any;
                content.push(<Component {...fieldProps} isFormLoading={isLoading} isFormSubmitting={isSubmitting} key={name} />);
            }
            return content;
        }, [theme, formName, props.isUpdate, data, fields, isLoading, isSubmitting]) as ReactNode[];
    }
    /**
     * A provider class for managing dialog interactions with forms. This class extends a base provider
     * and provides static methods to open and close form dialogs. It integrates with the `DialogControlled`
     * component and dynamically renders a `Form` component within the dialog.
     *
     * @template IFormDialogProps - The interface defining the properties for the form dialog.
     * @template DialogControlled - The base dialog component to be controlled by this provider.
     */
    static Dialog = FormDialogProvider;

    /**
     * A specialized provider class for managing the lifecycle of a form drawer component.
     * This class extends a generic provider and integrates with a `Drawer` component to
     * handle opening and closing of a form drawer with specific properties and behaviors.
     *
     * @template IFormDrawerProps - The interface defining the properties for the form drawer.
     * @template Drawer - The drawer component to be used as the base for this provider.
     */
    static Drawer = FormDrawerProvider;

    render() {
        const props = this.props;
        const { formFields, tabs, children: cChildren, header } = this.state;
        const {
            data,
            responsive,
            style,
            tabsProps: tProps,
            mainTabItemProps,
            sessionName,
            withScrollView,
            scrollViewProps,
            ...viewProps
        } = this.props;
        const testID = viewProps.testID || "resk-form";;
        const isSubmitting = this.isSubmitting() || props?.isSubmitting;
        const tabsProps = Object.assign({}, tProps);
        const { items: tabItems, mobile } = tabs;
        const submitStyle = isSubmitting ? [isSubmitting ? styles.submitting : undefined] : [];
        const disabledStyle = isSubmitting ? Theme.styles.disabled : undefined;
        const formContainerStyle = [styles.formContainer, ...submitStyle, disabledStyle];
        const mainFormTabStyle: IViewStyle = [
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
        const Wrapper = withScrollView ? ScrollView : Fragment;
        const wrapperProps = withScrollView ? Object.assign({}, { testID: testID + "-scrollview" }, scrollViewProps) : {};
        return (
            <FormContext.Provider value={{ form: this }}>
                <Wrapper {...wrapperProps}>
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
                </Wrapper>
            </FormContext.Provider>
        );
    }
    static readonly Field = Field;
}











export interface IFormProps extends Omit<IHtmlDivProps, "children" | "ref"> {

    prepareField?: (options: {
        field: IField;
        isUpdate: boolean;
        fields: IFields;
        data: IFormData;
    }) => IField;
    data?: IFormData;

    perm?: IAuthPerm;

    beforeSubmit?: (options: IFormOnSubmitOptions) => any;

    onSubmit?: (options: IFormOnSubmitOptions) => any;

    name?: string;

    onValidate?: (options: IFormFieldValidatorOptions) => any;

    onNoValidate?: (options: IFormFieldValidatorOptions) => any;

    onValidateField?: (options: IFormFieldValidatorOptions) => any;


    onNoValidateField?: (options: IFormFieldValidatorOptions) => any;


    keyboardEvents?: IKeyboardEventHandlerKey[];

    onEnterKeyPress?: (options: IFormKeyboardEventHandlerOptions) => any;

    onKeyboardEvent?: (options: IFormKeyboardEventHandlerOptions) => any;

    fields?: IFields;


    isEditingData?: (options: {
        data: IFormData;
        primaryKeys: string[];
    }) => boolean;

    /**
     * Disable all fields in the form.
     * 
     * When this property is true, all fields in the form will be disabled.
     * 
     * @type ```typescript
     * @type {boolean}
     * 
     * @example
     * disabled: true, // All fields will be disabled
     */
    disabled?: boolean;

    /**
     * Make all fields in the form read-only.
     * 
     * When this property is true, all fields in the form will be read-only.
     * 
     * @type {boolean}
     * 
     * @example
     * readonly: true, // All fields will be read-only
     */
    readOnly?: boolean;

    /**
     * Specify if the data is currently being updated.
     * 
     * By default, this is overwritten with the return value of the `isDataEditing` function.
     * 
     * @type {boolean}
     * 
     * @example
     * isUpdate: true, // Indicates that the form is in update mode
     */
    isUpdate?: boolean;

    /**
     * Specify if the form items will be responsive.
     * 
     * When this property is true, the form will adjust its layout based on the screen size.
     * 
     * @type {boolean}
     * 
     * @example
     * responsive: true, // Form items will be responsive
     */
    responsive?: boolean;

    /**
     * Names of the fields that will be rendered by the form.
     * 
     * This property allows you to specify which fields should be rendered by default.
     * 
     * @type {string[]}
     * 
     * @example
     * renderableFieldsNames: ['username', 'email'], // Only these fields will be rendered
     */
    renderableFieldsNames?: string[];

    /**
     * Function to determine if a field should be rendered by the form.
     * 
     * This property returns a boolean indicating whether the field will be rendered.
     * 
     * @param options - Options related to rendering fields.
     * @returns {boolean} - Return true if the field should be rendered.
     * 
     * @example
     * canRenderField: (options) => {
     *     return options.isUpdate; // Render field only if in update mode
     * }
     */
    canRenderField?(
        options: IFormProps & {
            field: IField;
            fieldName: string;
            isUpdate: boolean;
        }
    ): boolean;

    /**
     * Indicates the loading state of the form.
     * 
     * This property can be used to show a loading indicator while the form is being processed.
     * 
     * @type {boolean}
     * 
     * @example
     * isLoading: true, // Form is currently loading
     */
    isLoading?: boolean;

    /**
     * Indicates if the form is currently being submitted.
     * 
     * This property can be used to show a loading indicator or disable the form during submission.
     * 
     * @type {boolean}
     * 
     * @example
     * isSubmitting: true, // Form is currently submitting
     */
    isSubmitting?: boolean;

    /**
     * React node that serves as the header for the form.
     * 
     * This property allows you to customize the header of the form.
     * 
     * @type {((options: IFormProps) => ReactElement) | ReactElement}
     * 
     * @example
     * header: <h1>User Form</h1>, // Custom header for the form
     */
    header?: ((options: IFormProps) => ReactElement) | ReactElement;

    /**
     * Element node that will be rendered as children of the form.
     * 
     * This property allows you to pass additional content to be rendered within the form.
     * 
     * @type {((options: IFormProps) => ReactElement) | ReactElement}
     * 
     * @example
     * children: <p>Please fill out the form below:</p>, // Additional content
     */
    children?: ((options: IFormProps) => ReactElement) | ReactElement;


    /**
     * Props representing the components to render for displaying tab content in the form.
     * 
     * This property allows you to define tab items for the form.
     * 
     * @type {IFormTabItemsProp}
     * 
     * @example
     * tabItems: [{ title: 'Tab 1', content: <Tab1Content /> }, { title: 'Tab 2', content: <Tab2Content /> }],
     */
    sessionName?: string;


    /**
     * Specifies whether error messages will be displayed by the form fields.
     * 
     * @type {boolean}
     * 
     * @example
     * displayErrors: true, // Error messages will be displayed
     */
    displayErrors?: boolean;

    /***
     * Specifies whether errors should be displayed when the form is submitting.
     * When form is submitting, the form check if it's valid, if not, it display the errors in the form 
     * if this property is set to true
     * @default false
     */
    displayErrorsWhenSubmitting?: boolean;

    /**
     * If true, the form will be wrapped in a ScrollView
     * Default is false
     */
    withScrollView?: boolean;

    scrollViewClassName?: IClassName;

    scrollViewContainerClassName?: IClassName;

    /***
     * If true, the form will be rendered as a table
     * Default is false
     */
    renderAsTable?: boolean;
};