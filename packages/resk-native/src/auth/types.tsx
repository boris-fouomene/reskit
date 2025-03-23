import { IAuthUser } from "@resk/core/auth";

/**
 * Represents the authentication context in the application.
 * 
 * This type defines the structure of the authentication context, which includes
 * information about the currently authenticated user and the login component.
 * 
 * @type {IAuthContext}
 * 
 * @property {IAuthUser  | null} [user] - The currently authenticated user. 
 * If no user is authenticated, this property will be `null`.
 * 
 * @property {IReactComponent} [Login] - An optional React component that 
 * represents the login interface. This component can be rendered to allow 
 * users to log in to the application.
 * 
 * @example
 * // Example of using IAuthContext
 * const authContext: IAuthContext = {
 *     user: { id: '123', username: 'JohnDoe' }
 * };
 */
export interface IAuthContext {
    user?: IAuthUser | null;
}

/**
 * Props for the authentication provider component.
 * 
 * This type extends the IAuthContext to include children components that 
 * will be rendered within the authentication provider. It allows for 
 * passing down authentication-related data and functionality to child 
 * components in the React component tree.
 * 
 * @type {IAuthProviderProps}
 * @extends {IAuthContext}
 * 
 * @property {IAuthUser  | null} [user] - The currently authenticated user, 
 * inherited from IAuthContext. This property will be `null` if no user is 
 * authenticated.
 * 
 * @property {IReactComponent} [Login] - An optional React component for 
 * logging in, inherited from IAuthContext.
 * 
 * @property {React.ReactNode} children - The child components that will be 
 * rendered within the authentication provider. This allows for flexible 
 * composition of components that require authentication context.
 * 
 * @example
 * // Example of using IAuthProviderProps in a provider component
 * const AuthProvider: React.FC<IAuthProviderProps> = ({ user, Login, children }) => {
 *     return (
 *         <AuthContext.Provider value={{ user, Login }}>
 *             {children}
 *         </AuthContext.Provider>
 *     );
 * };
 * @see {@link IAuthContext} for the structure of the authentication context.
 */
export interface IAuthProviderProps extends IAuthContext {
    children: React.ReactNode;
}