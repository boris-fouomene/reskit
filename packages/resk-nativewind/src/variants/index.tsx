export * from "./generated-variants-colors";
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
import { VariantsGeneratedColors } from "./generated-variants-colors";
export const variants = {
    all,
    textInput,
    iconColor: tv({
        variants: {
            iconColor: VariantsGeneratedColors.textWithForegroundWithImportant
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
}

export * from "./types";

export * from "./colors";

export * from "./variantsFactory";

export * from "./generated-variants-colors";