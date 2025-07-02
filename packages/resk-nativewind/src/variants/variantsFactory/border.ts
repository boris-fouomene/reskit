export const borderStyleClasses = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
  double: "border-double",
  none: "web:border-none",
  hidden: "web:border-hidden",
};

export const borderTopWidthClasses = {
  0: "border-t-0",
  1: "border-t",
  2: "border-t-2",
  3: "border-t-3",
  4: "border-t-4",
  5: "border-t-5",
  6: "border-t-6",
  7: "border-t-7",
  8: "border-t-8",
  9: "border-t-9",
  10: "border-t-10",
} as const;

export const borderBottomWidthClasses = {
  0: "border-b-0",
  1: "border-b",
  2: "border-b-2",
  3: "border-b-3",
  4: "border-b-4",
  5: "border-b-5",
  6: "border-b-6",
  7: "border-b-7",
  8: "border-b-8",
  9: "border-b-9",
  10: "border-b-10",
} as const;

export const borderLeftWidthClasses = {
  0: "border-l-0",
  1: "border-l",
  2: "border-l-2",
  3: "border-l-3",
  4: "border-l-4",
  5: "border-l-5",
  6: "border-l-6",
  7: "border-l-7",
  8: "border-l-8",
  9: "border-l-9",
  10: "border-l-10",
} as const;

export const borderRightWidthClasses = {
  0: "border-r-0",
  1: "border-r",
  2: "border-r-2",
  3: "border-r-3",
  4: "border-r-4",
  5: "border-r-5",
  6: "border-r-6",
  7: "border-r-7",
  8: "border-r-8",
  9: "border-r-9",
  10: "border-r-10",
} as const;

export const borderWidthClasses = {
  0: "border-0",
  1: "border",
  2: "border-2",
  3: "border-3",
  4: "border-4",
  5: "border-5",
  6: "border-6",
  7: "border-7",
  8: "border-8",
  9: "border-9",
  10: "border-10",
} as const;
export const borderInlineWidthClasses = {
  0: "border-x-0",
  1: "border-x",
  2: "border-x-2",
  3: "border-x-3",
  4: "border-x-4",
  5: "border-x-5",
  6: "border-x-6",
  7: "border-x-7",
  8: "border-x-8",
  9: "border-x-9",
  10: "border-x-10",
} as const;

export const borderBlockWidthClasses = {
  0: "border-y-0",
  1: "border-y",
  2: "border-y-2",
  3: "border-y-3",
  4: "border-y-4",
  5: "border-y-5",
  6: "border-y-6",
  7: "border-y-7",
  8: "border-y-8",
  9: "border-y-9",
  10: "border-y-10",
} as const;

export const allBorderWidthClasses = {
  borderWidth: borderWidthClasses,
  borderLeftWidth: borderLeftWidthClasses,
  borderRightWidth: borderRightWidthClasses,
  borderTopWidth: borderTopWidthClasses,
  borderBottomWidth: borderBottomWidthClasses,
  borderInlineWidth: borderInlineWidthClasses,
  borderBlockWidth: borderBlockWidthClasses,
} as const;
