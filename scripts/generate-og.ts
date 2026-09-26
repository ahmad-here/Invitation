/**
 * Generates the 1200×630 WhatsApp / Open Graph preview images, one per invitation version,
 * from src/config/wedding.ts.  Run:  npm run og
 * Output: public/<versions[x].og.image>  (e.g. public/og/full.jpg)
 *
 * Runs directly with Node 22.18+/24 (built-in TypeScript type stripping).
 */
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { weddingConfig, type VersionId, type WeddingEvent } from '../src/config/wedding.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fontDir = join(root, 'scripts', 'og-fonts')
const W = 1200
const H = 630
const t = weddingConfig.theme

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const shortDate = (e: WeddingEvent) => {
  const [day, month = ''] = e.date.split(/\s+/)
  return `${day} ${month.slice(0, 3)}`.toUpperCase()
}

const corner = (transform: string) => `
  <g transform="${transform}" fill="none" stroke="${t.gold}" stroke-width="1.6" stroke-linecap="round" opacity=".9">
    <path d="M4 116C6 64 36 22 116 4"/><path d="M4 84c12-6 20-18 20-34"/><path d="M36 4c4 14 16 22 32 22"/>
    <g fill="${t.gold}" stroke="none">
      <path d="M30 46c7-11 18-12 26-9-6 9-16 14-26 9Z" opacity=".55"/>
      <path d="M46 30c11-7 12-18 9-26-9 6-14 16-9 26Z" opacity=".35"/>
      <g transform="translate(22 22)">
        ${[0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-6.5" rx="3.6" ry="6" transform="rotate(${r})" opacity=".75"/>`).join('')}
        <circle r="3" fill="${t.goldLight}"/>
      </g>
    </g>
  </g>`

const ornament = (y: number) => `
  <g transform="translate(${W / 2} ${y})" stroke="${t.gold}" fill="none" stroke-width="1.4">
    <path d="M-170 0H-26M26 0H170" stroke="url(#fade)"/>
    <path d="M0 -10 12 0 0 10 -12 0Z"/><path d="M0 -5 6 0 0 5 -6 0Z" fill="${t.gold}"/>
    <circle cx="-20" cy="0" r="2" fill="${t.gold}"/><circle cx="20" cy="0" r="2" fill="${t.gold}"/>
  </g>`

function svgFor(version: VersionId): string {
  const v = weddingConfig.versions[version]
  const events = v.events.map((id) => weddingConfig.events[id])
  const year = weddingConfig.year ? ` ${weddingConfig.year}` : ''
  const eyebrow = events.length === 1 ? `${events[0].name} Invitation` : 'Wedding Invitation'

  // One event → full details; several → "6 NOV · MEHNDI" chips.
  const eventLine =
    events.length === 1
      ? `<text x="${W / 2}" y="478" class="caps" font-size="27" fill="${t.cream}" letter-spacing="3">${esc(`${events[0].date}${year}`.toUpperCase())}  ·  ${esc(events[0].venue.toUpperCase())}</text>`
      : events
          .map((e, i) => {
            const slot = W / 2 + (i - (events.length - 1) / 2) * (events.length === 3 ? 300 : 340)
            return `<text x="${slot}" y="466" class="caps" font-size="26" fill="${t.cream}" letter-spacing="3">${esc(shortDate(e))}</text>
              <text x="${slot}" y="500" class="serif" font-size="30" font-style="italic" fill="${t.goldLight}">${esc(e.name)}</text>`
          })
          .join('') +
        events
          .slice(1)
          .map((_, i) => {
            const x = W / 2 + (i + 0.5 - (events.length - 1) / 2) * (events.length === 3 ? 300 : 340)
            return `<path d="M${x} 450 ${x + 6} 470 ${x} 490 ${x - 6} 470Z" fill="none" stroke="${t.gold}" stroke-width="1.2"/>`
          })
          .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="45%" r="75%">
      <stop offset="0" stop-color="${t.greenSoft}"/><stop offset=".55" stop-color="${t.green}"/><stop offset="1" stop-color="${t.greenDeep}"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${t.goldLight}" stop-opacity=".22"/><stop offset="1" stop-color="${t.goldLight}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.goldLight}"/><stop offset=".6" stop-color="${t.gold}"/><stop offset="1" stop-color="${t.goldDeep}"/>
    </linearGradient>
    <linearGradient id="fade" x1="-170" y1="0" x2="170" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${t.gold}" stop-opacity="0"/><stop offset=".4" stop-color="${t.gold}"/>
      <stop offset=".6" stop-color="${t.gold}"/><stop offset="1" stop-color="${t.gold}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="pat" width="64" height="64" patternUnits="userSpaceOnUse">
      <g fill="none" stroke="${t.gold}" stroke-width=".8" opacity=".09">
        <rect x="18" y="18" width="28" height="28"/><path d="M32 12 52 32 32 52 12 32Z"/>
        <path d="M32 0v12M32 52v12M0 32h12M52 32h12"/><circle cx="32" cy="32" r="4"/>
      </g>
    </pattern>
    <style>
      .caps { font-family: 'Cinzel'; font-weight: 600; text-anchor: middle; }
      .serif { font-family: 'Cormorant Garamond'; font-weight: 500; text-anchor: middle; }
      .script { font-family: 'Great Vibes'; text-anchor: middle; }
    </style>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#pat)"/>
  <ellipse cx="${W / 2}" cy="300" rx="480" ry="250" fill="url(#glow)"/>

  <rect x="26" y="26" width="${W - 52}" height="${H - 52}" rx="10" fill="none" stroke="${t.gold}" stroke-width="2.5"/>
  <rect x="38" y="38" width="${W - 76}" height="${H - 76}" rx="6" fill="none" stroke="${t.gold}" stroke-opacity=".55" stroke-width="1.2"/>
  ${corner('translate(46 46)')}
  ${corner(`translate(${W - 46} 46) scale(-1 1)`)}
  ${corner(`translate(46 ${H - 46}) scale(1 -1)`)}
  ${corner(`translate(${W - 46} ${H - 46}) scale(-1 -1)`)}

  <text x="${W / 2}" y="104" class="caps" font-size="25" fill="${t.goldLight}" letter-spacing="9">${esc(eyebrow.toUpperCase())}</text>
  ${ornament(132)}

  <text x="${W / 2}" y="238" class="script" font-size="100" fill="url(#gold)">${esc(weddingConfig.groom)}</text>
  <text x="${W / 2}" y="298" class="script" font-size="58" fill="${t.gold}">&amp;</text>
  <text x="${W / 2}" y="382" class="script" font-size="100" fill="url(#gold)">${esc(weddingConfig.bride)}</text>

  ${ornament(420)}
  ${eventLine}
  <text x="${W / 2}" y="560" class="caps" font-size="19" fill="${t.goldLight}" letter-spacing="7">${esc(`${weddingConfig.city} · ${weddingConfig.region}`.toUpperCase())}</text>
</svg>`
}

const fontFiles = readdirSync(fontDir).filter((f) => f.endsWith('.ttf')).map((f) => join(fontDir, f))

for (const id of Object.keys(weddingConfig.versions) as VersionId[]) {
  const outFile = join(root, 'public', weddingConfig.versions[id].og.image)
  mkdirSync(dirname(outFile), { recursive: true })
  const png = new Resvg(svgFor(id), {
    fitTo: { mode: 'width', value: W },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Cormorant Garamond' },
  })
    .render()
    .asPng()
  const info = await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(outFile)
  console.log(`✓ ${id.padEnd(14)} → public${weddingConfig.versions[id].og.image}  (${Math.round(info.size / 1024)} KB)`)
}
