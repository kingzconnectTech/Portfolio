import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import type { CinematicScene } from '../../data/story-cinematic'
import { StoryScene } from './StoryScene'

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
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="pointer-events-auto font-hn text-xs tracking-[0.26em] text-cream hover:text-white transition-opacity duration-300 hover:opacity-75 sm:text-sm font-semibold flex items-center gap-2"
              aria-label="Return to Home"
            >
              ← BACK
            </Link>
          </div>
        </header>



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
