import { forwardRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { CinematicScene } from '../../data/story-cinematic'
import {
  useIsDesktop,
  useIsLandscape,
  useIsShort,
  useIsTabletUp,
} from '../../hooks/useMediaQuery'

// Atmospheric gradients for scenes where an image is not present
const SCENE_GRADIENTS: Record<number, string> = {
  0: 'radial-gradient(ellipse at 65% 50%, #1c1408 0%, #0c0c0c 70%)',
  1: 'radial-gradient(ellipse at 18% 50%, #0d1117 0%, #0c0c0c 70%)',
  2: 'radial-gradient(ellipse at 72% 40%, #0f0f18 0%, #0c0c0c 70%)',
  3: 'radial-gradient(ellipse at 28% 60%, #0c1008 0%, #0c0c0c 70%)',
  4: 'radial-gradient(ellipse at 82% 32%, #130e08 0%, #0c0c0c 70%)',
  5: 'radial-gradient(ellipse at 38% 68%, #08111a 0%, #0c0c0c 70%)',
  6: 'radial-gradient(ellipse at 62% 38%, #110a11 0%, #0c0c0c 70%)',
  7: 'radial-gradient(ellipse at 20% 72%, #0a100e 0%, #0c0c0c 70%)',
  8: 'radial-gradient(ellipse at 50% 28%, #12100a 0%, #0c0c0c 70%)',
  9: 'radial-gradient(ellipse at 50% 50%, #0e0e0e 0%, #000000 100%)',
}

function getReadabilityGradient(
  direction: CinematicScene['gradient'],
  strength: number
): string {
  const s = strength
  const s2 = strength * 0.65
  switch (direction) {
    case 'left':
      return `linear-gradient(to right, rgba(12,12,12,${s}) 0%, rgba(12,12,12,${s2}) 42%, transparent 76%)`
    case 'right':
      return `linear-gradient(to left, rgba(12,12,12,${s}) 0%, rgba(12,12,12,${s2}) 42%, transparent 76%)`
    case 'bottom':
      return `linear-gradient(to top, rgba(12,12,12,${s}) 0%, rgba(12,12,12,${s2 * 0.75}) 40%, transparent 80%)`
    case 'top':
      return `linear-gradient(to bottom, rgba(12,12,12,${s}) 0%, rgba(12,12,12,${s2 * 0.75}) 40%, transparent 80%)`
    default:
      return 'none'
  }
}

// ── Desktop composition (unchanged) ──────────────────────────────────────────
function desktopFlexClasses(pos: CinematicScene['textPosition']): string {
  switch (pos) {
    case 'left':         return 'justify-center items-start'
    case 'right':        return 'justify-center items-end'
    case 'bottom-left':  return 'justify-end items-start pb-[10vh]'
    case 'bottom-right': return 'justify-end items-end pb-[10vh]'
    case 'center':       return 'justify-center items-center'
    default:             return 'justify-center items-start'
  }
}

function desktopPaddingClasses(pos: CinematicScene['textPosition']): string {
  switch (pos) {
    case 'left':
    case 'bottom-left':  return 'pl-[6vw] sm:pl-[7vw] pr-4 sm:max-w-[48%]'
    case 'right':
    case 'bottom-right': return 'pr-[6vw] sm:pr-[7vw] pl-4 sm:max-w-[48%]'
    case 'center':       return 'px-6 text-center max-w-3xl mx-auto'
    default:             return 'pl-[6vw] sm:max-w-[48%]'
  }
}

// ── Reflowed compositions ────────────────────────────────────────────────────
/**
 * - `stacked`: mobile and tablet portrait — bottom-aligned full-width block.
 * - `split`:   tablet landscape — desktop-style bottom-left card capped at 55vw.
 */
type SceneLayout = 'desktop' | 'split' | 'stacked'

interface LayoutClasses {
  heading: string
  number: string
  divider: string
  bodyGroup: string
  bodyNormal: string
  bodyBrand: string
  cta: string
}

function getLayoutClasses(layout: 'split' | 'stacked', isShort: boolean): LayoutClasses {
  const stacked = layout === 'stacked'

  return {
    heading: stacked
      ? isShort
        ? 'text-[clamp(1.5rem,5.2vh,2.25rem)]'
        : 'text-[clamp(2.25rem,11vw,3.5rem)] sm:text-[clamp(2.5rem,7.2vw,5rem)]'
      : isShort
        ? 'text-[clamp(1.25rem,4.4vh,2rem)]'
        : 'text-[clamp(1.75rem,4.2vw,3.25rem)]',
    number: isShort
      ? 'text-[10px] tracking-[0.34em] mb-2 sm:text-[11px]'
      : 'text-[10px] tracking-[0.34em] mb-3 sm:mb-4 sm:text-[11px]',
    divider: isShort ? 'mt-3 mb-3 h-px w-8 bg-white/30' : 'mt-5 mb-4 h-px w-8 bg-white/30',
    bodyGroup: isShort ? 'space-y-0.5' : 'space-y-1',
    bodyNormal: stacked
      ? isShort
        ? 'text-[11px] leading-[1.5]'
        : 'text-[13px] leading-[1.7] tracking-[0.01em] sm:text-sm'
      : isShort
        ? 'text-[11px] leading-[1.45]'
        : 'text-[13px] leading-[1.6] tracking-[0.01em]',
    bodyBrand: isShort
      ? 'text-[10px] leading-[1.4] tracking-[0.28em] mt-1.5 font-medium'
      : 'text-[11px] leading-relaxed tracking-[0.3em] mt-2 font-medium sm:text-xs',
    cta: isShort
      ? 'mt-6 flex flex-col gap-3 items-start'
      : 'mt-8 sm:mt-10 flex flex-col gap-3 items-start sm:flex-row sm:gap-4 sm:items-center',
  }
}

/** Bottom-to-top readability gradient for the stacked compositions. */
function getStackedGradient(isShort: boolean): string {
  return isShort
    ? 'linear-gradient(to top, rgba(12,12,12,0.94) 0%, rgba(12,12,12,0.9) 45%, rgba(12,12,12,0.55) 62%, transparent 72%)'
    : 'linear-gradient(to top, rgba(12,12,12,0.95) 0%, rgba(12,12,12,0.9) 25%, rgba(12,12,12,0.6) 40%, transparent 48%)'
}

export interface StorySceneProps {
  scene: CinematicScene
  isOutgoing?: boolean
}

export const StoryScene = forwardRef<HTMLDivElement, StorySceneProps>(function StoryScene(
  { scene, isOutgoing = false },
  ref
) {
  const [imageFailed, setImageFailed] = useState(false)

  const isDesktop = useIsDesktop()
  const isTabletUp = useIsTabletUp()
  const isLandscape = useIsLandscape()
  const isShort = useIsShort()

  // Desktop is untouched; tablet landscape keeps the split; everything else stacks.
  const layout: SceneLayout = isDesktop
    ? 'desktop'
    : isTabletUp && isLandscape
      ? 'split'
      : 'stacked'

  const isCenter = scene.textPosition === 'center'
  const gradientOverlay = getReadabilityGradient(scene.gradient, scene.overlayStrength)
  const flexClasses = desktopFlexClasses(scene.textPosition)
  const paddingClasses = desktopPaddingClasses(scene.textPosition)
  const layoutClasses = getLayoutClasses(layout === 'split' ? 'split' : 'stacked', isShort)

  // The reflowed layouts must never clip a chapter: the block is capped well
  // below the fixed header and scrolls internally only if a dense chapter still
  // does not fit. The bottom padding keeps text clear of browser chrome.
  const blockClasses =
    'max-h-[calc(100%_-_120px)] overflow-y-auto overscroll-contain scrollbar-hide'
  const blockBottomPadding = 'max(64px, calc(env(safe-area-inset-bottom, 0px) + 24px))'
  const blockStyle: CSSProperties = { touchAction: 'pan-y' }

  // Per-chapter focal points, consumed by `.scene-image--focal`.
  const focalVars = {
    '--focal-desktop': scene.imagePosition,
    '--focal-mobile': scene.mobileImagePosition ?? scene.imagePosition,
  } as CSSProperties

  const imageEl = (
    <img
      src={scene.image}
      alt={scene.imageAlt}
      loading={scene.id === 0 ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setImageFailed(true)}
      className={`scene-image absolute inset-0 w-full h-full object-cover origin-center select-none will-change-transform ${
        layout === 'desktop' ? '' : 'scene-image--focal'
      }`}
      style={layout === 'desktop' ? { objectPosition: scene.imagePosition } : undefined}
    />
  )

  const bodyLines = scene.body.map((line, i) =>
    line === '' ? (
      <div key={i} className="h-3" />
    ) : (
      <p
        key={i}
        className={`scene-body-line font-hn text-white will-change-transform ${
          layout === 'desktop'
            ? line === 'KINGZCONNECT'
              ? 'leading-relaxed text-[11px] tracking-[0.3em] sm:text-xs mt-2 text-white font-medium'
              : 'leading-relaxed text-sm sm:text-base tracking-[0.01em]'
            : line === 'KINGZCONNECT'
              ? layoutClasses.bodyBrand
              : layoutClasses.bodyNormal
        }`}
      >
        {line}
      </p>
    )
  )

  const outroCta = scene.isOutro ? (
    <div
      className={`scene-outro-cta will-change-transform ${
        layout === 'desktop'
          ? 'mt-12 sm:mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center'
          : layoutClasses.cta
      }`}
    >
      <Link
        to="/"
        className="px-8 py-[14px] font-hn text-[11px] tracking-[0.22em] transition-all duration-300 hover:opacity-85 active:opacity-70 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        style={{
          color: '#c4a574',
          border: '1px solid rgba(196,165,116,0.4)',
        }}
      >
        EXPLORE THE WORK →
      </Link>
      <Link
        to="/"
        className="px-8 py-[14px] border border-white/25 font-hn text-[11px] tracking-[0.22em] text-white/80 transition-all duration-300 hover:border-white/60 hover:text-white hover:bg-white/5 active:border-white/60 active:text-white backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        BACK TO HOME →
      </Link>
    </div>
  ) : null

  return (
    <div
      ref={ref}
      data-scene-id={scene.id}
      className={`absolute inset-0 w-full h-full overflow-hidden bg-transparent ${
        isOutgoing ? 'pointer-events-none z-10' : 'z-20'
      }`}
      style={focalVars}
      aria-hidden={isOutgoing}
      aria-label={`Scene ${scene.number}: ${scene.title.join(' ')}`}
    >
      {/* ── Visual Media Container (Scales & Drifts with GSAP) ── */}
      <div className="scene-media-layer absolute inset-0 w-full h-full overflow-hidden will-change-transform">
        {/* Background Photograph — a portrait crop can be supplied per chapter */}
        {!imageFailed &&
          (scene.mobileImage ? (
            <picture>
              <source media="(max-width: 640px)" srcSet={scene.mobileImage} />
              {imageEl}
            </picture>
          ) : (
            imageEl
          ))}

        {/* Fallback Gradient (only visible if image failed to load) */}
        {imageFailed && (
          <div
            className="scene-fallback-bg absolute inset-0 pointer-events-none"
            style={{
              background: SCENE_GRADIENTS[scene.id] ?? SCENE_GRADIENTS[0],
            }}
          />
        )}
      </div>

      {/* ── Directional & Vignette Overlays ── */}
      <div className="scene-overlay-layer absolute inset-0 pointer-events-none z-10 will-change-opacity">
        {layout === 'stacked' ? (
          <>
            {/* Header contrast */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(12,12,12,0.42) 0%, transparent 14%)',
              }}
            />
            {/* Bottom-to-top scrim: transparent at ~35% height, ~90% black at the base */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: getStackedGradient(isShort) }}
            />
          </>
        ) : layout === 'split' ? (
          <>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, rgba(12,12,12,0.86) 0%, rgba(12,12,12,0.6) 38%, transparent 68%)',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(12,12,12,0.62) 0%, transparent 46%), linear-gradient(to bottom, rgba(12,12,12,0.3) 0%, transparent 16%)',
              }}
            />
          </>
        ) : (
          <>
            {scene.gradient !== 'none' && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: gradientOverlay }}
              />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(12,12,12,0.45) 0%, transparent 28%), linear-gradient(to bottom, rgba(12,12,12,0.3) 0%, transparent 18%)',
              }}
            />
          </>
        )}
        {/* Modern color grading overlay for cinematic look */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(196,165,116,0.03) 100%)',
            mixBlendMode: 'color',
          }}
        />
        {/* Modern film grain overlay for cinematic texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {layout === 'desktop' ? (
        /* ── Desktop: original direct text overlay (NO cards/boxes) ── */
        <div className={`absolute inset-0 z-20 flex flex-col ${flexClasses}`}>
          <div className={`scene-text-container ${paddingClasses} will-change-transform p-6 sm:p-8 rounded-2xl backdrop-blur-md bg-white/5 shadow-xl`}>
            <div
              className="scene-number font-hn text-[10px] tracking-[0.34em] mb-4 sm:mb-5 sm:text-[11px] select-none will-change-transform"
              style={{ color: '#c4a574' }}
            >
              {scene.number}
            </div>

            <h2
              className={`scene-title font-hn leading-[0.9] tracking-[-0.03em] text-cream will-change-transform ${
                isCenter
                  ? 'text-[10vw] sm:text-[6.5vw] lg:text-[4.8vw]'
                  : 'text-[9.5vw] sm:text-[6vw] lg:text-[4.6vw]'
              }`}
            >
              {scene.title.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {scene.body.length > 0 && (
              <div className="scene-divider mt-6 mb-5 h-px w-8 bg-white/30 will-change-transform" />
            )}

            <div className="scene-body-group space-y-1">{bodyLines}</div>

            {outroCta}
          </div>
        </div>
      ) : layout === 'stacked' ? (
        /* ── Mobile / tablet portrait: bottom-aligned block over the scrim ── */
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <div
            data-story-scrollable=""
            className={`scene-text-container w-full will-change-transform px-5 sm:max-w-[560px] sm:px-10 ${blockClasses}`}
            style={{
              paddingBottom: blockBottomPadding,
              ...blockStyle,
            }}
          >
            <div
              className={`scene-number font-hn select-none will-change-transform ${layoutClasses.number}`}
              style={{ color: '#c4a574' }}
            >
              {scene.number}
            </div>

            <h2
              className={`scene-title font-hn leading-[0.95] tracking-[-0.02em] text-cream text-balance will-change-transform ${layoutClasses.heading}`}
            >
              {scene.title.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {scene.body.length > 0 && (
              <div className={`scene-divider will-change-transform ${layoutClasses.divider}`} />
            )}

            <div className={`scene-body-group ${layoutClasses.bodyGroup}`}>{bodyLines}</div>

            {outroCta}
          </div>
        </div>
      ) : (
        /* ── Tablet landscape: desktop split, card capped at 55% of the width ── */
        <div className="absolute inset-0 z-20 flex flex-col justify-end items-start">
          <div
            data-story-scrollable=""
            className={`scene-text-container will-change-transform w-1/2 max-w-[55vw] pl-6 pr-4 sm:pl-10 sm:pr-6 ${blockClasses}`}
            style={{
              paddingBottom: blockBottomPadding,
              ...blockStyle,
            }}
          >
            <div
              className={`scene-number font-hn select-none will-change-transform ${layoutClasses.number}`}
              style={{ color: '#c4a574' }}
            >
              {scene.number}
            </div>

            <h2
              className={`scene-title font-hn leading-[0.95] tracking-[-0.02em] text-cream text-balance will-change-transform ${layoutClasses.heading}`}
            >
              {scene.title.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {scene.body.length > 0 && (
              <div className={`scene-divider will-change-transform ${layoutClasses.divider}`} />
            )}

            <div className={`scene-body-group ${layoutClasses.bodyGroup}`}>{bodyLines}</div>

            {outroCta}
          </div>
        </div>
      )}
    </div>
  )
})
