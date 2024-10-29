import { Platform } from "@resk/core";
import { StyleSheet } from "react-native";
import { isRTL } from "@utils/i18nManager";

/**
 * @description
 * StyleHelper: Your Swiss Armv Knife for React Native Styling
 * 
 * This powerful utility object provides a comprehensive set of predefined styles
 * for React Native components. Inspired by utility-first CSS frameworks like
 * Tailwind, StyleHelper allows you to rapidly build beautiful, responsive layouts
 * without writing custom styles for every component.
 * 
 * @example
 * Here's a taste of how StyleHelper can transform your React Native code:
 * 
 * ```tsx
 * import StyleHelper from './StyleHelper';
 * 
 * const WelcomeCard = () => (
 *   <View style={[StyleHelper.p4, StyleHelper.bgWhite, StyleHelper.rounded, StyleHelper.shadow]}>
 *     <Text style={[StyleHelper.textXl, StyleHelper.textDark, StyleHelper.fontBold]}>
 *       Welcome aboard!
 *     </Text>
 *     <Text style={[StyleHelper.mt2, StyleHelper.textBase, StyleHelper.textGray600]}>
 *       We're excited to have you join our community.
 *     </Text>
 *     <TouchableOpacity 
 *       style={[StyleHelper.mt4, StyleHelper.bgPrimary, StyleHelper.p3, StyleHelper.roundedFull]}
 *     >
 *       <Text style={[StyleHelper.textWhite, StyleHelper.textCenter, StyleHelper.fontSemibold]}>
 *         Get Started
 *       </Text>
 *     </TouchableOpacity>
 *   </View>
 * );
 * ```
 * 
 * With StyleHelper, you can create beautiful, consistent designs across your entire app
 * without the headache of managing multiple stylesheets or remembering custom class names.
 */
const styles = StyleSheet.create({
    /**
     * Spacing Utilities: Padding
     * 
     * These styles help you control the padding around your components with ease.
     * Use them to create breathing room and improve the visual hierarchy of your layouts.
     * 
     * The naming convention is:
     * - `p{size}` for padding on all sides
     * - `ph{size}` for horizontal padding
     * - `pv{size}` for vertical padding
     * 
     * Where `size` ranges from 0 to 5, representing increments of 4 units (0, 4, 8, 12, 16, 20).
     * 
     * @example
     * ```tsx
     * <View style={StyleHelper.p4}>
     *   <Text>This text has 16 units of padding on all sides</Text>
     * </View>
     * 
     * <View style={[StyleHelper.ph3, StyleHelper.pv2]}>
     *   <Text>This text has 12 units of horizontal padding and 8 units of vertical padding</Text>
     * </View>
     * ```
     */
    p0: { padding: 0 },
    p1: { padding: 4 },
    p2: { padding: 8 },
    p3: { padding: 12 },
    p4: { padding: 16 },
    p5: { padding: 20 },
    ph0: { paddingHorizontal: 0 },
    ph1: { paddingHorizontal: 4 },
    ph2: { paddingHorizontal: 8 },
    ph3: { paddingHorizontal: 12 },
    ph4: { paddingHorizontal: 16 },
    ph5: { paddingHorizontal: 20 },
    pv0: { paddingVertical: 0 },
    pv1: { paddingVertical: 4 },
    pv2: { paddingVertical: 8 },
    pv3: { paddingVertical: 12 },
    pv4: { paddingVertical: 16 },
    pv5: { paddingVertical: 20 },

    /**
     * Spacing Utilities: Margin
     * 
     * These styles allow you to control the margin around your components.
     * Use them to create space between elements and structure your layouts effectively.
     * 
     * The naming convention is:
     * - `m{size}` for margin on all sides
     * - `mh{size}` for horizontal margin
     * - `mv{size}` for vertical margin
     * 
     * Where `size` ranges from 0 to 5, representing increments of 4 units (0, 4, 8, 12, 16, 20).
     * 
     * @example
     * ```tsx
     * <View style={StyleHelper.m3}>
     *   <Text>This view has 12 units of margin on all sides</Text>
     * </View>
     * 
     * <View>
     *   <Text style={StyleHelper.mb2}>This text has 8 units of margin at the bottom</Text>
     *   <Text style={StyleHelper.mt2}>This text has 8 units of margin at the top</Text>
     * </View>
     * ```
     */
    m0: { margin: 0 },
    m1: { margin: 4 },
    m2: { margin: 8 },
    m3: { margin: 12 },
    m4: { margin: 16 },
    m5: { margin: 20 },
    mh0: { marginHorizontal: 0 },
    mh1: { marginHorizontal: 4 },
    mh2: { marginHorizontal: 8 },
    mh3: { marginHorizontal: 12 },
    mh4: { marginHorizontal: 16 },
    mh5: { marginHorizontal: 20 },
    mv0: { marginVertical: 0 },
    mv1: { marginVertical: 4 },
    mv2: { marginVertical: 8 },
    mv3: { marginVertical: 12 },
    mv4: { marginVertical: 16 },
    mv5: { marginVertical: 20 },

    /**
     * Typography: Font Sizes
     * 
     * These styles allow you to easily control the font size of your text elements.
     * The scale provides a range of sizes suitable for various purposes, from small
     * captions to large headlines.
     * 
     * The naming convention is `text{Size}`, where Size ranges from Xs to 3Xl.
     * 
     * @example
     * ```tsx
     * <Text style={StyleHelper.textXs}>Extra small text</Text>
     * <Text style={StyleHelper.textBase}>Base size text</Text>
     * <Text style={StyleHelper.text2Xl}>Extra large text</Text>
     * 
     * <View>
     *   <Text style={[StyleHelper.text3Xl, StyleHelper.fontBold]}>
     *     Headline
     *   </Text>
     *   <Text style={StyleHelper.textBase}>
     *     This is the body text that follows the headline.
     *   </Text>
     * </View>
     * ```
     */
    textXs: { fontSize: 12 },
    textSm: { fontSize: 14 },
    textBase: { fontSize: 16 },
    textLg: { fontSize: 18 },
    textXl: { fontSize: 20 },
    text2Xl: { fontSize: 24 },
    text3Xl: { fontSize: 30 },

    /**
     * Typography: Font Weights
     * 
     * These styles allow you to adjust the font weight of your text elements.
     * Use them to create visual hierarchy and emphasize important content.
     * 
     * @example
     * ```tsx
     * <Text style={StyleHelper.fontLight}>Light weight text</Text>
     * <Text style={StyleHelper.fontBold}>Bold text for emphasis</Text>
     * 
     * <View>
     *   <Text style={[StyleHelper.textXl, StyleHelper.fontBold]}>
     *     Important Headline
     *   </Text>
     *   <Text style={StyleHelper.fontSemibold}>
     *     This subheading uses semibold for subtle emphasis.
     *   </Text>
     *   <Text style={StyleHelper.fontLight}>
     *     Light weight text can be used for less important information.
     *   </Text>
     * </View>
     * ```
     */
    fontBold: { fontWeight: 'bold' },
    fontSemibold: { fontWeight: '600' },
    fontLight: { fontWeight: '300' },

    /**
     * Typography: Text Alignment
     * 
     * These styles help you control the alignment of your text.
     * They're particularly useful for creating visually balanced layouts
     * and emphasizing certain pieces of text.
     * 
     * @example
     * ```tsx
     * <Text style={StyleHelper.textCenter}>This text is centered</Text>
     * 
     * <View>
     *   <Text style={StyleHelper.textLeft}>Left aligned text</Text>
     *   <Text style={StyleHelper.textRight}>Right aligned text</Text>
     *   <Text style={StyleHelper.textJustify}>
     *     This longer piece of text is justified, which can create a clean,
     *     aligned look for paragraphs. However, be cautious with justification
     *     on small screens as it can create awkward spacing.
     *   </Text>
     * </View>
     * ```
     */
    textCenter: { textAlign: 'center' },
    textLeft: { textAlign: 'left' },
    textRight: { textAlign: 'right' },
    textJustify: { textAlign: 'justify' },

    /**
     * Typography: Text Decoration
     * 
     * These styles allow you to add underlines or strikethroughs to your text.
     * They can be useful for highlighting links or indicating completed items.
     * 
     * @example
     * ```tsx
     * <Text style={StyleHelper.underline}>This text is underlined</Text>
     * <Text style={StyleHelper.lineThrough}>This text has a line through it</Text>
     * 
     * <View>
     *   <Text>Shopping List:</Text>
     *   <Text style={StyleHelper.lineThrough}>Apples</Text>
     *   <Text>Bananas</Text>
     *   <Text style={StyleHelper.underline}>Click here to add more items</Text>
     * </View>
     * ```
     */
    underline: { textDecorationLine: 'underline' },
    lineThrough: { textDecorationLine: 'line-through' },

    /**
     * Applies flex properties to the component.
     * @example
     * <View style={[StyleHelper.flex1, StyleHelper.flexRow, StyleHelper.justifyBetween]}>
     *   <Text>Left</Text>
     *   <Text>Right</Text>
     * </View>
     */
    flex1: { flex: 1 },
    /**
         * Flex style with a value of 2.
         * Allows the component to grow and fill twice the space compared to flex1.
         * 
         * @example
         * <View style={styles.flex2}>
         *   <Text>Double Content</Text>
         * </View>
         */
    flex2: { flex: 2 },

    /**
     * Flex style with a value of 3.
     * Allows the component to grow and fill three times the space compared to flex1.
     * 
     * @example
     * <View style={styles.flex3}>
     *   <Text>Triple Content</Text>
     * </View>
     */
    flex3: { flex: 3 },

    /**
     * Flex style with a value of 4.
     * Allows the component to grow and fill four times the space compared to flex1.
     * 
     * @example
     * <View style={styles.flex4}>
     *   <Text>Quadruple Content</Text>
     * </View>
     */
    flex4: { flex: 4 },

    /**
     * Flex style with a value of 5.
     * Allows the component to grow and fill five times the space compared to flex1.
     * 
     * @example
     * <View style={styles.flex5}>
     *   <Text>Quintuple Content</Text>
     * </View>
     */
    flex5: { flex: 5 },

    /**
     * Flex style with a value of 6.
     * Allows the component to grow and fill six times the space compared to flex1.
     * 
     * @example
     * <View style={styles.flex6}>
     *   <Text>Hexuple Content</Text>
     * </View>
     */
    flex6: { flex: 6 },
    flexRow: { flexDirection: 'row' },
    flexCol: { flexDirection: 'column' },
    flexWrap: { flexWrap: 'wrap' },
    flexNowrap: { flexWrap: 'nowrap' },
    justifyContentFlexStart: { justifyContent: 'flex-start' },
    justifyContentFlexEnd: { justifyContent: 'flex-end' },
    justifyContentCenter: { justifyContent: 'center' },
    justifyContentSpaceBetween: { justifyContent: 'space-between' },
    justifyContentSpaceAround: { justifyContent: 'space-around' },
    justifyContentSpaceEvenly: { justifyContent: 'space-evenly' },
    alignItemsFlexStart: { alignItems: 'flex-start' },
    alignItemsFlexEnd: { alignItems: 'flex-end' },
    alignItemsCenter: { alignItems: 'center' },
    alignItemsBaseline: { alignItems: 'baseline' },
    alignItemsStretch: { alignItems: 'stretch' },


    /**
     * Sets the width and height of the component.
     * @example
     * <View style={StyleHelper.w100}>
     *   <Text>Full width container</Text>
     * </View>
     */
    w100: { width: '100%' },
    h100: { height: '100%' },
    w50: { width: '50%' },
    h50: { height: '50%' },
    w25: { width: '25%' },
    h25: { height: '25%' },


    /**
     * Sets the opacity of the component.
     * @example
     * <View style={StyleHelper.opacity50}>
     *   <Text>50% opaque</Text>
     * </View>
     */
    opacity50: { opacity: 0.5 },
    opacity75: { opacity: 0.75 },

    /**
     * Applies border styles to the component.
     * @example
     * <View style={[StyleHelper.border, StyleHelper.rounded]}>
     *   <Text>Bordered and rounded container</Text>
     * </View>
     */
    border: { borderWidth: 1 },
    borderTop: { borderTopWidth: 1 },
    borderRight: { borderRightWidth: 1 },
    borderBottom: { borderBottomWidth: 1 },
    borderLeft: { borderLeftWidth: 1 },

    /**
     * Sets the overflow behavior of the component.
     * @example
     * <View style={[StyleHelper.overflowHidden, { height: 100 }]}>
     *   <Text>Content that exceeds 100 height will be hidden</Text>
     * </View>
     */
    overflowHidden: { overflow: 'hidden' },
    overflowVisible: { overflow: 'visible' },
    overflowScroll: { overflow: 'scroll' },

    /**
     * Hides the component.
     * @example
     * <View style={condition ? StyleHelper.hidden : null}>
     *   <Text>This will be hidden when condition is true</Text>
     * </View>
     */
    hidden: { display: 'none', opacity: 0 },

    /**
         * Style for disabled components.
         * Reduces opacity and disables pointer events.
         * 
         * @example
         * <Button style={styles.disabled} disabled />
         */
    disabled: {
        opacity: 0.6,
        pointerEvents: "none",
        userSelect: "text",
    },

    /**
     * Style for read-only components.
     * Reduces opacity and disables pointer events.
     * 
     * @example
     * <TextInput style={styles.readOnly} editable={false} />
     */
    readOnly: {
        opacity: 0.80,
        pointerEvents: "none",
        userSelect: "text",
    },



    /**
         * Style for box shadow.
         * Provides shadow properties for elevation and depth effect.
         * 
         * @property {string} shadowColor - Color of the shadow.
         * @property {object} shadowOffset - Offset for the shadow.
         * @property {number} shadowOpacity - Opacity of the shadow.
         * @property {number} shadowRadius - Radius of the shadow blur.
         * @property {number} elevation - Android-specific shadow elevation.
         * 
         * @example
         * <View style={styles.boxShadow}>
         *   <Text>Shadowed Box</Text>
         * </View>
         */
    boxShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },


    /**
     * Pointer cursor style for web platforms.
     * Applies a pointer cursor when hovering over the component.
     * 
     * @example
     * <View style={styles.cursorPointer}>
     *   ...
     * </View>
     */
    cursorPointer: Platform.isWeb() ? { cursor: 'pointer' } : {},

    /**
     * Row layout style.
     * Sets up a horizontal layout with flex items.
     * 
     * @property {string} flexDirection - Direction of the flex layout.
     * @property {string} justifyContent - Justification of flex items.
     * @property {string} alignItems - Alignment of flex items.
     * 
     * @example
     * <View style={styles.row}>
     *   <Text>Item 1</Text>
     *   <Text>Item 2</Text>
     * </View>
     */
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    /**
     * Reverse row layout style.
     * Sets up a horizontal layout with flex items in reverse order.
     * 
     * @property {string} flexDirection - Direction of the flex layout.
     * 
     * @example
     * <View style={styles.rowReverse}>
     *   <Text>Item 1</Text>
     *   <Text>Item 2</Text>
     * </View>
     */
    rowReverse: {
        flexDirection: "row-reverse",
    },

    /**
     * Centered layout style.
     * Sets up a layout with centered content.
     * 
     * @property {string} justifyContent - Justification of flex items.
     * @property {string} alignItems - Alignment of flex items.
     * 
     * @example
     * <View style={styles.centered}>
     *   <Text>Centered Text</Text>
     * </View>
     */
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },

    // ... (other styles)

    /**
     * Web font family style.
     * Applies a specific font family for web platforms.
     * 
     * @property {string} fontFamily - Font family for web platforms.
     * 
     * @example
     * <Text style={styles.webFontFamily}>Web font family</Text>
     */
    webFontFamily: Platform.isWeb() ? {
        fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue","Fira Sans",Ubuntu,Oxygen,"Oxygen Sans",Cantarell,"Droid Sans","Apple Color Emoji","Segoe UI Emoji","Segoe UI Emoji","Segoe UI Symbol","Lucida Grande",Helvetica,Arial,sans-serif',
    } : {},
    noPadding: {
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    absoluteFill: {
        ...StyleSheet.absoluteFillObject
    },
    noMargin: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
    },
    /***
     * this style is used to make the text direction right to left depending on the application layout direction
     */
    RTL: { transform: [{ scaleX: isRTL ? -1 : 1 }] }
});

export default styles;