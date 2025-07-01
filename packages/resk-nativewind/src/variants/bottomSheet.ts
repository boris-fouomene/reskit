import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsGeneratedColors } from "./colors/generated";
import { classes } from "./classes";

const bottomSheet = tv({
  slots: {
    container: "relative w-full shadow-xl px-2",
    contentContainer: "w-full h-full",
    portal: "justify-end transform translate-y-full transition duration-300 ease-in-out",
  },
  variants: {
    withBackdrop: {
      true: {
        portal: classes.backdrop,
      },
      false: {
        portal: "",
      },
    },
    visible: {
      true: {
        portal: "translate-y-0 flex flex-col flex-1",
      },
      false: {
        portal: "tranlate-y-full",
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
