# Changelog

## 0.2.1

### Patch Changes

- 4d1e136: Stop `baseEnvSchema` from requiring `npm_package_name` and `npm_package_version`.
  
  npm and pnpm set those variables only when a process is started through a package script, so a
  service run as `node dist/main.js` — which is what a container `CMD` normally does — failed
  validation and exited at boot with `Invalid input: expected string, received undefined`. Both now
  default to `'unknown'`, matching `getAppName()` and `getAppVersion()` in `@sklv-labs/core`.

## 0.2.0

### Minor Changes

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

### Patch Changes

- Updated dependencies [7cbc371]
  - @sklv-labs/core@0.1.1

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.0

First release from the [sklv-labs/ts](https://github.com/sklv-labs/ts) monorepo, replacing the
standalone `@sklv-labs/ts-nestjs-config` package.

### Added

- `ConfigModule.forRoot`, `BaseConfigService`, `ServiceBaseConfigService`, `baseEnvSchema`
  and `loadEnv`.

### Changed

- Targets NestJS 12.
