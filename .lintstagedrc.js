module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'jest --findRelatedTests --passWithNoTests',
  ],
  '*.{json,md}': ['prettier --write'],
}; 