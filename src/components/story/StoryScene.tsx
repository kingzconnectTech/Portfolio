import { forwardRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CinematicScene } from '../../data/story-cinematic'

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

function getTextFlexClasses(pos: CinematicScene['textPosition']): string {
  switch (pos) {
    case 'left':         return 'justify-center items-start'
    case 'right':        return 'justify-center items-end'
    case 'bottom-left':  return 'justify-end items-start pb-[10vh]'
    case 'bottom-right': return 'justify-end items-end pb-[10vh]'
    case 'center':       return 'justify-center items-center'
    default:             return 'justify-center items-start'
  }
}

function getTextPaddingClasses(pos: CinematicScene['textPosition']): string {
  switch (pos) {
    case 'left':
    case 'bottom-left':  return 'pl-[6vw] sm:pl-[7vw] pr-4 sm:max-w-[48%]'
    case 'right':
    case 'bottom-right': return 'pr-[6vw] sm:pr-[7vw] pl-4 sm:max-w-[48%]'
    case 'center':       return 'px-6 text-center max-w-3xl mx-auto'
    default:             return 'pl-[6vw] sm:max-w-[48%]'
  }
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

  const isCenter = scene.textPosition === 'center'
  const gradientOverlay = getReadabilityGradient(scene.gradient, scene.overlayStrength)
  const flexClasses = getTextFlexClasses(scene.textPosition)
  const paddingClasses = getTextPaddingClasses(scene.textPosition)

  return (
    <div
      ref={ref}
      data-scene-id={scene.id}
      className={`absolute inset-0 w-full h-full overflow-hidden bg-transparent ${
        isOutgoing ? 'pointer-events-none z-10' : 'z-20'
      }`}
      aria-hidden={isOutgoing}
      aria-label={`Scene ${scene.number}: ${scene.title.join(' ')}`}
    >
      {/* ── Visual Media Container (Scales & Drifts with GSAP) ── */}
      <div className="scene-media-layer absolute inset-0 w-full h-full overflow-hidden will-change-transform">
        {/* Background Photograph */}
        {!imageFailed && (
          <img
            src={scene.image}
            alt={scene.imageAlt}
            onError={() => setImageFailed(true)}
            className="scene-image absolute inset-0 w-full h-full object-cover origin-center select-none will-change-transform"
            style={{
              objectPosition: scene.imagePosition,
            }}
          />
        )}

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

      {/* ── Direct Text Overlay (NO cards/boxes) ── */}
      <div className={`absolute inset-0 z-20 flex flex-col ${flexClasses}`}>
        <div className={`scene-text-container ${paddingClasses} will-change-transform`}>
          {/* Scene Number */}
          <div
            className="scene-number font-hn text-[10px] tracking-[0.34em] mb-4 sm:mb-5 sm:text-[11px] select-none will-change-transform"
            style={{ color: '#c4a574' }}
          >
            {scene.number}
          </div>

          {/* Scene Headline / Title */}
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

          {/* Divider rule */}
          {scene.body.length > 0 && (
            <div className="scene-divider mt-6 mb-5 h-px w-8 bg-white/30 will-change-transform" />
          )}

          {/* Body Lines — White sub text */}
          <div className="scene-body-group space-y-1">
            {scene.body.map((line, i) =>
              line === '' ? (
                <div key={i} className="h-3" />
              ) : (
                <p
                  key={i}
                  className={`scene-body-line font-hn leading-relaxed text-white will-change-transform ${
                    line === 'KINGZCONNECT'
                      ? 'text-[11px] tracking-[0.3em] sm:text-xs mt-2 text-white font-medium'
                      : 'text-sm sm:text-base tracking-[0.01em]'
                  }`}
                >
                  {line}
                </p>
              )
            )}
          </div>

          {/* Outro Call To Action Buttons (Scene 09) */}
          {scene.isOutro && (
            <div className="scene-outro-cta mt-12 sm:mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center will-change-transform">
              <Link
                to="/"
                className="px-8 py-[14px] font-hn text-[11px] tracking-[0.22em] transition-all duration-300 hover:opacity-85 backdrop-blur-sm"
                style={{
                  color: '#c4a574',
                  border: '1px solid rgba(196,165,116,0.4)',
                }}
              >
                EXPLORE THE WORK →
              </Link>
              <Link
                to="/"
                className="px-8 py-[14px] border border-white/25 font-hn text-[11px] tracking-[0.22em] text-white/80 transition-all duration-300 hover:border-white/60 hover:text-white hover:bg-white/5 backdrop-blur-sm"
              >
                BACK TO HOME →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
