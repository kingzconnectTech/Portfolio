import { usePointerType } from '../../hooks/useMediaQuery'

export type SwipeHintVariant = 'bottom-center' | 'bottom-right' | 'top-right'

interface SwipeHintProps {
  variant: SwipeHintVariant
  visible: boolean
}

/**
 * Placement per composition:
 * - bottom-center: the original desktop hint (bottom edge, centred).
 * - bottom-right:  tablet landscape, clear of the bottom-left text card.
 * - top-right:     stacked (mobile / tablet portrait), where the bottom of the
 *                  screen belongs to the chapter text block.
 */
const VARIANTS = {
  'bottom-center': {
    position: 'bottom-7 left-1/2 -translate-x-1/2',
    align: 'items-center',
    label: 'text-[8px] sm:text-[9px] tracking-[0.34em] text-white/50',
  },
  'bottom-right': {
    position: 'bottom-6 right-6 sm:right-10',
    align: 'items-end',
    label: 'text-[9px] tracking-[0.34em] text-white/55',
  },
  'top-right': {
    position: 'top-[max(22px,env(safe-area-inset-top))] right-5 sm:right-10',
    align: 'items-end',
    label: 'text-[9px] tracking-[0.34em] text-white/60',
  },
} as const satisfies Record<SwipeHintVariant, { position: string; align: string; label: string }>

export function SwipeHint({ variant, visible }: SwipeHintProps) {
  const isTouch = usePointerType() === 'touch'
  const { position, align, label } = VARIANTS[variant]

  return (
    <div
      className={`pointer-events-none fixed z-50 flex select-none flex-col gap-2 transition-opacity duration-500 ${position} ${align}`}
      style={{
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
      }}
      aria-hidden={!visible}
    >
      <span className={`font-hn ${label}`}>
        {isTouch ? 'SWIPE UP' : 'SCROLL OR USE ARROWS'}
      </span>

      {isTouch ? (
        <svg
          className="story-swipe-chevron h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <div className="story-scroll-hint h-6 w-px bg-white/30" />
      )}
    </div>
  )
}
