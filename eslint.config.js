import eslintPluginAstro from 'eslint-plugin-astro';
export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
    ignores: [
      'dist/*',
      '.netlify/*',
      '.astro/*',
      'node_modules/*',
      'npm-debug.log*',
      'pnpm-debug.log*',
      '**/.env',
      '**/.env.production',
      '**/.DS_Store',
    ],
  },
];
