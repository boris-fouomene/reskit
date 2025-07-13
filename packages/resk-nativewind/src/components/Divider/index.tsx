import { IHtmlDivProps } from "@html/types";
import { Div } from "@html/Div";
import { cn } from "@utils/cn";
import { IDividerVariant } from "@variants/divider";
import { dividerVariant } from "@variants/divider";
/**
 * The `Divider` component renders a horizontal separation line on the page.
 * It can be customized with styles and className
 *
 * @component Divider
 * 
 * @example
 * Here’s an example of how to use the `Divider` component:
 *
 * ```tsx
 * import Divider from '@resk/nativewind'; // Adjust the import path as necessary 
 * const MyComponent = () => {
 *   return (
 *     <Div>
 *       <Divider style={{ height: 2 }} />
 *       <Divider disabled style={{ height: 1 }} />
 *     </Div>
 *   );
 * };
 * 
 * export default MyComponent;
 * ```
 * 
 * @note 
 * The color of the `Divider` is determined by the baground color from the class name
 * in your application for the color to be applied.
 */
export function Divider({ disabled, variant, className, ...rest }: IHtmlDivProps & { variant?: IDividerVariant }) {
  return (
    <Div
      testID="resk-divider"
      {...rest}
      className={cn("bg-outline dark:bg-dark-outline w-full h-[1px]", dividerVariant(variant), className)}
    />
  );
};

Divider.displayName = "Divider";