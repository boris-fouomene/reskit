import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { classes } from "./classes";

const bottomSheet = tv({
  slots: {
    portal: "",
    portalBackdrop: "",
    base: "absolute bottom-0 left-0 right-0 transform transition-transform ease-out",
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
        portal: "",
        base: "translate-y-0"
      },
      false: {
        portal: "",
        base: "translate-y-full"
      }
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
    transitionDuration: VariantsFactory.createTransitionDuration<{ base: string, portal: string }>((value) => {
      return { base: value, portal: value };
    }),
    transitionDelay: VariantsFactory.createTransitionDelay<{ base: string, portal: string }>((value) => {
      return { base: value, portal: value };
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
