// Turns a copy of the keel template into a new library, then deletes itself.
//
// Usage: pnpm run init [--name <name>] [--description <text>] [--owner <github user>]
// Flags skip their prompts.

import { readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { stdin, stdout } from "node:process"
import { createInterface } from "node:readline/promises"
import { parseArgs } from "node:util"

const TEMPLATE_NAME = "keel"
const TEMPLATE_OWNER = "adelrodriguez"
const root = join(import.meta.dirname, "..")

const { values: flags } = parseArgs({
  options: {
    description: { type: "string" },
    name: { type: "string" },
    owner: { type: "string" },
  },
})

const prompt = createInterface({ input: stdin, output: stdout })

async function ask(question: string, fallback?: string): Promise<string> {
  const suffix = fallback ? ` (${fallback})` : ""
  const answer = await prompt.question(`${question}${suffix}: `)
  const value = answer.trim() || fallback

  return value ?? ask(question, fallback)
}

const name = flags.name ?? (await ask("Package name"))
const description = flags.description ?? (await ask("Description"))
const owner = flags.owner ?? (await ask("GitHub owner", TEMPLATE_OWNER))
prompt.close()

function rewrite(file: string, edit: (contents: string) => string) {
  const path = join(root, file)
  writeFileSync(path, edit(readFileSync(path, "utf8")))
}

rewrite("package.json", (contents) => {
  const packageJson = JSON.parse(contents)

  packageJson.name = name
  packageJson.description = description
  packageJson.homepage = `https://github.com/${owner}/${name}#readme`
  packageJson.bugs.url = `https://github.com/${owner}/${name}/issues`
  packageJson.repository.url = `git+https://github.com/${owner}/${name}.git`
  delete packageJson.private
  delete packageJson.scripts.init

  return `${JSON.stringify(packageJson, null, 2)}\n`
})

rewrite("AGENTS.md", (contents) =>
  contents.replaceAll(`${TEMPLATE_OWNER}/${TEMPLATE_NAME}`, `${owner}/${name}`)
)
rewrite("docs/agents/issue-tracker.md", (contents) =>
  contents.replaceAll(`${TEMPLATE_OWNER}/${TEMPLATE_NAME}`, `${owner}/${name}`)
)
rewrite("scripts/verify-build.ts", (contents) =>
  contents
    .replaceAll(`from "${TEMPLATE_NAME}"`, `from "${name}"`)
    .replaceAll(`"${TEMPLATE_NAME}-build-`, `"${name}-build-`)
)

writeFileSync(
  join(root, "README.md"),
  `# ${name}

${description}

## Install

\`\`\`sh
npm install ${name}
\`\`\`
`
)

rmSync(join(root, "scripts/init.ts"))

console.info(`Initialized ${name}. Next: run scripts/setup-repo.sh after you push to GitHub.`)
