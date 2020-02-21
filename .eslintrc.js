module.exports = {
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:security/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:node/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  env: {
    node: true
  },
  plugins: ['import', 'prettier', 'security', 'jest'],
  rules: {
    'prettier/prettier': ['error'],
    'node/exports-style': ['error', 'module.exports'],
    'node/file-extension-in-import': ['error', 'always'],
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/console': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-global/url-search-params': ['error', 'always'],
    'node/prefer-global/url': ['error', 'always'],
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error'
  }
};
