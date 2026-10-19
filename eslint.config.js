const js = require('@eslint/js');
const cypress = require('eslint-plugin-cypress');
const prettier = require('eslint-config-prettier');
module.exports = [
  {
    ignores: [
      'node_modules/**',
      'cypress/reports/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
  { ...cypress.configs.recommended, files: ['cypress/**/*.js'] },
  prettier,
];
