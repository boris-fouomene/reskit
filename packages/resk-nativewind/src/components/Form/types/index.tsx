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
 * Represents the rendering options for a form based on the device type.
 * The `IFormRenderTabProp` type is a union of string literals that specify
 * how the form should be rendered depending on the device context.
 * 
 * @type IFormRenderTabProp
 * 
 * @remarks
 * This type is useful for defining responsive behavior in forms, allowing developers
 * to specify whether the form should render specifically for mobile devices, desktop
 * devices, or automatically adjust based on the available space.
 * 
 * - `"mobile"`: Indicates that the form should be rendered in a mobile-friendly layout.
 * - `"desktop"`: Indicates that the form should be rendered in a desktop-friendly layout.
 * - `"auto"`: Indicates that the form should automatically determine the best layout
 *   based on the current device or viewport size.
 * 
 * @example
 * // Example of using IFormRenderTabProp in a form component
 * const renderForm = (renderTab: IFormRenderTabProp) => {
 *     switch (renderTab) {
 *         case "mobile":
 *             return <MobileForm />;
 *         case "desktop":
 *             return <DesktopForm />;
 *         case "auto":
 *             return <ResponsiveForm />;
 *         default:
 *             return null;
 *     }
 * };
 */
export type IFormRenderTabProp = "mobile" | "desktop" | "auto";

/**
 * Represents the items for tabs in a form.
 * The `IFormTabItemsProp` type can be an array of `IFormTabItemProp`, null, undefined,
 * or a function that returns an array of `IFormTabItemProp` based on the provided options.
 * 
 * @type IFormTabItemsProp
 * 
 * @remarks
 * This type is useful for defining the structure of tab items in a form, allowing for
 * flexibility in how tab items are provided. It can be used to statically define tab items
 * as an array, or dynamically generate them based on the form properties through a function.
 * 
 * - `IFormTabItemProp[]`: An array of tab item properties, where each item defines a tab.
 * - `null`: Indicates that there are no tab items.
 * - `undefined`: Indicates that the tab items are not defined.
 * - `((options: IFormProps) => IFormTabItemProp[])`: A function that takes form properties as an argument
 *   and returns an array of tab item properties, allowing for dynamic generation of tab items based on
 *   the current form state or configuration.
 * 
 * @example
 * // Example of using IFormTabItemsProp in a form component
 * const tabItems: IFormTabItemsProp = [
 *     { label: "Tab 1", content: <Tab1Content /> },
 *     { label: "Tab 2", content: <Tab2Content /> },
 * ];
 * 
 * const dynamicTabItems: IFormTabItemsProp = (options: IFormProps) => {
 *     return options.isAdvanced ? [{ label: "Advanced", content: <AdvancedTabContent /> }] : [];
 * };
 */
export type IFormTabItemsProp = IFormTabItemProp[] | null | undefined | ((options: IFormProps) => IFormTabItemProp[]);

/**
 * Represents a single tab item in a form.
 * The `IFormTabItemProp` type can be undefined, null, or an object that extends
 * the properties of `ITabItemProps`, with the exception of the `children` property.
 * The `children` property can either be a ReactNode or a function that returns a ReactNode
 * based on the provided form properties.
 * 
 * @type IFormTabItemProp
 * 
 * @remarks
 * This type is useful for defining the structure of individual tab items within a form,
 * allowing for both static and dynamic content rendering. The `children` property can be
 * a function that takes form properties as an argument, enabling the tab content to be
 * generated based on the current state or configuration of the form.
 * 
 * - `undefined`: Indicates that the tab item is not defined.
 * - `null`: Indicates that there is no tab item.
 * - `Omit<ITabItemProps, "children">`: An object that includes all properties of `ITabItemProps`
 *   except for `children`.
 * - `{ children: ((options: IFormProps) => ReactNode) | ReactNode; }`: The `children` property,
 *   which can be either a function that returns a ReactNode or a static ReactNode.
 * 
 * @example
 * // Example of using IFormTabItemProp in a form component
 * const tabItem: IFormTabItemProp = {
 *     label: "Tab 1",
 *     children: (options: IFormProps) => {
 *         return <div>{options.someProperty}</div>; // Dynamic content based on form props
 *     },
 * };
 * 
 * const staticTabItem: IFormTabItemProp = {
 *     label: "Tab 2",
 *     children: <div>This is static content for Tab 2.</div>, // Static content
 * };
 */
export type IFormTabItemProp = undefined | null | Omit<ITabItemProps, "children"> & { children: ((options: IFormProps) => ReactNode) | ReactNode; }


/**
 * Represents the context for a form component.
 * The `IFormContext` interface defines the structure of the context object
 * that provides access to the form instance and its associated properties.
 * 
 * @interface IFormContext
 * 
 * @property {IForm | null} form - The form instance associated with the context.
 * If the form is not available, this property will be null.
 * 
 * @remarks
 * This interface is useful for providing a consistent way to access the form
 * instance within components that are part of the form's context. It allows
 * for easy interaction with the form's methods and properties, enabling
 * components to respond to form state changes and events.
 * 
 * @example
 * // Example of using IFormContext in a component
 * const MyComponent: React.FC = () => {
 *     const { form } = useContext(FormContext) as IFormContext;
 *     
 *     const handleSubmit = () => {
 *         if (form) {
 *             form.submit(); // Calls the submit method on the form instance
 *         }
 *     };
 *     
 *     return (
 *         <div>
 *             <button onClick={handleSubmit}>Submit</button>
 *         </div>
 *     );
 * };
 */
export interface IFormContext {
    form: IForm | null;
}


/**
 * Represents the data structure for a form.
 * The `IFormData` type is defined as a dictionary type, allowing for flexible
 * key-value pairs to represent the data associated with a form.
 * 
 * @type IFormData
 * 
 * @remarks
 * This type is useful for managing the state of form data, enabling easy access
 * and manipulation of the values entered by users. It can accommodate various
 * data types and structures, making it versatile for different form implementations.
 * 
 * The `IFormData` type is essentially an alias for `IDict`, which is a generic
 * dictionary type that can hold any key-value pairs.
 * 
 * @example
 * // Example of using IFormData to represent form data
 * const formData: IFormData = {
 *     username: "john_doe",
 *     email: "john@example.com",
 *     age: 30,
 *     isActive: true,
 * };
 * 
 * // Accessing form data
 * console.log(formData.username); // Outputs: "john_doe"
 * console.log(formData.email);    // Outputs: "john@example.com"
 */
export interface IFormData extends IDict {

}



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

