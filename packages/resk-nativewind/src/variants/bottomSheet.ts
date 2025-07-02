import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { classes } from "./classes";
import { transitionEasing } from "./variantsFactory/transitions";

const bottomSheet = tv({
  slots: {
    container: "relative w-full shadow-xl px-2",
    contentContainer: "w-full h-full",
    portal: "flex flex-col flex-1 justify-end transform translate-y-full transition",
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
        portal: "translate-y-0",
      },
      false: {
        portal: "tranlate-y-full",
      },
    },
    background: VariantsFactory.create<typeof VariantsColors.surface, { container: string }>(VariantsColors.surface, (value) => {
      return {
        container: value,
      };
    }),
    ...VariantsFactory.createTransitionsVariants<{ portal: string }>((value) => {
      return { portal: value };
    }),
    transitionEasing: VariantsFactory.createTransitionEasingVariants<{ portal: string }>((value) => {
      return { portal: value };
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
    withBackdrop: true,
    transitionDuration: 300,
    transitionEasing: "ease-in-out",
  },
});

const v = VariantsFactory.createTransitionsVariants<{ portal: string }>((value) => {
  return { portal: value };
});
export default bottomSheet;

export type IVariantPropsBottomSheet = VariantProps<typeof bottomSheet>;
