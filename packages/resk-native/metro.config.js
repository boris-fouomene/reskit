const { getDefaultConfig } = require('expo/metro-config');
module.exports = function () {
  const isElectron = process.env.isElectronScript || process.env.isElectron;
  const path = require("path");
  const projectRoot = path.resolve(process.cwd());
  const config = getDefaultConfig(projectRoot);
  config.projectRoot = projectRoot;
  config.resolver.assetExts = [
    ...config.resolver.assetExts,
    "db",
    "txt"
  ];
  ["txt", 'tsx', 'ts', 'jsx', 'js', 'cjs', 'mjs'].map((ex) => {
    if (!config.resolver.sourceExts.includes(ex)) {
      config.resolver.sourceExts.push(ex);
    }
  });
  if (isElectron) {
    config.resolver.sourceExts = [
      ...config.resolver.sourceExts.map((ex) => {
        return `electron.${ex}`;
      }),
      ...config.resolver.sourceExts,
    ]
  }
  // Remove all console logs in production...
  //config.transformer.minifierConfig.compress.drop_console = false;
  return config;
}