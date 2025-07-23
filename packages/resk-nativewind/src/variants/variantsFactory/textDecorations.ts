import { VariantsColors } from "@variants/colors/generated";

export const textDecorations = {
    decoration: {
        underline: 'underline',
        'line-through': 'line-through',
        overline: 'overline',
        none: 'decoration-none',
    },
    decorationStyle: {
        solid: "decoration-solid",
        double: "decoration-double",
        dotted: "decoration-dotted",
        dashed: "decoration-dashed",
        wavy: "decoration-wavy",
    },
    decorationThickness: {
        auto: 'decoration-auto',
        'from-font': 'decoration-from-font',
        0: 'decoration-0',
        1: 'decoration-1',
        2: 'decoration-2',
        4: 'decoration-4',
        8: 'decoration-8',
    },
    decorationColor: VariantsColors.textDecoration,
}