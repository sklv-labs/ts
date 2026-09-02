import baseEslint from '@sklv-labs/ts-dev-configs/eslint/base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...baseEslint,

  // The shared preset resolves `tsconfigRootDir` relative to itself inside node_modules,
  // which does not work from a workspace package — re-anchor it to this package.
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
