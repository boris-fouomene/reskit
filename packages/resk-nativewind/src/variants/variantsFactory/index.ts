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
import { positionClasses } from "./position";
import { activityIndicatorVariantOptions } from "./activityIndicator";
import { sizesClasses } from "./sizes";
import { textDecorations } from "./textDecorations";
import { responsiveWidth2height } from "./responsiveWidth2height";
import { responsivesPadding } from "./responsivePadding";
import { responsivesBorders } from "./responsivesBorders";


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
  ...responsivesBorders,
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
  ...responsiveWidth2height,

  ringColor: VariantsColors.ringColors,
  activeRingColor: VariantsColors.activeRingColors,
  hoverRingColor: VariantsColors.hoverRingColors,
  focusRingColor: VariantsColors.focusRingColors,
  ...ringWidthClasses,

  ...scalesClasses,
  ...borderClasses,
  ...padding2marginClasses,
  ...responsivesPadding,
  ...positionClasses,
} as const;

export const VariantsOptionsFactory = {
  allVariantsOptions,
  create: function <InputType extends Record<IVariantKey, any>, ResultType = string, VariantGroupName = unknown>(input: InputType, variantMutator?: IVariantOptionMutator<InputType, ResultType, VariantGroupName>, compositeKey?: VariantGroupName) {
    variantMutator = typeof variantMutator == "function" ? variantMutator : (value) => value as ResultType;
    return Object.fromEntries(
      typedEntries(input).map(([key, value]) => {
        return [key, variantMutator(value as any, key, compositeKey)];
      })
    ) as Record<keyof InputType, ResultType>;
  },
  createCompositeSize: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof width2heightClasses.width, ResultType>) {
    return VariantsOptionsFactory.create<typeof width2heightClasses.width, ResultType>(width2heightClasses.width, (value, variantName, compositeKey) => {
      value = `${value} ${value.replaceAll("w-", "h-")}` as any;
      if (typeof variantMutator == "function") {
        return variantMutator(value, variantName, compositeKey);
      }
      return value as any;
    });
  },
  createSize: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof sizesClasses, ResultType>) {
    return VariantsOptionsFactory.create<typeof sizesClasses, ResultType>(sizesClasses, variantMutator);
  },
  createPadding: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof paddingClasses.padding, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.padding, ResultType>(paddingClasses.padding, variantMutator);
  },
  createPaddingTop: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof paddingClasses.paddingTop, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingTop, ResultType>(paddingClasses.paddingTop, variantMutator);
  },
  createPaddingBottom: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof paddingClasses.paddingBottom, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingBottom, ResultType>(paddingClasses.paddingBottom, variantMutator);
  },
  createPaddingLeft: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof paddingClasses.paddingLeft, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingLeft, ResultType>(paddingClasses.paddingLeft, variantMutator);
  },
  createPaddingRight: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof paddingClasses.paddingRight, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingRight, ResultType>(paddingClasses.paddingRight, variantMutator);
  },
  createPaddingX: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof paddingClasses.paddingX, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingX, ResultType>(paddingClasses.paddingX, variantMutator);
  },
  createPaddingY: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof paddingClasses.paddingY, ResultType>) {
    return VariantsOptionsFactory.create<typeof paddingClasses.paddingY, ResultType>(paddingClasses.paddingY, variantMutator);
  },
  createMargin: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof marginClasses.margin, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.margin, ResultType>(marginClasses.margin, variantMutator);
  },
  createMarginTop: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof marginClasses.marginTop, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginTop, ResultType>(marginClasses.marginTop, variantMutator);
  },
  createMarginBottom: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof marginClasses.marginBottom, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginBottom, ResultType>(marginClasses.marginBottom, variantMutator);
  },
  createMarginLeft: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof marginClasses.marginLeft, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginLeft, ResultType>(marginClasses.marginLeft, variantMutator);
  },
  createMarginRight: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof marginClasses.marginRight, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginRight, ResultType>(marginClasses.marginRight, variantMutator);
  },
  createMarginX: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof marginClasses.marginX, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginX, ResultType>(marginClasses.marginX, variantMutator);
  },
  createMarginY: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof marginClasses.marginY, ResultType>) {
    return VariantsOptionsFactory.create<typeof marginClasses.marginY, ResultType>(marginClasses.marginY, variantMutator);
  },
  createTextSize: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof textSizes.size, ResultType>) {
    return VariantsOptionsFactory.create<typeof textSizes.size, ResultType>(textSizes.size, variantMutator);
  },
  createNativeTextSize: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof textSizes.nativeSize, ResultType>) {
    return VariantsOptionsFactory.create<typeof textSizes.nativeSize, ResultType>(textSizes.nativeSize, variantMutator);
  },
  createIconSize: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof iconSizes.size, ResultType>) {
    return VariantsOptionsFactory.create<typeof iconSizes.size, ResultType>(iconSizes.size, variantMutator);
  },
  createNativeIconSize: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof iconSizes.nativeSize, ResultType>) {
    return VariantsOptionsFactory.create<typeof iconSizes.nativeSize, ResultType>(iconSizes.nativeSize, variantMutator);
  },

  createBackgroundColor: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<typeof VariantsColors.background, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.background, ResultType>(VariantsColors.background, variantMutator);
  },
  createHoverBackgroundColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.hoverBackground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverBackground, ResultType>(VariantsColors.hoverBackground, variantMutator);
  },
  createActiveBackgroundColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.activeBackground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeBackground, ResultType>(VariantsColors.activeBackground, variantMutator);
  },
  createTextColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.text, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.text, ResultType>(VariantsColors.text, variantMutator);
  },
  createFillColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.fillColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.fillColor, ResultType>(VariantsColors.fillColor, variantMutator);
  },
  createHoverTextColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.hoverText, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverText, ResultType>(VariantsColors.hoverText, variantMutator);
  },
  createActiveTextColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.activeText, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeText, ResultType>(VariantsColors.activeText, variantMutator);
  },
  createTextForegroundColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.textForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.textForeground, ResultType>(VariantsColors.textForeground, variantMutator);
  },
  createHoverTextForegroundColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.hoverTextForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverTextForeground, ResultType>(VariantsColors.hoverTextForeground, variantMutator);
  },
  createActiveTextForegroundColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.activeTextForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeTextForeground, ResultType>(VariantsColors.activeTextForeground, variantMutator);
  },
  createIconColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.icon, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.icon, ResultType>(VariantsColors.icon, variantMutator);
  },
  createHoverIconColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.hoverIcon, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverIcon, ResultType>(VariantsColors.hoverIcon, variantMutator);
  },
  createActiveIconColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.activeIcon, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeIcon, ResultType>(VariantsColors.activeIcon, variantMutator);
  },
  createIconForegroundColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.iconForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.iconForeground, ResultType>(VariantsColors.iconForeground, variantMutator);
  },
  createHoverIconForegroundColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.hoverIconForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverIconForeground, ResultType>(VariantsColors.hoverIconForeground, variantMutator);
  },
  createActiveIconForegroundColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.activeIconForeground, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeIconForeground, ResultType>(VariantsColors.activeIconForeground, variantMutator);
  },

  createTextWeight: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof fontWeightClasses, ResultType>) {
    return VariantsOptionsFactory.create<typeof fontWeightClasses, ResultType>(fontWeightClasses, variantMutator);
  },
  createBorderStyle: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof borderClasses.borderStyle, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderStyle, ResultType>(borderClasses.borderStyle, variantMutator);
  },
  createShadowColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.shadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.shadow, ResultType>(VariantsColors.shadow, variantMutator);
  },
  createActiveShadowColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.activeShadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeShadow, ResultType>(VariantsColors.activeShadow, variantMutator);
  },
  createHoverShadowColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.hoverShadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverShadow, ResultType>(VariantsColors.hoverShadow, variantMutator);
  },
  createShadow: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof shadowClasses.shadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof shadowClasses.shadow, ResultType>(shadowClasses.shadow, variantMutator);
  },
  createActiveShadow: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof shadowClasses.activeShadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof shadowClasses.activeShadow, ResultType>(shadowClasses.activeShadow, variantMutator);
  },
  createHoverShadow: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof shadowClasses.hoverShadow, ResultType>) {
    return VariantsOptionsFactory.create<typeof shadowClasses.hoverShadow, ResultType>(shadowClasses.hoverShadow, variantMutator);
  },
  createOpacity: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof opacityClasses.opacity, ResultType>) {
    return VariantsOptionsFactory.create<typeof opacityClasses.opacity, ResultType>(opacityClasses.opacity, variantMutator);
  },
  createActiveOpacity: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof opacityClasses.activeOpacity, ResultType>) {
    return VariantsOptionsFactory.create<typeof opacityClasses.activeOpacity, ResultType>(opacityClasses.activeOpacity, variantMutator);
  },
  createHoverOpacity: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof opacityClasses.hoverOpacity, ResultType>) {
    return VariantsOptionsFactory.create<typeof opacityClasses.hoverOpacity, ResultType>(opacityClasses.hoverOpacity, variantMutator);
  },
  createTextAlign: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof textAlignClasses, ResultType>) {
    return VariantsOptionsFactory.create<typeof textAlignClasses, ResultType>(textAlignClasses, variantMutator);
  },
  createBorderWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof borderClasses.borderWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderWidth, ResultType>(borderClasses.borderWidth, variantMutator);
  },
  createBorderBottomWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof borderClasses.borderBottomWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderBottomWidth, ResultType>(borderClasses.borderBottomWidth, variantMutator);
  },
  createRingWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof ringWidthClasses.ringWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof ringWidthClasses.ringWidth, ResultType>(ringWidthClasses.ringWidth, variantMutator);
  },
  createActiveRingWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof ringWidthClasses.activeRingWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof ringWidthClasses.activeRingWidth, ResultType>(ringWidthClasses.activeRingWidth, variantMutator);
  },
  createHoverRingWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof ringWidthClasses.hoverRingWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof ringWidthClasses.hoverRingWidth, ResultType>(ringWidthClasses.hoverRingWidth, variantMutator);
  },
  createFocusRingWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof ringWidthClasses.focusRingWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof ringWidthClasses.focusRingWidth, ResultType>(ringWidthClasses.focusRingWidth, variantMutator);
  },
  createBorderTopWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof borderClasses.borderTopWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderTopWidth, ResultType>(borderClasses.borderTopWidth, variantMutator);
  },
  createBorderLeftWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof borderClasses.borderLeftWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderLeftWidth, ResultType>(borderClasses.borderLeftWidth, variantMutator);
  },
  createBorderRightWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof borderClasses.borderRightWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderRightWidth, ResultType>(borderClasses.borderRightWidth, variantMutator);
  },
  createBorderXWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof borderClasses.borderXWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderXWidth, ResultType>(borderClasses.borderXWidth, variantMutator);
  },
  createBorderYWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof borderClasses.borderYWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof borderClasses.borderYWidth, ResultType>(borderClasses.borderYWidth, variantMutator);
  },
  createBorderColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.borderColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderColor, ResultType>(VariantsColors.borderColor, variantMutator);
  },
  createBorderTopColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.borderTopColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderTopColor, ResultType>(VariantsColors.borderTopColor, variantMutator);
  },
  createBorderBottomColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.borderBottomColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderBottomColor, ResultType>(VariantsColors.borderBottomColor, variantMutator);
  },
  createBorderLeftColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.borderLeftColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderLeftColor, ResultType>(VariantsColors.borderLeftColor, variantMutator);
  },
  createBorderRightColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.borderRightColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.borderRightColor, ResultType>(VariantsColors.borderRightColor, variantMutator);
  },
  createHoverBorderColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.hoverBorderColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.hoverBorderColor, ResultType>(VariantsColors.hoverBorderColor, variantMutator);
  },
  createActiveBorderColor: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof VariantsColors.activeBorderColor, ResultType>) {
    return VariantsOptionsFactory.create<typeof VariantsColors.activeBorderColor, ResultType>(VariantsColors.activeBorderColor, variantMutator);
  },
  createTransitionDuration: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof transitions.transitionDuration, ResultType>) {
    return VariantsOptionsFactory.create<typeof transitions.transitionDuration, ResultType>(transitions.transitionDuration, variantMutator);
  },
  createTransitionDelay: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof transitions.transitionDelay, ResultType>) {
    return VariantsOptionsFactory.create<typeof transitions.transitionDelay, ResultType>(transitions.transitionDelay, variantMutator);
  },
  createTransitionEasing: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof transitions.transitionEasing, ResultType>) {
    return VariantsOptionsFactory.create<typeof transitions.transitionEasing, ResultType>(transitions.transitionEasing, variantMutator);
  },
  createOutlineWidth: function <ResultType = string>(variantMutator?: IVariantOptionMutator<typeof outlineClasses.outlineWidth, ResultType>) {
    return VariantsOptionsFactory.create<typeof outlineClasses.outlineWidth, ResultType>(outlineClasses.outlineWidth, variantMutator);
  },
  createComposite: function <T extends Record<string, Record<IVariantKey, IClassName>>, ResultType = string, CompositePrefix extends string = "">(composite: T, variantMutator?: IVariantOptionMutator<T[keyof T], ResultType, keyof T>, ...args: IConditionalCompositePrefix<CompositePrefix>): IVariantCompositeResult<T, CompositePrefix> {
    const r = {} as any;
    const compositePrefix = args[0];
    typedEntries(composite).forEach(([key, value]) => {
      r[isNonNullString(compositePrefix) ? `${compositePrefix}${String(key).upperFirst()}` : key] = VariantsOptionsFactory.create<T[keyof T], ResultType, keyof T>(value, variantMutator, key);
    });
    return r;
  },
  createAllRounded: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof roundedClasses)[keyof typeof roundedClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof roundedClasses, ResultType, CompositePrefix>(roundedClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllPosition: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof positionClasses)[keyof typeof positionClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof positionClasses, ResultType, CompositePrefix>(positionClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllPaddings: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof paddingClasses)[keyof typeof paddingClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof paddingClasses, ResultType, CompositePrefix>(paddingClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllGaps: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof gapClasses)[keyof typeof gapClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof gapClasses, ResultType, CompositePrefix>(gapClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllFlex: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof flexClasses)[keyof typeof flexClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof flexClasses, ResultType, CompositePrefix>(flexClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllScales: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof scalesClasses)[keyof typeof scalesClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof scalesClasses, ResultType, CompositePrefix>(scalesClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllMargins: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof marginClasses)[keyof typeof marginClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof marginClasses, ResultType, CompositePrefix>(marginClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllWidth2Height: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof width2heightClasses)[keyof typeof width2heightClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof width2heightClasses, ResultType, CompositePrefix>(width2heightClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllPadding2Margin: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof padding2marginClasses)[keyof typeof padding2marginClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof padding2marginClasses, ResultType, CompositePrefix>(padding2marginClasses, variantMutator, args[0] as CompositePrefix);
  },

  createAllShadow: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof shadowClasses)[keyof typeof shadowClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof shadowClasses, ResultType, CompositePrefix>(shadowClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllShadowColors: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof allShadowColors)[keyof typeof allShadowColors], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof allShadowColors, ResultType, CompositePrefix>(allShadowColors, variantMutator, args[0] as CompositePrefix);
  },
  createAll: function <ResultType = string>(variantMutator?: IVariantOptionMutator<(typeof allVariantsOptions)[keyof typeof allVariantsOptions], ResultType, keyof typeof allVariantsOptions>): IVariantOptionAll<ResultType> {
    const result: IVariantOptionAll<ResultType> = {} as any;
    Object.keys(allVariantsOptions).forEach((_compositeKey) => {
      const compositeKey = _compositeKey as keyof typeof allVariantsOptions;
      (result as any)[compositeKey] = VariantsOptionsFactory.create<(typeof allVariantsOptions)[keyof typeof allVariantsOptions], ResultType, keyof typeof allVariantsOptions>((allVariantsOptions as any)[compositeKey], variantMutator, compositeKey);
    });
    return result;
  },

  createAllOpacity: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof opacityClasses)[keyof typeof opacityClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof opacityClasses, ResultType, CompositePrefix>(opacityClasses, variantMutator, args[0] as CompositePrefix);
  },
  createAllOutline: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof outlineClasses)[keyof typeof outlineClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof outlineClasses, ResultType, CompositePrefix>(outlineClasses, variantMutator, args[0] as CompositePrefix);
  },

  createAllBorders: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof borderClasses)[keyof typeof borderClasses], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof borderClasses, ResultType, CompositePrefix>(borderClasses, variantMutator, args[0] as CompositePrefix);
  },

  createAllTransitions: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof transitions)[keyof typeof transitions], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof transitions, ResultType, CompositePrefix>(transitions, variantMutator, args[0] as CompositePrefix);
  },
  createTextVariants: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof textVariants)[keyof typeof textVariants], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof textVariants, ResultType, CompositePrefix>(textVariants, variantMutator, args[0] as CompositePrefix);
  },
  createActivityIndicatorVariants: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof activityIndicatorVariantOptions)[keyof typeof activityIndicatorVariantOptions], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof activityIndicatorVariantOptions, ResultType, CompositePrefix>(activityIndicatorVariantOptions, variantMutator, args[0] as CompositePrefix);
  },
  createIconVariants: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof iconVariants)[keyof typeof iconVariants], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof iconVariants, ResultType, CompositePrefix>(iconVariants, variantMutator, args[0] as CompositePrefix);
  },
  createAllTextDecorations: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof textDecorations)[keyof typeof textDecorations], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof textDecorations, ResultType, CompositePrefix>(textDecorations, variantMutator, args[0] as CompositePrefix);
  },
  createResponivesWidth2Height: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof responsiveWidth2height)[keyof typeof responsiveWidth2height], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof responsiveWidth2height, ResultType, CompositePrefix>(responsiveWidth2height, variantMutator, args[0] as CompositePrefix);
  },
  createResponsivesPadding: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof responsivesPadding)[keyof typeof responsivesPadding], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof responsivesPadding, ResultType, CompositePrefix>(responsivesPadding, variantMutator, args[0] as CompositePrefix);
  },
  createResponsivesBorder: function <ResultType = string, CompositePrefix extends string = "">(variantMutator?: IVariantOptionMutator<(typeof responsivesBorders)[keyof typeof responsivesBorders], ResultType>, ...args: IConditionalCompositePrefix<CompositePrefix>) {
    return VariantsOptionsFactory.createComposite<typeof responsivesBorders, ResultType, CompositePrefix>(responsivesBorders, variantMutator, args[0] as CompositePrefix);
  },
};

type IVariantOptionAll<ResultType = string> = {
  [key in keyof typeof allVariantsOptions]: Record<keyof (typeof allVariantsOptions)[key], ResultType>;
};

// This version maintains the exact key-value mapping
type IUcFirst<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S;

type IVariantOptionMutator<InputType extends Record<IVariantKey, any>, ResultType = string, VariantGroupName = unknown> = (value: InputType[keyof InputType], variantName: keyof InputType, compositeKey?: VariantGroupName) => ResultType;
type IVariantKey = string | number;

export type IVariantCompositeResult<T extends Record<string, Record<IVariantKey, unknown>>, CompositePrefix extends string = ""> = T extends Record<any, unknown> ? (CompositePrefix extends "" | undefined ? T : IVariantPrefixKeys<T, CompositePrefix>) : never;

// Basic version - prefixes all keys
type IVariantPrefixKeys<T extends Record<IVariantKey, any>, P extends string> = {
  [K in keyof T as `${P}${IUcFirst<K & string>}`]: T[K];
};
/**
 * Conditional parameter type that makes a parameter required when a generic extends a non-empty string.
 *
 * @typeParam T - The generic parameter to check
 * @typeParam ParamType - The type of the parameter when required
 *
 * @example
 * ```typescript
 * function myFunction<T extends string = "">(
 *   required: string,
 *   ...args: IConditionalParameter<T, T>
 * ) {
 *   const optional = args[0];
 * }
 *
 * // Usage:
 * myFunction("test"); // OK - T defaults to "", parameter is optional
 * myFunction<"">("test"); // OK - T is "", parameter is optional
 * myFunction<"prefix">("test", "prefix"); // OK - T is "prefix", parameter is required
 * myFunction<"prefix">("test"); // Error - missing required parameter
 * ```
 */
type IConditionalParameter<T extends string, ParamType = T> = T extends "" ? [] | [param?: ParamType] : [param: ParamType];

/**
 * Conditional parameter type specifically for composite prefix.
 *
 * @typeParam CompositePrefix - The prefix string type
 *
 * @example
 * ```typescript
 * function createComposite<CompositePrefix extends string = "">(
 *   data: any,
 *   mutator?: Function,
 *   ...args: IConditionalCompositePrefix<CompositePrefix>
 * ) {
 *   const compositePrefix = args[0];
 * }
 * ```
 */
type IConditionalCompositePrefix<CompositePrefix extends string> = IConditionalParameter<CompositePrefix, CompositePrefix>;
