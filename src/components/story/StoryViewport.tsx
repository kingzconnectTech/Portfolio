import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import type { CinematicScene } from '../../data/story-cinematic'
import { StoryScene } from './StoryScene'

export interface StoryViewportProps {
  currentScene: CinematicScene
  outgoingScene: CinematicScene | null
  totalScenes: number
  activeSceneIndex: number
  goToScene: (index: number) => void
  currentSceneRef: React.RefObject<HTMLDivElement>
  outgoingSceneRef: React.RefObject<HTMLDivElement>
}

export const StoryViewport = forwardRef<HTMLDivElement, StoryViewportProps>(
  function StoryViewport(
    {
      currentScene,
      outgoingScene,
      totalScenes,
      activeSceneIndex,
      goToScene,
      currentSceneRef,
      outgoingSceneRef,
    },
    containerRef
  ) {
    const formattedCurrent = String(activeSceneIndex).padStart(2, '0')
    const formattedTotal = String(totalScenes - 1).padStart(2, '0')

    return (
      <div
        ref={containerRef}
        className="fixed inset-0 w-screen h-[100dvh] bg-[#0c0c0c] overflow-hidden select-none"
        style={{
          touchAction: 'none', // Prevents browser pull-to-refresh & native touch scrolling
          userSelect: 'none',
        }}
        tabIndex={0}
        role="region"
        aria-label="Cinematic Story Slideshow"
        aria-roledescription="slideshow"
      >
        {/* ── Screen Reader Announcement ── */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Scene {activeSceneIndex + 1} of {totalScenes}: {currentScene.title.join(' ')}
        </div>

        {/* ── Outgoing Scene (during crossfade transition) ── */}
        {outgoingScene && (
          <StoryScene
            key={`outgoing-${outgoingScene.id}`}
            ref={outgoingSceneRef}
            scene={outgoingScene}
            isOutgoing={true}
          />
        )}

        {/* ── Current Active Scene ── */}
        <StoryScene
          key={`current-${currentScene.id}`}
          ref={currentSceneRef}
          scene={currentScene}
          isOutgoing={false}
        />

        {/* ── Fixed Global Minimal Navigation (Stays fixed at all times) ── */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8 pointer-events-none">
          <Link
            to="/"
            className="pointer-events-auto font-hn text-xs tracking-[0.26em] text-cream hover:text-white transition-opacity duration-300 hover:opacity-75 sm:text-sm font-semibold"
            aria-label="Return to Home"
          >
            KINGZCONNECT
          </Link>

          <nav
            className="pointer-events-auto flex items-center gap-6 sm:gap-8 font-hn text-[11px] tracking-[0.22em] text-cream/60 sm:text-xs"
            aria-label="Primary site navigation"
          >
            <Link
              to="/"
              className="transition-colors duration-300 hover:text-white"
            >
              HOME
            </Link>
            <Link
              to="/#projects"
              className="transition-colors duration-300 hover:text-white"
            >
              WORK
            </Link>
            <span
              className="text-white font-medium relative py-1"
              style={{ color: '#c4a574' }}
            >
              STORY
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#c4a574]" />
            </span>
          </nav>
        </header>

        {/* ── Fixed Static Corner Indicator (05 / 09) ── */}
        <div
          className="fixed bottom-7 left-6 sm:left-10 z-50 pointer-events-none select-none"
          aria-hidden="true"
        >
          <div
            className="font-hn text-[10px] sm:text-[11px] tracking-[0.32em] tabular-nums font-medium"
            style={{ color: '#c4a574' }}
          >
            {formattedCurrent} / {formattedTotal}
          </div>
        </div>

        {/* ── Fixed Right-Side Scene Navigation Dots ── */}
        <nav
          className="fixed right-6 sm:right-8 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-end gap-[10px]"
          aria-label="Jump to specific scene"
        >
          {Array.from({ length: totalScenes }).map((_, i) => {
            const isActive = activeSceneIndex === i
            const sceneNum = String(i).padStart(2, '0')
            return (
              <button
                key={i}
                type="button"
                onClick={() => goToScene(i)}
                aria-label={`Go to scene ${sceneNum}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center gap-2.5 py-1 px-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c4a574]"
              >
                <span
                  className="font-hn text-[8px] tracking-[0.2em] transition-all duration-300 select-none opacity-0 group-hover:opacity-100"
                  style={{
                    color: isActive ? '#c4a574' : 'rgba(239,238,233,0.5)',
                  }}
                >
                  {sceneNum}
                </span>
                <div
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: isActive ? 22 : 6,
                    height: 1.5,
                    background: isActive ? '#c4a574' : 'rgba(239,238,233,0.25)',
                  }}
                />
              </button>
            )
          })}
        </nav>

        {/* ── Fixed Bottom Scroll/Gesture Hint (Scene 00 Only) ── */}
        <div
          className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-500 select-none"
          style={{
            opacity: activeSceneIndex === 0 ? 1 : 0,
            visibility: activeSceneIndex === 0 ? 'visible' : 'hidden',
          }}
          aria-hidden={activeSceneIndex !== 0}
        >
          <span className="font-hn text-[8px] sm:text-[9px] tracking-[0.34em] text-white/50">
            SCROLL OR USE ARROWS
          </span>
          <div className="w-px h-6 bg-white/30 story-scroll-hint" />
        </div>
      </div>
    )
  }
)
