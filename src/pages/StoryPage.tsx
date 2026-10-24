import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { cinematicScenes, TOTAL_SCENES } from '../data/story-cinematic'
import { StoryViewport } from '../components/story/StoryViewport'
import { BREAKPOINTS, useMediaQuery } from '../hooks/useMediaQuery'
import { useSEO } from '../hooks/useSEO'

const WHEEL_THRESHOLD = 40
/** Deliberate swipe distance (px) before a chapter change. */
const SWIPE_THRESHOLD = 48
/** A quick flick needs less distance — but only within SWIPE_FLICK_MS. */
const SWIPE_FLICK_DISTANCE = 24
const SWIPE_FLICK_MS = 250

export function StoryPage() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [outgoingSceneIndex, setOutgoingSceneIndex] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useSEO('story')

  // Phones get shorter, snappier entrances.
  const isCompact = !useMediaQuery(BREAKPOINTS.tablet)

  const isTransitioning = useRef(false)
  const wheelAccumulator = useRef(0)
  const wheelResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartTime = useRef<number | null>(null)

  const viewportRef = useRef<HTMLDivElement>(null)
  const currentSceneRef = useRef<HTMLDivElement>(null)
  const outgoingSceneRef = useRef<HTMLDivElement>(null)
  const activeTimeline = useRef<gsap.core.Timeline | null>(null)

  // ── Reduced Motion Detection ─────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── Lock Native Document Scrolling Completely ────────────────────────────
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow
    const originalBodyHeight = document.body.style.height
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior
    const originalBodyOverscroll = document.body.style.overscrollBehavior

    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    document.body.style.height = '100dvh'
    window.scrollTo(0, 0)

    viewportRef.current?.focus()

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll
      document.body.style.overflow = originalBodyOverflow
      document.body.style.overscrollBehavior = originalBodyOverscroll
      document.body.style.height = originalBodyHeight
    }
  }, [])

  // ── Preload the first chapter, then the adjacent ones ────────────────────
  useEffect(() => {
    // Chapter 00 always: it is the entry point and must not pop in.
    const indicesToPreload = new Set([0, currentSceneIndex + 1, currentSceneIndex - 1])
    indicesToPreload.forEach((idx) => {
      if (idx >= 0 && idx < TOTAL_SCENES) {
        const scene = cinematicScenes[idx]
        if (scene?.image) {
          const img = new Image()
          img.src = scene.image
        }
      }
    })
  }, [currentSceneIndex])

  // ── Core Cinematic Cross-Dissolve Transition Controller ───────────────────
  const goToScene = useCallback(
    (targetIndex: number) => {
      if (
        targetIndex === currentSceneIndex ||
        targetIndex < 0 ||
        targetIndex >= TOTAL_SCENES ||
        isTransitioning.current
      ) {
        return
      }

      const fromIndex = currentSceneIndex

      // Lock input immediately to prevent gesture spamming
      isTransitioning.current = true
      setOutgoingSceneIndex(fromIndex)
      setCurrentSceneIndex(targetIndex)

      // Kill any in-flight transition timeline
      if (activeTimeline.current) {
        activeTimeline.current.kill()
      }

      requestAnimationFrame(() => {
        const outgoingEl = outgoingSceneRef.current
        const incomingEl = currentSceneRef.current
        if (!incomingEl) {
          isTransitioning.current = false
          return
        }

        const outgoingMedia = outgoingEl?.querySelector<HTMLElement>('.scene-media-layer')

        const incomingMedia = incomingEl.querySelector<HTMLElement>('.scene-media-layer')
        const incomingOverlay = incomingEl.querySelector<HTMLElement>('.scene-overlay-layer')
        const incomingNumber = incomingEl.querySelector<HTMLElement>('.scene-number')
        const incomingTitle = incomingEl.querySelector<HTMLElement>('.scene-title')
        const incomingDivider = incomingEl.querySelector<HTMLElement>('.scene-divider')
        const incomingBodyLines = incomingEl.querySelectorAll<HTMLElement>('.scene-body-line')
        const incomingOutroCta = incomingEl.querySelector<HTMLElement>('.scene-outro-cta')

        // Force GPU acceleration and ensure transforms work
        if (incomingMedia) {
          gsap.set(incomingMedia, { force3D: true, transformOrigin: 'center center' })
        }
        if (outgoingMedia) {
          gsap.set(outgoingMedia, { force3D: true, transformOrigin: 'center center' })
        }

        // If user prefers reduced motion, do a clean simple 0.35s fade
        if (reducedMotion) {
          const tl = gsap.timeline({
            onComplete: () => {
              setOutgoingSceneIndex(null)
              isTransitioning.current = false
            },
          })

          if (outgoingEl) {
            tl.to(outgoingEl, { opacity: 0, duration: 0.35, ease: 'power1.out' }, 0)
          }
          if (incomingEl) {
            tl.fromTo(incomingEl, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0)
          }
          activeTimeline.current = tl
          return
        }

        // ── Simple Smooth Fade Transition ──
        // Phones run a lighter version of the same choreography (≈0.5s total);
        // tablet and desktop keep the original timings.
        const t = isCompact
          ? {
              media: 0.42,
              overlay: 0.34,
              number: 0.26,
              title: 0.3,
              divider: 0.2,
              body: 0.3,
              cta: 0.3,
              stagger: 0.03,
              cOverlay: 0.04,
              cNumber: 0.08,
              cTitle: 0.1,
              cDivider: 0.12,
              cBody: 0.16,
              cCta: 0.2,
            }
          : {
              media: 0.6,
              overlay: 0.5,
              number: 0.4,
              title: 0.5,
              divider: 0.3,
              body: 0.4,
              cta: 0.4,
              stagger: 0.05,
              cOverlay: 0.1,
              cNumber: 0.2,
              cTitle: 0.25,
              cDivider: 0.3,
              cBody: 0.35,
              cCta: 0.4,
            }

        // Prepare incoming elements. The text rises into place; the media and its
        // overlays only fade, so the photograph never slides.
        const rise = isCompact ? 18 : 14
        if (incomingMedia) {
          gsap.set(incomingMedia, { opacity: 0 })
        }
        if (incomingOverlay) gsap.set(incomingOverlay, { opacity: 0 })
        if (incomingNumber) gsap.set(incomingNumber, { opacity: 0, y: rise })
        if (incomingTitle) gsap.set(incomingTitle, { opacity: 0, y: rise })
        if (incomingDivider) gsap.set(incomingDivider, { opacity: 0, y: rise })
        if (incomingBodyLines.length > 0) gsap.set(incomingBodyLines, { opacity: 0, y: rise })
        if (incomingOutroCta) gsap.set(incomingOutroCta, { opacity: 0, y: rise })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          onComplete: () => {
            setOutgoingSceneIndex(null)
            isTransitioning.current = false
          },
        })

        // Fade out outgoing scene
        if (outgoingEl) {
          tl.to(outgoingEl, { opacity: 0, duration: t.media }, 0)
        }

        // Fade in incoming scene
        if (incomingEl) {
          tl.fromTo(incomingEl, { opacity: 0 }, { opacity: 1, duration: t.media }, 0)
        }

        // Fade in incoming overlay
        if (incomingOverlay) {
          tl.to(incomingOverlay, { opacity: 1, duration: t.overlay }, t.cOverlay)
        }

        // Fade + rise the text elements, staggered so the block assembles in order
        if (incomingNumber) {
          tl.to(
            incomingNumber,
            { opacity: 1, y: 0, duration: t.number, ease: 'power2.out', clearProps: 'transform' },
            t.cNumber
          )
        }
        if (incomingTitle) {
          tl.to(
            incomingTitle,
            { opacity: 1, y: 0, duration: t.title, ease: 'power2.out', clearProps: 'transform' },
            t.cTitle
          )
        }
        if (incomingDivider) {
          tl.to(
            incomingDivider,
            { opacity: 1, y: 0, duration: t.divider, ease: 'power2.out', clearProps: 'transform' },
            t.cDivider
          )
        }
        if (incomingBodyLines.length > 0) {
          tl.to(
            incomingBodyLines,
            {
              opacity: 1,
              y: 0,
              duration: t.body,
              stagger: t.stagger,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            t.cBody
          )
        }
        if (incomingOutroCta) {
          tl.to(
            incomingOutroCta,
            { opacity: 1, y: 0, duration: t.cta, ease: 'power2.out', clearProps: 'transform' },
            t.cCta
          )
        }

        activeTimeline.current = tl
      })
    },
    [currentSceneIndex, reducedMotion, isCompact]
  )

  const nextScene = useCallback(() => {
    if (currentSceneIndex < TOTAL_SCENES - 1) {
      goToScene(currentSceneIndex + 1)
    }
  }, [currentSceneIndex, goToScene])

  const previousScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      goToScene(currentSceneIndex - 1)
    }
  }, [currentSceneIndex, goToScene])

  // ── Wheel & Trackpad Gesture Handling ────────────────────────────────────
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isTransitioning.current) {
        return
      }

      wheelAccumulator.current += e.deltaY

      if (wheelResetTimer.current) {
        clearTimeout(wheelResetTimer.current)
      }
      wheelResetTimer.current = setTimeout(() => {
        wheelAccumulator.current = 0
      }, 200)

      if (Math.abs(wheelAccumulator.current) >= WHEEL_THRESHOLD) {
        if (wheelAccumulator.current > 0) {
          nextScene()
        } else {
          previousScene()
        }
        wheelAccumulator.current = 0
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      el.removeEventListener('wheel', handleWheel)
      if (wheelResetTimer.current) {
        clearTimeout(wheelResetTimer.current)
      }
    }
  }, [nextScene, previousScene])

  // ── Mobile Touch Gesture Handling ─────────────────────────────────────────
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY.current = e.touches[0].clientY
        touchStartX.current = e.touches[0].clientX
        touchStartTime.current = Date.now()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Short landscape viewports can scroll an overflowing chapter text block;
      // let that gesture through instead of hijacking it for chapter navigation.
      const target = e.target as HTMLElement | null
      const scroller = target?.closest<HTMLElement>('[data-story-scrollable]')
      if (scroller && scroller.scrollHeight > scroller.clientHeight + 2) {
        return
      }

      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || touchStartX.current === null) return
      if (isTransitioning.current) {
        touchStartY.current = null
        touchStartX.current = null
        touchStartTime.current = null
        return
      }

      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const diffY = touchStartY.current - touchEndY
      const diffX = touchStartX.current - touchEndX
      const duration = Date.now() - (touchStartTime.current ?? Date.now())

      // Navigation needs either a deliberate swipe or a fast flick, so an
      // accidental tap (tiny movement) never changes the chapter.
      const isFlick = Math.abs(diffY) >= SWIPE_FLICK_DISTANCE && duration <= SWIPE_FLICK_MS
      const isDeliberateSwipe = Math.abs(diffY) >= SWIPE_THRESHOLD

      if (Math.abs(diffY) > Math.abs(diffX) && (isDeliberateSwipe || isFlick)) {
        if (diffY > 0) {
          nextScene()
        } else {
          previousScene()
        }
      }

      touchStartY.current = null
      touchStartX.current = null
      touchStartTime.current = null
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [nextScene, previousScene])

  // ── Keyboard Navigation ──────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase()
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return
      }

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          nextScene()
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault()
          previousScene()
          break
        case 'Home':
          e.preventDefault()
          goToScene(0)
          break
        case 'End':
          e.preventDefault()
          goToScene(TOTAL_SCENES - 1)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextScene, previousScene, goToScene])

  const currentSceneData = cinematicScenes[currentSceneIndex] ?? cinematicScenes[0]
  const outgoingSceneData =
    outgoingSceneIndex !== null ? cinematicScenes[outgoingSceneIndex] ?? null : null

  return (
    <StoryViewport
      ref={viewportRef}
      currentScene={currentSceneData}
      outgoingScene={outgoingSceneData}
      totalScenes={TOTAL_SCENES}
      activeSceneIndex={currentSceneIndex}
      currentSceneRef={currentSceneRef}
      outgoingSceneRef={outgoingSceneRef}
    />
  )
}
