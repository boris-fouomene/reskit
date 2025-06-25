import { tv, VariantProps } from "tailwind-variants";

const bottomSheet = tv({
  slots: {
    container: "absolute start-0 end-0 bottom-0 w-full min-h-[40%] max-h-[70%] shadow-xl bottom-0 px-2 transform transition duration-300 ease-in-out ",
    contentContainer: "w-full relative flex",
    portal: "",
  },
  variants: {
    visible: {
      true: {
        container: "translate-y-0",
      },
      false: {
        container: "translate-y-full",
      },
    },
  },
});

export default bottomSheet;

export type IVariantPropsBottomSheet = VariantProps<typeof bottomSheet>;
