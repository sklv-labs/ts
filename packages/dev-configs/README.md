# @sklv-labs/dev-configs

Shared TypeScript, oxlint, Prettier and commitlint configuration.

```bash
pnpm add -D @sklv-labs/dev-configs typescript oxlint oxlint-tsgolint prettier
```

## TypeScript

```json
{
  "extends": "@sklv-labs/dev-configs/tsconfig/base.json",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts"]
}
```

`tsconfig/nestjs.json` adds `experimentalDecorators`, `emitDecoratorMetadata` and relaxes
`strictPropertyInitialization`, which NestJS needs.

Both target ES2024 with `module: nodenext` and enable `strict` plus `noUncheckedIndexedAccess`.

## oxlint

oxlint resolves `extends` as a **file path**, not a package specifier, so the path goes through
`node_modules`:

```json
{
  "extends": ["./node_modules/@sklv-labs/dev-configs/oxlint/base.json"]
}
```

Use `oxlint/nestjs.json` for NestJS code. Run with `oxlint --type-aware` to enable the rules that
need type information; that requires `oxlint-tsgolint`.

`base.json` turns two rules off deliberately:

- `typescript/no-unsafe-type-assertion` — branded types cannot be produced without an assertion,
  so the rule fires on correct code.
- `typescript/no-unnecessary-type-parameters` — a branded-type helper takes the brand as a type
  parameter used once by design; that is the API, not an accident.

`nestjs.json` additionally turns off two rules:

- `typescript/no-extraneous-class` — a Nest module is a class whose only members are static
  factories.
- `typescript/consistent-type-imports` — Nest reads constructor parameter types from
  `design:paramtypes` at runtime and `ValidationPipe` needs the DTO class itself, neither of which
  the rule can see. Taking its advice erases the metadata and breaks dependency injection and
  request validation with no compile error.

## Prettier, commitlint, lint-staged

```jsonc
// .prettierrc
"@sklv-labs/dev-configs/prettier"
```

```json
// .commitlintrc.json
{ "extends": ["@sklv-labs/dev-configs/commitlint"] }
```

```js
// package.json "lint-staged", or .lintstagedrc.js
module.exports = require('@sklv-labs/dev-configs/lint-staged');
```

commitlint extends `@commitlint/config-conventional`; install it alongside.

## License

MIT
