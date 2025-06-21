import { IFontIconProps } from "../types";
import ClientFontIcon, { DEFAULT_FONT_ICON_SIZE } from "./Client";


/***
 * The `FontIcon` component is used to display font-based icons from various icon sets.
 * The default icon set is `MaterialCommunityIcons`, which doesn't require prefixes for icon names.
 * 
 * Icon sets are selected by prefixing the icon name with a specific key for each icon set. 
 * 
 * @see https://oblador.github.io/react-native-vector-icons/ for all supported icons
 * @see https://www.npmjs.com/package/react-native-vector-icons for application icons
 * 
 * The following prefixes should be used to specify the icon set:
 *  - `fa6` for FontAwesome6
 *  - `antd` for AntDesign
 *  - `feather` for Feather
 *  - `foundation` for Foundation
 *  - `octicons` for Octicons
 *  - `ionic` for Ionicons
 *  - `material` for MaterialIcons (default)
 * 
 * @example
 * ```ts
 * import FontIcon from "$components/Icon/Font";
 * 
 * export default function MyApp() {
 *   return (
 *     <>
 *       <FontIcon name="camera" />  // Defaults to MaterialCommunityIcons
 *       <FontIcon name="fa6-camera" />  // Uses FontAwesome6 icon set
 *     </>
 *   );
 * }
 * ```
 * 
 * @param {IFontIconProps} props The properties of the `FontIcon` component.
 * @returns {JSX.Element | null} Returns the icon element, or null if the icon is not defined.
 */
export default function FontIcon(props: IFontIconProps) {
    return <>
        <ClientFontIcon {...props} />
    </>
};

/***
 * The default size of the font icon.
 * value: 20
 */
FontIcon.DEFAULT_SIZE = DEFAULT_FONT_ICON_SIZE;



FontIcon.displayName = "Icon.Font";