import { tv, type VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
const icon = tv({
    variants: {
        ...VariantsFactory.createPadding2Margin(),
        shadow: VariantsFactory.createShadow(),
        activeShadow: VariantsFactory.createActiveShadow(),
        hoverShadow: VariantsFactory.createHoverShadow(),
        shadowColor: VariantsFactory.createShadowColor(),
        activeShadowColor: VariantsFactory.createActiveShadowColor(),
        hoverShadowColor: VariantsFactory.createHoverShadowColor(),
        opacity: VariantsFactory.createOpacity(),
        activeOpacity: VariantsFactory.createActiveOpacity(),
        hoverOpacity: VariantsFactory.createHoverOpacity(),
        color: VariantsColors.icon,
        size: VariantsFactory.createIconSize(),
        nativeSize: VariantsFactory.createNativeIconSize(),
    }
});

export type IVariantPropsIcon = VariantProps<typeof icon>;

export default icon;