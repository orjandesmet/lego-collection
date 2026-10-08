export default {
  '*': 'prettier --write --ignore-unknown',
  '*.{js,ts,astro}': 'eslint --fix',
};
