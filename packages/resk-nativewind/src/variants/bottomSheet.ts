import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsGeneratedColors } from "./colors/generated";
import { classes } from "./classes";

const bottomSheet = tv({
  slots: {
    container: "absolute end-0 bottom-0 w-full shadow-xl px-2 transition-transform duration-300 ease-in-out",
    contentContainer: "w-full h-full",
    portal: "",
  },
  variants: {
    withBackdrop: {
      true: {
        portal: classes.backdrop
      },
      false: {
        portal: "",
      },
    },
    visible: {
      true: {
        //portal: "animate-slide-in-bottom",
        container: "translate-y-0",
      },
      false: {
        container: "tranlate-y-full",
      },
    },
    background: VariantsFactory.create<typeof VariantsGeneratedColors.surface, { container: string }>(VariantsGeneratedColors.surface, (value) => {
      return {
        container: value,
      };
    }),
    ...VariantsFactory.createAll<{ container: string }>((value) => {
      return {
        container: value,
      };
    }),
  },
  defaultVariants: {
    background: "surface",
    roundedTop: "10px",
    minHeight: "40%",
    maxHeight: "70%",
    easing: "ease-in-out",
    withBackdrop: true,
  },
  compoundVariants: [],
});

export default bottomSheet;

export type IVariantPropsBottomSheet = VariantProps<typeof bottomSheet>;
