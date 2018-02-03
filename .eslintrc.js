module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    node: true,
    mocha: true,
    es6: true,
  },
  extends: 'eslint:recommended',
  rules: {
    'eol-last': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 1}],
    'no-unexpected-multiline': ['error'],
    'no-trailing-spaces': ['error'],
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'always'],
    'quotes': ['error', 'single'],
  },
}
