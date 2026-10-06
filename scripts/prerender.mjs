// Gera o HTML estático de todas as páginas, além de sitemap.xml e robots.txt.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const ssr = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)

const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')
for (const marker of ['<!--app-head-->', '<div id="root"></div>']) {
  if (!template.includes(marker)) throw new Error(`Marcador ${marker} não encontrado em dist/index.html`)
}

for (const page of ssr.pages) {
  const html = template
    .replace('<!--app-head-->', page.head)
    .replace('<div id="root"></div>', `<div id="root">${ssr.render(page.path)}</div>`)
  const file = page.notFound ? resolve(dist, '404.html') : resolve(dist, `.${page.path}index.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  console.log(`prerender: ${page.notFound ? '/404.html' : page.path}`)
}

writeFileSync(resolve(dist, 'sitemap.xml'), ssr.sitemap())
writeFileSync(resolve(dist, 'robots.txt'), ssr.robots())
console.log('prerender: sitemap.xml, robots.txt')

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })
