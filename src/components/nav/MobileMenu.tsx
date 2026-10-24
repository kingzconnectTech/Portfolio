import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS, SOCIAL_LINKS } from '../../data/nav'

export type MobileMenuTone = 'cream' | 'white'

export interface MobileMenuProps {
  /** Label of the page currently being viewed, so its link reads as current. */
  activeLabel?: string
  /** Palette of the host page: cream-on-black (home) or white-on-black (inner pages). */
  tone?: MobileMenuTone
  /**
   * Tailwind classes controlling when the trigger is hidden.
   * Defaults to the standard 768px (`md`) mobile breakpoint. Pages whose desktop
   * layout starts later (e.g. the story viewport) can override this.
   */
  visibilityClass?: string
  /** Extra classes for the trigger wrapper, e.g. positioning or pointer-events. */
  className?: string
  /** Render the "Find me" social links below the primary navigation. */
  showSocial?: boolean
}

/**
 * Shared, accessible mobile navigation.
 *
 * One component drives the hamburger menu on every page so the interaction,
 * spacing, animation and semantics stay identical. The desktop navigation is
 * hidden whenever this menu is available and vice-versa, because both sides of
 * the breakpoint are mutually exclusive CSS states.
 *
 * Accessibility: the trigger is a real button with `aria-expanded`/`aria-controls`;
 * Escape closes and restores focus; Tab is trapped inside the panel while open;
 * the closed panel is `invisible` so its links leave the tab order; and the body
 * scroll lock prevents the page from shifting behind the menu.
 */
export function MobileMenu({
  activeLabel,
  tone = 'white',
  visibilityClass = 'md:hidden',
  className = '',
  showSocial = false,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  const close = useCallback((restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  // Navigating to a new route closes the menu (the panel would otherwise linger).
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while open so the page behind cannot move or reflow.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Escape to close, Tab cycles within the menu, outside interaction dismisses it.
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        close(true)
        return
      }
      if (event.key !== 'Tab') return

      const root = rootRef.current
      if (!root) return
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey && (active === first || !root.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !root.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [open, close])

  const isCream = tone === 'cream'
  const focusRing = isCream
    ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/70'
    : 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
  const triggerColor = isCream ? 'text-cream' : 'text-white'
  const panelSurface = isCream
    ? 'border-cream/15 bg-[#141414]/95'
    : 'border-white/15 bg-[#0c0c0c]/95'
  const mutedText = isCream ? 'text-cream/50' : 'text-white/45'
  const linkIdle = isCream
    ? 'text-cream/65 hover:text-cream'
    : 'text-white/65 hover:text-white'
  const activeText = isCream ? 'text-cream' : 'text-white'
  const activeUnderline = isCream ? 'bg-cream/70' : 'bg-white/70'
  const divider = isCream ? 'bg-cream/10' : 'bg-white/10'

  const barBase =
    'absolute left-0 block h-[2px] w-6 bg-current transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]'

  return (
    <div ref={rootRef} className={`relative ${visibilityClass} ${className}`}>
      {/* Scrim — dims the page and catches outside taps */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls={panelId}
        className={`relative z-[80] flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300 ${triggerColor} ${focusRing}`}
      >
        <span aria-hidden="true" className="relative block h-4 w-6">
          <span className={`${barBase} top-0 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span
            className={`${barBase} top-[7px] ${open ? 'scale-x-0 opacity-0' : 'opacity-100'}`}
          />
          <span className={`${barBase} top-[14px] ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </span>
      </button>

      <nav
        id={panelId}
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`absolute right-0 top-full z-[80] mt-3 w-[min(80vw,20rem)] origin-top-right border p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out ${
          open
            ? 'visible translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none invisible -translate-y-2 scale-95 opacity-0'
        } ${panelSurface}`}
      >
        <ul className="flex flex-col">
          {NAV_ITEMS.map(item => {
            const isActive = item.label === activeLabel
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex min-h-[48px] items-center px-3 font-hn text-sm tracking-[0.18em] transition-colors duration-300 ${focusRing} ${
                    isActive ? activeText : linkIdle
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-[13px] left-3 right-3 h-px ${activeUnderline}`}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {showSocial && (
          <>
            <div aria-hidden="true" className={`mx-3 my-3 h-px ${divider}`} />
            <div className={`px-3 pb-1 text-[10px] uppercase tracking-[0.2em] ${mutedText}`}>
              Find Me
            </div>
            <ul className="flex flex-wrap gap-x-4 px-3 pb-1">
              {SOCIAL_LINKS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex min-h-[48px] items-center font-hn text-sm transition-colors duration-300 ${linkIdle} ${focusRing}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </div>
  )
}
