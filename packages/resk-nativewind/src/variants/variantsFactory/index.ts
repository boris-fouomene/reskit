import { roundeClasses, roundedBottomClasses, roundedBottomLeftRadiusClasses, roundedBottomRightRadiusClasses, roundedRightClasses, roundedTopClasses, roundedTopLeftRadiusClasses, roundedTopRightRadiusClasses, roundeLeftClasses } from "./rounded";
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
import { typedEntries } from "@resk/core/utils";
import { opacityClasses } from "./opacity";
import { outlineClasses } from "./outline";

type IVariantFactoryMutator<InputType extends Record<IVariantKey, any>, ResultType = string, VariantGroupName = any> = (value: InputType[keyof InputType], variantName: keyof InputType, variantGroupName?: VariantGroupName) => ResultType;
type IVariantKey = string | number;
type IVariantCompositeResult<T extends Record<string, Record<IVariantKey, unknown>>> = {
  [K in keyof T]: T[K] extends Record<IVariantKey, infer V> ? Record<keyof T[K], V> : never;
};

const allShadowColors = {
  shadowColor: VariantsColors.shadow,
  activeShadowColor: VariantsColors.activeShadow,
  hoverShadowColor: VariantsColors.hoverShadow,
  hoverBackground: VariantsColors.hoverBackground,
  activeBackground: VariantsColors.activeBackground,
};
const allVariantsClasses = {
  rounded: roundeClasses,
  roundedLeft: roundeLeftClasses,
  roundedRight: roundedRightClasses,
  roundedTop: roundedTopClasses,
  roundedBottom: roundedBottomClasses,
  roundedTopLeft: roundedTopLeftRadiusClasses,
  roundedTopRight: roundedTopRightRadiusClasses,
  roundedBottomLeft: roundedBottomLeftRadiusClasses,
  roundedBottomRight: roundedBottomRightRadiusClasses,

  ...opacityClasses,
  ...shadowClasses,
  ...borderClasses,
  ...outlineClasses,
  ...allShadowColors,

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
};

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
 * const computed = VariantsFactory.create(
 *   { small: "p-2", large: "p-6" },
 *   (value, key) => `tw-${value}`
 * );
 * // Result: { small: "tw-p-2", large: "tw-p-6" }
 * ```
 */
export const VariantsFactory = {
  allVariantsClasses,
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
   * const computed = VariantsFactory.create(
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
  create: function <InputType extends Record<IVariantKey, any>, ResultType = string, VariantGroupName = any>(input: InputType, variantMutator?: IVariantFactoryMutator<InputType, ResultType, VariantGroupName>, variantGroupName?: VariantGroupName) {
    variantMutator = typeof variantMutator == "function" ? variantMutator : (value) => value as ResultType;
    return Object.fromEntries(
      typedEntries(input).map(([key, value]) => {
        return [key, variantMutator(value as any, key, variantGroupName)];
      })
    ) as Record<keyof InputType, ResultType>;
  },
  createSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof width2heightClasses.width, ResultType>) {
    return VariantsFactory.create<typeof width2heightClasses.width, ResultType>(width2heightClasses.width, (value, variantName, variantGroupName) => {
      value = `${value} ${value.replaceAll("w-", "h-")}`;
      if (typeof variantMutator == "function") {
        return variantMutator(value, variantName, variantGroupName);
      }
      return value as any;
    });
  },
  createPadding: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.padding, ResultType>) {
    return VariantsFactory.create<typeof paddingClasses.padding, ResultType>(paddingClasses.padding, variantMutator);
  },
  createPadingTop: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingTop, ResultType>) {
    return VariantsFactory.create<typeof paddingClasses.paddingTop, ResultType>(paddingClasses.paddingTop, variantMutator);
  },
  createPadingBottom: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingBottom, ResultType>) {
    return VariantsFactory.create<typeof paddingClasses.paddingBottom, ResultType>(paddingClasses.paddingBottom, variantMutator);
  },
  createPadingLeft: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingLeft, ResultType>) {
    return VariantsFactory.create<typeof paddingClasses.paddingLeft, ResultType>(paddingClasses.paddingLeft, variantMutator);
  },
  createPadingRight: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingRight, ResultType>) {
    return VariantsFactory.create<typeof paddingClasses.paddingRight, ResultType>(paddingClasses.paddingRight, variantMutator);
  },
  createPadingX: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingX, ResultType>) {
    return VariantsFactory.create<typeof paddingClasses.paddingX, ResultType>(paddingClasses.paddingX, variantMutator);
  },
  createPadingY: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses.paddingY, ResultType>) {
    return VariantsFactory.create<typeof paddingClasses.paddingY, ResultType>(paddingClasses.paddingY, variantMutator);
  },
  createMargin: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.margin, ResultType>) {
    return VariantsFactory.create<typeof marginClasses.margin, ResultType>(marginClasses.margin, variantMutator);
  },
  createMarginTop: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginTop, ResultType>) {
    return VariantsFactory.create<typeof marginClasses.marginTop, ResultType>(marginClasses.marginTop, variantMutator);
  },
  createMarginBottom: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginBottom, ResultType>) {
    return VariantsFactory.create<typeof marginClasses.marginBottom, ResultType>(marginClasses.marginBottom, variantMutator);
  },
  createMarginLeft: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginLeft, ResultType>) {
    return VariantsFactory.create<typeof marginClasses.marginLeft, ResultType>(marginClasses.marginLeft, variantMutator);
  },
  createMarginRight: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginRight, ResultType>) {
    return VariantsFactory.create<typeof marginClasses.marginRight, ResultType>(marginClasses.marginRight, variantMutator);
  },
  createMarginX: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginX, ResultType>) {
    return VariantsFactory.create<typeof marginClasses.marginX, ResultType>(marginClasses.marginX, variantMutator);
  },
  createMarginY: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses.marginY, ResultType>) {
    return VariantsFactory.create<typeof marginClasses.marginY, ResultType>(marginClasses.marginY, variantMutator);
  },
  createTextSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textSizes.textSize, ResultType>) {
    return VariantsFactory.create<typeof textSizes.textSize, ResultType>(textSizes.textSize, variantMutator);
  },
  createNativeTextSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textSizes.nativeTextSize, ResultType>) {
    return VariantsFactory.create<typeof textSizes.nativeTextSize, ResultType>(textSizes.nativeTextSize, variantMutator);
  },
  createIconSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof iconSizes.iconSize, ResultType>) {
    return VariantsFactory.create<typeof iconSizes.iconSize, ResultType>(iconSizes.iconSize, variantMutator);
  },
  createNativeIconSize: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof iconSizes.nativeIconSize, ResultType>) {
    return VariantsFactory.create<typeof iconSizes.nativeIconSize, ResultType>(iconSizes.nativeIconSize, variantMutator);
  },
  createRounded: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof roundeClasses, ResultType>) {
    return VariantsFactory.create<typeof roundeClasses, ResultType>(roundeClasses, variantMutator);
  },
  createComposite: function <T extends Record<string, Record<IVariantKey, IClassName>>, ResultType = string>(composite: T, variantMutator?: IVariantFactoryMutator<T[keyof T], ResultType>): IVariantCompositeResult<T> {
    const r = {} as any;
    typedEntries(composite).forEach(([key, value]) => {
      r[key] = VariantsFactory.create<T[keyof T], ResultType, keyof T>(value, variantMutator, key);
    });
    return r;
  },
  createPaddings: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof paddingClasses)[keyof typeof paddingClasses], ResultType>) {
    return VariantsFactory.createComposite<typeof paddingClasses, ResultType>(paddingClasses, variantMutator);
  },
  createScales: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof scalesClasses)[keyof typeof scalesClasses], ResultType>) {
    return VariantsFactory.createComposite<typeof scalesClasses, ResultType>(scalesClasses, variantMutator as any);
  },
  createMargins: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof marginClasses)[keyof typeof marginClasses], ResultType>) {
    return VariantsFactory.createComposite<typeof marginClasses, ResultType>(marginClasses, variantMutator as any);
  },
  createWidth2Height: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof width2heightClasses)[keyof typeof width2heightClasses], ResultType>) {
    return VariantsFactory.createComposite<typeof width2heightClasses, ResultType>(width2heightClasses, variantMutator);
  },
  createPadding2Margin: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof padding2marginClasses)[keyof typeof padding2marginClasses], ResultType>) {
    return VariantsFactory.createComposite<typeof padding2marginClasses, ResultType>(padding2marginClasses, variantMutator);
  },

  createBackgroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.background, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.background, ResultType>(VariantsColors.background, variantMutator);
  },
  createHoverBackgroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverBackground, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.hoverBackground, ResultType>(VariantsColors.hoverBackground, variantMutator);
  },
  createActiveBackgroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeBackground, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.activeBackground, ResultType>(VariantsColors.activeBackground, variantMutator);
  },
  createTextColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.text, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.text, ResultType>(VariantsColors.text, variantMutator);
  },
  createHoverTextColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverText, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.hoverText, ResultType>(VariantsColors.hoverText, variantMutator);
  },
  createActiveTextColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeText, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.activeText, ResultType>(VariantsColors.activeText, variantMutator);
  },
  createTextForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.textForeground, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.textForeground, ResultType>(VariantsColors.textForeground, variantMutator);
  },
  createHoverTextForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverTextForeground, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.hoverTextForeground, ResultType>(VariantsColors.hoverTextForeground, variantMutator);
  },
  createActiveTextForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeTextForeground, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.activeTextForeground, ResultType>(VariantsColors.activeTextForeground, variantMutator);
  },
  createIconColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.icon, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.icon, ResultType>(VariantsColors.icon, variantMutator);
  },
  createHoverIconColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverIcon, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.hoverIcon, ResultType>(VariantsColors.hoverIcon, variantMutator);
  },
  createActiveIconColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeIcon, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.activeIcon, ResultType>(VariantsColors.activeIcon, variantMutator);
  },
  createIconForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.iconForeground, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.iconForeground, ResultType>(VariantsColors.iconForeground, variantMutator);
  },
  createHoverIconForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverIconForeground, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.hoverIconForeground, ResultType>(VariantsColors.hoverIconForeground, variantMutator);
  },
  createActiveIconForegroundColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeIconForeground, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.activeIconForeground, ResultType>(VariantsColors.activeIconForeground, variantMutator);
  },

  createTextWeight: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof fontWeightClasses, ResultType>) {
    return VariantsFactory.create<typeof fontWeightClasses, ResultType>(fontWeightClasses, variantMutator);
  },
  createBorderStyle: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderStyle, ResultType>) {
    return VariantsFactory.create<typeof borderClasses.borderStyle, ResultType>(borderClasses.borderStyle, variantMutator);
  },
  createShadowColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.shadow, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.shadow, ResultType>(VariantsColors.shadow, variantMutator);
  },
  createActiveShadowColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeShadow, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.activeShadow, ResultType>(VariantsColors.activeShadow, variantMutator);
  },
  createHoverShadowColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverShadow, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.hoverShadow, ResultType>(VariantsColors.hoverShadow, variantMutator);
  },
  createShadow: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof shadowClasses.shadow, ResultType>) {
    return VariantsFactory.create<typeof shadowClasses.shadow, ResultType>(shadowClasses.shadow, variantMutator);
  },
  createActiveShadow: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof shadowClasses.activeShadow, ResultType>) {
    return VariantsFactory.create<typeof shadowClasses.activeShadow, ResultType>(shadowClasses.activeShadow, variantMutator);
  },
  createHoverShadow: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof shadowClasses.hoverShadow, ResultType>) {
    return VariantsFactory.create<typeof shadowClasses.hoverShadow, ResultType>(shadowClasses.hoverShadow, variantMutator);
  },
  createAllShadow: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof shadowClasses)[keyof typeof shadowClasses], ResultType>) {
    return VariantsFactory.createComposite<typeof shadowClasses, ResultType>(shadowClasses, variantMutator);
  },
  createAllShadowColors: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof allShadowColors)[keyof typeof allShadowColors], ResultType>) {
    return VariantsFactory.createComposite<typeof allShadowColors, ResultType>(allShadowColors, variantMutator);
  },
  createAll: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof allVariantsClasses)[keyof typeof allVariantsClasses], ResultType, keyof typeof allVariantsClasses>): IVariantFactoryAll<ResultType> {
    const result: IVariantFactoryAll<ResultType> = {} as any;
    Object.keys(allVariantsClasses).forEach((_variantGroupName) => {
      const variantGroupName = _variantGroupName as keyof typeof allVariantsClasses;
      (result as any)[variantGroupName] = VariantsFactory.create<(typeof allVariantsClasses)[keyof typeof allVariantsClasses], ResultType, keyof typeof allVariantsClasses>((allVariantsClasses as any)[variantGroupName], variantMutator, variantGroupName);
    });
    return result;
  },
  createOpacity: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof opacityClasses.opacity, ResultType>) {
    return VariantsFactory.create<typeof opacityClasses.opacity, ResultType>(opacityClasses.opacity, variantMutator);
  },
  createActiveOpacity: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof opacityClasses.activeOpacity, ResultType>) {
    return VariantsFactory.create<typeof opacityClasses.activeOpacity, ResultType>(opacityClasses.activeOpacity, variantMutator);
  },
  createHoverOpacity: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof opacityClasses.hoverOpacity, ResultType>) {
    return VariantsFactory.create<typeof opacityClasses.hoverOpacity, ResultType>(opacityClasses.hoverOpacity, variantMutator);
  },
  createTextAlign: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof textAlignClasses, ResultType>) {
    return VariantsFactory.create<typeof textAlignClasses, ResultType>(textAlignClasses, variantMutator);
  },
  createBorderWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderWidth, ResultType>) {
    return VariantsFactory.create<typeof borderClasses.borderWidth, ResultType>(borderClasses.borderWidth, variantMutator);
  },
  createBorderBottomWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderBottomWidth, ResultType>) {
    return VariantsFactory.create<typeof borderClasses.borderBottomWidth, ResultType>(borderClasses.borderBottomWidth, variantMutator);
  },
  createRingWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ringWidthClasses.ringWidth, ResultType>) {
    return VariantsFactory.create<typeof ringWidthClasses.ringWidth, ResultType>(ringWidthClasses.ringWidth, variantMutator);
  },
  createActiveRingWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ringWidthClasses.activeRingWidth, ResultType>) {
    return VariantsFactory.create<typeof ringWidthClasses.activeRingWidth, ResultType>(ringWidthClasses.activeRingWidth, variantMutator);
  },
  createHoverRingWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ringWidthClasses.hoverRingWidth, ResultType>) {
    return VariantsFactory.create<typeof ringWidthClasses.hoverRingWidth, ResultType>(ringWidthClasses.hoverRingWidth, variantMutator);
  },
  createFocusRingWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ringWidthClasses.focusRingWidth, ResultType>) {
    return VariantsFactory.create<typeof ringWidthClasses.focusRingWidth, ResultType>(ringWidthClasses.focusRingWidth, variantMutator);
  },
  createBorderTopWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderTopWidth, ResultType>) {
    return VariantsFactory.create<typeof borderClasses.borderTopWidth, ResultType>(borderClasses.borderTopWidth, variantMutator);
  },
  createBorderLeftWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderLeftWidth, ResultType>) {
    return VariantsFactory.create<typeof borderClasses.borderLeftWidth, ResultType>(borderClasses.borderLeftWidth, variantMutator);
  },
  createBorderRightWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderRightWidth, ResultType>) {
    return VariantsFactory.create<typeof borderClasses.borderRightWidth, ResultType>(borderClasses.borderRightWidth, variantMutator);
  },
  createBorderInlineWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderInlineWidth, ResultType>) {
    return VariantsFactory.create<typeof borderClasses.borderInlineWidth, ResultType>(borderClasses.borderInlineWidth, variantMutator);
  },
  createBorderBlockWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses.borderBlockWidth, ResultType>) {
    return VariantsFactory.create<typeof borderClasses.borderBlockWidth, ResultType>(borderClasses.borderBlockWidth, variantMutator);
  },
  createBorders: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof borderClasses)[keyof typeof borderClasses], ResultType>) {
    return VariantsFactory.createComposite<typeof borderClasses, ResultType>(borderClasses, variantMutator);
  },
  createBorderColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderColor, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.borderColor, ResultType>(VariantsColors.borderColor, variantMutator);
  },
  createBorderTopColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderTopColor, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.borderTopColor, ResultType>(VariantsColors.borderTopColor, variantMutator);
  },
  createBorderBottomColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderBottomColor, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.borderBottomColor, ResultType>(VariantsColors.borderBottomColor, variantMutator);
  },
  createBorderLeftColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderLeftColor, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.borderLeftColor, ResultType>(VariantsColors.borderLeftColor, variantMutator);
  },
  createBorderRightColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.borderRightColor, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.borderRightColor, ResultType>(VariantsColors.borderRightColor, variantMutator);
  },
  createHoverBorderColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.hoverBorderColor, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.hoverBorderColor, ResultType>(VariantsColors.hoverBorderColor, variantMutator);
  },
  createActiveBorderColor: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof VariantsColors.activeBorderColor, ResultType>) {
    return VariantsFactory.create<typeof VariantsColors.activeBorderColor, ResultType>(VariantsColors.activeBorderColor, variantMutator);
  },
  createTransitions: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof transitions)[keyof typeof transitions], ResultType>) {
    return VariantsFactory.createComposite<typeof transitions, ResultType>(transitions, variantMutator);
  },
  createTransitionDuration: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof transitions.transitionDuration, ResultType>) {
    return VariantsFactory.create<typeof transitions.transitionDuration, ResultType>(transitions.transitionDuration, variantMutator);
  },
  createTransitionDelay: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof transitions.transitionDelay, ResultType>) {
    return VariantsFactory.create<typeof transitions.transitionDelay, ResultType>(transitions.transitionDelay, variantMutator);
  },
  createTransitionEasing: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof transitions.transitionEasing, ResultType>) {
    return VariantsFactory.create<typeof transitions.transitionEasing, ResultType>(transitions.transitionEasing, variantMutator);
  },
  createAllOpacity: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof opacityClasses)[keyof typeof opacityClasses], ResultType>) {
    return VariantsFactory.createComposite<typeof opacityClasses, ResultType>(opacityClasses, variantMutator);
  },
  createAllOutline: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<(typeof outlineClasses)[keyof typeof outlineClasses], ResultType>) {
    return VariantsFactory.createComposite<typeof outlineClasses, ResultType>(outlineClasses, variantMutator);
  },
  createOutlineWidth: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof outlineClasses.outlineWidth, ResultType>) {
    return VariantsFactory.create<typeof outlineClasses.outlineWidth, ResultType>(outlineClasses.outlineWidth, variantMutator);
  },
};

type IVariantFactoryAll<ResultType = string> = {
  [key in keyof typeof allVariantsClasses]: Record<keyof (typeof allVariantsClasses)[key], ResultType>;
};
