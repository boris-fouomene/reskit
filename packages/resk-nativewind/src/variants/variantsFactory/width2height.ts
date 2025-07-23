export const width2heightClasses = {
  ":web:width": {
    min: 'web:w-min',
    max: 'web:w-max',
    fit: 'web:w-fit',
  },
  ":web:height": {
    min: 'web:h-min',
    max: 'web:h-max',
    fit: 'web:h-fit',
  },
  ":web:minWidth": {
    min: 'web:min-w-min',
    max: 'web:min-w-max',
    fit: 'web:min-w-fit',
  },
  ":web:maxWidth": {
    min: 'web:max-w-min',
    max: 'web:max-w-max',
    fit: 'web:max-w-fit',
  },
  ":web:minHeight": {
    min: 'web:min-h-min',
    max: 'web:min-h-max',
    fit: 'web:min-h-fit',
  },
  ":web:maxHeight": {
    min: 'web:max-h-min',
    max: 'web:max-h-max',
    fit: 'web:max-h-fit',
  },
  // Base Classes
  maxHeight: {
    // Fixed Heights - Pixel Values (0-10)
    0: "max-h-0",
    px: "max-h-px",
    0.5: "max-h-0.5",
    1: "max-h-1",
    1.5: "max-h-1.5",
    2: "max-h-2",
    2.5: "max-h-2.5",
    3: "max-h-3",
    3.5: "max-h-3.5",
    4: "max-h-4",
    5: "max-h-5",
    6: "max-h-6",
    7: "max-h-7",
    8: "max-h-8",
    9: "max-h-9",
    10: "max-h-10",

    // Medium Heights (44-96px)
    11: "max-h-11",
    12: "max-h-12",
    13: "max-h-13",
    14: "max-h-14",
    15: "max-h-15",
    16: "max-h-16",
    17: "max-h-17",
    18: "max-h-18",
    19: "max-h-19",
    20: "max-h-20",
    24: "max-h-24",

    28: "max-h-28",
    32: "max-h-32",
    36: "max-h-36",
    40: "max-h-40",
    44: "max-h-44",
    48: "max-h-48",
    52: "max-h-52",
    56: "max-h-56",
    60: "max-h-60",
    64: "max-h-64",
    72: "max-h-72",
    80: "max-h-80",
    96: "max-h-96",

    // Percentage-Based Heights (Cross-platform compatible)
    half: "max-h-[50%]", // 50%
    third: "max-h-[33.33333%]", // 33.333%
    twoThirds: "max-h-[66.667%]", // 66.667%
    quarter: "max-h-[25%]", // 25%
    threeQuarters: "max-h-[75%]", // 75%
    fifth: "max-h-[20%]", // 20%
    twoFifths: "max-h-[40%]", // 40%
    threeFifths: "max-h-[60%]", // 60%
    fourFifths: "max-h-[80%]", // 80%
    sixth: "max-h-[16.667%]", // 16.667%
    fiveSixths: "max-h-[83.333%]", // 83.333%

    // Full Heights
    full: "max-h-full", // 100%
    screen: "max-h-screen", // 100vh (web) / screen height (native)

    // Special Values (NativeWind 4 compatible)
    none: "max-h-none", // none
    min: "max-h-min", // min-content
    max: "max-h-max", // max-content
    fit: "max-h-fit",

    "3xs": "max-h-3xs",
    "2xs": "max-h-2xs",
    xs: "max-h-xs",
    sm: "max-h-sm",
    md: "max-h-md",
    lg: "max-h-lg",
    xl: "max-h-xl",
    "2xl": "max-h-2xl",
    "3xl": "max-h-3xl",
    "4xl": "max-h-4xl",
    "5xl": "max-h-5xl",
    "6xl": "max-h-6xl",
    "7xl": "max-h-7xl"
  },

  minHeight: {
    // Fixed Heights - Pixel Values (0-10)
    0: "min-h-0",
    px: "min-h-px",
    0.5: "min-h-0.5",
    1: "min-h-1",
    1.5: "min-h-1.5",
    2: "min-h-2",
    2.5: "min-h-2.5",
    3: "min-h-3",
    3.5: "min-h-3.5",
    4: "min-h-4",
    5: "min-h-5",
    6: "min-h-6",
    7: "min-h-7",
    8: "min-h-8",
    9: "min-h-9",
    10: "min-h-10",

    // Medium Heights (44-96px)
    11: "min-h-11",
    12: "min-h-12",
    13: "min-h-13",
    14: "min-h-14",
    15: "min-h-15",
    16: "min-h-16",
    17: "min-h-17",
    18: "min-h-18",
    19: "min-h-19",
    20: "min-h-20",
    24: "min-h-24",

    28: "min-h-28",
    32: "min-h-32",
    36: "min-h-36",
    40: "min-h-40",
    44: "min-h-44",
    48: "min-h-48",
    52: "min-h-52",
    56: "min-h-56",
    60: "min-h-60",
    64: "min-h-64",
    72: "min-h-72",
    80: "min-h-80",
    96: "min-h-96",

    // Percentage-Based Heights (Cross-platform compatible)
    half: "min-h-[50%]", // 50%
    third: "min-h-[33.33333%]", // 33.333%
    twoThirds: "min-h-[66.667%]", // 66.667%
    quarter: "min-h-[25%]", // 25%
    threeQuarters: "min-h-[75%]", // 75%
    fifth: "min-h-[20%]", // 20%
    twoFifths: "min-h-[40%]", // 40%
    threeFifths: "min-h-[60%]", // 60%
    fourFifths: "min-h-[80%]", // 80%
    sixth: "min-h-[16.667%]", // 16.667%
    fiveSixths: "min-h-[83.333%]", // 83.333%

    // Full Heights
    full: "min-h-full", // 100%
    screen: "min-h-screen", // 100vh (web) / screen height (native)

    // Special Values (NativeWind 4 compatible)
    none: "min-h-none", // none
    min: "min-h-min", // min-content
    max: "min-h-max", // max-content
    fit: "min-h-fit",

    "3xs": "min-h-3xs",
    "2xs": "min-h-2xs",
    xs: "min-h-xs",
    sm: "min-h-sm",
    md: "min-h-md",
    lg: "min-h-lg",
    xl: "min-h-xl",
    "2xl": "min-h-2xl",
    "3xl": "min-h-3xl",
    "4xl": "min-h-4xl",
    "5xl": "min-h-5xl",
    "6xl": "min-h-6xl",
    "7xl": "min-h-7xl"
  },

  height: {
    // Fixed Heights - Pixel Values (0-10)
    0: "h-0",
    px: "h-px",
    0.5: "h-0.5",
    1: "h-1",
    1.5: "h-1.5",
    2: "h-2",
    2.5: "h-2.5",
    3: "h-3",
    3.5: "h-3.5",
    4: "h-4",
    5: "h-5",
    6: "h-6",
    7: "h-7",
    8: "h-8",
    9: "h-9",
    10: "h-10",

    // Medium Heights (44-96px)
    11: "h-11",
    12: "h-12",
    13: "h-13",
    14: "h-14",
    15: "h-15",
    16: "h-16",
    17: "h-17",
    18: "h-18",
    19: "h-19",
    20: "h-20",
    24: "h-24",

    28: "h-28",
    32: "h-32",
    36: "h-36",
    40: "h-40",
    44: "h-44",
    48: "h-48",
    52: "h-52",
    56: "h-56",
    60: "h-60",
    64: "h-64",
    72: "h-72",
    80: "h-80",
    96: "h-96",

    // Percentage-Based Heights (Cross-platform compatible)
    half: "h-[50%]", // 50%
    third: "h-[33.33333%]", // 33.333%
    twoThirds: "h-[66.667%]", // 66.667%
    quarter: "h-[25%]", // 25%
    threeQuarters: "h-[75%]", // 75%
    fifth: "h-[20%]", // 20%
    twoFifths: "h-[40%]", // 40%
    threeFifths: "h-[60%]", // 60%
    fourFifths: "h-[80%]", // 80%
    sixth: "h-[16.667%]", // 16.667%
    fiveSixths: "h-[83.333%]", // 83.333%

    // Full Heights
    full: "h-full", // 100%
    screen: "h-screen", // 100vh (web) / screen height (native)

    // Special Values (NativeWind 4 compatible)
    none: "h-none", // none
    min: "h-min", // min-content
    max: "h-max", // max-content
    fit: "h-fit",

    "3xs": "h-3xs",
    "2xs": "h-2xs",
    xs: "h-xs",
    sm: "h-sm",
    md: "h-md",
    lg: "h-lg",
    xl: "h-xl",
    "2xl": "h-2xl",
    "3xl": "h-3xl",
    "4xl": "h-4xl",
    "5xl": "h-5xl",
    "6xl": "h-6xl",
    "7xl": "h-7xl",
  },

  maxWidth: {
    // Fixed Widths - Pixel Values (0-10)
    0: "max-w-0",
    px: "max-w-px",
    0.5: "max-w-0.5",
    1: "max-w-1",
    1.5: "max-w-1.5",
    2: "max-w-2",
    2.5: "max-w-2.5",
    3: "max-w-3",
    3.5: "max-w-3.5",
    4: "max-w-4",
    5: "max-w-5",
    6: "max-w-6",
    7: "max-w-7",
    8: "max-w-8",
    9: "max-w-9",
    10: "max-w-10",

    // Medium Widths (44-96px)
    11: "max-w-11",
    12: "max-w-12",
    13: "max-w-13",
    14: "max-w-14",
    15: "max-w-15",
    16: "max-w-16",
    17: "max-w-17",
    18: "max-w-18",
    19: "max-w-19",
    20: "max-w-20",
    24: "max-w-24",

    // Large Widths (112-384px)
    28: "max-w-28",
    32: "max-w-32",
    36: "max-w-36",
    40: "max-w-40",
    44: "max-w-44",
    48: "max-w-48",
    52: "max-w-52",
    56: "max-w-56",
    60: "max-w-60",
    64: "max-w-64",
    72: "max-w-72",
    80: "max-w-80",
    96: "max-w-96",

    // Percentage-Based Widths (Cross-platform compatible)
    half: "max-w-[50%]", // 50%
    third: "max-w-[33.33333%]", // 33.333%
    twoThirds: "max-w-[66.667%]", // 66.667%
    quarter: "max-w-[25%]", // 25%
    threeQuarters: "max-w-[75%]", // 75%
    fifth: "max-w-[20%]", // 20%
    twoFifths: "max-w-[40%]", // 40%
    threeFifths: "max-w-[60%]", // 60%
    fourFifths: "max-w-[80%]", // 80%
    sixth: "max-w-[16.667%]", // 16.667%
    fiveSixths: "max-w-[83.333%]", // 83.333%

    // Full Widths
    full: "max-w-full", // 100%
    screen: "max-w-screen", // 100vh (web) / screen height (native)

    // Special Values (NativeWind 4 compatible)
    none: "max-w-none", // none
    min: "max-w-min", // min-content
    max: "max-w-max", // max-content
    fit: "max-w-fit",

    "3xs": "max-w-3xs",
    "2xs": "max-w-2xs",
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "h-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  },

  minWidth: {
    // Fixed Widths - Pixel Values (0-10)
    0: "min-w-0",
    px: "min-w-px",
    0.5: "min-w-0.5",
    1: "min-w-1",
    1.5: "min-w-1.5",
    2: "min-w-2",
    2.5: "min-w-2.5",
    3: "min-w-3",
    3.5: "min-w-3.5",
    4: "min-w-4",
    5: "min-w-5",
    6: "min-w-6",
    7: "min-w-7",
    8: "min-w-8",
    9: "min-w-9",
    10: "min-w-10",

    // Medium Widths (44-96px)
    11: "min-w-11",
    12: "min-w-12",
    13: "min-w-13",
    14: "min-w-14",
    15: "min-w-15",
    16: "min-w-16",
    17: "min-w-17",
    18: "min-w-18",
    19: "min-w-19",
    20: "min-w-20",
    24: "min-w-24",

    // Large Widths (112-384px)
    28: "min-w-28",
    32: "min-w-32",
    36: "min-w-36",
    40: "min-w-40",
    44: "min-w-44",
    48: "min-w-48",
    52: "min-w-52",
    56: "min-w-56",
    60: "min-w-60",
    64: "min-w-64",
    72: "min-w-72",
    80: "min-w-80",
    96: "min-w-96",

    // Percentage-Based Widths (Cross-platform compatible)
    half: "min-w-[50%]", // 50%
    third: "min-w-[33.33333%]", // 33.333%
    twoThirds: "min-w-[66.667%]", // 66.667%
    quarter: "min-w-[25%]", // 25%
    threeQuarters: "min-w-[75%]", // 75%
    fifth: "min-w-[20%]", // 20%
    twoFifths: "min-w-[40%]", // 40%
    threeFifths: "min-w-[60%]", // 60%
    fourFifths: "min-w-[80%]", // 80%
    sixth: "min-w-[16.667%]", // 16.667%
    fiveSixths: "min-w-[83.333%]", // 83.333%

    // Full Widths
    full: "min-w-full", // 100%
    screen: "min-w-screen", // 100vh (web) / screen height (native)

    // Special Values (NativeWind 4 compatible)
    none: "min-w-none", // none
    min: "min-w-min", // min-content
    max: "min-w-max", // max-content
    fit: "min-w-fit",

    "3xs": "min-w-3xs",
    "2xs": "min-w-2xs",
    xs: "min-w-xs",
    sm: "min-w-sm",
    md: "min-w-md",
    lg: "min-w-lg",
    xl: "min-w-xl",
    "2xl": "h-2xl",
    "3xl": "min-w-3xl",
    "4xl": "min-w-4xl",
    "5xl": "min-w-5xl",
    "6xl": "min-w-6xl",
    "7xl": "min-w-7xl",

    "5px": "min-w-[5px]",
    "10px": "min-w-[10px]",
    "15px": "min-w-[15px]",
    "20px": "min-w-[20px]",
    "25px": "min-w-[25px]",
    "30px": "min-w-[30px]",
    "35px": "min-w-[35px]",
    "40px": "min-w-[40px]",
    "45px": "min-w-[45px]",
    "50px": "min-w-[50px]",
    "55px": "min-w-[55px]",
    "60px": "min-w-[60px]",
    "65px": "min-w-[65px]",
    "70px": "min-w-[70px]",
    "75px": "min-w-[75px]",
    "80px": "min-w-[80px]",
    "85px": "min-w-[85px]",
    "90px": "min-w-[90px]",
    "95px": "min-w-[95px]",
    "100px": "min-w-[100px]",
    "110px": "min-w-[110px]",
    "120px": "min-w-[120px]",
    "130px": "min-w-[130px]",
    "140px": "min-w-[140px]",
    "150px": "min-w-[150px]",
    "160px": "min-w-[160px]",
    "170px": "min-w-[170px]",
    "180px": "min-w-[180px]",
    "190px": "min-w-[190px]",
    "200px": "min-w-[200px]",
  },

  width: {
    // Fixed Widths - Pixel Values (0-10)
    0: "w-0",
    px: "w-px",
    0.5: "w-0.5",
    1: "w-1",
    1.5: "w-1.5",
    2: "w-2",
    2.5: "w-2.5",
    3: "w-3",
    3.5: "w-3.5",
    4: "w-4",
    5: "w-5",
    6: "w-6",
    7: "w-7",
    8: "w-8",
    9: "w-9",
    10: "w-10",

    // Medium Widths (44-96px)
    11: "w-11",
    12: "w-12",
    13: "w-13",
    14: "w-14",
    15: "w-15",
    16: "w-16",
    17: "w-17",
    18: "w-18",
    19: "w-19",
    20: "w-20",
    24: "w-24",

    // Large Widths (112-384px)
    28: "w-28",
    32: "w-32",
    36: "w-36",
    40: "w-40",
    44: "w-44",
    48: "w-48",
    52: "w-52",
    56: "w-56",
    60: "w-60",
    64: "w-64",
    72: "w-72",
    80: "w-80",
    96: "w-96",

    // Percentage-Based Widths (Cross-platform compatible)
    half: "w-[50%]", // 50%
    third: "w-[33.33333%]", // 33.333%
    twoThirds: "w-[66.667%]", // 66.667%
    quarter: "w-[25%]", // 25%
    threeQuarters: "w-[75%]", // 75%
    fifth: "w-[20%]", // 20%
    twoFifths: "w-[40%]", // 40%
    threeFifths: "w-[60%]", // 60%
    fourFifths: "w-[80%]", // 80%
    sixth: "w-[16.667%]", // 16.667%
    fiveSixths: "w-[83.333%]", // 83.333%

    // Full Widths
    full: "w-full", // 100%
    screen: "w-screen", // 100vh (web) / screen height (native)

    // Special Values (NativeWind 4 compatible)
    none: "w-none", // none
    min: "w-min", // min-content
    max: "w-max", // max-content
    fit: "w-fit",

    "3xs": "w-3xs",
    "2xs": "w-2xs",
    xs: "w-xs",
    sm: "w-sm",
    md: "w-md",
    lg: "w-lg",
    xl: "w-xl",
    "2xl": "h-2xl",
    "3xl": "w-3xl",
    "4xl": "w-4xl",
    "5xl": "w-5xl",
    "6xl": "w-6xl",
    "7xl": "w-7xl",

    "5px": "w-[5px]",
    "10px": "w-[10px]",
    "15px": "w-[15px]",
    "20px": "w-[20px]",
    "25px": "w-[25px]",
    "30px": "w-[30px]",
    "35px": "w-[35px]",
    "40px": "w-[40px]",
    "45px": "w-[45px]",
    "50px": "w-[50px]",
    "55px": "w-[55px]",
    "60px": "w-[60px]",
    "65px": "w-[65px]",
    "70px": "w-[70px]",
    "75px": "w-[75px]",
    "80px": "w-[80px]",
    "85px": "w-[85px]",
    "90px": "w-[90px]",
    "95px": "w-[95px]",
    "100px": "w-[100px]",
    "110px": "w-[110px]",
    "120px": "w-[120px]",
    "130px": "w-[130px]",
    "140px": "w-[140px]",
    "150px": "w-[150px]",
    "160px": "w-[160px]",
    "170px": "w-[170px]",
    "180px": "w-[180px]",
    "190px": "w-[190px]",
    "200px": "w-[200px]",
  },
} as const;
