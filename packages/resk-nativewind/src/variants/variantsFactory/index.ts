import { roundeClasses } from "./rounded";
import { paddingClasses, paddingXClasses, paddingYClasses } from "./padding";
import { marginClasses, marginXClasses, marginYClasses } from "./margin";
import { borderClasses } from "./border";
import { ShadowColorsClasses, ShadowClasses } from "./shadow";

type IVariantFactoryMutator<InputType extends Record<string, unknown>, ResultType = string> = (value: InputType[keyof InputType], variantName: keyof InputType) => ResultType;

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
        return Object.fromEntries(Object.entries(input).map(([key, value]) => {
            return [key, variantMutator(value as any, key as keyof InputType)]
        })) as Record<keyof InputType, ResultType>;
    },
    createRoundedVariants: function createRoundedVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof roundeClasses, ResultType>) {
        return VariantsFactory.create<typeof roundeClasses, ResultType>(roundeClasses, variantMutator);
    },
    createPaddingVariants: function createPaddingVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingClasses, ResultType>) {
        return VariantsFactory.create<typeof paddingClasses, ResultType>(paddingClasses, variantMutator);
    },
    createMarginVariants: function createMarginVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginClasses, ResultType>) {
        return VariantsFactory.create<typeof marginClasses, ResultType>(marginClasses, variantMutator);
    },
    createPaddingXVariants: function createPaddingXVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingXClasses, ResultType>) {
        return VariantsFactory.create<typeof paddingXClasses, ResultType>(paddingXClasses, variantMutator);
    },
    createPaddingYVariants: function createPaddingYVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof paddingYClasses, ResultType>) {
        return VariantsFactory.create<typeof paddingYClasses, ResultType>(paddingYClasses, variantMutator);
    },
    createMarginXVariants: function createMarginXVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginXClasses, ResultType>) {
        return VariantsFactory.create<typeof marginXClasses, ResultType>(marginXClasses, variantMutator);
    },
    createMarginYVariants: function createMarginYVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof marginYClasses, ResultType>) {
        return VariantsFactory.create<typeof marginYClasses, ResultType>(marginYClasses, variantMutator);
    },
    createBorderVariants: function createBorderVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof borderClasses, ResultType>) {
        return VariantsFactory.create<typeof borderClasses, ResultType>(borderClasses, variantMutator);
    },
    createShadowVariants: function createShadowVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ShadowClasses, ResultType>) {
        return VariantsFactory.create<typeof ShadowClasses, ResultType>(ShadowClasses, variantMutator);
    },
    createShadowColorsVariants: function createShadowColorsVariants<ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof ShadowColorsClasses, ResultType>) {
        return VariantsFactory.create<typeof ShadowColorsClasses, ResultType>(ShadowColorsClasses, variantMutator);
    },
    createAll: function <ResultType = string>(variantMutator?: IVariantFactoryMutator<typeof allVariantClasses[keyof typeof allVariantClasses], ResultType>): IVariantFactoryAll<ResultType> {
        const result: IVariantFactoryAll<ResultType> = {} as any;
        Object.keys(allVariantClasses).forEach((variantClassName) => {
            (result as any)[variantClassName] = VariantsFactory.create((allVariantClasses as any)[variantClassName], variantMutator);
        });
        return result;
    },
}
const allVariantClasses = {
    border: borderClasses,
    rounded: roundeClasses,
    padding: paddingClasses,
    paddingX: paddingXClasses,
    paddingY: paddingYClasses,
    margin: marginClasses,
    marginX: marginXClasses,
    marginY: marginYClasses,
    shadow: ShadowClasses,
    shadowColor: ShadowColorsClasses,
};
type IVariantFactoryAll<ResultType = string> = {
    [key in keyof typeof allVariantClasses]: Record<keyof typeof allVariantClasses[key], ResultType>;
}
