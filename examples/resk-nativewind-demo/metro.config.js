const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require("path");

// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

//config.watchFolders = [path.resolve(__dirname), path.resolve(__dirname, "..", "..", "packages/resk-nativewind/build")];

module.exports = withNativeWind(config, { input: './global.css' });
