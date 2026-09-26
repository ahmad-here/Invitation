import { weddingConfig, type VersionId, type WeddingEvent } from '../config/wedding.ts'

const versionIds = Object.keys(weddingConfig.versions) as VersionId[]

function fromKeyOrSlug(value: string | null | undefined): VersionId | null {
  if (!value) return null
  const v = value.toLowerCase()
  return versionIds.find((id) => id === v || weddingConfig.versions[id].slug === v) ?? null
}

/**
 * Picks the invitation version from (in order):
 *   ?version=<id|slug>  →  /invite/<slug>  →  weddingConfig.invitationVersion
 */
export function resolveVersion(pathname: string, search: string): VersionId {
  const query = new URLSearchParams(search).get('version')
  const pathMatch = pathname.match(/\/invite\/([^/?#]+)/)
  return fromKeyOrSlug(query) ?? fromKeyOrSlug(pathMatch?.[1]) ?? weddingConfig.invitationVersion
}

export function eventsFor(version: VersionId): WeddingEvent[] {
  return weddingConfig.versions[version].events.map((id) => weddingConfig.events[id])
}

export function invitePath(version: VersionId): string {
  return `/invite/${weddingConfig.versions[version].slug}`
}
