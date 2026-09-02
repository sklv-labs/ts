# sklv-labs

Monorepo for the `@sklv-labs` TypeScript packages.

| Package                                              | Description                                          |
| ---------------------------------------------------- | ---------------------------------------------------- |
| [`@sklv-labs/core`](packages/core)                   | Framework-agnostic TypeScript primitives             |
| [`@sklv-labs/nestjs-config`](packages/nestjs-config) | Type-safe configuration module for NestJS 12         |
| [`@sklv-labs/dev-configs`](packages/dev-configs)     | Shared TypeScript / ESLint / Prettier / Jest presets |

Every package in this repo consumes `dev-configs` through `workspace:*`, so a preset change and the
code it affects land in one commit.

## Requirements

- Node.js >= 24
- pnpm >= 9.9 (`corepack enable` picks up the pinned version from `packageManager`)

## Getting started

```bash
pnpm install
pnpm build
```

## Tasks

Every task runs through [Turborepo](https://turborepo.com), which respects the dependency graph
(`nestjs-config` builds only after `core`) and caches results in `.turbo/`.

| Command           | What it does                                 |
| ----------------- | -------------------------------------------- |
| `pnpm build`      | `tsc` in each package, topologically ordered |
| `pnpm type-check` | `tsc --noEmit` in each package               |
| `pnpm lint`       | ESLint over `src/**/*.ts`                    |
| `pnpm lint:fix`   | ESLint with `--fix`                          |
| `pnpm test`       | Jest in each package                         |
| `pnpm test:cov`   | Jest with coverage                           |
| `pnpm format`     | Prettier over the whole repo                 |
| `pnpm clean`      | remove `dist/`, `coverage/`, `*.tsbuildinfo` |

Scope a task to one package:

```bash
pnpm --filter @sklv-labs/core build
pnpm turbo run test --filter=@sklv-labs/nestjs-config
```

## Internal dependencies

Packages depend on each other with the `workspace:^` protocol, so `pnpm` symlinks the local source
instead of downloading from npm:

```json
"dependencies": {
    "@sklv-labs/core": "workspace:^"
}
```

At publish time Changesets rewrites `workspace:^` to the real version range, so consumers on npm get
a normal `^0.1.1`.

## Releasing

Versioning and publishing are handled by [Changesets](https://github.com/changesets/changesets).

1. Make your change and commit it.
2. `pnpm changeset` — select the affected packages, the bump type, and write the release note.
   Commit the generated file in `.changeset/`.
3. Merge to `main`. The **Release** workflow opens a `chore(release): version packages` PR that
   applies every pending changeset, bumps versions and updates each `CHANGELOG.md`.
4. Merge that PR — the workflow publishes the bumped packages to npm with provenance.

Versions are **independent** per package. Bumping `core` automatically patch-bumps
`nestjs-config`, because it depends on it.

The workflow needs one repository secret: `NPM_TOKEN` (an npm automation token with publish rights
on the `@sklv-labs` scope).

## Conventions

- Conventional Commits, enforced by `commitlint` on `commit-msg`.
- `lint-staged` runs ESLint and Prettier on staged files at `pre-commit`.
- Both hooks are installed by `husky` via the root `prepare` script.

## Where things live in the org

One monorepo **per language ecosystem**, not one for the whole org — release mechanics do not mix
(npm versions via Changesets and a publish step; Go modules version via git tags with no publish
step at all).

```
github.com/sklv-labs/
├─ ts                        this repo — publishable TypeScript packages
├─ .github                   org profile, reusable workflows, org-level secrets
├─ guidelines                language/architecture guidelines, docs only
├─ nestjs-service-template   GitHub template repo for a new deployable service
└─ go                        added only when there is real Go code
```

The npm scope `@sklv-labs` is language-neutral and stays as-is; inside this repo the `ts-` prefix is
redundant, so packages are named `@sklv-labs/core`, `@sklv-labs/nestjs-config`, and so on.

What does **not** belong here:

- **Services / apps.** They are separately deployable and have their own lifecycle. They consume
  these packages from npm.
- **Templates.** `gh repo create --template` cannot point at a monorepo subdirectory, so boilerplate
  for a new service stays its own repository, flagged as a template.
- **Guidelines and other prose.** Docs repos have no build, no tests and no releases; they gain
  nothing from the workspace.

## Adding a package

See [MIGRATION.md](MIGRATION.md).

## License

MIT
