import "@resk/core";
import { IButtonProps } from "@components/Button/types";
import { IKeyboardEventHandlerEvent } from "@components/KeyboardEventHandler/types";
import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import { IFields } from "@resk/core/resources";
import { ReactNode } from "react";


export interface IFormFields extends IFields { }


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
    validate: string;
    noValidate: string;
    validationStatusChanged: string;
}

export type IFormEvent = keyof IFormEventMap;

export type IFormManagerEvent = `${IFormEvent}Form` | `${IFormEvent}Action` | `${IFormEvent}Field` | "formValidationStatusChanged";


/**
 * Interface representing the options available when submitting a form.
 * 
 * This interface extends the IFormContext and includes additional properties
 * that provide context about the form submission, such as the form data
 * being submitted and whether the submission is for an update or a new entry.
 * 
 * @interface IFormOnSubmitOptions
 * 
 * @example
 * const submitOptions: IFormOnSubmitOptions = {
 *     data: {
 *         name: 'John Doe',
 *         email: 'john.doe@example.com',
 *     },
 *     isUpdate: false,
 *     // Additional properties from IFormContext can be included here
 * };
 * 
 * // Function to handle form submission
 * function handleSubmit(options: IFormOnSubmitOptions) {
 *     if (options.isUpdate) {
 *         console.log('Updating user data:', options.data);
 *     } else {
 *         console.log('Creating new user with data:', options.data);
 *     }
 * }
 * @see {@link IFormContext} for additional properties available in the context.
 */
export interface IFormOnSubmitOptions extends IFormContext {
    /**
     * The data being submitted through the form.
     * 
     * This property contains the structured data that the user has filled out
     * in the form. It is essential for processing the submission, whether it
     * is for creating a new entry or updating an existing one.
     * 
     * @type {IFormData}
     * 
     * @example
     * const formData: IFormData = {
     *     name: 'Jane Doe',
     *     email: 'jane.doe@example.com',
     * };
     * 
     * const options: IFormOnSubmitOptions = {
     *     data: formData,
     *     isUpdate: true,
     *     // Other context properties
     * };
     */
    data: IFormData;

    /**
     * Indicates whether the form submission is for an update.
     * 
     * This boolean flag helps determine the context of the submission.
     * If true, the submission is intended to update an existing record;
     * if false, it is for creating a new record.
     * 
     * @type {boolean}
     * 
     * @example
     * const options: IFormOnSubmitOptions = {
     *     data: {
     *         name: 'Alice Smith',
     *         email: 'alice.smith@example.com',
     *     },
     *     isUpdate: false,
     * };
     * 
     * // Check if the submission is an update
     * if (options.isUpdate) {
     *     console.log('Updating existing record.');
     * } else {
     *     console.log('Creating a new record.');
     * }
     */
    isUpdate: boolean;
};


/**
 * Interface representing the options available for form callbacks.
 * 
 * This interface extends both `IFormProps` and `IFormContext`, combining properties
 * that define the form's configuration and its current context. It is designed
 * to provide a comprehensive set of options for handling form-related callbacks,
 * such as submission, validation, and reset actions.
 * 
 * @interface IFormCallbackOptions
 * 
 * @example
 * const callbackOptions: IFormCallbackOptions = {
 *     // Properties from IFormProps
 *     onSubmit: (data) => {
 *         console.log('Form submitted with data:', data);
 *     },
 *     onReset: () => {
 *         console.log('Form has been reset.');
 *     },
 *     // Properties from IFormContext
 *     currentField: 'username',
 *     isValid: true,
 * };
 * 
 * // Function to handle form submission
 * function handleFormSubmission(options: IFormCallbackOptions) {
 *     if (options.isValid) {
 *         options.onSubmit({ username: 'user123' });
 *     } else {
 *         console.log('Form is not valid.');
 *     }
 * }
 */
export interface IFormCallbackOptions extends IFormProps, IFormContext { }

/**
 * Interface representing the options available for retrieving form data.
 * 
 * This interface provides configuration options for the `getData` function,
 * which is responsible for returning the current state of the form data.
 * The behavior of the data retrieval can be controlled using the `handleChange`
 * property, allowing for flexibility in how data is accessed.
 * 
 * @interface IFormGetDataOptions
 * 
 * @example
 * const getDataOptions: IFormGetDataOptions = {
 *     handleChange: true,
 * };
 * 
 * // Function to retrieve form data based on options
 * function retrieveFormData(options: IFormGetDataOptions) {
 *     if (options.handleChange) {
 *         // Logic to get both initial and current field data
 *         console.log('Retrieving all form data, including changes.');
 *     } else {
 *         // Logic to get only the initial data
 *         console.log('Retrieving only initial form data.');
 *     }
 * }
 * @remarks
*  When `handleChange` is set to false, the `getData` function will return
*  only the initial data, i.e., the data passed as a parameter to the
*  `Form` component by its parent.
* 
*  If `handleChange` is not set to false, in addition to the initial data
*  provided by the parent of the `Form` component, the data from the
*  various fields will also be retrieved.
 */
export interface IFormGetDataOptions {
    /**
     * When `handleChange` is set to false, the `getData` function will return
     * only the initial data, i.e., the data passed as a parameter to the
     * `Form` component by its parent.
     * 
     * If `handleChange` is not set to false, in addition to the initial data
     * provided by the parent of the `Form` component, the data from the
     * various fields will also be retrieved.
     * 
     * @type {boolean}
     * 
     * @default true
     * 
     * @example
     * const options: IFormGetDataOptions = {
     *     handleChange: false, // Only retrieve initial data
     * };
     * 
     * // Example usage in a function
     * const data = getData(options);
     * console.log(data); // Outputs only the initial data
     */
    handleChange?: boolean;
};




/**
 * Represents a protected resource that can be associated with a button in the user interface.
 * The `IFormAction` interface extends the `IButtonProps` interface, allowing for the definition
 * of actions that can be performed within a form context.
 * 
 * @interface IFormAction
 * @extends IButtonProps<IFormContext>
 * 
 * @remarks
 * This interface is particularly useful in applications where user roles and permissions dictate
 * the visibility of UI elements. By extending `IButtonProps`, it inherits properties related to
 * button behavior and appearance, while also providing access to the form context.
 * 
 * @example
 * // Example of using IFormAction to define a submit action for a form
 * const submitAction: IFormAction = {
 *     label: "Submit",
 *     onClick: (context) => {
 *         const { form } = context;
 *         if (form) {
 *             form.submit(); // Calls the submit method on the form instance
 *         }
 *     },
 *     disabled: false,
 *     tooltip: "Submit the form",
 * };
 */
export interface IFormAction extends IButtonProps<IFormContext> { }

