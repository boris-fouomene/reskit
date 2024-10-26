const withStorybook = require("@storybook/react-native/metro/withStorybook");
const path = require("path");

module.exports = function () {
  const config = require("@resk/expo/metro.config")();
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    const defaultResolveResult = context.resolveRequest(
      context,
      moduleName,
      platform
    );
  
    if (
      process.env.STORYBOOK_ENABLED !== "true" &&
      defaultResolveResult?.filePath?.includes?.(".ondevice/")
    ) {
      return {
        type: "empty",
      };
    }
  
    return defaultResolveResult;
  };
  return withStorybook(config, {
    enabled: true,
    enabled: process.env.STORYBOOK_ENABLED === "true",
    configPath: path.resolve(__dirname, "./.ondevice"),
    // See API section below for available options
  });
}