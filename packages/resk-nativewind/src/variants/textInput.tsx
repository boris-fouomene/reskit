import { tv, VariantProps } from "tailwind-variants";

const textInput = tv({
    slots: {
        input: "",
        inputContainer: "",
        container: "",
        leftContainer: "",
        rightContainer: "",
        contentContainer: "",
        icon: "",
        label: ""
    },
    variants: {
        focus: {
            true: {

            }
        },
        error: {
            true: {

            }
        }
    }
});

export type IVariantPropsTextInput = VariantProps<typeof textInput>;

export default textInput;