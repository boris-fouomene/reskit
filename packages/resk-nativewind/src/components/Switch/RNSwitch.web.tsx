import { SwitchProps } from "react-native";
import { Div } from "@html/Div";
/***
 * @see : https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/Switch/index.js
 */
export default function NativeSwitch({ value, ...props }: SwitchProps) {
    return <Div className="relative inline-block w-11 h-5">
        <input checked type="checkbox" className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" />
        <label className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer">
        </label>
    </Div>
}