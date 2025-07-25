import { tv, VariantProps } from "tailwind-variants";
import { VariantsOptionsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { classes } from "./classes";

export const bottomSheetVariant = tv({
  slots: {
    contentContainer: "absolute flex-1 flex w-full h-full flex-col-reverse",
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
    ...VariantsOptionsFactory.createAll<{ content: string }>((value) => {
      return {
        content: value,
      };
    }),
    colorScheme: VariantsOptionsFactory.create<typeof VariantsColors.surface, { content: string }>(VariantsColors.surface, (value, colorName) => {
      return {
        content: value,
      };
    }),
    appBarColorScheme: VariantsOptionsFactory.create<typeof VariantsColors.surface, { appBar: string }>(VariantsColors.surface, (value, colorName) => {
      return {
        appBar: value,
      };
    }),
  },
  defaultVariants: {
    colorScheme: "surface",
    roundedTop: "10px",
    minHeight: "half",
    maxHeight: "threeQuarters",
    withBackdrop: true,
    transitionDuration: 300,
  },
});

export type IBottomSheetVariant = VariantProps<typeof bottomSheetVariant>;
