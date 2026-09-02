import nestjsEslint from '@sklv-labs/ts-dev-configs/eslint/nestjs';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...nestjsEslint,

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
