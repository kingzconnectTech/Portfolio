import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { CinematicScene as CinematicSceneType } from '../../data/story-cinematic'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

// Unique moody gradient backgrounds for scenes without photos yet
const SCENE_GRADIENTS: Record<number, string> = {
  0: 'radial-gradient(ellipse at 65% 50%, #1c1408 0%, #0c0c0c 65%)',
  1: 'radial-gradient(ellipse at 18% 50%, #0d1117 0%, #0c0c0c 65%)',
  2: 'radial-gradient(ellipse at 72% 40%, #0f0f18 0%, #0c0c0c 65%)',
  3: 'radial-gradient(ellipse at 28% 60%, #0c1008 0%, #0c0c0c 65%)',
  4: 'radial-gradient(ellipse at 82% 32%, #130e08 0%, #0c0c0c 65%)',
  5: 'radial-gradient(ellipse at 38% 68%, #08111a 0%, #0c0c0c 65%)',
  6: 'radial-gradient(ellipse at 62% 38%, #110a11 0%, #0c0c0c 65%)',
  7: 'radial-gradient(ellipse at 20% 72%, #0a100e 0%, #0c0c0c 65%)',
  8: 'radial-gradient(ellipse at 50% 28%, #12100a 0%, #0c0c0c 65%)',
  9: 'radial-gradient(ellipse at 50% 50%, #0e0e0e 0%, #000000 100%)',
}

function getReadabilityGradient(
  direction: CinematicSceneType['gradient'],
  strength: number
): string {
  const s = strength
  const s2 = strength * 0.65
  switch (direction) {
    case 'left':
      return `linear-gradient(to right, rgba(12,12,12,${s}) 0%, rgba(12,12,12,${s2}) 38%, transparent 72%)`
    case 'right':
      return `linear-gradient(to left, rgba(12,12,12,${s}) 0%, rgba(12,12,12,${s2}) 38%, transparent 72%)`
    case 'bottom':
      return `linear-gradient(to top, rgba(12,12,12,${s}) 0%, rgba(12,12,12,${s2 * 0.7}) 38%, transparent 78%)`
    case 'top':
      return `linear-gradient(to bottom, rgba(12,12,12,${s}) 0%, rgba(12,12,12,${s2 * 0.7}) 38%, transparent 78%)`
    default:
      return 'none'
  }
}

function getTextFlexClasses(pos: CinematicSceneType['textPosition']): string {
  switch (pos) {
    case 'left':         return 'justify-center items-start'
    case 'right':        return 'justify-center items-end'
    case 'bottom-left':  return 'justify-end items-start pb-[8vh]'
    case 'bottom-right': return 'justify-end items-end pb-[8vh]'
    case 'center':       return 'justify-center items-center'
    default:             return 'justify-center items-start'
  }
}

function getTextPaddingClasses(pos: CinematicSceneType['textPosition']): string {
  switch (pos) {
    case 'left':
    case 'bottom-left':  return 'pl-[6vw] sm:pl-[7vw] pr-4 sm:max-w-[46%]'
    case 'right':
    case 'bottom-right': return 'pr-[6vw] sm:pr-[7vw] pl-4 sm:max-w-[46%]'
    case 'center':       return 'px-6 text-center max-w-3xl mx-auto'
    default:             return 'pl-[6vw] sm:max-w-[46%]'
  }
}

export type CinematicSceneProps = {
  scene: CinematicSceneType
  reducedMotion: boolean
  /** The scroller element — needed for GSAP ScrollTrigger in snap containers */
  scrollerEl: HTMLElement | null
}

export function CinematicSceneComponent({
  scene,
  reducedMotion,
  scrollerEl,
}: CinematicSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  // GSAP animations — scoped to the snap scroller
  useEffect(() => {
    if (!containerRef.current || reducedMotion || !scrollerEl) return

    const ctx = gsap.context(() => {
      // Subtle parallax on image
      if (imageRef.current && imageLoaded) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.06 },
          {
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              scroller: scrollerEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        )
      }

      // Staggered text entrance
      const children = textRef.current?.querySelectorAll('.anim-child')
      if (children && children.length > 0) {
        gsap.fromTo(
          children,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              scroller: scrollerEl,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [scene.id, reducedMotion, scrollerEl, imageLoaded])

  const gradientOverlay = getReadabilityGradient(scene.gradient, scene.overlayStrength)
  const flexClasses = getTextFlexClasses(scene.textPosition)
  const paddingClasses = getTextPaddingClasses(scene.textPosition)

  return (
    <section
      ref={containerRef}
      id={`scene-${scene.number}`}
      className="relative w-full h-screen flex-shrink-0 snap-start overflow-hidden"
      aria-label={`Scene ${scene.number}: ${scene.title.join(' ')}`}
    >
      {/* ── Photo background ── */}
      {!imageFailed && (
        <img
          ref={imageRef}
          src={scene.image}
          alt={scene.imageAlt}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageFailed(true)}
          className="absolute inset-0 w-full h-full object-cover origin-center"
          style={{
            objectPosition: scene.imagePosition,
            opacity: imageLoaded ? 1 : 0,
            transition: reducedMotion ? 'none' : 'opacity 0.8s ease',
          }}
        />
      )}

      {/* ── Gradient fallback background ── */}
      <div
        className="absolute inset-0"
        style={{
          background: SCENE_GRADIENTS[scene.id] ?? SCENE_GRADIENTS[0],
          opacity: imageLoaded ? 0 : 1,
          transition: reducedMotion ? 'none' : 'opacity 0.8s ease',
        }}
      />

      {/* ── Directional gradient for text readability ── */}
      {scene.gradient !== 'none' && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: gradientOverlay }}
        />
      )}

      {/* ── Permanent bottom vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(12,12,12,0.35) 0%, transparent 30%)',
        }}
      />

      {/* ── Text layer ── */}
      <div
        className={`absolute inset-0 z-20 flex flex-col ${flexClasses}`}
      >
        <div className={paddingClasses} ref={textRef}>
          {scene.isOutro ? (
            <OutroContent scene={scene} reducedMotion={reducedMotion} />
          ) : (
            <SceneText scene={scene} reducedMotion={reducedMotion} />
          )}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// Scene text layout
// ─────────────────────────────────────────────
function SceneText({
  scene,
  reducedMotion,
}: {
  scene: CinematicSceneType
  reducedMotion: boolean
}) {
  const isCenter = scene.textPosition === 'center'

  return (
    <>
      {/* Number */}
      <div
        className="anim-child font-hn text-[10px] tracking-[0.34em] mb-5 sm:text-[11px]"
        style={{
          color: '#c4a574',
          opacity: reducedMotion ? 1 : 0,
        }}
      >
        {scene.number}
      </div>

      {/* Title */}
      <h2
        className={`anim-child font-hn leading-[0.88] tracking-[-0.03em] text-cream ${
          isCenter
            ? 'text-[9vw] sm:text-[6vw] lg:text-[4.5vw]'
            : 'text-[9.5vw] sm:text-[6vw] lg:text-[4.8vw]'
        }`}
        style={{ opacity: reducedMotion ? 1 : 0 }}
      >
        {scene.title.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>

      {/* Divider rule */}
      {scene.body.length > 0 && (
        <div
          className="anim-child mt-6 mb-5 h-px w-8 bg-white/30"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        />
      )}

      {/* Body lines */}
      {scene.body.map((line, i) =>
        line === '' ? (
          <div key={i} className="anim-child h-3" style={{ opacity: reducedMotion ? 1 : 0 }} />
        ) : (
          <p
            key={i}
            className={`anim-child font-hn leading-relaxed text-white ${
              line === 'KINGZCONNECT'
                ? 'text-[11px] tracking-[0.3em] sm:text-xs mt-1 text-white'
                : 'text-sm sm:text-base tracking-[0.01em] text-white'
            }`}
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            {line}
          </p>
        )
      )}
    </>
  )
}

// ─────────────────────────────────────────────
// Outro scene layout
// ─────────────────────────────────────────────
function OutroContent({
  scene,
  reducedMotion,
}: {
  scene: CinematicSceneType
  reducedMotion: boolean
}) {
  return (
    <>
      {/* Number */}
      <div
        className="anim-child font-hn text-[10px] tracking-[0.34em] mb-10 sm:text-[11px]"
        style={{ color: '#c4a574', opacity: reducedMotion ? 1 : 0 }}
      >
        {scene.number}
      </div>

      {/* Title */}
      <h2
        className="anim-child font-hn text-[12vw] leading-[0.88] tracking-[-0.03em] text-cream sm:text-[8vw] lg:text-[5.5vw]"
        style={{ opacity: reducedMotion ? 1 : 0 }}
      >
        {scene.title.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>

      {/* CTA buttons */}
      <div
        className="anim-child mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center"
        style={{ opacity: reducedMotion ? 1 : 0 }}
      >
        <Link
          to="/"
          className="px-8 py-[14px] border border-cream/20 font-hn text-[11px] tracking-[0.22em] text-cream/70 transition-all duration-300 hover:border-cream/55 hover:text-cream hover:bg-cream/5 backdrop-blur-sm"
        >
          ← BACK TO HOME
        </Link>
        <Link
          to="/"
          className="px-8 py-[14px] font-hn text-[11px] tracking-[0.22em] transition-all duration-300 hover:opacity-80 backdrop-blur-sm"
          style={{
            color: '#c4a574',
            border: '1px solid rgba(196,165,116,0.35)',
          }}
        >
          EXPLORE THE WORK →
        </Link>
      </div>
    </>
  )
}
