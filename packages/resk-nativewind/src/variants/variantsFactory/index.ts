import { roundedClasses } from "./rounded";
import { marginClasses, padding2marginClasses, paddingClasses } from "./padding2margin";
import { borderClasses } from "./border";
import { shadowClasses } from "./shadow";
import { textSizes } from "./textSizes";
import { iconSizes } from "./iconSizes";
import { fontWeightClasses } from "./fontWeight";
import { textAlignClasses } from "./textAlignClasses";
import { VariantsColors } from "@variants/colors/generated";
import { width2heightClasses } from "./width2height";
import { ringWidthClasses } from "./ring";
import { scalesClasses } from "./scales";
import { IClassName } from "@src/types";
import { transitions } from "./transitions";
import { isNonNullString, typedEntries } from "@resk/core/utils";
import { opacityClasses } from "./opacity";
import { outlineClasses } from "./outline";
import { gapClasses } from "./gap";
import { flexClasses } from "./flex";
import { iconVariants, textVariants } from "./text2icons";

const allShadowColors = {
  shadowColor: VariantsColors.shadow,
  activeShadowColor: VariantsColors.activeShadow,
  hoverShadowColor: VariantsColors.hoverShadow,
  hoverBackground: VariantsColors.hoverBackground,
  activeBackground: VariantsColors.activeBackground,
} as const;
const allVariantsOptions = {
  ...roundedClasses,
  ...gapClasses,
  ...opacityClasses,
  ...shadowClasses,
  ...borderClasses,
  ...outlineClasses,
  ...allShadowColors,
  ...flexClasses,

  borderColor: VariantsColors.borderColor,
  borderTopColor: VariantsColors.borderTopColor,
  borderBottomColor: VariantsColors.borderBottomColor,
  borderLeftColor: VariantsColors.borderLeftColor,
  borderRightColor: VariantsColors.borderRightColor,
  hoverBorderColor: VariantsColors.hoverBorderColor,
  activeBorderColor: VariantsColors.activeBorderColor,

  ...width2heightClasses,

  ringColor: VariantsColors.ringColors,
  activeRingColor: VariantsColors.activeRingColors,
  hoverRingColor: VariantsColors.hoverRingColors,
  focusRingColor: VariantsColors.focusRingColors,
  ...ringWidthClasses,

  ...scalesClasses,
  ...borderClasses,
  ...padding2marginClasses,
} as const;

/**
 * A utility factory for generating and transforming variant objects in a type-safe manner.
 *
 * `VariantsOptionsFactory` provides generic methods to create, mutate, and compose variant mappings,
 * such as style or class variants for design systems (e.g., Tailwind or NativeWind).
 * It supports custom mutator functions for flexible value transformation, and includes
 * specialized helpers for common variant categories (text sizes, icon sizes, rounded, etc.).
 *
 * @remarks
 * - All methods are generic and support custom input and output types.
 * - The `create` method is the core utility, accepting any object and an optional mutator.
 * - Useful for generating design system variants, utility classes, or mapping values in a consistent way.
 *
 * @typeParam InputType - The type of the input object for variant creation.
 * @typeParam ResultType - The type of the result values after applying the mutator (defaults to `string`).
 *
 * @example
 * ```typescript
 * // Basic usage with default mutator (identity)
 * const variants = VariantsOptionsFactory.create({ primary: "bg-blue-500", secondary: "bg-gray-500" });
 * // Result: { primary: "bg-blue-500", secondary: "bg-gray-500" }
 *
 * // Using a custom mutator to append a prefix
 * const computed = VariantsOptionsFactory.create(
 *   { small: "p-2", large: "p-6" },
 *   (value, key) => `tw-${value}`
 * );
 * // Result: { small: "tw-p-2", large: "tw-p-6" }
 * ```
 */
export const VariantsOptionsFactory = {
  allVariantsOptions,
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
   * const variants = VariantsOptionsFactory.create({ primary: "bg-blue-500", secondary: "bg-gray-500" });
   * // Result: { primary: "bg-blue-500", secondary: "bg-gray-500" }
   *
   * // Using a custom mutator to append a prefix
   * const computed = VariantsOptionsFactory.create(
   *   { small: "p-2", large: "p-6" },
   *   (value, key) => `tw-${value}`
   * );
   * // Result: { small: "tw-p-2", large: "tw-p-6" }
   *
   * // Using with a type-safe input and custom result type
   * const input = { rounded: "rounded-full", square: "rounded-none" } as const;
   * const result = VariantsOptionsFactory.create<typeof input, number>(
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
  create: function <InputType extends Record<IVariantKey, any>, ResultType = string, VariantGroupName = any>(input: InputType, variantMutator?: IVariantFactoryMutator<InputType, ResultType, VariantGroupName>, compositeKey?: VariantGroupName) {
    variantMutator = typeof variantMutator == "function" ? variantMutator : (value) => value as ResultType;
    return Object.fromEntries(
      typedEntries(input).map(([key, value]) => {
        return [key, variantMutator(value as any, key, compositeKey)];
      })
    ) as Record<keyof InputType, ResultType>;
  },
  createCompositeSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof width2heightClasses.width, ResultType>) {
    return VariantsOptionsFactory.create<typeof width2heightClasses.width, ResultType>(width2heightClasses.width, (value, variantName, compositeKey) => {
      value = `${value} ${value.replaceAll("w-", "h-")}` as any;
      if (typeof variantMutator == "function") {
        return variantMutator(value, variantName, compositeKey);
      }
      return value as any;
    });
  },
  createSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof width2heightClasses.width, ResultType>) {
    return VariantsOptionsFactory.create<typeof width2heightClasses.width, ResultType>(width2heightClasses.width, (value, compositeKey) => {
      value = `${value} ${value.replaceAll("w-", "h-")}` as any;
      return typeof variantMutator == "function" ? variantMutator(value, compositeKey) : (value as any);
    });
  },
  createPadding: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.padding, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.padding, ResultType>(paddingClasses.padding, variantMutator);
  },
  createPaddingTop: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingTop, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingTop, ResultType>(paddingClasses.paddingTop, variantMutator);
  },
  createPaddingBottom: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingBottom, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingBottom, ResultType>(paddingClasses.paddingBottom, variantMutator);
  },
  createPaddingLeft: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingLeft, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingLeft, ResultType>(paddingClasses.paddingLeft, variantMutator);
  },
  createPaddingRight: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingRight, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingRight, ResultType>(paddingClasses.paddingRight, variantMutator);
  },
  createPaddingX: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingX, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingX, ResultType>(paddingClasses.paddingX, variantMutator);
  },
  createPaddingY: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingY, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingY, ResultType>(paddingClasses.paddingY, variantMutator);
  },
  createMargin: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.margin, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.margin, ResultType>(marginClasses.margin, variantMutator);
  },
  createMarginTop: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginTop, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginTop, ResultType>(marginClasses.marginTop, variantMutator);
  },
  createMarginBottom: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginBottom, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginBottom, ResultType>(marginClasses.marginBottom, variantMutator);
  },
  createMarginLeft: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginLeft, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginLeft, ResultType>(marginClasses.marginLeft, variantMutator);
  },
  createMarginRight: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginRight, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginRight, ResultType>(marginClasses.marginRight, variantMutator);
  },
  createMarginX: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginX, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginX, ResultType>(marginClasses.marginX, variantMutator);
  },
  createMarginY: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginY, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginY, ResultType>(marginClasses.marginY, variantMutator);
  },
  createTextSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textSizes.size, ResultType>) {
    return VariantsOptionsFactory.create<typeof textSizes.size, ResultType>(textSizes.size, variantMutator);
  },
  createNativeTextSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textSizes.nativeSize, ResultType>) {
    return VariantsOptionsFactory.create<typeof textSizes.nativeSize, ResultType>(textSizes.nativeSize, variantMutator);
  },
  createIconSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof iconSizes.size, ResultType>) {
    return VariantsOptionsFactory.create<typeof iconSizes.size, ResultType>(iconSizes.size, variantMutator);
  },
  createNativeIconSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof iconSizes.nativeSize, ResultType>) {
    return VariantsOptionsFactory.create<typeof iconSizes.nativeSize, ResultType>(iconSizes.nativeSize, variantMutator);
  },

  createBackgroundColor: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.background, ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.create<typeof VariantsColors.background, ResultType>(VariantsColors.background, variantMutator);
  },
  createHoverBackgroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverBackground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverBackground, ResultType>(VariantsColors.hoverBackground, variantMutator);
  },
  createActiveBackgroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeBackground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeBackground, ResultType>(VariantsColors.activeBackground, variantMutator);
  },
  createTextColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.text, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.text, ResultType>(VariantsColors.text, variantMutator);
  },
  createHoverTextColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverText, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverText, ResultType>(VariantsColors.hoverText, variantMutator);
  },
  createActiveTextColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeText, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeText, ResultType>(VariantsColors.activeText, variantMutator);
  },
  createTextForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.textForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.textForeground, ResultType>(VariantsColors.textForeground, variantMutator);
  },
  createHoverTextForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverTextForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverTextForeground, ResultType>(VariantsColors.hoverTextForeground, variantMutator);
  },
  createActiveTextForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeTextForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeTextForeground, ResultType>(VariantsColors.activeTextForeground, variantMutator);
  },
  createIconColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.icon, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.icon, ResultType>(VariantsColors.icon, variantMutator);
  },
  createHoverIconColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverIcon, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverIcon, ResultType>(VariantsColors.hoverIcon, variantMutator);
  },
  createActiveIconColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeIcon, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeIcon, ResultType>(VariantsColors.activeIcon, variantMutator);
  },
  createIconForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.iconForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.iconForeground, ResultType>(VariantsColors.iconForeground, variantMutator);
  },
  createHoverIconForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverIconForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverIconForeground, ResultType>(VariantsColors.hoverIconForeground, variantMutator);
  },
  createActiveIconForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeIconForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeIconForeground, ResultType>(VariantsColors.activeIconForeground, variantMutator);
  },

  createTextWeight: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof fontWeightClasses, ResultType>) {
    return VariantsOptionsFactory.create<typeof fontWeightClasses, ResultType>(fontWeightClasses, variantMutator);
  },
  createBorderStyle: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderStyle, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderStyle, ResultType>(borderClasses.borderStyle, variantMutator);
  },
  createShadowColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.shadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.shadow, ResultType>(VariantsColors.shadow, variantMutator);
  },
  createActiveShadowColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeShadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeShadow, ResultType>(VariantsColors.activeShadow, variantMutator);
  },
  createHoverShadowColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverShadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverShadow, ResultType>(VariantsColors.hoverShadow, variantMutator);
  },
  createShadow: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof shadowClasses.shadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof shadowClasses.shadow, ResultType>(shadowClasses.shadow, variantMutator);
  },
  createActiveShadow: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof shadowClasses.activeShadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof shadowClasses.activeShadow, ResultType>(shadowClasses.activeShadow, variantMutator);
  },
  createHoverShadow: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof shadowClasses.hoverShadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof shadowClasses.hoverShadow, ResultType>(shadowClasses.hoverShadow, variantMutator);
  },
  createOpacity: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof opacityClasses.opacity, ResultType>) {
    return VariantsOptionsFactory.create<typeof opacityClasses.opacity, ResultType>(opacityClasses.opacity, variantMutator);
  },
  createActiveOpacity: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof opacityClasses.activeOpacity, ResultType>) {
    return VariantsOptionsFactory.create<typeof opacityClasses.activeOpacity, ResultType>(opacityClasses.activeOpacity, variantMutator);
  },
  createHoverOpacity: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof opacityClasses.hoverOpacity, ResultType>) {
    return VariantsOptionsFactory.create<typeof opacityClasses.hoverOpacity, ResultType>(opacityClasses.hoverOpacity, variantMutator);
  },
  createTextAlign: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textAlignClasses, ResultType>) {
    return VariantsOptionsFactory.create<typeof textAlignClasses, ResultType>(textAlignClasses, variantMutator);
  },
  createBorderWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderWidth, ResultType>(borderClasses.borderWidth, variantMutator);
  },
  createBorderBottomWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderBottomWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderBottomWidth, ResultType>(borderClasses.borderBottomWidth, variantMutator);
  },
  createRingWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ringWidthClasses.ringWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof ringWidthClasses.ringWidth, ResultType>(ringWidthClasses.ringWidth, variantMutator);
  },
  createActiveRingWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ringWidthClasses.activeRingWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof ringWidthClasses.activeRingWidth, ResultType>(ringWidthClasses.activeRingWidth, variantMutator);
  },
  createHoverRingWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ringWidthClasses.hoverRingWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof ringWidthClasses.hoverRingWidth, ResultType>(ringWidthClasses.hoverRingWidth, variantMutator);
  },
  createFocusRingWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ringWidthClasses.focusRingWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof ringWidthClasses.focusRingWidth, ResultType>(ringWidthClasses.focusRingWidth, variantMutator);
  },
  createBorderTopWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderTopWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderTopWidth, ResultType>(borderClasses.borderTopWidth, variantMutator);
  },
  createBorderLeftWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderLeftWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderLeftWidth, ResultType>(borderClasses.borderLeftWidth, variantMutator);
  },
  createBorderRightWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderRightWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderRightWidth, ResultType>(borderClasses.borderRightWidth, variantMutator);
  },
  createBorderInlineWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderInlineWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderInlineWidth, ResultType>(borderClasses.borderInlineWidth, variantMutator);
  },
  createBorderBlockWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderBlockWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderBlockWidth, ResultType>(borderClasses.borderBlockWidth, variantMutator);
  },
  createBorderColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderColor, ResultType>(VariantsColors.borderColor, variantMutator);
  },
  createBorderTopColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderTopColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderTopColor, ResultType>(VariantsColors.borderTopColor, variantMutator);
  },
  createBorderBottomColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderBottomColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderBottomColor, ResultType>(VariantsColors.borderBottomColor, variantMutator);
  },
  createBorderLeftColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderLeftColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderLeftColor, ResultType>(VariantsColors.borderLeftColor, variantMutator);
  },
  createBorderRightColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderRightColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderRightColor, ResultType>(VariantsColors.borderRightColor, variantMutator);
  },
  createHoverBorderColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverBorderColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverBorderColor, ResultType>(VariantsColors.hoverBorderColor, variantMutator);
  },
  createActiveBorderColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeBorderColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeBorderColor, ResultType>(VariantsColors.activeBorderColor, variantMutator);
  },
  createTransitionDuration: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof transitions.transitionDuration, ResultType>) {
    return VariantsOptionsFactory.create<typeof transitions.transitionDuration, ResultType>(transitions.transitionDuration, variantMutator);
  },
  createTransitionDelay: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof transitions.transitionDelay, ResultType>) {
    return VariantsOptionsFactory.create<typeof transitions.transitionDelay, ResultType>(transitions.transitionDelay, variantMutator);
  },
  createTransitionEasing: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof transitions.transitionEasing, ResultType>) {
    return VariantsOptionsFactory.create<typeof transitions.transitionEasing, ResultType>(transitions.transitionEasing, variantMutator);
  },
  createOutlineWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof outlineClasses.outlineWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof outlineClasses.outlineWidth, ResultType>(outlineClasses.outlineWidth, variantMutator);
  },

  createComposite: function <T extends Record<string, Record<IVariantKey, IClassName>>, ResultType = string, CompositePrefix extends string = any>(composite: T, variantMutator?: IVariantFactoryMutator<T[keyof T], ResultType, keyof T>, compositePrefix?: CompositePrefix): IVariantCompositeResult<T, CompositePrefix> {
    const r = {} as any;
    typedEntries(composite).forEach(([key, value]) => {
      r[isNonNullString(compositePrefix) ? `${compositePrefix}${String(key).upperFirst()}` : key] = VariantsOptionsFactory.create<T[keyof T], ResultType, keyof T>(value, variantMutator, key);
    });
    return r;
  },
  createAllRounded: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof roundedClasses)[keyof typeof roundedClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof roundedClasses, ResultType, CompositePrefix>(roundedClasses, variantMutator, compositePrefix);
  },
  createAllPaddings: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof paddingClasses)[keyof typeof paddingClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof paddingClasses, ResultType, CompositePrefix>(paddingClasses, variantMutator, compositePrefix);
  },
  createAllGaps: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof gapClasses)[keyof typeof gapClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof gapClasses, ResultType, CompositePrefix>(gapClasses, variantMutator, compositePrefix);
  },
  createAllFlex: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof flexClasses)[keyof typeof flexClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof flexClasses, ResultType, CompositePrefix>(flexClasses, variantMutator, compositePrefix);
  },
  createAllScales: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof scalesClasses)[keyof typeof scalesClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof scalesClasses, ResultType, CompositePrefix>(scalesClasses, variantMutator, compositePrefix);
  },
  createAllMargins: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof marginClasses)[keyof typeof marginClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof marginClasses, ResultType, CompositePrefix>(marginClasses, variantMutator, compositePrefix);
  },
  createAllWidth2Height: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof width2heightClasses)[keyof typeof width2heightClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof width2heightClasses, ResultType, CompositePrefix>(width2heightClasses, variantMutator, compositePrefix);
  },
  createAllPadding2Margin: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof padding2marginClasses)[keyof typeof padding2marginClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof padding2marginClasses, ResultType, CompositePrefix>(padding2marginClasses, variantMutator, compositePrefix);
  },

  createAllShadow: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof shadowClasses)[keyof typeof shadowClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof shadowClasses, ResultType, CompositePrefix>(shadowClasses, variantMutator, compositePrefix);
  },
  createAllShadowColors: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof allShadowColors)[keyof typeof allShadowColors], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof allShadowColors, ResultType, CompositePrefix>(allShadowColors, variantMutator, compositePrefix);
  },
  createAll: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof allVariantsOptions)[keyof typeof allVariantsOptions], ResultType, keyof typeof allVariantsOptions>): IVariantFactoryAll<ResultType> {
    const result: IVariantFactoryAll<ResultType> = {} as any;
    Object.keys(allVariantsOptions).forEach((_compositeKey) => {
      const compositeKey = _compositeKey as keyof typeof allVariantsOptions;
      (result as any)[compositeKey] = VariantsOptionsFactory.create<(typeof allVariantsOptions)[keyof typeof allVariantsOptions], ResultType, keyof typeof allVariantsOptions>((allVariantsOptions as any)[compositeKey], variantMutator, compositeKey);
    });
    return result;
  },

  createAllOpacity: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof opacityClasses)[keyof typeof opacityClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof opacityClasses, ResultType, CompositePrefix>(opacityClasses, variantMutator, compositePrefix);
  },
  createAllOutline: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof outlineClasses)[keyof typeof outlineClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof outlineClasses, ResultType, CompositePrefix>(outlineClasses, variantMutator, compositePrefix);
  },

  createAllBorders: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof borderClasses)[keyof typeof borderClasses], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof borderClasses, ResultType, CompositePrefix>(borderClasses, variantMutator, compositePrefix);
  },

  createAllTransitions: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof transitions)[keyof typeof transitions], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof transitions, ResultType, CompositePrefix>(transitions, variantMutator, compositePrefix);
  },
  createTextVariants: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof textVariants)[keyof typeof textVariants], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof textVariants, ResultType, CompositePrefix>(textVariants, variantMutator, compositePrefix);
  },
  createIconVariants: function <ResultType = string, CompositePrefix extends string = any>(variantMutator?: IVariantFactoryMutator<(typeof iconVariants)[keyof typeof iconVariants], ResultType>, compositePrefix?: CompositePrefix) {
    return VariantsOptionsFactory.createComposite<typeof iconVariants, ResultType, CompositePrefix>(iconVariants, variantMutator, compositePrefix);
  },
};

type IVariantFactoryAll<ResultType = string> = {
  [key in keyof typeof allVariantsOptions]: Record<keyof (typeof allVariantsOptions)[key], ResultType>;
};

// This version maintains the exact key-value mapping
type IUcFirst<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S;

type IVariantFactoryMutator<InputType extends Record<IVariantKey, any>, ResultType = string, VariantGroupName = any> = (value: InputType[keyof InputType], variantName: keyof InputType, compositeKey?: VariantGroupName) => ResultType;
type IVariantKey = string | number;

export type IVariantCompositeResult<T extends Record<string, Record<IVariantKey, unknown>>, CompositePrefix extends string = any> = T extends Record<infer K2, unknown> ? (CompositePrefix extends "" | undefined ? T : IPrefixKeys<T, CompositePrefix>) : never;

// Basic version - prefixes all keys
type IPrefixKeys<T extends Record<string, any>, P extends string> = {
  [K in keyof T as `${P}${IUcFirst<K & string>}`]: T[K];
};
