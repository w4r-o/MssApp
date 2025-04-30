module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@services': './app/(tabs)/services',
            '@components': './app/components',
            '@utils': './app/utils'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
}; 