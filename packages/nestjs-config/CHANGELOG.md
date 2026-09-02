# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

First release from the [sklv-labs/ts](https://github.com/sklv-labs/ts) monorepo, replacing the
standalone `@sklv-labs/ts-nestjs-config` package.

### Added

- `ConfigModule` with `forRoot` and `forRootAsync`.
- `BaseConfigService` and the `ServiceBaseConfigService` / `baseEnvSchema` presets.
- Zod-validated, type-safe environment loading with `dotenv` + `dotenv-expand`.

### Changed

- Targets NestJS 12 (`@nestjs/common` and `@nestjs/core` `^12.0.0`).
