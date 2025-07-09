export const flexClasses = {
    // Flex Direction
    flexDirection: {
        row: "flex-row",
        "row-reverse": "flex-row-reverse",
        col: "flex-col",
        "col-reverse": "flex-col-reverse",
    },

    // Flex Wrap
    flexWrap: {
        wrap: "flex-wrap",
        "wrap-reverse": "flex-wrap-reverse",
        nowrap: "flex-nowrap",
    },

    // Flex (grow, shrink, basis combined)
    flex: {
        1: "flex-1",
        auto: "flex-auto",
        initial: "flex-initial",
        none: "flex-none",
    },

    // Flex Grow
    flexGrow: {
        0: "grow-0",
        1: "grow",
    },

    // Flex Shrink
    flexShrink: {
        0: "shrink-0",
        1: "shrink",
    },

    // Flex Basis
    flexBasis: {
        0: "basis-0",
        1: "basis-1",
        2: "basis-2",
        3: "basis-3",
        4: "basis-4",
        5: "basis-5",
        6: "basis-6",
        7: "basis-7",
        8: "basis-8",
        9: "basis-9",
        10: "basis-10",
        11: "basis-11",
        12: "basis-12",
        14: "basis-14",
        16: "basis-16",
        20: "basis-20",
        24: "basis-24",
        28: "basis-28",
        32: "basis-32",
        36: "basis-36",
        40: "basis-40",
        44: "basis-44",
        48: "basis-48",
        52: "basis-52",
        56: "basis-56",
        60: "basis-60",
        64: "basis-64",
        72: "basis-72",
        80: "basis-80",
        96: "basis-96",
        auto: "basis-auto",
        px: "basis-px",
        0.5: "basis-0.5",
        1.5: "basis-1.5",
        2.5: "basis-2.5",
        3.5: "basis-3.5",
        full: "basis-full",
        "1/2": "basis-1/2",
        "1/3": "basis-1/3",
        "2/3": "basis-2/3",
        "1/4": "basis-1/4",
        "2/4": "basis-2/4",
        "3/4": "basis-3/4",
        "1/5": "basis-1/5",
        "2/5": "basis-2/5",
        "3/5": "basis-3/5",
        "4/5": "basis-4/5",
        "1/6": "basis-1/6",
        "2/6": "basis-2/6",
        "3/6": "basis-3/6",
        "4/6": "basis-4/6",
        "5/6": "basis-5/6",
        "1/12": "basis-1/12",
        "2/12": "basis-2/12",
        "3/12": "basis-3/12",
        "4/12": "basis-4/12",
        "5/12": "basis-5/12",
        "6/12": "basis-6/12",
        "7/12": "basis-7/12",
        "8/12": "basis-8/12",
        "9/12": "basis-9/12",
        "10/12": "basis-10/12",
        "11/12": "basis-11/12",
    },

    // Justify Content
    justifyContent: {
        normal: "justify-normal",
        start: "justify-start",
        end: "justify-end",
        center: "justify-center",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
        stretch: "justify-stretch",
    },

    // Justify Items
    justifyItems: {
        start: "justify-items-start",
        end: "justify-items-end",
        center: "justify-items-center",
        stretch: "justify-items-stretch",
    },

    // Justify Self
    justifySelf: {
        auto: "justify-self-auto",
        start: "justify-self-start",
        end: "justify-self-end",
        center: "justify-self-center",
        stretch: "justify-self-stretch",
    },

    // Align Content
    alignContent: {
        normal: "content-normal",
        center: "content-center",
        start: "content-start",
        end: "content-end",
        between: "content-between",
        around: "content-around",
        evenly: "content-evenly",
        baseline: "content-baseline",
        stretch: "content-stretch",
    },

    // Align Items
    alignItems: {
        start: "items-start",
        end: "items-end",
        center: "items-center",
        baseline: "items-baseline",
        stretch: "items-stretch",
    },

    // Align Self
    alignSelf: {
        auto: "self-auto",
        start: "self-start",
        end: "self-end",
        center: "self-center",
        stretch: "self-stretch",
        baseline: "self-baseline",
    },

    // Place Content
    placeContent: {
        center: "place-content-center",
        start: "place-content-start",
        end: "place-content-end",
        between: "place-content-between",
        around: "place-content-around",
        evenly: "place-content-evenly",
        baseline: "place-content-baseline",
        stretch: "place-content-stretch",
    },

    // Place Items
    placeItems: {
        start: "place-items-start",
        end: "place-items-end",
        center: "place-items-center",
        baseline: "place-items-baseline",
        stretch: "place-items-stretch",
    },

    // Place Self
    placeSelf: {
        auto: "place-self-auto",
        start: "place-self-start",
        end: "place-self-end",
        center: "place-self-center",
        stretch: "place-self-stretch",
    },
} as const;