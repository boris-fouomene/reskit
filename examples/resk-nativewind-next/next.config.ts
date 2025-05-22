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
  const serverExtensions = (isServer ? [
    '.server.js',
    '.server.jsx',
    '.server.ts',
    '.server.tsx',
  ] : ['.client.js', '.client.jsx', '.client.ts', '.client.tsx',]);
  const nextConfig: NextConfig = {
    ...defaultConfig,
    experimental: {

    },
    /* config options here */
    transpilePackages: [
      "expo",
      "expo-modules-core",
      'react-native',
      'react-native-web',
      '@transfergratis/ui',
      "nativewind",
      "@resk/nativewind",
      "react-native-css-interop",
      "react-native-reanimated",
      "react-native-vector-icons",
      "@expo/vector-icons",
      "react-native-safe-area-context"
    ],
    turbopack: {
      root: path.join(__dirname, "..", '..'),
      resolveAlias: {
        'react-native': "react-native-web",
      },
      resolveExtensions: [
        ...serverExtensions,
        ...resolveExtensions,
        '.js', '.jsx', '.ts', '.tsx', '.json'
      ],
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    }
  };
  return nextConfig;
}