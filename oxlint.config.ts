import core, { ignorePatterns } from "adamantite/lint"
import { defineConfig } from "oxlint"

export default defineConfig({
  extends: [core],
  ignorePatterns: [...ignorePatterns],
  options: {
    respectEslintDisableDirectives: true,
    typeAware: true,
    typeCheck: true,
  },
  overrides: [
    // Each `src/lib` folder imports only the folders below it, so dependencies point one way:
    // `shared` is the bottom layer and `greeting` builds on it. Give each new folder its own
    // override that lists the folders above it.
    {
      files: ["src/**/*.ts"],
      rules: {
        "import/no-relative-parent-imports": "error",
      },
    },
    {
      // Each file in the root of `src` is a public entry point.
      files: ["src/*.ts"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["#*.ts", "./*.ts"],
                message: "An entry point must not import another entry point.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/lib/**/*.ts"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["#*.ts"],
                message: "lib must not import a public entry point.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/lib/shared/**/*.ts"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["#*.ts", "#lib/greeting/**"],
                message: "shared must not import other lib folders.",
              },
            ],
          },
        ],
      },
    },
    {
      // JSDoc is the only type syntax available in plain JavaScript files.
      files: ["scripts/**/*.mjs"],
      rules: { "jsdoc/check-tag-names": ["error", { typed: false }] },
    },
  ],
  rules: {
    // Also report cycles that pass through type-only imports.
    "import/no-cycle": ["error", { ignoreTypes: false }],
  },
})
