# @sklv-labs/dev-configs

Shared TypeScript, ESLint, Prettier and Jest presets for sklv-labs projects.

## Installation

```bash
pnpm add -D @sklv-labs/dev-configs eslint prettier typescript
# add jest + ts-jest too if you use the jest presets
```

## Presets

Two flavours: `base` for plain TypeScript, `nestjs` for NestJS packages (adds decorator metadata,
`prettier/prettier` as an error, and coverage thresholds).

`tsconfig.json`

```json
{
  "extends": "@sklv-labs/dev-configs/presets/base/tsconfig.json",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
  "include": ["src/**/*"]
}
```

`eslint.config.mjs`

```js
import baseEslint from '@sklv-labs/dev-configs/eslint/base';
import { defineConfig } from 'eslint/config';

export default defineConfig([...baseEslint]);
```

`jest.config.js` · `.prettierrc.js` · `commitlint.config.js` · `.lintstagedrc.js`

```js
module.exports = require('@sklv-labs/dev-configs/presets/base/jest.config.js');
module.exports = require('@sklv-labs/dev-configs/presets/base/prettier.js');
module.exports = require('@sklv-labs/dev-configs/configs/git/commitlint.js');
module.exports = require('@sklv-labs/dev-configs/configs/git/lint-staged.js');
```

Swap `base` for `nestjs` where a NestJS variant exists. The full list of importable paths is the
`exports` map in `package.json`.

## Notes

The presets set `projectService: true` but deliberately do **not** set `tsconfigRootDir` — ESLint
resolves it from the directory it runs in, which is what you want in a workspace.

`eslint`, `prettier`, `typescript`, `jest` and `ts-jest` are peer dependencies; the ESLint plugins
the presets import are ordinary dependencies, so they resolve under pnpm without hoisting.

## License

MIT
