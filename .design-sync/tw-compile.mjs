// Precompiles the app's Tailwind v4 stylesheet into a static CSS file for design-sync.
// The converter copies CSS, it does not run Tailwind — without this step the utility
// classes the components use (bg-card, font-title, ...) never exist and cards ship unstyled.
// Resolves postcss/@tailwindcss/postcss from the repo's own node_modules (no new installs).
import fs from 'node:fs'
import path from 'node:path'
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'

const [, , inputArg, outputArg] = process.argv
const input = path.resolve(inputArg)
const output = path.resolve(outputArg)

const css = fs.readFileSync(input, 'utf8')
const result = await postcss([tailwind()]).process(css, { from: input, to: output })

fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, result.css)
console.log(`wrote ${path.relative(process.cwd(), output)} (${result.css.length} bytes)`)
