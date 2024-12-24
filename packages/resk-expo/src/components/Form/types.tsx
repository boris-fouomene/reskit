import { IButtonProps } from "@components/Button";
import { IKeyboardEventHandlerEvent, IKeyboardEventHandlerProps } from "@components/KeyboardEventHandler";
import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import { ITabItemProps, ITabProps } from "@components/Tab";
import { IViewProps } from "@components/View";
import { IAuthPerm, IDict, IField, IFieldMapKeys, IObservable, IResourceName, IValidatorRule, IValidatorRuleOptions } from "@resk/core";
import { IOnChangeOptions, IStyle } from "@src/types";
import { ObservableComponent } from "@utils/index";
import { ReactElement, ReactNode } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

export type IFormFieldsProp = Record<string, IFormFieldProps<any>>;

export type IFormFields = Record<string, IFormField>;

export interface IFormEventMap {
    mount: string;
    unmount: string;
    submit: string;
    beforeSubmit: string;
    afterSubmit: string;
    onValidate: string;
    onNoValidate: string;
    beforeValidate: string;
    afterValidate: string;
}

export type IFormEvent = keyof IFormEventMap;

export type IFormManagerEvent = `${IFormEvent}Form` | `${IFormEvent}Action` | `${IFormEvent}Field`;


export interface IFormPrepareRenderResult {
    formFields: ReactNode;
    tabs: { mobile: boolean; items: ReactNode[] };
    children: ReactNode;
    header: ReactNode;
};

export interface IForm extends ObservableComponent<IFormProps, IFormState, IFormEvent> {
    //fields: IFormFields;
    defaultName: string;
    readonly state: IFormState;
    componentProps: IFormProps;
    //errors: string[];
    primaryKeyFields: IFormFieldsProp;
    init(): void;
    getName(): string;
    isDocEditing(props?: IFormProps): boolean;
    getData(options?: IFormGetDataOptions): IFormData;
    getField(fieldName: string): IFormField | null;
    getFields(): IFormFields;
    isValid(): boolean;
    getErrors(): string[];
    renderLoading(options?: IFormProps): ReactNode;
    mountField(field: IFormField): void;
    unmountField(field: IFormField): void;
    isResource(): boolean;
    getResourceName(): IResourceName | undefined;
    getRenderTabType(options?: IFormProps): IFormRenderTabProp;
    isLoading(options?: IFormProps): boolean;
    renderChildren(options?: IFormProps): ReactNode;
    renderHeader(options?: IFormProps): ReactNode;
    prepareRender(props?: IFormProps): IFormPrepareRenderResult;
};
export interface IFormField extends ObservableComponent<IFormFieldProps, IFormFieldState, IFormEvent> {
    getName(): string;
    getValidValue(data: IFormData): any;
    getInvalidValue(data: IFormData): any;
    isValid(): boolean;
    getLabel(): string;
    getErrorText(): string;
}


export interface IFormOnSubmitOptions {
    data: IFormData;
    context: IForm;
    isUpdate: boolean;
};

export type IFormFieldValidatorOptions = IValidatorRuleOptions & {
    /**** la valeur précédemment affectée au champ */
    prevValue?: any;
    /**** le contexte lié à la form field */
    context: IFormField;

    /**le message d'erreur en cas d'erreur de validation */
    message?: string;
};

export interface IFormCallbackOptions extends IFormProps, IFormContext {

}

export interface IFormGetDataOptions {
    /**
     * lorsque handleChanges  est à false, alors la fonction getData retournera uniquement les données initialises, ie celles passées en paramètre au composant FormBase par son parent.
     * Si handleChanges n'est pas à false, alors en plus des données initialises passées par le parent du composant FormBase, les données des différents champs seront récupérées
     */
    handleChange?: boolean;
};

export type IFormProps = IViewProps & {

    data?: IFormData;

    perm?: IAuthPerm;
    /**
     * la fonction appelée immédiatement avant l'envoie des données du formulaire. cette fonction peut retourner une promesse ou générer une exception pour interdire l'envoie du formulaire
     * la function onSubmit est appelée si la promesse est résolue.
     * Il est important et très recommandé de faire muter les données dans la prop beforeSubmit, plutôt que la prop onSubmit.
     * @param options
     * @returns {boolean | string | Promise}
     */
    beforeSubmit?: (options: IFormOnSubmitOptions) => any;
    /**** cette fonction est appelée lorsque l'envoie des données du formulaire est déclenchée.
     *  \n- Le processu d'envoie des données du formulaire est le suivant :
     *  -1. la fonction beforeSubmit est appelée si la promesse lié à cette fonction est résolue, alors,\n
     *  -2. Le status de la form est mis à jour à l'état isSubmitting, et la fonction onSubmit est appelée.
     *  -3. En cas d'échec ou de succès de la fonction onSubmit, le status isSubmitting de la form est réinitialisé à false
     *  Cette fonction peut être appeler à partir du composant Field, lorsque le formulaire est valide et que le bouton Entrée à été cliqué
     *  ou si l'on clique sur une action du formulaire, (bouton ou item de menu ayant la props formName égale au nom du formulaire)
     *  onSubmit ({data,context,field})
     *  la fonction peut retourner une promesse ou générer une exception afin d'interdire l'envoie des données
     *  la props field : représente le champ qui est à l'origine de l'envoie du formulaire
     */
    onSubmit?: (options: IFormOnSubmitOptions) => any;

    /**
     * le nom de la form
     */
    name?: string;
    /**
     * méthode de rappel appelée lorsque tous les champs de la form sont valides
     */
    onValidate?: (options: IFormFieldValidatorOptions) => any;

    /*** Cette fonction est appelée lorsque au moins un champ de la form n'est pas valide :
     * elle prend en paramètre :
     *      -name : le nom du champ,
     *      -value : la valeur qui n'a pas été validée pour le champ,
     *      -msg : Le message d'erreur correspondant
     *      -validRule : La règle de validation,
     *      -validParams : Les paramètres de validation,
     *      -event : L'évènement utilisée qui a déclanché la validation du formulaire
     */
    onNoValidate?: (options: IFormFieldValidatorOptions) => any;
    /***
     * méthode de rappel appélée lorsqu'un champ de la form est valide
     */
    onValidateField?: (options: IFormFieldValidatorOptions) => any;
    /***
     * méthode appélée lorsqu'un champ de la form n'est pas valide
     */
    onNoValidateField?: (options: IFormFieldValidatorOptions) => any;

    /*** objet de la forme : 
   *  {

   *      eventName : handler 
          avec eventName   le nom de l'évènement et hanbler la fonction de rappel à appeler
   *  }
   */
    keyboardEvents?: IKeyboardEventHandlerKey[];
    /***
     * Lorsque l'utilisateur clique sur la touche Enter du clavier
     * Si cette fonction retourne false alors la fonction submit de IForm ne sera pas appelée ou encore la props onSubmit de form ne sera pas appelée si elle est définie
     * @return {boolean|any} si false, alors la fonction submit de form ne sera pas appelée
     */
    onEnterKeyPress?: (options: IFormKeyboardEventHandlerOptions) => any;
    /***
     * lorsqu'un évènement de clavier est écouté sur l'un des champs du formulaire
     */
    onKeyboardEvent?: (options: IFormKeyboardEventHandlerOptions) => any;

    fields?: IFormFieldsProp;

    /***
     * cette props prend en paramèter l'objet data et détermine s'il s'agit d'une modification de la donnée en cours où non
     */
    isDocEditing?: (options: IFormCallbackOptions) => boolean;

    /*** permet de désactiver tous les champs du form. lorsque ce champ est true alors tous les champs du form sont disabled */
    disabled?: boolean;

    /*** permet de rendre readOnly tous les champs du form. lorsque ce champ est true alors tous les champs du form sont readOnly*/
    readonly?: boolean;

    /** permet de spécifier si les données sont en cours de modification
     * par défaut, elle est overwrite avec le retour de la fonction isDocEditing
     */
    isUpdate?: boolean;

    /*** spécifie si les items du formulaire seront responsive */
    responsive?: boolean;

    /***
     * les noms des champs qui seront rendu par le formulaire, au cas où l'on souhaite par défaut ne render que certains champ
     * alors il faudra spécifier le nom des dits champs dans cette prop\n
     * il s'agira la de spécifier la liste des nom des champs qui seront rendu par le formulaire
     */
    renderableFieldsNames?: string[];

    /***
     * Cette prop permet de retourner un booléan, spécifiant si le champ sera oui ou non rendu par le formulaire
     */
    canRenderField?(
        options: IFormProps & {
            field: IFormFieldProps;
            fieldName: string;
            isUpdate: boolean;
        }
    ): boolean;

    /**
     * permet de renseigner sur le comportement en cours de chargement du form
     */
    isLoading?: boolean;

    /***
     * si le formulaire est en cours d'envoie
     */
    isSubmitting?: boolean;

    /***
     * le noeud react qui fera office de header pour le formulare
     */
    header?: ((options: IFormProps) => ReactElement) | ReactElement;

    /*** l'élement node qui sera rendu en children ou enfant du formulaire */
    children?: ((options: IFormProps) => ReactElement) | ReactElement;

    /***
     * les props représentant le coposants à render pour afficher le contenu en Tab du formulaire
     */
    tabItems?: IFormTabItemsProp;

    /*** le nom de la session, pour la persistance des données */
    sessionName?: string;

    /***
     * les props à passer au composant Tab, lorsque les tabItems sont passés comme paramètre au form
     */
    tabsProps?: ITabProps;

    /***
     * la taille de la fenêtre window, pour éviter que les champs soient responsives dans les petis écrans ou les boîtes de dialogues
     */
    windowWidth?: number;

    /***
     * les props à passer au TabItem main, lorsque la prop renderTabType est à mobile, où encore lorsque les tabItems seront rendu en environnement mobile
     */
    mainTabItemProps?: ITabItemProps;

    /***
     * spécifie si les messages d'erreur seronts affichés par les champs du formulaire ou pas
     */
    displayErrors?: boolean;

    renderTabType?: IFormRenderTabProp;

    /***
     * le contexte du formulaire
     */
    context?: IForm;
};

/***
 * le type de rendu des tabItems liés au formulaire
 * en mobile, le tabItems liés au composant Form seront rendu dans une page de plusieurs Tab
 * en desktop, Le form principal sera rendu dans le header et en decous du form principal sera rendu les tabItems
 * en auto, le type de rendu est calculé automatiquement en fonction de la taille de l'écran
 */
export type IFormRenderTabProp = "mobile" | "desktop" | "auto";

/***
 * le type de propriété des items du tab
 */
export type IFormTabItemsProp = IFormTabItemProp[] | null | undefined | ((options: IFormProps) => IFormTabItemProp[]);

export type IFormTabItemProp = undefined | null | Omit<ITabItemProps, "children"> & { children: ((options: IFormProps) => ReactNode) | ReactNode; }

export interface IFormState {
    /*** renseigne sur l'état d'envoie (fonction submit) du formulaire */
    isSubmitting: boolean;

    formFields: ReactNode;
}

export interface IFormContext {
    form: IForm;
}



export type IFormData = IDict;


export type IFormFieldOnChangeOptions<onChangeEventType = NativeSyntheticEvent<TextInputChangeEventData> | null, ValueType = any> = IOnChangeOptions<onChangeEventType, ValueType> & {
    context: IFormField;
};

export type IFormFieldProps<T extends IFieldMapKeys = "text", onChangeEventType = NativeSyntheticEvent<TextInputChangeEventData> | null, ValueType = any> = IField<T> & {
    getValidValue?: (options: { value: any; context: IFormField; data: IFormData }) => any;
    /**
     * s'il s'agit d'un composant de type Filter
     */
    isFilter?: boolean;

    /***
     * spécifie si le champ sera validé au montage du composant
     */
    validateOnMount?: boolean;

    /***
     * spécifie si le champ sera validé lorsque celui-ci perdra le focus
     */
    validateOnBlur?: boolean;

    /***
     * les règles de validation à passer au composant
     */
    validationRules?: IValidatorRule[];

    /***
     * les données de la form à laquelle le champ est rattaché
     */
    data?: IFormData;

    /***
     * spécifie si le rendu du field sera responsive, ie sur plusieurs lignes
     */
    responsive?: boolean;

    /***
     * la fonction appelée en cas de validation du champ
     * Elle peut retourner une promesse qui lorsqu'elle sera résolue alors le champ également le sera
     * Si cette fonction retourne une chaine de caractère, alors cette chaine est considérée comme une erreur
     * Si elle retourne false, alors le champ n'est pas validée
     */
    onValidate?: (options: IFormFieldOnChangeOptions<onChangeEventType, ValueType>) => any;

    /***
     * la fonction appelée en cas de non validation du champ
     */
    onNoValidate?: (options: IFormFieldOnChangeOptions<onChangeEventType, ValueType>) => any;

    /**
     * les props à passer au composant KeyBoardEventHandler
     * Il s'agit des props qui wrappent le composant Field
     */
    keyboardEventHandlerProps?: IKeyboardEventHandlerProps;

    /**le nom du formulaire auquel ser reporte le champ field */
    formName?: string;

    onChange?: (options: IFormFieldOnChangeOptions<onChangeEventType, ValueType>) => any;

    /**le message d'erreur lié au champ field */
    errorText?: string;

    /**
     * si le composant contient une erreur
     */
    error?: boolean;

    /***
     * spécifie si le champ est en cours de loading ou pas
     */
    isLoading?: boolean;

    /***
     * permet de spécifier si tou le formulaire est en mode loading ou pas, ie les données sont en train d'être fetchées pour par la suite êtres envoyées au formulaire
     */
    isFormLoading?: boolean;

    /***
     * renseigne sur l'état d'envoie en cours du formulaire
     */
    isFormSubmitting?: boolean;
    /***
     * la fonction permettant de render l'élément loading lorsque le champ est en train d'être loading
     */
    renderLoading?: (
        options: IFormFieldProps<T> & {
            width: string | number; //la largeur occupée par le champ en cas de responsive design
        }
    ) => ReactNode;

    ref?: any;

    onMount?: (context: IFormField) => any;

    onUnmount?: (context: IFormField) => any;

    /*** spécifie si le champ de type email doit être validé par le formulaire */
    validateEmail?: boolean;
}

export interface IFormKeyboardEventHandlerOptions extends IFormContext {
    /*** la touche de clavier qui a été appuyée */
    key: IKeyboardEventHandlerKey;
    /*** l'évènement généré lors de l'appui du clavier */
    event: IKeyboardEventHandlerEvent;

    /***
     * les données du formulaire
     */
    formData?: IFormData;
};

export type IFormFieldState<T extends IFieldMapKeys = "text"> = IField<T> & {
    error: boolean;
    /*** si le champ est en cours d'édition */
    isFieldEditable: boolean;
    /*** si le champ est inactif, ou désactivé */
    isFieldDisabled: boolean;
    validatedValue?: any; //la valeur en cours de validation
    hasHandledValidation?: boolean; //si la validation a déjé été opérée au travers du champ
    value: any; //la valeur du form field
    prevValue?: any; //la valeur précédemment affectée au champ
    errorText: string; //le message d'erreur

    /*** si le formulaire a déjé essayé d'être soumis */
    formTriedTobeSubmitted?: boolean;

    /**
     * les styles au props wrapper
     */
    wrapperStyle: IStyle;
}

export type IFormAction = IButtonProps<IFormContext>;