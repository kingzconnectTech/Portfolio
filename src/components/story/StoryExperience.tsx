import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Project } from '../../data/projects'
import { storyChapters, storyNavChapters } from '../../data/story'
import { StoryProgressContext } from './StoryContext'
import { StoryCanvas } from './StoryCanvas'
import { StoryUI } from './StoryUI'
import { clamp } from './math'

type StoryExperienceProps = {
  open: boolean
  onClose: () => void
  onGoProjects: () => void
}

/**
 * Full-screen cinematic Story layer.
 * Opens over the existing homepage — does not replace it.
 * Progress is wheel/touch scrubbed so the WebGL stage stays interactive.
 */
export function StoryExperience({ open, onClose, onGoProjects }: StoryExperienceProps) {
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const [entered, setEntered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const touchY = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const scrollLength = isMobile ? 6.5 : 9.5

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setIsMobile(mq.matches)
      setReducedMotion(motion.matches)
    }
    sync()
    mq.addEventListener('change', sync)
    motion.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      motion.removeEventListener('change', sync)
    }
  }, [])

  const setProgressBoth = useCallback((value: number) => {
    const next = clamp(value)
    progressRef.current = next
    setProgress(next)
  }, [])

  useEffect(() => {
    if (open) {
      setMounted(true)
      document.body.style.overflow = 'hidden'
      const t = window.setTimeout(() => setEntered(true), 40)
      try {
        audioCtxRef.current = new AudioContext()
      } catch {
        /* sound-ready stub */
      }
      return () => window.clearTimeout(t)
    }

    setEntered(false)
    const t = window.setTimeout(() => {
      setMounted(false)
      setProgressBoth(0)
      setSelectedProject(null)
    }, 700)
    document.body.style.overflow = ''
    return () => window.clearTimeout(t)
  }, [open, setProgressBoth])

  useEffect(() => {
    if (!open || !entered) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY / (window.innerHeight * scrollLength)
      setProgressBoth(progressRef.current + delta)
    }

    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null
    }

    const onTouchMove = (e: TouchEvent) => {
      if (touchY.current == null) return
      const y = e.touches[0]?.clientY ?? touchY.current
      const dy = touchY.current - y
      touchY.current = y
      setProgressBoth(progressRef.current + dy / (window.innerHeight * scrollLength * 0.35))
    }

    const onTouchEnd = () => {
      touchY.current = null
    }

    const el = rootRef.current
    el?.addEventListener('wheel', onWheel, { passive: false })
    el?.addEventListener('touchstart', onTouchStart, { passive: true })
    el?.addEventListener('touchmove', onTouchMove, { passive: true })
    el?.addEventListener('touchend', onTouchEnd)

    return () => {
      el?.removeEventListener('wheel', onWheel)
      el?.removeEventListener('touchstart', onTouchStart)
      el?.removeEventListener('touchmove', onTouchMove)
      el?.removeEventListener('touchend', onTouchEnd)
    }
  }, [open, entered, scrollLength, setProgressBoth])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProject) setSelectedProject(null)
        else onClose()
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        setProgressBoth(progressRef.current + 0.04)
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        setProgressBoth(progressRef.current - 0.04)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, selectedProject, setProgressBoth])

  const scrollToChapter = useCallback(
    (chapterId: string) => {
      const chapter = storyChapters.find((c) => c.id === chapterId)
      if (!chapter) return
      const mid = (chapter.range[0] + chapter.range[1]) / 2
      setProgressBoth(mid)
    },
    [setProgressBoth],
  )

  const handleGoProjects = useCallback(() => {
    onClose()
    onGoProjects()
  }, [onClose, onGoProjects])

  const ctx = useMemo(
    () => ({
      progress,
      isMobile,
      reducedMotion,
      onSelectProject: (p: Project) => setSelectedProject(p),
      onExit: onClose,
      onGoProjects: handleGoProjects,
      scrollToChapter,
    }),
    [progress, isMobile, reducedMotion, onClose, handleGoProjects, scrollToChapter],
  )

  if (!mounted) return null

  return (
    <StoryProgressContext.Provider value={ctx}>
      <div
        ref={rootRef}
        className="fixed inset-0 z-[100] story-experience"
        aria-modal="true"
        role="dialog"
        aria-label="The Making of a Builder"
        style={{
          opacity: entered && open ? 1 : 0,
          transform: entered && open ? 'scale(1)' : 'scale(1.03)',
          filter: entered && open ? 'blur(0px)' : 'blur(12px)',
          transition: reducedMotion
            ? 'opacity 0.35s ease'
            : 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), filter 0.7s ease',
          background: '#0c0c0c',
          pointerEvents: open ? 'auto' : 'none',
          touchAction: 'none',
        }}
      >
        <div className="absolute inset-0">
          <StoryCanvas />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        <StoryUI
          entered={entered && open}
          selectedProject={selectedProject}
          onCloseProject={() => setSelectedProject(null)}
        />

        <div className="sr-only">
          {storyNavChapters.map((c) => (
            <div key={c.id}>
              Chapter {c.number}: {c.title}
            </div>
          ))}
        </div>
      </div>
    </StoryProgressContext.Provider>
  )
}
