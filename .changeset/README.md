# Changesets

This folder holds [changesets](https://github.com/changesets/changesets): one markdown file per
pending release note.

## Workflow

1. Make your change in `packages/*`.
2. Run `pnpm changeset` — pick the affected packages and the bump (patch / minor / major), then
   write the release note. This creates a file in this folder; commit it with your change.
3. On merge to `main`, the Release workflow opens (or updates) a **"chore(release): version
   packages"** PR that consumes every pending changeset, bumps versions and writes CHANGELOGs.
4. Merging that PR publishes the bumped packages to npm.

Internal dependencies are handled automatically: bumping `@sklv-labs/core` patch-bumps
`@sklv-labs/nestjs-config`, and the `workspace:^` range is rewritten to a real version range at
publish time.
