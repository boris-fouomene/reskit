import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsGeneratedColors } from "./colors/generated";

const bottomSheet = tv({
  slots: {
    container: "start-0 end-0 bottom-0 w-full shadow-xl px-2",
    contentContainer: "w-full h-full",
    portal: "", //"flex flex-col-reverse flex-1", //"flex flex-col flex-1 justify-end",
  },
  variants: {
    visible: {
      true: {
        container: "animate-slide-in-bottom",
      },
      false: {
        container: "animate-slide-out-bottom",
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
    ...VariantsFactory.createWidth2HeightVariants<{ container: string; contentContainer: string }>((value) => {
      return {
        container: value,
        contentContainer: "",
      };
    }),
  },
  defaultVariants: {
    background: "surface",
    roundedTop: "10px",
    minHeight: "40%",
    maxHeight: "70%",
    easing: "ease-in-out",
  },
  compoundVariants: [],
});

export default bottomSheet;

export type IVariantPropsBottomSheet = VariantProps<typeof bottomSheet>;
