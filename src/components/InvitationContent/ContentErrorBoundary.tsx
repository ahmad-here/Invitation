import { Component, type ReactNode } from 'react'

/** Shown if the invitation content fails to download (e.g. connection dropped). */
export class ContentErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="load-error" role="alert">
        <p>The invitation could not be loaded. Please check your internet connection.</p>
        <button type="button" className="btn btn--gold" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    )
  }
}
