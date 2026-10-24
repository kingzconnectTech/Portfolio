import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import type { CinematicScene } from '../../data/story-cinematic'
import { useIsDesktop, useIsLandscape, useIsTabletUp } from '../../hooks/useMediaQuery'
import { MobileMenu } from '../nav/MobileMenu'
import { ChapterProgress } from './ChapterProgress'
import { StoryScene } from './StoryScene'
import { SwipeHint, type SwipeHintVariant } from './SwipeHint'

export interface StoryViewportProps {
  currentScene: CinematicScene
  outgoingScene: CinematicScene | null
  totalScenes: number
  activeSceneIndex: number
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
      currentSceneRef,
      outgoingSceneRef,
    },
    containerRef
  ) {
    const isDesktop = useIsDesktop()
    const isTabletUp = useIsTabletUp()
    const isLandscape = useIsLandscape()

    // Stacked layouts (mobile / tablet portrait) keep the top-right free, so the
    // hint moves up there — the bottom belongs to the chapter text block.
    const hintVariant: SwipeHintVariant = isDesktop
      ? 'bottom-center'
      : isTabletUp && isLandscape
        ? 'bottom-right'
        : 'top-right'

    return (
      <div
        ref={containerRef}
        className="story-viewport fixed inset-0 w-screen bg-[#0c0c0c] overflow-hidden select-none"
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

        {/* ── Chapter Progress (reflowed layouts only) ── */}
        {!isDesktop && <ChapterProgress index={activeSceneIndex} total={totalScenes} />}

        <header
          className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 pointer-events-none`}
          style={{
            paddingTop: isDesktop ? '32px' : 'max(16px, env(safe-area-inset-top))',
            paddingBottom: '16px',
          }}
        >
          <div className="flex items-center gap-6 pointer-events-auto">
            <Link
              to="/"
              className={`font-hn tracking-[0.26em] text-cream font-semibold flex items-center gap-2 transition-opacity duration-300 text-xs sm:text-sm ${
                isDesktop
                  ? 'hover:text-white hover:opacity-75'
                  : '-ml-2.5 min-h-[44px] min-w-[44px] rounded-full bg-black/35 px-2.5 backdrop-blur-[2px] hover:text-white active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
              }`}
              aria-label="Return to Home"
            >
              ← BACK
            </Link>
          </div>

          {/* Mobile Menu — visible for every non-desktop composition */}
          <MobileMenu
            activeLabel="Story"
            tone="white"
            showSocial
            visibilityClass={isDesktop ? 'hidden' : ''}
            className="pointer-events-auto"
          />
        </header>

        {/* ── Gesture Hint (Scene 00 Only) ── */}
        <SwipeHint variant={hintVariant} visible={activeSceneIndex === 0} />
      </div>
    )
  }
)
