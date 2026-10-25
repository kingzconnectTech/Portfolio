import { Component, type ErrorInfo, type ReactNode } from 'react'

/**
 * Single funnel for runtime failures.
 *
 * In production a crash is otherwise invisible — the tab stops painting and
 * nobody ever sees the stack. Everything routed through here is emitted as one
 * structured console line carrying the URL and the boundary that caught it, so
 * it is also the one place a remote sink (log drain, error tracker) can be
 * attached later without touching the rest of the app.
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  const normalised = error instanceof Error ? error : new Error(String(error))

  console.error('[app-error]', {
    message: normalised.message,
    stack: normalised.stack,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    ...context,
  })
}

interface ErrorBoundaryProps {
  children: ReactNode
  /** Identifies the layer that failed, e.g. "app" or "route:/story". */
  label?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Keeps a failure in one subtree from taking down the whole application.
 *
 * Mounted twice: once around the router in `main.tsx` so nothing can blank the
 * document, and once inside the router keyed by pathname so a broken page is
 * recoverable by navigating away instead of requiring a manual reload.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, {
      boundary: this.props.label ?? 'unnamed',
      componentStack: info.componentStack,
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    const { error } = this.state

    if (!error) {
      return this.props.children
    }

    return (
      <div className="flex min-h-[100svh] w-full flex-col items-center justify-center gap-8 bg-[#0c0c0c] px-6 text-center text-white">
        <p className="font-inter tabular-nums text-[10px] tracking-[0.34em] text-white/50">
          SOMETHING BROKE
        </p>

        <h1 className="font-weghorst text-[clamp(2rem,7vw,5rem)] leading-[0.9]">
          THIS VIEW<br />DIDN&apos;T LOAD.
        </h1>

        <p className="font-hn max-w-sm text-sm leading-relaxed text-white/60">
          {error.message || 'An unexpected error stopped this page from rendering.'}
        </p>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-8">
          <button
            type="button"
            onClick={this.handleReload}
            className="font-hn inline-flex min-h-[48px] items-center justify-center rounded-sm border border-white/20 px-6 text-xs tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white/5"
          >
            RELOAD
          </button>
          {/* A plain anchor, deliberately: this renders outside the router, and a
              hard document load is the reliable way out of a broken app state. */}
          <a
            href="/"
            className="font-hn inline-flex min-h-[48px] items-center justify-center rounded-sm px-6 text-xs tracking-[0.22em] text-white/60 transition-colors duration-300 hover:text-white"
          >
            BACK TO HOME
          </a>
        </div>
      </div>
    )
  }
}
