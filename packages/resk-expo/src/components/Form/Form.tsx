import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import View, { IViewProps } from "@components/View";
import { defaultStr, IResourceActionName, IResourceName, isNonNullString, uniqid } from "@resk/core";
import { getTextContent, isValidElement, ObservableComponent } from "@utils";
import { FormsManager } from "./FormsManager";
import { IFormField, IForm, IFormFieldsProp, IFormProps, IFormState, IFormEvent, IFormPrepareRenderResult, IFormGetDataOptions, IFormData, IFormFields, IFormKeyboardEventHandlerOptions, IFormRenderTabProp, IFormCallbackOptions } from "./types";
import React, { ReactElement, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "@components/ActivityIndicator";


export class Form extends ObservableComponent<IFormProps, IFormState, IFormEvent> implements IForm {
    readonly defaultName: string = uniqid("form-name");
    readonly state = {} as IFormState;
    /***
     * la liste des instances de formFields associé au formulaire
     */
    private readonly fields: IFormFields = {};
    private errors: string[] = [];
    readonly primaryKeyFields = {};
    componentProps: IFormProps = {} as IFormProps;
    constructor(props: IFormProps) {
        super(props);
        this.init();
        Object.assign(this.state, this.prepareRender());
    }
    init() { }
    prepareRender(props?: IFormProps): IFormPrepareRenderResult {
        props = this.getComponentProps(props);
        return {
            formFields: null,
            tabs: { mobile: false, items: [] },
            children: this.renderChildren(props),
            header: this.renderHeader(props),
        };
    }
    renderHeader(options: IFormProps): ReactNode {
        const header = typeof options.header == "function" ? options.header(options) : options.header;
        if (header && this.isLoading(options)) return this.renderLoading(options);
        return isValidElement(header) ? header : null;
    }
    isLoading(options?: IFormProps): boolean {
        return !!options?.isLoading || !!this.componentProps?.isLoading;
    }
    renderChildren(options: IFormProps): ReactElement {
        const children =
            typeof options?.children == "function" ? options.children(options) : options?.children;
        if (children && this.isLoading(options)) return this.renderLoading(options);
        return isValidElement(children) ? (children as ReactElement) : <React.Fragment />;
    }
    getName(): string {
        return defaultStr(this.props.name, this.defaultName);
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
                fValue = field.isValid() ? field.getValidValue(data) : field.getInvalidValue(data);
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
    /***
     * retourne le type de rendu pour le composant Tab
     */
    getRenderTabType(options?: IFormProps): IFormRenderTabProp {
        return (
            options
                ? options.renderTabType
                : this.componentProps?.renderTabType
                    ? this.componentProps?.renderTabType
                    : "mobile"
        ) as IFormRenderTabProp;
    }

    static Loading: React.FC<IFormProps> = (props) => {
        return (
            <View
                testID={`${props?.testID || ""}_rn-form-loading-container`}
                style={styles.loadingContainer}
            >
                <ActivityIndicator size={"large"} />
            </View>
        );
    }
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
});