export default ({ config }) => ({
  ...config,
  name: "@resk/expo-stories",
  slug: "resk-expo-stories",
  version: "1.0.0",
  entryPoint: process.env.STORYBOOK_ENABLED ? "index.storybook.tsx" : "expo/AppEntry.js",
  orientation: "portrait",
  icon: "./assets/icon.png",
  "plugins": [
    "expo-router"
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
  },
});
