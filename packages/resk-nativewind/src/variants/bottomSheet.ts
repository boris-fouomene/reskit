import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { classes } from "./classes";

const bottomSheet = tv({
  slots: {
    contentContainer: "relative flex flex-col flex-1 w-full h-full justify-end",
    modalBackdrop: "",
    content: "w-full h-full",
    appBar: "w-full", //appBar classes options
  },
  variants: {
    withBackdrop: {
      true: {
        modalBackdrop: classes.backdrop,
      },
    },
    ...VariantsFactory.createAll<{ content: string }>((value) => {
      return {
        content: value,
      };
    }),
    colorScheme: VariantsFactory.create<typeof VariantsColors.surface, { content: string }>(VariantsColors.surface, (value, colorName) => {
      return {
        content: value,
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
