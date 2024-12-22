import { IField, IFieldMapKeys } from "@resk/core";
import { IStyle } from "@src/types";
import { ReactNode } from "react";

export type IFormFieldsProp = Record<string, IFieldProps<any>>;


export interface IFormState {
    /*** renseigne sur l'état d'envoie (fonction submit) du formulaire */
    isSubmitting: boolean;

    formFields: ReactNode;
}


export type IFieldProps<T extends IFieldMapKeys = "text"> IField<T> & {
    getValidValue?: (options: { value: any; context: Field; data: IFormData }) => any;
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
    validationRules?: IValidationRules;

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
    onValidate?: (options: IFieldValidateOptions) => any;

    /***
     * la fonction appelée en cas de non validation du champ
     */
    onNoValidate?: (options: IFieldValidateOptions) => any;

    /**
     * les props à passer au composant KeyBoardEventHandler
     * Il s'agit des props qui wrappent le composant Field
     */
    keyboardEventHandlerProps?: IKeyboardEventHandlerProps;

    /**le nom du formulaire auquel ser reporte le champ field */
    formName?: string;

    onChange?: (options: IFieldValidateOptions) => any;

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
        options: IFieldProps<T> & {
            width: string | number; //la largeur occupée par le champ en cas de responsive design
        }
    ) => ReactNode;

    ref?: any;

    onMount?: (context: Field<T>) => any;

    onUnmount?: (context: Field<T>) => any;

    /*** spécifie si le champ de type email doit être validé par le formulaire */
    validateEmail?: boolean;
}


export type IFieldState<T extends IFieldMapKeys = "text"> = IField<T> & {
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