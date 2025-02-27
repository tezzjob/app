import globals from "globals";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: { globals: globals.browser },
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    }
  },
  {settings: {
      react: {
        version: 'detect',
      },
    }},
  {
    plugins: {
      react: require('eslint-plugin-react'),
    },
  },
];