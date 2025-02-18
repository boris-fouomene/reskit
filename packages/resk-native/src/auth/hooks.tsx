import { createContext, useContext, useEffect, useState, ReactNode, isValidElement } from "react";
import { IAuthContext, IAuthProviderProps } from "./types";
import { Auth, isObj } from "@resk/core";
import { IWithHOCOptions } from "@hooks/withHOC";
import View from "@components/View";
import Label from "@components/Label";
import Theme, { useTheme } from "@theme/index";
import { StyleSheet } from "react-native";
import { Portal } from "@components/Portal";

// Create an authentication context with a default value of null.
const AuthContext = createContext<IAuthContext | null>(null);

/**
 * Custom hook to access the authentication context.
 * 
 * This hook retrieves the current authentication context from the AuthContext.
 * If the context is not available, it defaults to an object with the user set to null.
 * It also ensures that the user is updated with the signed-in user from the Auth module.
 * 
 * @returns {IAuthContext} The current authentication context, including the user and login component.
 * 
 * @example
 * const { user, Login } = useAuth();
 * if (user) {
 *     console.log(`Welcome back, ${user.username}!`);
 * } else {
 *     return <Login />;
 * }
 */
export const useAuth = () => {
  const context = useContext(AuthContext) || { user: null };
  context.user = isObj(context?.user) ? context.user : Auth.getSignedUser();
  return context as IAuthContext;
};

/**
 * Authentication provider component.
 * 
 * This component wraps its children with the AuthContext provider, making the 
 * authentication context available to all descendant components. It retrieves 
 * the currently signed-in user and passes it along with any additional props 
 * to the context.
 * 
 * @param {IAuthProviderProps} props - The properties for the AuthProvider, including 
 * children and any additional context values.
 * @returns {JSX.Element} The AuthContext provider wrapping the children.
 * 
 * @example
 * <AuthProvider>
 *     <YourComponent />
 * </AuthProvider>
 */
export function AuthProvider(props: IAuthProviderProps) {
  const user = Auth.getSignedUser();
  const { children, ...rest } = props;
  return <AuthContext.Provider value={{ ...rest, user }}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to get the signed user and listen for authentication events.
 * 
 * This hook manages the state of the signed user and updates it when the 
 * user signs in or out. It sets up event listeners for the SIGN_IN and 
 * SIGN_OUT events from the Auth module, ensuring that the user state is 
 * kept in sync with the authentication status.
 * 
 * @returns {IAuthContext["user"]} The currently signed user or null if not signed in.
 * 
 * @example
 * const signedUser  = useGetSignedUser ();
 * if (signedUser ) {
 *     console.log(`Current user: ${signedUser .username}`);
 * } else {
 *     console.log('No user is currently signed in.');
 * }
 */
export const useGetSignedUser = (): IAuthContext["user"] => {
  const [user, setUser] = useState(Auth.getSignedUser());
  useEffect(() => {
    const onSignIn = Auth.events.on("SIGN_IN", () => {
      setUser(Auth.getSignedUser());
    });
    const onSignOut = Auth.events.on("SIGN_OUT", () => {
      setUser(null);
    });
    return () => {
      onSignIn?.remove();
      onSignOut?.remove();
    };
  }, []);
  return user;
};


/**
 * Custom hook to determine if a user is signed in.
 * 
 * This hook utilizes the `useGetSignedUser ` hook to check if there is a currently 
 * signed-in user. It returns a boolean value indicating the user's authentication status.
 * 
 * @returns {boolean} `true` if a user is signed in, `false` otherwise.
 * 
 * @example
 * const isSignedIn = useIsSignedIn();
 * if (isSignedIn) {
 *     console.log('User  is signed in.');
 * } else {
 *     console.log('User  is not signed in.');
 * }
 */
export const useIsSignedIn = (): boolean => {
  return !!useGetSignedUser();
};

/**
 * Options for components that require authentication.
 * 
 * This interface extends the `IWithHOCOptions` interface, allowing for additional 
 * options specific to authentication-related higher-order components (HOCs).
 * 
 * @extends IWithHOCOptions
 * 
 * @example
 * const withAuthOptions: IWithAuthOptions = {
 *     // Additional options can be defined here
 * };
 */
export interface IWithAuthOptions extends IWithHOCOptions { }

/**
 * Props for components that require authentication context.
 * 
 * This type extends a generic type `T` to include the `user` property from 
 * the authentication context. It allows for flexible composition of props 
 * while ensuring that the user information is always available.
 * 
 * @template T - The base type for additional props. Defaults to `any`.
 * 
 * @property {IAuthContext["user"]} user - The currently authenticated user, 
 * which can be `null` if no user is signed in.
 * 
 * @example
 * const MyComponent: React.FC<IWithAuthProps<{ additionalProp: string }>> = ({ user, additionalProp }) => {
 *     return (
 *         <Text>
 *             {user ? <p>Welcome, {user.username}!</p> : <p>Please sign in.</p>}
 *             <p>{additionalProp}</p>
 *         </Text>
 *     );
 * };
 */
export type IWithAuthProps<T extends any = any> = T & {
  user: IAuthContext["user"];
};

/**
 * Higher-order component (HOC) that provides authentication context to a wrapped component.
 * 
 * This function takes a React functional component and returns a new component that 
 * injects authentication-related props, including the currently signed-in user. If the 
 * user is not signed in, it can render a fallback component or the Login component 
 * defined in the authentication context.
 * 
 * @template T - The type of additional props that can be passed to the wrapped component.
 * 
 * @param {React.FC<IWithAuthProps<T>>} Component - The component to be wrapped with authentication context.
 * @param {IWithAuthOptions} [options={}] - Optional configuration options for the HOC.
 * 
 * @returns {React.FC<IWithAuthProps<T>>} A new component that provides authentication context.
 * 
 * @example
 * const MyComponent: React.FC<IWithAuthProps> = ({ user }) => {
 *     return <Text>Welcome, {user.username}!</Text>;
 * };
 * 
 * const MyComponentWithAuth = withAuth(MyComponent, { fallback: <Text>Please log in.</Text> });
 * 
 * // Usage in a parent component
 * <MyComponentWithAuth />
 */
export function withAuth<T extends any = any>(Component: React.FC<IWithAuthProps<T>>, options: IWithAuthOptions = {}): React.FC<IWithAuthProps<T>> {
  options = Object.assign({}, options);
  const { fallback, displayName } = options;
  const fn: React.FC<IWithAuthProps<T>> = function (props: IWithAuthProps<T>): ReactNode {
    const user = useGetSignedUser();

    if (!user) {
      if (typeof fallback === "function") {
        return fallback();
      }
      if (fallback !== undefined && isValidElement(fallback)) return fallback;
      return <Login />;
    }
    return <Component {...props} user={user} />;
  };
  if (Component?.displayName) {
    fn.displayName = Component.displayName + "_WithAuth";
  } else if (displayName) {
    fn.displayName = displayName;
  }
  return fn;
}

/**
 * Login component that renders the authentication login interface.
 * 
 * This component checks the authentication context for a Login component 
 * provided by the AuthProvider. If the Login component is not available, 
 * it displays an error message indicating that the AuthProvider must 
 * include a Login component. It also allows for optional children to be 
 * rendered alongside the error message.
 * 
 * @param {Object} props - The props for the Login component.
 * @param {ReactNode} [props.children] - Optional children to render alongside 
 * the error message if the Login component is not available.
 * 
 * @returns {JSX.Element} The rendered Login component or an error message.
 * 
 * @example
 * // Usage of the Login component
 * <Login/>
 */
const Login: React.FC<{}> = function ({ }) {
  const authContext = useAuth();
  const Component = authContext?.Login;
  const theme = useTheme();
  return <Portal testID="resk-auth-login-portal" absoluteFill>
    <View testID="resk-auth-login-container" style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {!Component || typeof Component !== "function" ? <View style={[styles.container, Theme.styles.centered, , Theme.styles.h100, Theme.styles.w100]} testID="resk-auth-login-container">
        <View>
          <Label colorScheme="error" fontSize={20} textBold>AuthProvider must have a Login component using the `Login` prop from resk-native  provider auth options.</Label>
        </View>
      </View> : <Component signIn={Auth.signIn} />}
    </View>
  </Portal>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})

Login.displayName = "ReskNativeAuthLogin";

/**
 * Container component that conditionally renders its children based on the user's authentication status.
 * 
 * This component checks if a user is signed in using the `useGetSignedUser ` hook. 
 * If the user is authenticated, it renders the provided children. If the user is 
 * not authenticated, it renders the `Login` component to prompt the user to sign in.
 * 
 * @param {Object} props - The props for the Container component.
 * @param {JSX.Element} props.children - The child elements to render if the user is authenticated.
 * 
 * @returns {JSX.Element} The rendered children if the user is signed in, or the Login component if not.
 * 
 * @example
 * // Usage of the Container component
 * <Container>
 *     <div>Protected content that only authenticated users can see.</div>
 * </Container>
 */
const Container: React.FC<{ children: JSX.Element }> = ({ children }: { children: JSX.Element }) => {
  const user = useGetSignedUser();
  return user ? children : <Login />;
}

Container.displayName = "ReskNativeAuthContainer";

export default { Login, Container, AuthContext };
