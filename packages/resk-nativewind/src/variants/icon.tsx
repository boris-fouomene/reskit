import { tv, type VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
const icon = tv({
    variants: {
        ...VariantsFactory.createAll(),

        color: VariantsColors.icon,
        size: VariantsFactory.createIconSize(),
        nativeSize: VariantsFactory.createNativeIconSize(),
        hoverColor: VariantsFactory.createHoverIconColor(),
        activeColor: VariantsFactory.createActiveIconColor(),

        error: {
            true: "",
        },
        waring: {
            true: ""
        },
        success: {
            true: "",
        },
    },
    compoundVariants: [
        {
            color: "error",
            error: true,
        },
        {
            color: "warning",
            warning: true,
        },
        {
            color: "success",
            success: true,
        }
    ]
});

export type IVariantPropsIcon = VariantProps<typeof icon>;

export default icon;