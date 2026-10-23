interface ChapterProgressProps {
  /** Zero-based index of the active chapter. */
  index: number
  total: number
}

/**
 * Slim hairline progress bar pinned to the very top of the viewport. Sits above
 * the fixed header so it never competes with the "← BACK" control, and is
 * rendered only on the reflowed layouts (desktop keeps its original chrome).
 */
export function ChapterProgress({ index, total }: ChapterProgressProps) {
  const percent = ((index + 1) / total) * 100

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[60] h-[2px] bg-white/10"
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
      role="progressbar"
      aria-label="Chapter progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={index + 1}
    >
      <div
        className="h-full bg-white/70 transition-[width] duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
