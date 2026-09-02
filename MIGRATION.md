# Migrating a package into the monorepo

`core`, `nestjs-config` and `dev-configs` already live in `packages/`. The remaining repositories sit in
`../sklv-legacy/` and are still standalone on GitHub:

```
go-guidelines (docs only)        ts-nestjs-health
ts-nestjs-cls                    ts-nestjs-logger
ts-nestjs-database               ts-nestjs-observability
ts-nestjs-error                  ts-nestjs-openapi
ts-nestjs-health
```

Not everything belongs here — see the org layout notes in `README.md` for which of these become
workspace packages, which become template repos, and which become docs.

## Steps

1. **Copy the sources only.**

   ```bash
   mkdir -p packages/<name>
   cp -R ../sklv-legacy/<name>/src packages/<name>/src
   cp -R ../sklv-legacy/<name>/docs packages/<name>/docs        # if present
   cp ../sklv-legacy/<name>/{README.md,CHANGELOG.md,LICENSE} packages/<name>/
   ```

   Do **not** copy `.git`, `.github`, `.husky`, `node_modules`, `dist`, `.editorconfig`,
   `.gitignore`, `.prettierrc.js` or `commitlint.config.js` — all of those now live at the root.

2. **Copy the TypeScript, Jest and ESLint configs**, then re-anchor ESLint. The shared preset sets
   `tsconfigRootDir` relative to itself inside `node_modules`, which resolves to the wrong place
   from a workspace package, so append an override — copy `eslint.config.mjs` from an existing
   package and swap the preset import.

3. **Trim `package.json`:**
   - Remove every devDependency that is already in the root `package.json` (typescript, eslint and
     its plugins, prettier, jest, ts-jest, `@types/node`, `@types/jest`, commitlint,
     `@sklv-labs/dev-configs`). Keep only package-specific ones, e.g. `@nestjs/*`.
   - Remove the `version:patch` / `version:minor` / `version:major` scripts — Changesets owns
     versioning now.
   - Add `clean`, and `--passWithNoTests` to `test` if the package has no specs yet.
   - Point `repository` at this monorepo and add `"directory": "packages/<name>"`.
   - Add `"publishConfig": { "access": "public", "provenance": true }`.
   - Rewrite intra-repo dependencies to `workspace:^`.

4. **Un-ignore it** by verifying the build, then archive the standalone GitHub repository.

5. **Verify:**

   ```bash
   pnpm install
   pnpm build && pnpm type-check && pnpm lint && pnpm test
   ```

6. **Archive the old GitHub repository** so nobody pushes to it again. Published npm versions are
   unaffected; the next release simply comes from here.

## Gotchas seen so far

- **pnpm is strict about undeclared dependencies.** `@sklv-labs/dev-configs` imports
  `typescript-eslint`, `eslint-plugin-import-x`, `globals`, `@eslint/js`, `eslint-config-prettier`
  and `eslint-plugin-prettier` without declaring them, which is why the root `.npmrc` hoists
  `*eslint*`, `*prettier*` and `globals`. Fixing this properly means adding those as dependencies of
  `ts-dev-configs` and dropping the hoist patterns.
- **The base Jest preset lists `<rootDir>/test` in `roots`.** Jest hard-errors if that directory
  does not exist, so packages without a `test/` directory must override `roots`
  (see `packages/core/jest.config.js`).
- **Stale `eslint-disable` comments error out.** ESLint 9+ fails on a directive naming a rule from a
  plugin that is not installed — e.g. `@darraghor/nestjs-typed/*`, which nothing here depends on.
