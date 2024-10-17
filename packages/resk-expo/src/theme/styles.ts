import { Platform } from "@resk/core";
import { StyleSheet, ViewStyle } from "react-native";
export { StyleSheet };

export const LINE_HEIGHT = 20;

export const ALPHA_OPACITY = 0.75;

export const ALPHA = 0.6;

export const DISABLED_OPACITY = 0.6;

export const READ_ONLY_OPACITY = 0.80;


export const styles = StyleSheet.create({
    flex1: { flex: 1 },
    flex2: { flex: 2 },
    flex3: { flex: 3 },
    flex4: { flex: 4 },
    flex5: { flex: 5 },
    flex6: { flex: 6 },
    boxShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    textAlignCenter: {
        textAlign: 'center',
    },
    lineHeight: {
        lineHeight: LINE_HEIGHT,
    },
    disabled: {
        opacity: DISABLED_OPACITY,
        pointerEvents: "none",
    },
    readOnly: {
        opacity: READ_ONLY_OPACITY,
        pointerEvents: "none",
    },
    cursorPointer: Platform.isWeb() ? { cursor: 'pointer' } : {},
    //cursorNotAllowed : isWeb()? {cursor:'not-allowed'} : {},
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rowReverse: {
        flexDirection: "row-reverse",
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
    justifyContentFlexStart: {
        justifyContent: 'flex-start'
    },
    justifyContentCenter: {
        justifyContent: 'center'
    },
    justifyContentFlexEnd: {
        justifyContent: 'flex-end'
    },
    justifyContentSpaceBetween: {
        justifyContent: 'space-between'
    },
    alignItemsFlexStart: {
        alignItems: 'flex-start'
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    alignItemsFlexEnd: {
        alignItems: 'flex-end'
    },
    wrap: {
        flexWrap: 'wrap',
    },
    flexWrap: { flexWrap: 'wrap' },
    noWrap: { flexWrap: 'nowrap' },
    rowWrap: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    hidden: {
        display: 'none',
        opacity: 0,
    },
    noPadding: {
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    noMargin: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
    },
    webFontFamilly: Platform.isWeb() ? {
        fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue","Fira Sans",Ubuntu,Oxygen,"Oxygen Sans",Cantarell,"Droid Sans","Apple Color Emoji","Segoe UI Emoji","Segoe UI Emoji","Segoe UI Symbol","Lucida Grande",Helvetica,Arial,sans-serif',
    } : {},
    label: { fontWeight: 'normal' },
    bold: { fontWeight: 'bold' },
    textDecorationUnderline: {
        textDecorationLine: 'underline',
    },
    textDecorationNone: {
        textDecorationLine: 'none',
    },
    webFontFamily: Platform.isWeb() ? {
        fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue","Fira Sans",Ubuntu,Oxygen,"Oxygen Sans",Cantarell,"Droid Sans","Apple Color Emoji","Segoe UI Emoji","Segoe UI Emoji","Segoe UI Symbol","Lucida Grande",Helvetica,Arial,sans-serif',
    } : {},
    absoluteFill: StyleSheet && StyleSheet.absoluteFillObject || {},
    w100: {
        width: "100%",
    },
    h100: {
        height: "100%",
    },
    pv0: {
        paddingVertical: 0,
    },
    pv1: {
        paddingVertical: 10,
    },
    pv2: {
        paddingVertical: 20,
    },
    pv3: {
        paddingVertical: 30,
    },
    ph0: {
        paddingHorizontal: 0,
    },
    ph1: {
        paddingHorizontal: 10,
    },
    ph2: {
        paddingHorizontal: 20,
    },
    ph3: {
        paddingHorizontal: 30,
    },
    mv0: {
        marginVertical: 0,
    },
    mt0: {
        marginTop: 0,
    },
    mt1: {
        marginTop: 10,
    },
    mt2: {
        marginTop: 20,
    },
    mt3: {
        marginTop: 30,
    },
    pt0: {
        paddingTop: 0,
    },
    pt1: {
        paddingTop: 10,
    },
    pt2: {
        paddingTop: 20,
    },
    pt3: {
        paddingTop: 30,
    },
    mb0: {
        marginBottom: 0,
    },
    mb1: {
        marginBottom: 10,
    },
    mb2: {
        marginBottom: 20,
    },
    mb3: {
        marginBottom: 30,
    },
    ml0: {
        marginLeft: 0,
    },
    ml1: {
        marginLeft: 10,
    },
    ml2: {
        marginLeft: 20,
    },
    ml3: {
        marginLeft: 30,
    },
    mr0: {
        marginRight: 0,
    },
    mr1: {
        marginRight: 10,
    },
    mr2: {
        marginRight: 20,
    },
    mr3: {
        marginRight: 30,
    },
    mv1: {
        marginVertical: 10,
    },
    mv2: {
        marginVertical: 20,
    },
    mv3: {
        marginVertical: 30,
    },
    mh0: {
        marginHorizontal: 0,
    },
    mh1: {
        marginHorizontal: 10,
    },
    mh2: {
        marginHorizontal: 20,
    },
    mh3: {
        marginHorizontal: 30,
    },
    p0: {
        padding: 0,
    },
    p1: {
        padding: 10,
    },
    p2: {
        padding: 20,
    },
    p3: {
        padding: 30,
    },
    m0: {
        margin: 0,
    },
    m1: {
        margin: 10,
    },
    m2: {
        margin: 20,
    },
    m3: {
        margin: 30,
    },
    ph05: {
        paddingHorizontal: 5,
    },
    pv05: {
        paddingVertical: 5,
    },
    mh05: {
        marginHorizontal: 5,
    },
    mv05: {
        marginVertical: 5,
    },
    p05: {
        padding: 5,
    },
    m05: {
        margin: 5,
    },
    mr05: {
        marginRight: 5,
    },
    ml05: {
        marginLeft: 5,
    },
    backgroundColorTransparent: {
        backgroundColor: "transparent",
        paddingHorizontal: 0,
        paddingVertical: 0,
        height: 50,
    }
});

export default styles;


/**
 * @copy of splitStyle implementation, @see : https://github.com/callstack/react-native-paper/blob/main/src/utils/splitStyles.ts
 * Utility function to extract styles in separate objects
 *
 * @param styles The style object you want to filter
 * @param filters The filters by which you want to split the styles
 * @returns An array of filtered style objects:
 * - The first style object contains the properties that didn't match any filter
 * - After that there will be a style object for each filter you passed in the same order as the matching filters
 * - A style property will exist in a single style object, the first filter it matched
 */
export function splitStyles<Tuple extends FiltersArray>(styles: ViewStyle, ...filters: Tuple) {
    if (process.env.NODE_ENV !== 'production' && filters.length === 0) {
        console.error('No filters were passed when calling splitStyles');
    }

    // `Object.entries` will be used to iterate over the styles and `Object.fromEntries` will be called before returning
    // Entries which match the given filters will be temporarily stored in `newStyles`
    const newStyles = filters.map(() => [] as Entry[]);

    // Entries which match no filter
    const rest: Entry[] = [];

    // Iterate every style property
    outer: for (const item of Object.entries(styles) as Entry[]) {
        // Check each filter
        for (let i = 0; i < filters.length; i++) {
            // Check if filter matches
            if (filters[i](item[0])) {
                newStyles[i].push(item); // Push to temporary filtered entries array
                continue outer; // Skip to checking next style property
            }
        }

        // Adds to rest styles if not filtered
        rest.push(item);
    }

    // Put unmatched styles in the beginning
    newStyles.unshift(rest);

    // Convert arrays of entries into objects
    return newStyles.map((styles) => Object.fromEntries(styles)) as unknown as [
        ViewStyle,
        ...MappedTuple<Tuple>
    ];
}

type FiltersArray = readonly ((style: keyof ViewStyle) => boolean)[];
type Style = ViewStyle[keyof ViewStyle];
type Entry = [keyof ViewStyle, Style];
type MappedTuple<Tuple extends FiltersArray> = {
    [Index in keyof Tuple]: ViewStyle;
} & { length: Tuple['length'] };