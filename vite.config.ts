import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { weddingConfig, type VersionId } from './src/config/wedding.ts'
import { renderMetaTags, renderThemeStyle } from './src/lib/meta.ts'

const META_START = '<!-- meta:start -->'
const META_END = '<!-- meta:end -->'

/** Absolute public site URL for Open Graph tags. */
function resolveSiteUrl(command: 'build' | 'serve'): string {
  const env = process.env
  const url =
    env.SITE_URL ||
    weddingConfig.siteUrl ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    (env.CONTEXT === 'production' && env.URL) || // Netlify production
    env.DEPLOY_PRIME_URL || // Netlify previews
    ''
  if (url) return url.replace(/\/$/, '')
  if (command === 'build') {
    console.warn(
      '\n\x1b[33m[invitation] No site URL configured: Open Graph URLs will point to http://localhost:4173.\n' +
        '  Set SITE_URL=https://your-domain or weddingConfig.siteUrl before building for production.\x1b[0m\n',
    )
  }
  return 'http://localhost:4173'
}

/**
 * Injects theme colours + Open Graph tags into index.html, then after the build writes
 * one static HTML file per invitation version (dist/invite/<slug>/index.html), each
 * with its own metadata. WhatsApp's crawler sees correct tags without running JS.
 */
function invitationPages(): Plugin {
  let config: ResolvedConfig
  let siteUrl = ''
  const withMeta = (html: string, meta: string) =>
    html.replace(new RegExp(`${META_START}[\\s\\S]*?${META_END}`), `${META_START}\n    ${meta}\n    ${META_END}`)

  return {
    name: 'invitation-pages',
    configResolved(c) {
      config = c
      siteUrl = resolveSiteUrl(c.command)
    },
    transformIndexHtml(html) {
      return withMeta(
        html.replace('<!--theme-->', renderThemeStyle()),
        renderMetaTags(weddingConfig.invitationVersion, siteUrl, true),
      )
    },
    closeBundle() {
      if (config.command !== 'build') return
      const outDir = resolve(config.root, config.build.outDir)
      const rootHtml = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      for (const id of Object.keys(weddingConfig.versions) as VersionId[]) {
        const slug = weddingConfig.versions[id].slug
        const html = withMeta(rootHtml, renderMetaTags(id, siteUrl))
        // Both forms, so /invite/<slug> and /invite/<slug>/ resolve to a real file on any static host.
        mkdirSync(resolve(outDir, 'invite', slug), { recursive: true })
        writeFileSync(resolve(outDir, 'invite', slug, 'index.html'), html)
        writeFileSync(resolve(outDir, 'invite', `${slug}.html`), html)
      }
      console.log(`[invitation] Wrote ${Object.keys(weddingConfig.versions).length} version pages. og base: ${siteUrl}`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), invitationPages()],
})
