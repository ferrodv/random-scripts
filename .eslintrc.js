module.exports = {
  extends: "airbnb-typescript-prettier",
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'no-console': 'off',
    'no-await-in-loop': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    'no-promise-executor-return': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  },
};