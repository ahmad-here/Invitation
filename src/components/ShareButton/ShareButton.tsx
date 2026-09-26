import type { VersionId } from '../../config/wedding.ts'
import { whatsappShareLink } from '../../lib/links.ts'

/** Opens WhatsApp with a pre-filled message containing this version's invitation link. */
export function ShareButton({ version }: { version: VersionId }) {
  return (
    <a
      className="btn btn--whatsapp"
      href={whatsappShareLink(version)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share this invitation on WhatsApp (opens WhatsApp)"
    >
      <svg className="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.1Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
      </svg>
      Share on WhatsApp
    </a>
  )
}
