# Changelog

## 0.1.1

### Patch Changes

- 7cbc371: Move the toolchain to TypeScript 7, oxlint and Vitest.
  
  `@sklv-labs/dev-configs` replaces its ESLint and Jest presets with oxlint configuration and drops
  all six of its runtime dependencies. `presets/base/*` and `presets/nestjs/*` move to
  `tsconfig/base.json` and `tsconfig/nestjs.json`, and the Prettier, commitlint and lint-staged
  configs are now exported as `./prettier`, `./commitlint` and `./lint-staged`. This is a breaking
  change for anything importing the old paths.
  
  `@sklv-labs/nestjs-config` drops `@nestjs/core` and `rxjs` from its peer dependencies — neither was
  imported. `exports` now uses a single `default` condition instead of claiming both `import` and
  `require` for the same CommonJS file.
  
  `@sklv-labs/core` fixes `getEnvironment`, which cast `NODE_ENV` to `Environments` without checking
  it, so any string was reported as a valid environment. It now returns `undefined` for values
  outside the enum. The `Uuid` brand moved to a `unique symbol`, which is a type-level change only.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.0

First release from the [sklv-labs/ts](https://github.com/sklv-labs/ts) monorepo, replacing the
standalone `@sklv-labs/ts-core` package.

### Added

- `Uuid<B>` branded type with `uuid`, `isUuid` and `asUuid` (UUID v7).
- Environment helpers: `getAppName`, `getAppVersion`, `getFullAppName`, `getEnvironment`,
  `isDevelopment`, `isProduction`, `isTest`.
- `Environments` enum.
