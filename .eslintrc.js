module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@next/next/no-img-element': 'warn'
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
    'build/',
    'mobile/TurfApp/lib/',
    'scripts/',
  ],
}; 