# Changelog

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
