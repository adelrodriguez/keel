# Coding Standards

Follow the TypeScript, public API, import, error, test, comment, and commit conventions of this library.

## TypeScript Style

- Write concise, technical TypeScript.
- Use functional and declarative patterns.
- Avoid enums.
- Use `readonly` arrays or maps with `as const`.
- Rely on type inference. Annotate function parameters, exported contracts, and values that TypeScript cannot infer, such as an empty array. Do not annotate local variables, return types, or callback parameters that TypeScript already infers.
- Declare functions with the `function` keyword.
- Use descriptive names without restating the context. Let the module supply the context.
- Group operations under the domain they act on, then name the operation with a verb.
- Use auxiliary verbs for state and behavior, such as `isEmpty`, `hasError`, or `canRetry`.
- Use lowercase kebab-case names for files and directories.
- Name a folder after the domain it serves, such as `src/lib/greeting/`. Do not name it after a mechanism, such as `utils/` or `helpers/`.
- Use named exports in `src/`. Use a default export only where a tool requires it, such as a config file.
- Order a module so that each part comes before the code that uses it: types, constants, helpers, and the exported functions last.
- Extract a function or constant when a second caller needs it or when it names a distinct concept. Do not add parameters, options, or overloads that no caller uses.
- When the order of object keys matters, such as when a library infers a type from an earlier key, do not disable `sort-keys`. Put the keys that must come later in their own group after a blank line, and add a comment above the group that explains the order. `sort-keys` sorts each group separately.

## Public API

- Each file in the root of `src/` is a public entry point, and only those files are. `src/index.ts` is the main entry point. Each other root file, such as `src/testing.ts`, is a separate export path.
- When you add a root file, add it to `entry` in `tsdown.config.ts` and to `exports` in `package.json`.
- Export from an entry point only what consumers use. Code in `src/lib/` stays internal and free to change.
- Treat each export as a contract. Removing or changing an export, a parameter, or a return type is a breaking change and needs a major changeset.
- Keep the package free of side effects on import (`"sideEffects": false`). Do not create clients, read environment variables, or set process-wide state at module load.
- Do not add a runtime dependency unless the library cannot work without it. Prefer a Node built-in or a few lines of code.
- Keep the code compatible with the `engines.node` floor in `package.json`. `pnpm run test:compat` checks this.

## Imports and Boundaries

- Import with `#` subpath imports and the full file extension, such as `#lib/shared/errors.ts`. The `import/no-relative-parent-imports` lint rule bans `../` imports.
- Code in `src/lib/` never imports an entry point. An entry point never imports another entry point.
- Folders in `src/lib/` form layers, and imports point one way. `shared/` is the bottom layer and imports no other `lib` folder. A folder imports only the folders below it.
- When you add a folder to `src/lib/`, add a `no-restricted-imports` override in `oxlint.config.ts` that lists the folders above it.
- Do not create import cycles, including cycles through type-only imports. `import/no-cycle` enforces this.

## Errors

- Throw a custom error class for each failure that a consumer can handle. Put shared error classes in `src/lib/shared/errors.ts` and export them from the entry points that throw them.
- Give each error class a literal `name` and `readonly` fields for the data that a consumer needs, such as the invalid input.
- Write the message so that it says what was expected and what was received.

## Tests

- Write a test only when it can fail on a real bug: code with a defined spec (parsers, serialization, math, date logic, state machines), a regression test that fails without the fix for a bug you just fixed, or edge cases and error paths.
- Test the public types in `src/__tests__/types.test-d.ts` with `expectTypeOf` and `@ts-expect-error`. Types are part of the product.
- Leave out tests that cannot catch a bug:
  - Tests of what the language or a library already guarantees, such as `Array.map` mapping or a spread copying.
  - Runtime tests that a type matches itself, or that a typed function returns its declared shape. Enforce a contract with `satisfies` or type-level assertions instead.
  - Tests that a deleted feature, option, or export stays deleted.
  - Tests that cannot fail: they assert that a thin wrapper was called, mock the code under test, or assert values the test set up itself.
- When a change breaks a test that encodes no real requirement, delete the test instead of bending it to fit.
- When a test covers important behavior but breaks on implementation details, rewrite it to test the behavior.
- Keep test code in proportion to the change.
- Use pnpm to manage packages and execute scripts.
- Use Vitest. Import `describe`, `expect`, and `it` from `vitest`.
- Add tests to a `__tests__` folder beside the file they test, with the same name, such as `greeting/__tests__/greeting.test.ts`.
- Name each `describe` block after its function. Name each test case after its behavior.
- Before you open a PR, run `pnpm run check`, `pnpm run test`, and `pnpm run analyze`. Run `pnpm run build:verify` when you change exports, the build, or `package.json`.

## Comments

- Prefer clear names and structure to explanatory comments.
- Do not add comments that repeat the code, describe an obvious operation, or describe a change from an earlier implementation.
- Delete all commented-out code.

## Commits

- Use a conventional commit message (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `build:`, `ci:`, `revert:`, `release:`, `deps:`, `wip:`, `breaking:`, `deprecate:`).
- Give pull requests a conventional commit title.
- Add a changeset for each change that consumers can see. Run `pnpm exec changeset --empty` for a change that they cannot see.
