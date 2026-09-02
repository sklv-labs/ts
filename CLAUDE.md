# sklv-labs/ts

pnpm + Turborepo monorepo publishing the `@sklv-labs` packages. Node >= 24, pnpm 11 via corepack.

## Toolchain — do not swap these back

**TypeScript 7** (the native compiler), **oxlint** with type-aware rules, **Vitest**, Prettier,
Changesets.

The linter is oxlint, **not ESLint**, and this is not a preference — `typescript-eslint` declares
`typescript@>=4.8.4 <6.1.0`, so it cannot run on TS 7 at all. `ts-jest` declares
`typescript@>=4.3 <7` and is out for the same reason. If you find yourself adding `eslint`,
`typescript-eslint` or `ts-jest`, you are about to break the build.

Prettier stays because `oxfmt` is still 0.x.

## Lint and test run once, repo-wide

`pnpm lint` is `oxlint --type-aware` over the whole repo. `pnpm test` is one Vitest run with
`projects: packages/*`. Only `build` and `type-check` fan out per package through Turbo, because
they need each package's `tsconfig.json`.

Do not add a per-package lint or test config, and do not add `lint`/`test` tasks to `turbo.json`.

## Lint rules go in config, never inline

If a rule fires on correct code, decide whether it is wrong for a _class_ of code or for one line.
Class of code → turn it off in `packages/dev-configs/oxlint/base.json` (or `oxlint/nestjs.json`)
and explain why in that package's README, since JSON cannot hold comments. One line → an
`// oxlint-disable-next-line rule -- reason` comment.

Two exceptions are already declared and intentional: `no-unsafe-type-assertion` and
`no-unnecessary-type-parameters` are off, because branded types cannot be produced without an
assertion and the brand is a type parameter used once by design.

oxlint resolves `extends` as a **file path**, not a package specifier, hence
`./node_modules/@sklv-labs/dev-configs/oxlint/base.json`.

## Config files

One file per tool at the root, each pointing at `@sklv-labs/dev-configs`. Never write a config
whose body is `module.exports = require('...')` — every tool here has a native `extends`. The only
legitimate per-package config is `tsconfig.json`, because `rootDir` and `outDir` differ.

## Versions are owned by Changesets

Never hand-edit a `version` field. Run `pnpm changeset`, commit the generated file. On merge to
`main`, CI opens a version PR; merging that publishes and tags.

This needs the org setting `can_approve_pull_request_reviews: true`, which is already enabled — if
a release fails with "GitHub Actions is not permitted to create or approve pull requests", that is
what regressed.

## Packaging

CJS packages: `"type": "commonjs"` and a single `default` condition in `exports`. Do not add an
`import` condition claiming ESM for a CommonJS file. Verify with `npx publint` in the package
directory before changing `exports`.

## Traps

- **`dotenv-expand` must stay `^13.0.0`.** `1000.0.0` is the maintainer's "use dotenvx instead"
  marker, not a release.
- **`Environments` is a TS `enum`**, so it is not erasable syntax. Node's native type stripping and
  `erasableSyntaxOnly` cannot be used unless it becomes a const object.
- **`ConfigModule.forRoot` replaces `process.env`** so zod-coerced types survive. Values are
  therefore not guaranteed strings and are not inherited by child processes.
- Local `node` on this machine is 22 via proto; the repo needs 24. Use `corepack pnpm`, or put
  `~/.nvm/versions/node/v24.12.0/bin` first on `PATH`.

## Writing

Conventional Commits, enforced by commitlint. READMEs are plain prose — no emoji, no bold feature
bullets, no marketing tone. Say what a thing does and what will bite the reader.
