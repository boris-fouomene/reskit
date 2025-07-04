import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { classes } from "./classes";
import appBarVariant from "@variants/appBar";

const bottomSheet = tv({
  slots: {
    base: "relative w-full shadow-xl px-2",
    portal: "flex flex-col flex-1 justify-end transform translate-y-full transition",
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
        portal: "translate-y-0",
      },
      false: {
        portal: "tranlate-y-full",
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
    ...VariantsFactory.createTransitions<{ portal: string }>((value) => {
      return { portal: value };
    }),
    transitionEasing: VariantsFactory.createTransitionEasing<{ portal: string }>((value) => {
      return { portal: value };
    }),
  },
  defaultVariants: {
    colorScheme: "surface",
    roundedTop: "10px",
    minHeight: "40%",
    maxHeight: "70%",
    withBackdrop: true,
    transitionDuration: 300,
    transitionEasing: "ease-in-out",
  },
});
export default bottomSheet;

export type IVariantPropsBottomSheet = VariantProps<typeof bottomSheet>;
