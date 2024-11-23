const packageJson = require("./package.json");
export default ({ config }) => ({
  ...config,
  name: packageJson.name,
  slug: "resk-expo-stories",
  version: packageJson.version,
  entryPoint: "index",
  orientation: "portrait",
  icon: "./assets/icon.png",
  newArchEnabled : true,
  plugins : [
    "expo-router",
    "expo-sqlite"
  ],
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
  },
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler : "metro",
    output : "single"
  },
});
