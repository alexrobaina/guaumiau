module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@stores': './src/stores',
          '@services': './src/services',
          '@navigation': './src/navigation',
          '@types': './src/types',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
