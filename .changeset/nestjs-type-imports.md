---
'@sklv-labs/dev-configs': patch
---

Turn off `typescript/consistent-type-imports` in the NestJS oxlint preset.

NestJS resolves constructor parameters from `design:paramtypes` metadata at runtime, and
`ValidationPipe` needs the DTO class itself to run class-validator. The rule cannot see either, so
it reports injected classes and DTOs as type-only imports — and applying its fix erases the
metadata, breaking dependency injection and request validation with no compile error.
