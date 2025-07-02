export * from "./colors/generated";
import surface from "./surface";
import text from "./text";
import iconButton from "./iconButton";
import heading from "./heading";
import divider from "./divider";
import icon from "./icon";
import badge from "./badge";
import all from "./all";
import button from "./button";
import activityIndicator from "./activityIndicator";
import modal from "./modal";
import menu from "./menu";
import checkbox from "./checkbox";
import progressBar from "./progressBar";
import textInput from "./textInput";
import { tv } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import bottomSheet from "./bottomSheet";
import dropdownItem from "./dropdownItem";
export const variants = {
    all,
    bottomSheet,
    textInput,
    iconColor: tv({
        variants: {
            iconColor: VariantsColors.textWithForegroundWithImportant
        }
    }),
    menu,
    icon,
    heading,
    iconButton,
    surface,
    badge,
    text,
    divider,
    button,
    activityIndicator,
    modal,
    checkbox,
    progressBar,
    dropdownItem,
}

export * from "./types";

export * from "./colors";

export * from "./variantsFactory";

export * from "./colors/generated";