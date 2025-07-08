import { Div } from "@html/Div";
import { SetupExpo__DEV__ } from "@components/SetupExpo__DEV__";
import { GlobalStyles } from "./GlobalStyles";
import { IClassName } from "@src/types";
import { cn } from "@utils/cn";
import { PortalProvider } from "@components/Portal";
/**
 * Props for the AppRoot component.
 * 
 * @public
 */
export interface IAppRootProps {
    /** 
     * The child components to render within the application shell.
     * This typically includes your main application content and routing components.
     */
    children: React.ReactNode;

    /***
        The class name to apply to the root container.
        This allows for custom styling or additional CSS classes to be applied.
        It can be used to extend the default styles provided by the component.
        If not specified, the default styles will be applied.
    */
    className?: IClassName;
}

/**
 * Props for the AppRoot component.
 * 
 * @public
 */
export interface AppRootProps {
    /** 
     * The child components to render within the application shell.
     * This typically includes your main application content and routing components.
     */
    children: React.ReactNode;
}

/**
 * Universal application shell component that provides foundational setup for both web and mobile environments.
 * 
 * The `AppRoot` serves as the root wrapper for your application, establishing the base layout structure
 * and initializing essential services that work across Next.js (web) and Expo (React Native) platforms.
 * 
 * ## Features
 * 
 * - **Cross-platform compatibility**: Works seamlessly in Next.js server-side components and Expo applications
 *   - On web: Server-side compatible - simply returns children without client-side state
 *   - On mobile: Enables proper modal and overlay rendering within the React Native context
 * - **Development tools**: Includes Expo-specific development utilities when in development mode
 * - **Global styling**: Applies application-wide styles and CSS variables
 * - **Flexible layout**: Establishes a full-screen flex container that adapts to different screen sizes
 * 
 * ## Layout Structure
 * 
 * The component creates a full-screen container with the following characteristics:
 * - Full viewport dimensions (`h-screen w-screen`)
 * - Flexbox column layout (`flex flex-col flex-1`)
 * - Relative positioning for absolute-positioned children
 * - Consistent root identifier (`reskit-app-root`) for styling and testing
 * 
 * ## Usage
 * 
 * ### Next.js App Router (Server Component)
 * ```tsx
 * // app/layout.tsx
 * import { AppRoot } from '@resk/nativewind';
 * 
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <AppRoot>
 *           {children}
 *         </AppRoot>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 * 
 * ### Expo Application
 * ```tsx
 * // App.tsx
 * import { AppRoot } from '@resk/nativewind';
 * import { NavigationContainer } from '@react-navigation/native';
 * 
 * export default function App() {
 *   return (
 *     <AppRoot>
 *       <NavigationContainer>
            {/* Your navigation structure goes here, e.g.:}
 *       </NavigationContainer>
 *     </AppRoot>
 *   );
 * }
 * ```
 * 
 * ## Architecture
 * 
 * The component is structured in layers from outermost to innermost:
 * 1. **Layout Container** (`Div`): Provides the base layout structure and styling
 *    - **Web (Next.js)**: Server-side compatible implementation that simply returns children
 *    - **Mobile (Expo)**: Provides React Native portal context for proper modal rendering
 * 3. **Children**: Your application content
 * 4. **Development Tools**: Expo-specific development utilities (development only)
 * 5. **Global Styles**: Application-wide CSS and styling definitions
 * 
 * @param props - The component props
 * @param props.children - The child components to render within the shell
 * 
 * @returns The rendered application shell with all child components and services initialized
 * 
 * @example
 * Basic usage with a simple application:
 * ```tsx
 * function MyApp() {
 *   return (
 *     <AppRoot>
 *       <Header />
 *       <MainContent />
 *       <Footer />
 *     </AppRoot>
 *   );
 * }
 * ```
 * 
 * @example
 * Usage with routing:
 * ```tsx
 * function AppWithRouting() {
 *   return (
 *     <AppRoot>
 *       <Router>
 *         <Routes>
 *           <Route path="/" element={<HomePage />} />
 *           <Route path="/about" element={<AboutPage />} />
 *         </Routes>
 *       </Router>
 *     </AppRoot>
 *   );
 * }
 * ```
 * 
 * @since 1.0.0
 * @public
 */
export function AppRoot({ children, className }: IAppRootProps) {
    return <>
        <GlobalStyles />
        <SetupExpo__DEV__ />
        <Div
            className={cn("flex flex-col flex-1 h-full w-full relative reskit-app-root", className)}
            id="reskit-app-root"
        >
            <PortalProvider>
                {children}
            </PortalProvider>
        </Div>
    </>;
}