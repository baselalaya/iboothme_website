import http from 'http'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import sirv from 'sirv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'dist', 'public')

// Minimal routes to pre-render now; expand as needed
const staticRoutes = [
  '/',
  '/products',
  '/insights',
  '/ai-effects',
  '/ai-technology',
  '/our-story',
  '/analytics',
  '/privacy',
  '/terms',
]

async function startServer(): Promise<{ url: string; close: () => Promise<void> }>{
  const handler = sirv(distDir, { single: true })
  const server = http.createServer((req, res) => handler(req as any, res as any))
  await new Promise<void>((resolve) => server.listen(0, resolve))
  const address = server.address()
  if (typeof address === 'object' && address && 'port' in address) {
    const url = `http://127.0.0.1:${address.port}`
    return { url, close: () => new Promise<void>((r) => server.close(() => r())) }
  }
  throw new Error('Failed to bind server')
}

async function ensureDeps() {
  try {
    await import('playwright')
  } catch {
    console.error('\n[prerender] Installing dev dependency: playwright (first run)')
    const { execSync } = await import('node:child_process')
    execSync('npm i -D playwright', { stdio: 'inherit' })
  }
}

async function prerender() {
  await ensureDeps()
  const { chromium } = await import('playwright')
  const server = await startServer()
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  for (const route of staticRoutes) {
    const url = server.url + route
    console.log(`[prerender] ${url}`)
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle' })
      if (!resp || !resp.ok()) throw new Error(`HTTP ${resp?.status()}`)
      // wait for SEO markers: title and meta description
      try {
        await page.waitForFunction(() => document.title && document.title.length > 0, { timeout: 15000 })
      } catch {}
      try {
        await page.waitForSelector('head meta[name="description"]', { timeout: 15000 })
      } catch {}
      const html = await page.content()
      const outDir = path.join(distDir, route === '/' ? '' : route)
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'index.html'), html)
      console.log(`[prerender] Wrote ${path.join(route, 'index.html') || '/index.html'}`)
    } catch (e) {
      console.warn(`[prerender] Failed ${route}:`, (e as Error).message)
      // attempt to dump whatever rendered for debugging
      try {
        const html = await page.content()
        const outDir = path.join(distDir, route === '/' ? '' : route)
        fs.mkdirSync(outDir, { recursive: true })
        fs.writeFileSync(path.join(outDir, 'index.html'), html)
        console.warn(`[prerender] Wrote partial ${path.join(route, 'index.html') || '/index.html'}`)
      } catch {}
    }
  }

  await browser.close()
  await server.close()
  console.log('[prerender] Done')
}

prerender().catch((e) => {
  console.error(e)
  process.exit(1)
})
