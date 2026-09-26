# Muhammad Ahmad & Zainab Akram: Digital Wedding Invitation

A mobile-first, interactive wedding invitation built with **React + TypeScript + Vite + plain CSS**. It has a CSS-3D envelope opening, event cards with Google Maps links, a countdown, optional music and WhatsApp sharing. Each invitation version has its **own WhatsApp link preview**.

| Version | URL | Events |
|---|---|---|
| Walima only | `/invite/walima` | Walima |
| Mehndi + Walima | `/invite/mehndi-walima` | Mehndi, Walima |
| Full | `/invite/full` | Mehndi, Barat, Walima |
| Default | `/` | whatever `invitationVersion` is set to |

`?version=walima | mehndi-walima | all` also works on any URL.

---

## 1. Commands

Requires **Node.js 22.18+** (Node 24 recommended).

```bash
cd invitation
npm install          # install dependencies
npm run dev          # development server → http://localhost:5173 (try /invite/walima)
npm run build        # production build → dist/
npm run preview      # serve the production build → http://localhost:4173
npm run og           # regenerate the 1200×630 WhatsApp preview images
npm run lint         # ESLint
```

For a production build, always set your real domain:

```bash
# macOS/Linux/Git Bash
SITE_URL=https://your-domain.com npm run build
# PowerShell
$env:SITE_URL="https://your-domain.com"; npm run build
```

---

## 2. Project structure

```
invitation/
├─ index.html                     # HTML shell; meta tags injected at build time
├─ vite.config.ts                 # + plugin that writes one HTML page per version
├─ vercel.json / netlify.toml     # hosting config
├─ scripts/
│  ├─ generate-og.ts              # builds the WhatsApp preview images from the config
│  └─ og-fonts/                   # fonts used only for the preview images
├─ public/
│  ├─ og/                         # walima.jpg, mehndi-walima.jpg, full.jpg (1200×630)
│  ├─ audio/                      # put your licensed music here
│  └─ favicon.svg
└─ src/
   ├─ config/wedding.ts           # ★ ALL wedding details live here
   ├─ pages/InvitationPage.tsx    # stages: envelope → opening → invitation
   ├─ components/
   │  ├─ InvitationIntro/         # 3D envelope + "Open Invitation"
   │  ├─ InvitationContent/       # the revealed invitation (lazy-loaded)
   │  ├─ CoupleSection/           # names, Bismillah, family message
   │  ├─ EventTimeline/           # list of events for the version
   │  ├─ EventCard/               # one event + Add to Calendar
   │  ├─ LocationButton/          # "Open Location" (Google Maps)
   │  ├─ Countdown/               # countdown (only when year is set)
   │  ├─ ClosingSection/          # thank-you message
   │  ├─ ShareButton/             # WhatsApp share
   │  ├─ MusicControl/            # Music On / Off
   │  ├─ BackToTop/
   │  └─ DecorativeElements/      # ornaments, florals, arch, particles, icons
   ├─ hooks/                      # useInView, useReducedMotion
   ├─ lib/                        # dates (PKT), version routing, links, meta tags
   ├─ styles/                     # base.css, invitation.css
   └─ assets/images/pattern.svg   # Islamic geometric pattern
```

---

## 3. Changing wedding details

Open **`src/config/wedding.ts`**. Everything is there:

| What | Key |
|---|---|
| Bride / groom names | `bride`, `groom` |
| **Year** | `year` (currently `null`) |
| Event dates / times / venues | `events.mehndi`, `events.barat`, `events.walima` |
| Google Maps links | `events.<event>.mapsUrl` |
| Default version | `invitationVersion` |
| Preview titles/descriptions/images | `versions.<id>.og` |
| Colours | `theme` |
| Music | `music` |
| WhatsApp message | `shareMessage` |
| Invitation wording | `text` |
| Production domain | `siteUrl` (or the `SITE_URL` env var) |

Formats: `date: "6 November"` and `time: "7:00 PM"`. Leave `time: ""` when no time should be shown (e.g. Walima). Calendar entries are then all-day.

After changing names, dates, venues, colours or titles, run `npm run og` to refresh the preview images, then rebuild.

### The year
`year: null` means the year is not decided yet. While it is `null`:
- no countdown is shown; a "Save the date" card with the dates appears instead,
- no weekday is shown and no "Add to Calendar" button appears.

Set `year: 2026` (for example). Countdown, weekdays and calendar buttons then switch on automatically. All times are treated as **Pakistan time (UTC+5)**, whatever timezone the guest's phone is in. The countdown targets the **next upcoming event** of that version.

---

## 4. Changing the invitation version

- **Per link (recommended):** send `/invite/walima`, `/invite/mehndi-walima` or `/invite/full`. No code change is needed.
- **Site root default:** change `invitationVersion` in `wedding.ts` to `'walima'`, `'mehndi-walima'` or `'all'`.
- **Which events a version includes:** edit `versions.<id>.events`.

---

## 5. Google Maps links

In `wedding.ts`, each event has `mapsUrl: ''` marked `// TODO`.

1. Open Google Maps and find the venue (e.g. *Zeenat Marquee, Chishtian*).
2. Tap **Share → Copy link** (looks like `https://maps.app.goo.gl/…`).
3. Paste it into that event's `mapsUrl`.

While a `mapsUrl` is empty, the button opens a Google Maps **search** for "venue, city, Pakistan". No coordinates are invented. Replace these with the exact links before sending. On Android and iOS the link opens the Google Maps app when it is installed.

---

## 6. Music

1. Put a **licensed** MP3 at `public/audio/wedding-music.mp3` (aim for 1–2 MB).
2. Set `music.url: '/audio/wedding-music.mp3'` in `wedding.ts`.

Music never autoplays. The file is only downloaded and started when the guest taps **Open Invitation**, which counts as a user gesture, so mobile browsers allow it. A **Music On / Music Off** button then appears at the top right. Music pauses when the guest leaves the tab. With no URL, or a broken file, the button simply doesn't appear and everything else works.

---

## 7. WhatsApp preview images (1200×630)

`npm run og` renders `public/og/walima.jpg`, `mehndi-walima.jpg` and `full.jpg` from the config. Names, events, city and colours are all taken from `wedding.ts`. The design lives in `scripts/generate-og.ts` as an SVG template. All important text sits in the centre, so it survives WhatsApp's square crop in small previews. Output is JPEG, about 80 KB (WhatsApp is most reliable under ~300 KB).

To use a custom-designed image instead (Canva, Photoshop…), export it at **1200×630 JPEG** and save it over the file in `public/og/` (or point `versions.<id>.og.image` to it).

---

## 8. How Open Graph metadata works here

When a link is pasted in WhatsApp, WhatsApp's server downloads the **raw HTML** of that URL and reads its `og:*` tags. **It does not run JavaScript**, so tags added by React at runtime would be ignored.

That's why metadata is produced **at build time** (`vite.config.ts` → `invitationPages()` plugin, tags from `src/lib/meta.ts`):

```
dist/index.html                       → default version's tags
dist/invite/walima/index.html  (+ walima.html)        → Walima tags + walima.jpg
dist/invite/mehndi-walima/index.html (+ .html)        → Mehndi+Walima tags
dist/invite/full/index.html   (+ full.html)           → Full tags
```

Each file contains `og:title`, `og:description`, `og:image` (+ width/height/alt), `og:url`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` and a canonical link. All use **absolute URLs** built from `SITE_URL`. Every page loads the same JS bundle, and the app picks the version from the URL.

Site URL resolution (first match wins): `SITE_URL` env var → `weddingConfig.siteUrl` → Vercel production domain → Netlify `URL`. If none is set, the build prints a yellow warning and uses `http://localhost:4173`. **Never share a build that shows that warning.**

---

## 9. Deployment

### Vercel
1. Push the `invitation` folder to GitHub (or run `npx vercel` inside it).
2. On vercel.com, import the repo. Set **Root Directory** to `invitation` if it's in a subfolder. Framework: Vite (build `npm run build`, output `dist`, already in `vercel.json`).
3. Under **Settings → Environment Variables**, add `SITE_URL = https://your-domain.com` (your final domain, e.g. `https://ahmad-zainab.vercel.app`).
4. Deploy. If you add a custom domain later, update `SITE_URL` and **redeploy**.

### Netlify
1. Add new site → import the repo. Base directory: `invitation`. Build command and publish dir come from `netlify.toml`.
2. Under **Site configuration → Environment variables**, add `SITE_URL = https://your-domain.com`.
3. Deploy.

### GitHub Pages (current setup)
Live at **https://ahmad-here.github.io/Invitation/** (versions: `/Invitation/invite/walima`, `/Invitation/invite/mehndi-walima`, `/Invitation/invite/full`).

1. Once only: in the repo, go to **Settings → Pages → Source** and select **GitHub Actions**. *Not* "Deploy from a branch", which serves the unbuilt source and gives a blank page.
2. Push to `main`. `.github/workflows/deploy-pages.yml` builds with `BASE_PATH=/Invitation/` and `SITE_URL=https://ahmad-here.github.io/Invitation`, then publishes `dist/`.
3. Progress shows in the repo's **Actions** tab. You can re-run it manually with **Run workflow**.

If you add a custom domain later, set `BASE_PATH` to `/` and `SITE_URL` to the new domain in the workflow.

Vercel, Netlify and GitHub Pages all serve HTTPS automatically. Check after deploying:
- `https://your-domain.com/invite/walima` → *View Source* shows the Walima `og:title`
- `https://your-domain.com/og/walima.jpg` opens the image

---

## 10. Testing WhatsApp link previews

1. **Check the tags first:** paste the URL into
   - https://developers.facebook.com/tools/debug/ (Meta Sharing Debugger; WhatsApp uses the same crawler family). It shows the title, image and any errors, and **"Scrape Again"** refreshes Meta's cache.
   - https://www.opengraph.xyz/ for a quick visual check.
2. **Test in WhatsApp:** send the link to yourself (the "Message yourself" chat) or a test group. Wait a second or two for the preview to appear **before** tapping send.
3. Tap the preview. The interactive invitation opens in the browser.

## 11. WhatsApp caching and limitations

- WhatsApp **caches previews per URL**, both on its servers and in the app. After changing an image or title, an already-shared URL may keep the old preview for days.
- **Workaround:** share a slightly different URL, e.g. `https://your-domain.com/invite/full?v=2`. It's a new URL for WhatsApp, and the site ignores the extra parameter. Renaming the image file (e.g. `full-v2.jpg`, updated in `og.image`) also forces a fresh image.
- The site **cannot force** WhatsApp to show a preview. WhatsApp may skip it on slow connections, for large images, or when the sender has link previews disabled. It shows a large image for 1200×630 images in most cases. Some versions show a small square thumbnail, which is why the key text is centred.
- The preview must be generated from a **public HTTPS** URL. `localhost` or password-protected previews will never show an image.
- Get everything final (domain, `SITE_URL`, images) **before** sending the link widely.

---

## Accessibility & performance notes

- Semantic sections/headings; real `<button>`s and `<a>` links; aria labels on icon/secondary controls; no hover-only interactions; tap targets ≥ 44–52 px.
- `prefers-reduced-motion`: the envelope is shown statically and opening becomes a short cross-fade. Petals and particles stop, and all content stays.
- CSS-only 3D (no WebGL). Animations use `transform`/`opacity`. Fonts are self-hosted (Latin subset, `woff2`). The invitation content is code-split and prefetched while the envelope is on screen. Music is only downloaded after the guest taps.
