import { Dimensions } from "react-native";
import { IBreakpoints,IBreakpoint, IMainBreakpoints} from "./types";

/***
 * les différents BREAKPOINTS des tailles de l'écran possible
 */
export const BREAKPOINTS : IMainBreakpoints = {
    all: {
        //small phone breakpoint
        sp:{
            max : 320,
            name : 'sp',
            label : "Small phone",
        },
        //medium phone breakpoint
        mp:{
            max : 399,
            name :'mp',
            label : "Medium phone",
        }, 
        // Small devices (landscape phones, 576px and up)
        xs:{
            max : 575,
            name : 'xs',
            label : "Small devices (landscape phones, 576px and up)",
        }, 
        // Medium devices (tablets, 768px and up)
        sm:{
            max : 767,
            name :'sm',
            label : "Medium devices (tablets, 768px and up)",
        },
        //medium devices (laptops, 1024px and up)
        md : {
            max : 1024,
            name :'md',
            label : "medium devices (laptops, 1024px and up)",
        }, 
        // Extra large devices (large desktops, 1200px and up)
        lg:{
            max : 1199,
            name :'lg',
            label : "large devices (large desktops, 1200px and up)",
        },
        // Extra large devices (large desktops)
        xl:{
            max : 99999999999999999,
            name :'xl',
            label : "Extra large devices (large desktops)",
        }, 
    }
}

// int comparer for sorts
const compareInts = function compare(a:any, b:any):number {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }

    return 0;
};

// Indicates if an object is numeric
const isNumeric = function (obj : any) : boolean{
    return !isNaN(parseFloat(obj)) && isFinite(obj);
};

// Given a BREAKPOINTS object, will convert simple "max" values to a rich breakpoint object
// which can contain min, max, and name
const setMaxWidths = function (breakpoints : IBreakpoints) {
    const maxWidths : number[]= [] ;
    for (let name in breakpoints) {
        const m = breakpoints[name as keyof IBreakpoints]?.max;
        if(m){
            maxWidths.push(m);
        }
    }
    maxWidths.sort(compareInts);
    return maxWidths;
};

// Given a BREAKPOINTS object, will assign "min" values based on the
// existing BREAKPOINTS "max" values.
const setMinWidths = function (breakpoints : IBreakpoints, maxWidths : number[]): void {
    for (let name in breakpoints) {
        const breakpoint = breakpoints[name as keyof IBreakpoints];
        if (breakpoint?.min) {
            continue;
        }
        for (let i = 0; i < maxWidths.length; i++) {
            if (breakpoint?.max == maxWidths[i]) {
                if (i === 0) {
                    breakpoint.min = 0;
                } else {
                    breakpoint.min = maxWidths[i - 1] + 1;
                }
                break;
            }
        }
    }
};

// Given a BREAKPOINTS object, will create a "max" breakpoint
// going from the largest breakpoint's max value to infinity
const addMaxBreakpoint = function (breakpoints : IMainBreakpoints, maxWidths : number[]) {
    if (!maxWidths || maxWidths.length === 0) {
        return;
    }
    const largestBreakpoint = maxWidths[maxWidths.length - 1];
    if(!isNumeric(largestBreakpoint)) return;
    breakpoints.max = {
        min: largestBreakpoint + 1,
        max: Infinity
    };
};


// Given a raw BREAKPOINTS object (with simple ints for max values), 
// converts to a fully normalized BREAKPOINTS object with breakpoint objects for values.
const normalize = function (BREAKPOINTS : IMainBreakpoints) {
    // Normalize the BREAKPOINTS object
    const maxWidths = setMaxWidths(BREAKPOINTS.all);
    setMinWidths(BREAKPOINTS.all, maxWidths);
    addMaxBreakpoint(BREAKPOINTS, maxWidths);
};

/***
 * update current media and return the name of current breakpoint
 */
export const update  = function(opts? : {width?: number}) : string | null{
    const width = isNumeric(opts?.width) ? opts?.width : Dimensions.get('window').width; // Window width
    if (!width) {
        return null;
    }
    const _breakpoints = BREAKPOINTS.all;
    for (let name in _breakpoints) {
        const breakpoint = _breakpoints[name as keyof IBreakpoints];
        if(!breakpoint || !breakpoint?.max || !breakpoint?.min) continue;
        // Detect which BREAKPOINTS have been entered and which ones have been left.
        if (width <= breakpoint.max && width >= breakpoint.min) {
            BREAKPOINTS.current = breakpoint;
            return name;
        }
    }
    return null;
}


/***
 * initialise la gestion des breakpoints
 */
export function initBreakPoints(){
    const width = Dimensions.get('window').width;
    normalize(BREAKPOINTS);
    for (let name in BREAKPOINTS.all) {
        const breakpoint = BREAKPOINTS.all[name as keyof IBreakpoints];
        if(!(breakpoint) || !breakpoint?.max || !breakpoint?.min) continue;
        if (width <= breakpoint.max && width >= breakpoint.min) {
            BREAKPOINTS.current = breakpoint;
            break;
        } 
    }
}

/*** retourne le medié courant à partir de la width passée en paramètre
 * @param {number}, la valeur de la taille du window dont on veut retourner le media
 */

export const getCurrentMedia = (width? : number) : keyof IBreakpoints | ''=>{
    width = width && width > 300 ? width : Dimensions.get("window").width;
    for(let i in BREAKPOINTS.all){
        const breakpoint = BREAKPOINTS.all[i as keyof IBreakpoints];
        if(!breakpoint || !breakpoint?.max || !breakpoint?.min) continue;
        if(width <= breakpoint.max) return i as keyof IBreakpoints;
    }
    return BREAKPOINTS.current?.name || "";
}

export default BREAKPOINTS;