import { roundeClasses } from "./rounded";
import { marginClasses, padding2marginClasses, paddingClasses } from "./padding2margin";
import { borderClasses } from "./border";
import { ShadowColorsClasses } from "./shadow";
import { IconSizes, textSizes } from "./textSizes";
import { allScaleVariants } from "./scales";
import { fontWeightClasses } from "./fontWeight";
import { textAlignClasses } from "./textAlignClasses";

type IVariantFactoryMutator<InputType extends Record<string, unknown>, ResultType = string> = (value: InputType[keyof InputType], variantName: keyof InputType) => ResultType;

/**
 * A utility factory for generating and transforming variant objects in a type-safe manner.
 *
 * `VariantsFactory` provides generic methods to create, mutate, and compose variant mappings,
 * such as style or class variants for design systems (e.g., Tailwind or NativeWind).
 * It supports custom mutator functions for flexible value transformation, and includes
 * specialized helpers for common variant categories (text sizes, icon sizes, rounded, etc.).
 *
 * @remarks
 * - All methods are generic and support custom input and output types.
 * - The `create` method is the core utility, accepting any object and an optional mutator.
 * - Specialized methods (e.g., `createTextSizes`, `createIconSizes`) use predefined variant sets.
 * - Useful for generating design system variants, utility classes, or mapping values in a consistent way.
 *
 * @typeParam InputType - The type of the input object for variant creation.
 * @typeParam ResultType - The type of the result values after applying the mutator (defaults to `string`).
 *
 * @example
 * ```typescript
 * // Basic usage with default mutator (identity)
 * const variants = VariantsFactory.create({ primary: "bg-blue-500", secondary: "bg-gray-500" });
 * // Result: { primary: "bg-blue-500", secondary: "bg-gray-500" }
 *
 * // Using a custom mutator to append a prefix
 * const variantsWithPrefix = VariantsFactory.create(
 *   { small: "p-2", large: "p-6" },
 *   (value, key) => `tw-${value}`
 * );
 * // Result: { small: "tw-p-2", large: "tw-p-6" }
 * ```
 */
export const VariantsFactory = {
  /**
   * Creates a new variants object by applying a mutator function to each value in the input object.
   *
   * This utility is useful for generating style or class variants in a type-safe way, such as for Tailwind or NativeWind.
   * You can provide a custom mutator function to transform each variant value, or omit it to return the original values.
   *
   * @typeParam InputType - The type of the input object, where each key is a variant name and each value is the variant value.
   * @typeParam ResultType - The type of the result values after applying the mutator (defaults to `string`).
   *
   * @param input - The input object containing variant definitions.
   * @param variantMutator - Optional. A function that receives each value and its key, and returns a transformed value.
   *                         If not provided, the identity function is used (returns the value as-is).
   *
   * @returns A new object with the same keys as `input`, where each value is the result of the `variantMutator`.
   *
   * @example
   * ```typescript
   * // Basic usage with default mutator (identity)
   * const variants = VariantsFactory.create({ primary: "bg-blue-500", secondary: "bg-gray-500" });
   * // Result: { primary: "bg-blue-500", secondary: "bg-gray-500" }
   *
   * // Using a custom mutator to append a prefix
   * const variantsWithPrefix = VariantsFactory.create(
   *   { small: "p-2", large: "p-6" },
   *   (value, key) => `tw-${value}`
   * );
   * // Result: { small: "tw-p-2", large: "tw-p-6" }
   *
   * // Using with a type-safe input and custom result type
   * const input = { rounded: "rounded-full", square: "rounded-none" } as const;
   * const result = VariantsFactory.create<typeof input, number>(
   *   input,
   *   (value, key) => value.length
   * );
   * // Result: { rounded: 12, square: 12 }
   * ```
   *
   * @remarks
   * - This function is generic and works with any object shape.
   * - The mutator function receives both the value and the key for maximum flexibility.
   * - Useful for generating design system variants, utility classes, or mapping values.
   */
  create: function <InputType extends Record<string, unknown>, ResultType = string>(input: InputType, variantMutator?: IVariantFactoryMutator<InputType, ResultType>) {
    variantMutator = typeof variantMutator == "function" ? variantMutator : (value) => value as ResultType;
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => {
        return [key, variantMutator(value as any, key as keyof InputType)];
      })
    ) as Record<keyof InputType, ResultType>;
  },
  createTextSizes: function createRoundedVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textSizes, ResultType>) {
    return VariantsFactory.create<typeof textSizes, ResultType>(textSizes, variantMutator);
  },
  createIconSizes: function createRoundedVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textSizes, ResultType>) {
    return VariantsFactory.create<typeof IconSizes, ResultType>(IconSizes, variantMutator);
  },
  createRoundedVariants: function createRoundedVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof roundeClasses, ResultType>) {
    return VariantsFactory.create<typeof roundeClasses, ResultType>(roundeClasses, variantMutator);
  },
  createPaddingsVariants: function createRoundedVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof paddingClasses)[keyof typeof paddingClasses], ResultType>): Record<keyof typeof paddingClasses, Record<keyof (typeof paddingClasses)[keyof typeof paddingClasses], string>> {
    const r = {} as any;
    Object.entries(paddingClasses).forEach(([key, value]) => {
      r[key] = VariantsFactory.create<(typeof paddingClasses)[keyof typeof paddingClasses], ResultType>(value, variantMutator);
    });
    return r;
  },
  createMarginsVariants: function createRoundedVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof marginClasses)[keyof typeof marginClasses], ResultType>): Record<keyof typeof marginClasses, Record<keyof (typeof marginClasses)[keyof typeof marginClasses], string>> {
    const r = {} as any;
    Object.entries(marginClasses).forEach(([key, value]) => {
      r[key] = VariantsFactory.create<(typeof marginClasses)[keyof typeof marginClasses], ResultType>(value, variantMutator);
    });
    return r;
  },
  createPadding2MarginVariants: function createRoundedVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof padding2marginClasses)[keyof typeof padding2marginClasses], ResultType>): Record<keyof typeof padding2marginClasses, Record<keyof (typeof padding2marginClasses)[keyof typeof padding2marginClasses], string>> {
    const r = {} as any;
    Object.entries(padding2marginClasses).forEach(([key, value]) => {
      r[key] = VariantsFactory.create<(typeof padding2marginClasses)[keyof typeof padding2marginClasses], ResultType>(value, variantMutator);
    });
    return r;
  },
  createFontWeightVariants: function createFontWeightVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof fontWeightClasses, ResultType>) {
    return VariantsFactory.create<typeof fontWeightClasses, ResultType>(fontWeightClasses, variantMutator);
  },
  createBorderVariants: function createBorderVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses, ResultType>) {
    return VariantsFactory.create<typeof borderClasses, ResultType>(borderClasses, variantMutator);
  },
  createShadowColorsVariants: function createShadowColorsVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ShadowColorsClasses, ResultType>) {
    return VariantsFactory.create<typeof ShadowColorsClasses, ResultType>(ShadowColorsClasses, variantMutator);
  },
  scalesVariants: allScaleVariants,
  createScalesVariants: function createScaleHoverVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof allScaleVariants, ResultType>) {
    return VariantsFactory.create<typeof allScaleVariants, ResultType>(allScaleVariants, variantMutator);
  },
  createAll: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof allVariantClasses)[keyof typeof allVariantClasses], ResultType>): IVariantFactoryAll<ResultType> {
    const result: IVariantFactoryAll<ResultType> = {} as any;
    Object.keys(allVariantClasses).forEach((variantClassName) => {
      (result as any)[variantClassName] = VariantsFactory.create((allVariantClasses as any)[variantClassName], variantMutator);
    });
    return result;
  },
  createTextAlignVariants: function createTextAlignVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textAlignClasses, ResultType>) {
    return VariantsFactory.create<typeof textAlignClasses, ResultType>(textAlignClasses, variantMutator);
  },
};
const allVariantClasses = {
  border: borderClasses,
  rounded: roundeClasses,
  shadowColor: ShadowColorsClasses,
  ...padding2marginClasses,
};
type IVariantFactoryAll<ResultType = string> = {
  [key in keyof typeof allVariantClasses]: Record<keyof (typeof allVariantClasses)[key], ResultType>;
};
