/**
 * Builds the <head> tags for each invitation version. Runs at BUILD time
 * (imported by vite.config.ts) so the tags are in the initial HTML response
 * that WhatsApp / Facebook / Twitter crawlers read. Crawlers do not run JS.
 */
import { weddingConfig, type VersionId } from '../config/wedding.ts'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function renderMetaTags(version: VersionId, siteUrl: string, isRoot = false): string {
  const v = weddingConfig.versions[version]
  const base = siteUrl.replace(/\/$/, '')
  const url = isRoot ? `${base}/` : `${base}/invite/${v.slug}`
  const image = base + v.og.image
  const { title, description, imageAlt } = v.og

  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(`${weddingConfig.groom} & ${weddingConfig.bride}`)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:secure_url" content="${esc(image)}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />`,
  ].join('\n    ')
}

/** Theme colours → CSS custom properties, inlined into <head> so there is no colour flash. */
export function renderThemeStyle(): string {
  const toKebab = (k: string) => k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
  const vars = Object.entries(weddingConfig.theme)
    .map(([k, v]) => `--c-${toKebab(k)}:${v}`)
    .join(';')
  return `<style>:root{${vars}}</style>`
}
