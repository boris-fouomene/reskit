import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsGeneratedColors } from "./generated-variants-colors";

const bottomSheet = tv({
  slots: {
    container: "absolute start-0 end-0 bottom-0 w-full shadow-xl bottom-0 px-2 transform transition-transform duration-300 ease-out",
    contentContainer: "w-full h-full",
    portal: "", //"flex flex-col flex-1 justify-end",
  },
  variants: {
    visible: {
      true: {
        container: "translate-y-0 transform-none",
      },
      false: {
        container: "translate-y-full",
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
  },
});

export default bottomSheet;

export type IVariantPropsBottomSheet = VariantProps<typeof bottomSheet>;
