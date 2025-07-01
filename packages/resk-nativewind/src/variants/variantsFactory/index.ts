import { roundeClasses, roundedBottomClasses, roundedBottomLeftRadiusClasses, roundedBottomRightRadiusClasses, roundedRightClasses, roundedTopClasses, roundedTopLeftRadiusClasses, roundedTopRightRadiusClasses, roundeLeftClasses } from "./rounded";
import { marginClasses, padding2marginClasses, paddingClasses } from "./padding2margin";
import { borderBottomWidthVariants, borderLeftWidthVariants, borderRightWidthVariants, borderStyleClasses, borderTopWidthVariants, borderWidthVariants, borderInlineWidthVariants, borderBlockWidthVariants, allBorderWidthVariants } from "./border";
import { ShadowColorsClasses } from "./shadow";
import { IconSizes, textSizes } from "./textSizes";
import { fontWeightClasses } from "./fontWeight";
import { textAlignClasses } from "./textAlignClasses";
import { VariantsGeneratedColors } from "@variants/colors/generated";
import { width2heightClasses } from "./width2height";
import { activeRingSize, focusRingSize, hoverRingSize, ringClasses } from "./ring";
import { scalesClasses } from "./scales";
import { IClassName } from "@src/types";
import { transitionEasing, transitions } from "./transitions";

type IVariantFactoryMutator<InputType extends Record<string | number, unknown>, ResultType = string, VariantGroupName = any> = (value: InputType[keyof InputType], variantName: keyof InputType, variantGroupName?: VariantGroupName) => ResultType;

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
  create: function <InputType extends Record<string, unknown>, ResultType = string, VariantGroupName = any>(input: InputType, variantMutator?: IVariantFactoryMutator<InputType, ResultType>, variantGroupName?: VariantGroupName) {
    variantMutator = typeof variantMutator == "function" ? variantMutator : (value) => value as ResultType;
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => {
        return [key, variantMutator(value as any, key as keyof InputType, variantGroupName)];
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
  createMultipleVariants: function <T extends Record<string, Record<number | string, IClassName>>, ResultType = string>(multiVariants: T, variantMutator?: IVariantFactoryMutator<T[keyof T], ResultType>): Record<keyof T, Record<keyof T[keyof T], ResultType>> {
    const r = {} as any;
    Object.entries(multiVariants).forEach(([key, value]) => {
      r[key] = VariantsFactory.create<T[keyof T], ResultType, keyof T>(value as any, variantMutator, key);
    });
    return r;
  },
  createPaddingsVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof paddingClasses)[keyof typeof paddingClasses], ResultType>) {
    return VariantsFactory.createMultipleVariants<typeof paddingClasses, ResultType>(paddingClasses, variantMutator);
  },
  createScalesVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof scalesClasses)[keyof typeof scalesClasses], ResultType>) {
    return VariantsFactory.createMultipleVariants<typeof scalesClasses, ResultType>(scalesClasses, variantMutator as any);
  },
  createMarginsVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof marginClasses)[keyof typeof marginClasses], ResultType>) {
    return VariantsFactory.createMultipleVariants<typeof marginClasses, ResultType>(marginClasses, variantMutator as any);
  },
  createWidth2HeightVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof width2heightClasses)[keyof typeof width2heightClasses], ResultType>) {
    return VariantsFactory.createMultipleVariants<typeof width2heightClasses, ResultType>(width2heightClasses, variantMutator);
  },
  createPadding2MarginVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof padding2marginClasses)[keyof typeof padding2marginClasses], ResultType>) {
    return VariantsFactory.createMultipleVariants<typeof padding2marginClasses, ResultType>(padding2marginClasses, variantMutator);
  },

  createFontWeightVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof fontWeightClasses, ResultType>) {
    return VariantsFactory.create<typeof fontWeightClasses, ResultType>(fontWeightClasses, variantMutator);
  },
  createBorderStyleVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderStyleClasses, ResultType>) {
    return VariantsFactory.create<typeof borderStyleClasses, ResultType>(borderStyleClasses, variantMutator);
  },
  createShadowColorsVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ShadowColorsClasses, ResultType>) {
    return VariantsFactory.create<typeof ShadowColorsClasses, ResultType>(ShadowColorsClasses, variantMutator);
  },
  createAll: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof allVariantClasses)[keyof typeof allVariantClasses], ResultType>): IVariantFactoryAll<ResultType> {
    const result: IVariantFactoryAll<ResultType> = {} as any;
    Object.keys(allVariantClasses).forEach((variantClassName) => {
      (result as any)[variantClassName] = VariantsFactory.create((allVariantClasses as any)[variantClassName], variantMutator);
    });
    return result;
  },
  createTextAlignVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textAlignClasses, ResultType>) {
    return VariantsFactory.create<typeof textAlignClasses, ResultType>(textAlignClasses, variantMutator);
  },
  createBorderWidthVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderWidthVariants, ResultType>) {
    return VariantsFactory.create<typeof borderWidthVariants, ResultType>(borderWidthVariants, variantMutator);
  },
  createBorderBottomWidthVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderBottomWidthVariants, ResultType>) {
    return VariantsFactory.create<typeof borderBottomWidthVariants, ResultType>(borderBottomWidthVariants, variantMutator);
  },
  createBorderTopWidthVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderTopWidthVariants, ResultType>) {
    return VariantsFactory.create<typeof borderTopWidthVariants, ResultType>(borderTopWidthVariants, variantMutator);
  },
  createBorderLeftWidthVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderLeftWidthVariants, ResultType>) {
    return VariantsFactory.create<typeof borderLeftWidthVariants, ResultType>(borderLeftWidthVariants, variantMutator);
  },
  createBorderRightWidthVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderRightWidthVariants, ResultType>) {
    return VariantsFactory.create<typeof borderRightWidthVariants, ResultType>(borderRightWidthVariants, variantMutator);
  },
  createBorderXWidthVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderInlineWidthVariants, ResultType>) {
    return VariantsFactory.create<typeof borderInlineWidthVariants, ResultType>(borderInlineWidthVariants, variantMutator);
  },
  createBorderYWidthVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderBlockWidthVariants, ResultType>) {
    return VariantsFactory.create<typeof borderBlockWidthVariants, ResultType>(borderBlockWidthVariants, variantMutator);
  },
  createAllBorderWidthVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof allBorderWidthVariants)[keyof typeof allBorderWidthVariants], ResultType>) {
    return VariantsFactory.createMultipleVariants<typeof allBorderWidthVariants, ResultType>(allBorderWidthVariants, variantMutator);
  },
  createTransitionsVariants: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof transitions)[keyof typeof transitions], ResultType>) {
    return VariantsFactory.createMultipleVariants<typeof transitions, ResultType>(transitions, variantMutator);
  },
  createTransitionEasing: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof transitionEasing, ResultType>) {
    return VariantsFactory.create<typeof transitionEasing, ResultType>(transitionEasing, variantMutator);
  },
};
const allVariantClasses = {
  rounded: roundeClasses,
  roundedLeft: roundeLeftClasses,
  roundedRight: roundedRightClasses,
  roundedTop: roundedTopClasses,
  roundedBottom: roundedBottomClasses,
  roundedTopLeft: roundedTopLeftRadiusClasses,
  roundedTopRight: roundedTopRightRadiusClasses,
  roundedBottomLeft: roundedBottomLeftRadiusClasses,
  roundedBottomRight: roundedBottomRightRadiusClasses,
  shadowColor: ShadowColorsClasses,
  borderStyle: borderStyleClasses,
  borderColor: VariantsGeneratedColors.borderColor,
  ...width2heightClasses,
  ringColor: VariantsGeneratedColors.ringColors,
  activeRingColor: VariantsGeneratedColors.activeRingColors,
  hoverRingColor: VariantsGeneratedColors.hoverRingColors,
  ringSize: ringClasses,
  hoverRingSize: hoverRingSize,
  activeRingSize: activeRingSize,
  focusRingSize: focusRingSize,
  ...scalesClasses,
  ...allBorderWidthVariants,
  ...padding2marginClasses,
};
type IVariantFactoryAll<ResultType = string> = {
  [key in keyof typeof allVariantClasses]: Record<keyof (typeof allVariantClasses)[key], ResultType>;
};
