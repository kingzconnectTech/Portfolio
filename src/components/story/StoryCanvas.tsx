import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { StoryWorld } from './StoryWorld'
import { useStoryProgress } from './StoryContext'

export function StoryCanvas() {
  const { isMobile } = useStoryProgress()

  return (
    <Canvas
      className="absolute inset-0"
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{
        antialias: !isMobile,
        alpha: false,
        powerPreference: isMobile ? 'low-power' : 'high-performance',
      }}
      shadows={!isMobile}
      camera={{ position: [0, 1.35, 3.8], fov: isMobile ? 40 : 36, near: 0.05, far: 50 }}
      style={{ background: '#0c0c0c' }}
    >
      <Suspense fallback={null}>
        <StoryWorld />
      </Suspense>
    </Canvas>
  )
}
