import type { NextConfig } from "next";
import path from "path";
import fs from "fs";
import { DefinePlugin } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  webpack: (config, context) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...getAliasesFromTSConfig(),
      "react-native$": "react-native-web", // Redirect React Native imports to React Native Web
      "react-dom$": path.resolve(__dirname, "./node_modules/react-dom"),
    };
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/react-native-vector-icons/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel"], // Ensures compatibility with Next.js
        },
      },
    });
    // Add a rule to handle .ttf files
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource', // This handles font files correctly
    });
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    // Expose __DEV__ from Metro.
    config.plugins.push(
      new DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      })
    );
    // Handle .css files correctly
    /* config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    }); */
    return config;
  },
  experimental: {
    forceSwcTransforms: true,
  },
  transpilePackages: ["@resk/native", 'react-native-web', "react-native-vector-icons"],
};

export default nextConfig;

function getAliasesFromTSConfig() {
  const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) return {};
  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    const paths = Object.assign({}, tsconfig?.compilerOptions?.paths);
    const aliases = {};
    Object.keys(paths).forEach((alias) => {
      if (alias) {
        const key = alias.replace('/*', ''); // Remove wildcard
        const value = path.resolve(__dirname, paths[alias][0].replace('/*', ''));
        (aliases as any)[key] = value;
      }
    });
    return aliases;
  } catch (e) {
    console.log(" gettinng aliases from tsconfig : ",tsconfigPath,e);
  }
  return {};
}