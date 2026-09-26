/**
 * ============================================================================
 *  WEDDING CONFIGURATION: the only file you should need to edit.
 * ============================================================================
 *
 *  Everything shown on the invitation, the WhatsApp preview metadata, the
 *  preview images (npm run og) and the theme colours come from this file.
 *
 *  Note: this file is also imported by vite.config.ts and scripts/generate-og.ts
 *  (plain Node), so keep it free of browser-only or Vite-only code.
 */

export type EventId = 'mehndi' | 'barat' | 'walima'
export type VersionId = 'walima' | 'mehndi-walima' | 'all'

export interface WeddingEvent {
  id: EventId
  name: string
  /** Day + full month name, e.g. "6 November". The year comes from `year` below. */
  date: string
  /** e.g. "7:00 PM". Leave "" if no time should be shown (it is then treated as all-day). */
  time: string
  venue: string
  city: string
  /**
   * Google Maps share link for the venue.
   * How to get it: open Google Maps → search the venue → Share → Copy link
   * (looks like https://maps.app.goo.gl/xxxx). Paste it here.
   * If left empty, the button falls back to a Google Maps *search* for
   * "<venue>, <city>" (no coordinates are guessed).
   */
  mapsUrl: string
  /** Short line shown on the event card. */
  tagline: string
}

export interface InvitationVersion {
  /** Clean URL segment: /invite/<slug> */
  slug: string
  events: EventId[]
  og: {
    title: string
    description: string
    /** Path inside /public. Regenerate with `npm run og`. */
    image: string
    imageAlt: string
  }
}

const groom = 'Muhammad Ahmad'
const bride = 'Zainab Akram'

export const weddingConfig = {
  groom,
  bride,
  city: 'Chishtian',
  region: 'Punjab, Pakistan',

  /**
   * WEDDING YEAR: not decided yet, so it is `null`.
   * Set it to a number (e.g. 2026) and the countdown, weekdays and
   * "Add to Calendar" buttons will turn on automatically.
   */
  year: null as number | null,

  /** Pakistan Standard Time (UTC+5, no daylight saving). Used for countdown & calendar. */
  timezone: { iana: 'Asia/Karachi', utcOffset: '+05:00' },

  /** Default event length used for calendar entries. */
  eventDurationHours: 4,

  /**
   * Public production URL (https, no trailing slash), e.g. "https://ahmad-zainab.vercel.app".
   * Required for absolute og:url / og:image. It can also be set with the SITE_URL
   * environment variable at build time (env var wins). On Vercel/Netlify the
   * platform URL is detected automatically if both are empty.
   */
  siteUrl: '',

  /**
   * Default version shown at "/" (the site root).
   * Each version also has its own clean URL: /invite/walima, /invite/mehndi-walima, /invite/full
   * and ?version=walima | mehndi-walima | all works on any URL too.
   */
  invitationVersion: 'all' as VersionId,

  events: {
    mehndi: {
      id: 'mehndi',
      name: 'Mehndi',
      date: '6 November',
      time: '7:00 PM',
      venue: 'Bandhan Marriage Hall',
      city: 'Chishtian',
      mapsUrl: '', // TODO: paste the Google Maps link for Bandhan Marriage Hall
      tagline: 'An evening of colour, music & henna',
    },
    barat: {
      id: 'barat',
      name: 'Barat',
      date: '7 November',
      time: '12:00 PM',
      venue: 'Labaik Marriage Hall',
      city: 'Chishtian',
      mapsUrl: '', // TODO: paste the Google Maps link for Labaik Marriage Hall
      tagline: 'The arrival of the groom & the Nikah celebrations',
    },
    walima: {
      id: 'walima',
      name: 'Walima',
      date: '8 November',
      time: '',
      venue: 'Zeenat Marquee',
      city: 'Chishtian',
      mapsUrl: '', // TODO: paste the Google Maps link for Zeenat Marquee
      tagline: 'A reception in celebration of the new couple',
    },
  } satisfies Record<EventId, WeddingEvent>,

  versions: {
    walima: {
      slug: 'walima',
      events: ['walima'],
      og: {
        title: `${groom} & ${bride} | Walima Invitation`,
        description: `You are cordially invited to the Walima reception of ${groom} & ${bride}, 8 November, Zeenat Marquee, Chishtian.`,
        image: '/og/walima.jpg',
        imageAlt: `Walima invitation card for ${groom} and ${bride}`,
      },
    },
    'mehndi-walima': {
      slug: 'mehndi-walima',
      events: ['mehndi', 'walima'],
      og: {
        title: `${groom} & ${bride} | Wedding Invitation`,
        description: `You are cordially invited to celebrate the wedding celebrations of ${groom} & ${bride}: Mehndi 6 November & Walima 8 November, Chishtian.`,
        image: '/og/mehndi-walima.jpg',
        imageAlt: `Mehndi and Walima invitation card for ${groom} and ${bride}`,
      },
    },
    all: {
      slug: 'full',
      events: ['mehndi', 'barat', 'walima'],
      og: {
        title: `${groom} & ${bride} | Wedding Invitation`,
        description: `You are cordially invited to celebrate the wedding celebrations of ${groom} & ${bride}: Mehndi, Barat & Walima, 6–8 November, Chishtian.`,
        image: '/og/full.jpg',
        imageAlt: `Wedding invitation card for ${groom} and ${bride}`,
      },
    },
  } satisfies Record<VersionId, InvitationVersion>,

  /**
   * Background music. Put a *licensed* MP3 in /public/audio/ and set `url`,
   * e.g. "/audio/wedding-music.mp3". With an empty url the music button is hidden.
   * Music only ever starts after the guest taps "Open Invitation".
   */
  music: {
    enabled: true,
    url: '/audio/backgroundmusic.mp3',
    volume: 0.5,
  },

  /** WhatsApp share text. {url} is replaced with the invitation link. */
  shareMessage: `Assalam-o-Alaikum! 💐\nYou are cordially invited to the wedding celebrations of ${groom} & ${bride}.\n\nPlease open the invitation here:\n{url}`,

  /** Wording on the invitation. */
  text: {
    envelopeLine: 'You are cordially invited',
    familyLine: 'Together with their families',
    requestLine: 'request the pleasure of your company at their wedding celebrations',
    closingLine: 'Your presence would make our celebration even more special.',
    closingWish: 'With love and best wishes, we look forward to celebrating with you.',
    bismillah: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  },

  /** Theme colours (injected as CSS variables, also used for preview images). */
  theme: {
    green: '#0f3b2e',
    greenDeep: '#082419',
    greenSoft: '#1d5a45',
    gold: '#c9a55a',
    goldLight: '#ecd49b',
    goldDeep: '#9a7433',
    /** Darker gold used for small text on cream (keeps WCAG AA contrast). */
    goldInk: '#7a5a1f',
    cream: '#fbf6ea',
    creamDark: '#efe4c8',
    ink: '#2a2418',
    accentMehndi: '#b5892a',
    accentBarat: '#8c2f39',
    accentWalima: '#1d5a45',
  },
}

export type WeddingConfig = typeof weddingConfig
