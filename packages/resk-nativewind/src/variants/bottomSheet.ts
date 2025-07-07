import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { classes } from "./classes";

const bottomSheet = tv({
  slots: {
    portal: "flex flex-col flex-1 w-full h-full justify-end",
    portalBackdrop: "",
    base: "absolute left-0 bottom-0 w-full h-full",
    content: "w-full h-full",
    appBar: "w-full", //appBar classes options
  },
  variants: {
    withBackdrop: {
      true: {
        portal: classes.backdrop,
      },
    },
    visible: {
      true: {
        base: "translate-y-0",
      },
      false: {
        base: "translate-y-full",
      },
    },
    ...VariantsFactory.createAll<{ base: string }>((value) => {
      return {
        base: value,
      };
    }),
    colorScheme: VariantsFactory.create<typeof VariantsColors.surface, { base: string }>(VariantsColors.surface, (value, colorName) => {
      return {
        base: value,
      };
    }),
    appBarColorScheme: VariantsFactory.create<typeof VariantsColors.surface, { appBar: string }>(VariantsColors.surface, (value, colorName) => {
      return {
        appBar: value,
      };
    }),
  },
  defaultVariants: {
    colorScheme: "surface",
    roundedTop: "10px",
    minHeight: "40%",
    height: "70%",
    withBackdrop: true,
    transitionDuration: 300,
  },
});
export default bottomSheet;

export type IVariantPropsBottomSheet = VariantProps<typeof bottomSheet>;
