import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { classes } from "./classes";

const bottomSheet = tv({
  slots: {
    base: "absolute web:fixed bottom-0 left-0 right-0 transform transition-transform ease-out w-full px-2",
    portal: "absolute web:fixed inset-0",
    //portal: "flex flex-col flex-1 justify-end transform transition-transform translate-y-full",
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
        base: "tranlate-y-full",
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
    height: "70%",
    withBackdrop: true,
    transitionDuration: 300,
    transitionEasing: "ease-in-out",
  },
});
export default bottomSheet;

export type IVariantPropsBottomSheet = VariantProps<typeof bottomSheet>;
