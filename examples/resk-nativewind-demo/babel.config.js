module.exports = function(api) {
  api.cache(true);
  return {
    
      presets: [
        ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
        'nativewind/babel',
      ],
    
    plugins : [
      /*** This plugin must be the last in the list */
      'react-native-reanimated/plugin',
    ],
  };
};
