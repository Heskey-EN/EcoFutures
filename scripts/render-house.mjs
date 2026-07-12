// Dev utility: render the InteractiveHouse diagram to a PNG without a browser.
// Bundles the real component with esbuild, server-renders it (default state:
// walls selected, nothing planned), extracts the <svg>, and rasterizes it
// onto the navy panel background with sharp.
//
//   node scripts/render-house.mjs [out.png]
//
// Requires sharp (dev-only): npm i sharp --no-save
import { writeFileSync, rmSync, mkdtempSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

const PROJ = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(join(PROJ, 'package.json'))
const esbuild = require('esbuild')
const sharp = require('sharp')

const outPng = process.argv[2] || join(PROJ, 'house-preview.png')
const work = mkdtempSync(join(tmpdir(), 'house-render-'))
const entryFile = join(work, 'entry.jsx')
const bundleFile = join(work, 'bundle.cjs')

writeFileSync(
  entryFile,
  `
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import InteractiveHouse from '${PROJ.replace(/\\/g, '/')}/src/components/InteractiveHouse.jsx'
const html = renderToStaticMarkup(
  React.createElement(MemoryRouter, null, React.createElement(InteractiveHouse))
)
const m = html.match(/<svg[^>]*aria-label="Cross-section[\\s\\S]*?<\\/svg>/)
if (!m) { console.error('NO SVG FOUND'); process.exit(1) }
process.stdout.write(m[0])
`,
)

esbuild.buildSync({
  entryPoints: [entryFile],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  jsx: 'automatic',
  outfile: bundleFile,
  absWorkingDir: PROJ,
  nodePaths: [join(PROJ, 'node_modules')],
  logLevel: 'silent',
})

let svg = execFileSync(process.execPath, [bundleFile], {
  encoding: 'utf8',
  maxBuffer: 10e6,
  stdio: ['ignore', 'pipe', 'ignore'], // silence SSR useLayoutEffect warnings
})
svg = svg.replace('<svg ', '<svg width="1360" height="1000" xmlns="http://www.w3.org/2000/svg" ')

await sharp(Buffer.from(svg)).flatten({ background: '#0D1B2A' }).png().toFile(outPng)
rmSync(work, { recursive: true, force: true })
console.log('rendered', outPng)
