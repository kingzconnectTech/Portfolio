import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

/**
 * Catch-all for paths the router does not recognise.
 *
 * Without it an unmatched URL resolved to no element at all, which reads as a
 * crash: a blank dark document with no way back.
 */
export function NotFoundPage() {
  useSEO('notFound')

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-center gap-8 bg-[#0c0c0c] px-6 text-center text-white">
      <p className="font-inter tabular-nums text-[10px] tracking-[0.34em] text-white/50">
        404
      </p>

      <h1 className="font-weghorst text-[clamp(2.5rem,9vw,7rem)] leading-[0.85]">
        THIS PAGE<br />ISN&apos;T HERE.
      </h1>

      <p className="font-hn max-w-sm text-sm leading-relaxed text-white/60">
        The link may be out of date, or the address was mistyped.
      </p>

      <Link
        to="/"
        className="font-hn inline-flex min-h-[48px] items-center justify-center rounded-sm border border-white/20 px-6 text-xs tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white/5"
      >
        BACK TO HOME
      </Link>
    </div>
  )
}
