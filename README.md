<div align="center">
  <h1 align="center">⚓️ <code>keel</code></h1>

  <p align="center">
    <strong>A template for TypeScript libraries</strong>
  </p>
</div>

Keel starts a library with pnpm, tsdown, Adamantite, vitest, Changesets, and Packref already set up.

## Start a library

1. Create a repository from this template on GitHub, then clone it.
2. Run `pnpm install`.
3. Run `pnpm run init`. It asks for the package name, emoji, description, and GitHub owner, rewrites the files that name the template, and deletes itself.
4. Replace the example in `src/` with your library.
5. Push, then run `scripts/setup-repo.sh` to protect `main` and require every CI job.
6. On npm, add this repository's `release.yml` workflow as a trusted publisher.

## Layout

- `src/index.ts` exports the public API. Everything else stays internal.
- `src/lib/` holds the library logic in folders whose imports point one way. `oxlint.config.ts` enforces the direction with `no-restricted-imports`; give each new folder an override that lists the folders above it.
- Code imports with `#` subpath imports, such as `#lib/shared/errors.ts`.
- Tests sit in a `__tests__/` folder beside the file they test, with the same name. `src/__tests__/types.test-d.ts` tests the public types with `expectTypeOf`.

## Scripts

| Script                  | What it does                                                       |
| ----------------------- | ------------------------------------------------------------------ |
| `pnpm run check`        | Formatting, lint, and types, including `types.test-d.ts`           |
| `pnpm run fix`          | Formatting and safe lint fixes                                     |
| `pnpm run analyze`      | Unused files, exports, and dependencies                            |
| `pnpm run test`         | Unit tests                                                         |
| `pnpm run test:compat`  | Runs the built package on the `engines.node` floor                 |
| `pnpm run build:verify` | Builds, packs, installs, and type-checks the package as a consumer |

## CI

| Workflow         | Jobs                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `adamantite.yml` | `check`, `analyze`                                                   |
| `test.yml`       | `unit`, `compat`                                                     |
| `build.yml`      | `build`                                                              |
| `release.yml`    | Waits for the jobs above, then versions or publishes with Changesets |
| `pullfrog.yml`   | Pullfrog review agent                                                |
