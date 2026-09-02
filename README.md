# sklv-labs/ts

Monorepo for the `@sklv-labs` TypeScript packages.

| Package                                              | Description                                               |
| ---------------------------------------------------- | --------------------------------------------------------- |
| [`@sklv-labs/core`](packages/core)                   | Branded UUIDs, environment helpers, shared enums          |
| [`@sklv-labs/nestjs-config`](packages/nestjs-config) | Zod-validated configuration module for NestJS 12          |
| [`@sklv-labs/dev-configs`](packages/dev-configs)     | Shared TypeScript, oxlint, Prettier and commitlint config |

## Requirements

Node.js >= 24 and pnpm 11. `corepack enable` picks up the pinned version from `packageManager`.

```bash
pnpm install
pnpm build
```

## Tasks

`build` and `type-check` run per package through Turborepo, which orders them by the dependency
graph and caches results. `lint`, `test` and `format` run once for the whole repo.

| Command           | Runs                                         |
| ----------------- | -------------------------------------------- |
| `pnpm build`      | `tsc` per package, in topological order      |
| `pnpm type-check` | `tsc --noEmit` per package                   |
| `pnpm lint`       | `oxlint --type-aware` across the repo        |
| `pnpm lint:fix`   | the same, with `--fix`                       |
| `pnpm test`       | `vitest run`, one project per package        |
| `pnpm test:cov`   | the same, with V8 coverage                   |
| `pnpm format`     | Prettier over everything                     |
| `pnpm clean`      | remove `dist/`, `coverage/`, `*.tsbuildinfo` |

Scope to one package with `pnpm --filter @sklv-labs/core build`.

## Toolchain

TypeScript 7 (the native compiler), [oxlint](https://oxc.rs) with type-aware rules via
`oxlint-tsgolint`, Vitest, Prettier, Changesets. oxlint is the linter rather than ESLint because
`typescript-eslint` does not support TypeScript 7; `oxlint-tsgolint` runs on typescript-go and
tracks it directly.

## Configuration

One config file per tool at the repo root. Each one points at
[`@sklv-labs/dev-configs`](packages/dev-configs) rather than restating settings:

```
.oxlintrc.json        extends dev-configs/oxlint/base.json
.prettierrc           "@sklv-labs/dev-configs/prettier"
.commitlintrc.json    extends @sklv-labs/dev-configs/commitlint
vitest.config.ts      projects: packages/*
turbo.json            build + type-check task graph
package.json          "lint-staged" key
```

`packages/*/tsconfig.json` is the one config that must be per package, because `rootDir` and
`outDir` differ. `packages/nestjs-config/.oxlintrc.json` extends the NestJS oxlint preset instead
of the base one.

## Internal dependencies

Packages depend on each other with `workspace:^`, so pnpm links the local source. Changesets
rewrites it to a real version range when publishing.

## Releasing

1. Commit your change.
2. `pnpm changeset` — pick the packages, the bump, and write the note. Commit the generated file.
3. On merge to `main`, the Release workflow opens a `chore(release): version packages` PR that
   applies the changesets and updates each `CHANGELOG.md`.
4. Merge it. The workflow publishes to npm with provenance.

Versions are independent per package. Bumping `core` patch-bumps `nestjs-config`, which depends on
it. The workflow needs one repository secret, `NPM_TOKEN`.

## Conventions

Conventional Commits, enforced by commitlint on `commit-msg`. `lint-staged` runs oxlint and
Prettier on staged files at `pre-commit`. Both hooks are installed by husky via `prepare`.

## Where things live in the org

One monorepo per language ecosystem, not one for the whole org — npm packages version through
Changesets and a publish step, Go modules version through git tags and have no publish step.

```
github.com/sklv-labs/
├─ ts          this repo
├─ .github     org profile, reusable workflows
└─ guidelines  language and architecture guidelines
```

Services, templates and prose docs live in their own repositories.

## License

MIT
