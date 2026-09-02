---
name: new-package
description: Scaffold a new @sklv-labs package in this monorepo with the correct manifest, tsconfig, exports and changeset. Use when adding a package to sklv-labs/ts, or when asked to "add a package", "create a new package", or to port a package in from sklv-legacy.
---

# Add a package to sklv-labs/ts

There is no boilerplate repository — it was deleted, because everything it contained now lives at
the monorepo root. Copy the shape of an existing package instead.

Pick the closest model: `packages/core` for a framework-agnostic package, `packages/nestjs-config`
for a NestJS one.

## 1. Files

A package needs exactly these. Anything else belongs at the root.

```
packages/<name>/
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
├── LICENSE          copy from a sibling
└── src/index.ts
```

Add `.oxlintrc.json` extending `../../node_modules/@sklv-labs/dev-configs/oxlint/nestjs.json`
**only** for NestJS packages. Do not add a lint, test, prettier or commitlint config — those are
root-level and repo-wide.

## 2. tsconfig.json

```json
{
  "extends": "@sklv-labs/dev-configs/tsconfig/base.json",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts"]
}
```

Use `tsconfig/nestjs.json` for NestJS packages — it adds decorator metadata.

## 3. package.json

Start at version `0.1.0` and let Changesets move it from there.

```json
{
  "name": "@sklv-labs/<name>",
  "version": "0.1.0",
  "type": "commonjs",
  "license": "MIT",
  "author": "sklv-labs",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sklv-labs/ts.git",
    "directory": "packages/<name>"
  },
  "publishConfig": { "access": "public", "provenance": true },
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "files": ["dist", "README.md", "CHANGELOG.md", "LICENSE"],
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf dist coverage *.tsbuildinfo",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": { "@sklv-labs/dev-configs": "workspace:*" },
  "engines": { "node": ">=24.0.0" }
}
```

Rules that matter:

- `exports` uses a single `default` condition. These are CommonJS packages; an `import` condition
  pointing at a CJS file is a false claim that `publint` will flag.
- Only `build`, `clean` and `type-check` scripts. `lint` and `test` run from the root.
- Depend on a sibling package with `"@sklv-labs/other": "workspace:^"` — Changesets rewrites it to
  a real range at publish time.
- Put a dependency in `peerDependencies` only if the consumer must own the instance (frameworks,
  `reflect-metadata`). Do not list something you do not import — that was the bug in the old
  `nestjs-config`, which peered on `@nestjs/core` and `rxjs` while importing neither.

## 4. Wire it up

```bash
pnpm install                                  # links the workspace package
pnpm build && pnpm type-check && pnpm lint && pnpm test
cd packages/<name> && npx publint              # after any exports change
```

## 5. Changeset

```bash
pnpm changeset
```

Pick the new package, choose `minor`, and describe what it provides. Commit the generated file with
the code. Never edit `version` by hand.

## Porting from sklv-legacy

The pre-monorepo repositories are at `../sklv-legacy/<name>/` with full git history. Copy `src/`,
`README.md` and `CHANGELOG.md`, then write a fresh manifest from the template above — do not copy
the old `package.json`, `.husky/`, `.github/`, `eslint.config.mjs`, `jest.config.js` or any
dotfile. Those repos were on ESLint and ts-jest, which do not work on TypeScript 7.

Check what the source actually imports before writing dependencies:

```bash
grep -rhoE "from '[^']+'" ../sklv-legacy/<name>/src | sort -u
```
