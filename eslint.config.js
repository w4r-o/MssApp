// Standard ESLint config for React Native + TypeScript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.recommended,
  reactNative.configs.all,
  {
    plugins: {
      react,
      'react-native': reactNative,
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Not needed for React 17+
      'react-native/no-inline-styles': 'warn',
      'react/prop-types': 'off', // Using TypeScript for props
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]; 