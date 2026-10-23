import { useEffect, useState } from 'react'

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * The initial value is read synchronously so the first paint already has the
 * right layout (no flash of the wrong composition).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = () => setMatches(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Pointer-type detection: a device with no hover and a coarse pointer is a
 * phone or tablet, so the story advances by swipe rather than wheel/arrows.
 */
export const TOUCH_POINTER_QUERY = '(hover: none) and (pointer: coarse)'

export function usePointerType(): 'touch' | 'mouse' {
  return useMediaQuery(TOUCH_POINTER_QUERY) ? 'touch' : 'mouse'
}

/** Layout thresholds. Desktop is anything at or above 1100px and stays as-is. */
export const BREAKPOINTS = {
  /** Tablet and up — 641px, the top of the mobile range. */
  tablet: '(min-width: 641px)',
  /** Desktop — the existing wide-screen composition must not change. */
  desktop: '(min-width: 1100px)',
  landscape: '(orientation: landscape)',
  /** Landscape phones: short viewports need tighter type and spacing. */
  short: '(max-height: 500px)',
} as const

export const useIsTabletUp = () => useMediaQuery(BREAKPOINTS.tablet)
export const useIsDesktop = () => useMediaQuery(BREAKPOINTS.desktop)
export const useIsLandscape = () => useMediaQuery(BREAKPOINTS.landscape)
export const useIsShort = () => useMediaQuery(BREAKPOINTS.short)
