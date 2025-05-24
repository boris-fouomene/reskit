import type { NextConfig } from "next";
import path from "path";

const resolveExtensions = [
  '.next.js',
  '.next.jsx',
  '.next.ts',
  '.next.tsx',
  '.web.js',
  '.web.jsx',
  '.web.ts',
  '.web.tsx',
];
export default function (phase: string, { defaultConfig }: { defaultConfig: NextConfig }) {
  const isServer = true;
  const nextConfig: NextConfig = {
    ...defaultConfig,
    reactStrictMode: true,
    /* config options here */
    transpilePackages: [
      "expo",
      "expo-modules-core",
      'react-native',
      "nativewind",
      "react-native-css-interop",
      "react-native-reanimated",
      "react-native-vector-icons",
      "react-native-safe-area-context"
    ],
    turbopack: {
      root: path.join(__dirname, "..", '..'),
      resolveAlias: {
        'react-native': "react-native-web",
      },
      resolveExtensions: [
        ...resolveExtensions,
        '.js', '.jsx', '.ts', '.tsx', '.json'
      ],
    },
  };
  return nextConfig;
}