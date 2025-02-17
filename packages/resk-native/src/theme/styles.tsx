import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { isRTL } from "@utils/i18nManager";
import Platform from "@platform";

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
 *   <View style={[StyleHelper.p4, StyleHelper.bgWhite, StyleHelper.rounded]}>
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
     * Where `size` ranges from 0 to 10, representing increments of 10 units (0, 10, 20, 30, 40, 50).
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
    //padding 5 px
    p05: { padding: 5 },
    /**
     * padding 10 px
     */
    p1: { padding: 10 },
    /**
     * padding 20 px
     */
    p2: { padding: 20 },
    p3: { padding: 30 },
    p4: { padding: 40 },
    p5: { padding: 50 },
    ph0: { paddingHorizontal: 0 },
    ph05: { paddingHorizontal: 5 },
    ph1: { paddingHorizontal: 10 },
    ph2: { paddingHorizontal: 20 },
    ph3: { paddingHorizontal: 30 },
    ph4: { paddingHorizontal: 40 },
    ph5: { paddingHorizontal: 50 },
    pv0: { paddingVertical: 0 },
    pv05: { paddingVertical: 5 },
    pv1: { paddingVertical: 10 },
    pv2: { paddingVertical: 20 },
    pv3: { paddingVertical: 30 },
    pv4: { paddingVertical: 40 },
    pv5: { paddingVertical: 50 },

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
    m05: { margin: 5 },
    m1: { margin: 10 },
    m2: { margin: 20 },
    m3: { margin: 30 },
    m4: { margin: 40 },
    m5: { margin: 50 },
    mh0: { marginHorizontal: 0 },
    mh05: { marginHorizontal: 5 },
    mh1: { marginHorizontal: 10 },
    mh2: { marginHorizontal: 20 },
    mh3: { marginHorizontal: 30 },
    mh4: { marginHorizontal: 40 },
    mh5: { marginHorizontal: 50 },
    mv0: { marginVertical: 0 },
    mv05: { marginVertical: 5 },
    mv1: { marginVertical: 10 },
    mv2: { marginVertical: 20 },
    mv3: { marginVertical: 30 },
    mv4: { marginVertical: 40 },
    mv5: { marginVertical: 50 },

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

    flex0: {
        flex: 0,
    },
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
    flexColReverse: {
        flexDirection: 'column-reverse',
    },
    flexRowReverse: {
        flexDirection: 'row-reverse',
    },
    flexGrow: {
        flexGrow: 1,
    },
    flexShrink: {
        flexShrink: 1,
    },
    flexShrink0: {
        flexShrink: 0,
    },
    flexNowrap: { flexWrap: 'nowrap' },
    justifyContentStart: { justifyContent: 'flex-start' },
    justifyContentEnd: { justifyContent: 'flex-end' },
    justifyContentCenter: { justifyContent: 'center' },
    justifyContentSpaceBetween: { justifyContent: 'space-between' },
    justifyContentSpaceAround: { justifyContent: 'space-around' },
    justifyContentSpaceEvenly: { justifyContent: 'space-evenly' },
    alignItemsStart: { alignItems: 'flex-start' },
    alignItemsEnd: { alignItems: 'flex-end' },
    alignItemsCenter: { alignItems: 'center' },
    alignItemsBaseline: { alignItems: 'baseline' },
    alignItemsStretch: { alignItems: 'stretch' },
    alignItemBaseline: {
        alignItems: 'baseline',
    },
    alignSelfAuto: {
        alignSelf: 'auto',
    },
    alignSelfStart: {
        alignSelf: 'flex-start',
    },
    alignSelfEnd: {
        alignSelf: 'flex-end',
    },
    alignSelfCenter: {
        alignSelf: 'center',
    },
    alignSelfStretch: {
        alignSelf: 'stretch',
    },
    alignSelfBaseline: {
        alignSelf: 'baseline',
    },

    /**
     * Sets the width and height of the component.
     * @example
     * <View style={StyleHelper.w100}>
     *   <Text>Full width container</Text>
     * </View>
     */
    w100: { width: '100%' },
    h100: { height: '100%' },
    hFullVh: Platform.web({ height: '100vh' }),
    wFullVh: Platform.web({ width: '100vh' }),
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
     * Pointer cursor style for web platforms.
     * Applies a pointer cursor when hovering over the component.
     * 
     * @example
     * <View style={styles.cursorPointer}>
     *   ...
     * </View>
     */
    cursorPointer: Platform.web({ cursor: 'pointer' }),

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
    RTL: { transform: [{ scaleX: isRTL ? -1 : 1 }] },


    /*
   * Positioning
   */
    fixed: {
        position: Platform.select({ web: 'fixed', native: 'absolute' }) as 'absolute',
    },
    absolute: {
        position: 'absolute',
    },
    relative: {
        position: 'relative',
    },
    sticky: Platform.web({
        position: 'sticky',
    }),
    inset0: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    zIndex10: {
        zIndex: 10,
    },
    zIndex20: {
        zIndex: 20,
    },
    zIndex30: {
        zIndex: 30,
    },
    zIndex40: {
        zIndex: 40,
    },
    zIndex50: {
        zIndex: 50,
    },

    bgTransparent: {
        backgroundColor: 'transparent',
    },


    /**
     * Applies border styles to the component.
     * @example
     * <View style={[StyleHelper.border, StyleHelper.rounded]}>
     *   <Text>Bordered and rounded container</Text>
     * </View>
     */
    borderTop1: { borderTopWidth: 1 },
    borderRight1: { borderRightWidth: 1 },
    borderBottom1: { borderBottomWidth: 1 },
    borderLeft1: { borderLeftWidth: 1 },
    border0: {
        borderWidth: 0,
    },
    borderTop0: {
        borderTopWidth: 0,
    },
    borderBottom0: {
        borderBottomWidth: 0,
    },
    borderLeft0: {
        borderLeftWidth: 0,
    },
    borderRight0: {
        borderRightWidth: 0,
    },
    border: {
        borderWidth: StyleSheet.hairlineWidth,
    },
    borderTop: {
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    borderBoottom: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    borderLeft: {
        borderLeftWidth: StyleSheet.hairlineWidth,
    },
    borderRight: {
        borderRightWidth: StyleSheet.hairlineWidth,
    },
    curveCircular: Platform.ios({
        borderCurve: 'circular',
    }),
    curveContinuous: Platform.ios({
        borderCurve: 'continuous',
    }),

    /*
   * Shadow
   */
    shadowMobile: {
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 8,
    },
    shadowTablet: {
        shadowRadius: 16,
        shadowOpacity: 0.1,
        elevation: 16,
    },
    shadowDesktop: {
        shadowRadius: 32,
        shadowOpacity: 0.1,
        elevation: 24,
    },

    /*
  * Pointer events & user select
  */
    pointerEventsNone: {
        pointerEvents: 'none',
    },
    pointerEventsAuto: {
        pointerEvents: 'auto',
    },
    userSelectNone: {
        userSelect: 'none',
    },
    userSelectText: {
        userSelect: 'text',
    },
    userSelectAll: {
        userSelect: 'all',
    },


    /*
   * Transition
   */
    webTransitionNone: Platform.web({
        transitionProperty: 'none',
    }),
    webTransitionAll: Platform.web({
        transitionProperty: 'all',
        transitionTimingFunction: 'cubic-bezier(0.17, 0.73, 0.14, 1)',
        transitionDuration: '100ms',
    }),
    webTransitionColor: Platform.web({
        transitionProperty:
            'color, background-color, border-color, text-decoration-color, fill, stroke',
        transitionTimingFunction: 'cubic-bezier(0.17, 0.73, 0.14, 1)',
        transitionDuration: '100ms',
    }),
    webTransitionOpacity: Platform.web({
        transitionProperty: 'opacity',
        transitionTimingFunction: 'cubic-bezier(0.17, 0.73, 0.14, 1)',
        transitionDuration: '100ms',
    }),
    webTransitionTransform: Platform.web({
        transitionProperty: 'transform',
        transitionTimingFunction: 'cubic-bezier(0.17, 0.73, 0.14, 1)',
        transitionDuration: '100ms',
    }),
});

export default styles;