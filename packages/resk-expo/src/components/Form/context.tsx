import { createContext, useContext } from "react";
import { IFormContext } from "./types";

/**
 * Creates a context for managing form-related data and state within a React application.
 * The `FormContext` allows components to access and share form-related information
 * without having to pass props down through every level of the component tree.
 *
 * @constant FormContext
 * @type {React.Context<IFormContext>}
 * 
 * @remarks
 * This context is particularly useful in applications with complex forms where multiple
 * components need to access the same form data or methods. By using `FormContext`, 
 * developers can ensure that all components have access to the latest form state and 
 * can respond to changes accordingly.
 * 
 * @example
 * // Example of using FormContext in a component
 * const MyFormComponent = () => {
 *     const formContext = useContext(FormContext);
 *     return (
 *         <div>
 *             <h1>{formContext.form?.getName()}</h1>
 *             {}
 *         </div>
 *     );
 * };
 */
export const FormContext = createContext<IFormContext>({} as IFormContext);

/**
 * A custom hook that provides access to the `FormContext`.
 * This hook simplifies the process of consuming the context in functional components.
 *
 * @returns {IFormContext} - The current value of the `FormContext`.
 * 
 * @example
 * // Example of using the useForm hook in a component
 * const MyFieldComponent = () => {
 *     const formContext = useForm();
 *     return (
 *         <div>
 *             <label>{formContext.field?.getLabel()}</label>
 *             <input type="text" />
 *         </div>
 *     );
 * };
 */
export const useForm = () => useContext(FormContext);