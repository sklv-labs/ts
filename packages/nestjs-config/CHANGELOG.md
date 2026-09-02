# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- **Renamed from `@sklv-labs/ts-nestjs-config` to `@sklv-labs/nestjs-config`.** The package moved into the
  [sklv-labs/ts](https://github.com/sklv-labs/ts) monorepo, where the `ts-` prefix is redundant.
  The old name is deprecated on npm and receives no further releases.

## [0.1.0] - 2026-01-XX

### Added

- Initial release of @sklv-labs/nestjs-config
- `ConfigModule` with `forRoot` and `forRootAsync` methods for module configuration
- Comprehensive TypeScript type definitions
- Full documentation and usage examples

### Features

- **Type-Safe Configuration**: Full TypeScript support
- **Async Configuration**: Support for dependency injection in async module configuration
- **NestJS Native**: Built on top of NestJS with seamless integration
