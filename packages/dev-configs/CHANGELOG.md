# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

First release from the [sklv-labs/ts](https://github.com/sklv-labs/ts) monorepo, replacing the
standalone `@sklv-labs/ts-dev-configs` package.

### Added

- `base` and `nestjs` presets for TypeScript, ESLint, Jest and Prettier.
- `presets/base/tsconfig.spec.json`, so non-NestJS packages no longer borrow the NestJS one.
- ESLint plugins are now declared as real `dependencies`, so the presets resolve under pnpm's
  strict `node_modules` layout without hoisting workarounds.

### Removed

- `src/index.ts` and the `presets/*/index.js` shims, which restated every path already declared
  in `exports`. Reference the subpath exports directly.
- The unused `react` preset and the vite / vitest / webpack / vscode configs.

### Fixed

- Presets no longer set `tsconfigRootDir` to their own location inside `node_modules`, which broke
  type-checked linting for consumers.
- Dropped rules for uninstalled plugins (`@darraghor/nestjs-typed/*`) and for
  `@typescript-eslint/interface-name-prefix`, which no longer exists.
