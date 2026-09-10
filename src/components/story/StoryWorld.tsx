import { useStoryProgress } from './StoryContext'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { storyColors } from './materials'
import { WorkspaceComposition } from './WorkspaceComposition'

export function StoryWorld() {
  const { isMobile } = useStoryProgress()
  const bg = useRef(new THREE.Color(storyColors.charcoalDeep))

  useFrame(({ scene }) => {
    bg.current.set(storyColors.charcoalDeep)
    scene.background = bg.current
    const fog = scene.fog as THREE.Fog | null
    if (fog) {
      fog.color.copy(bg.current)
      fog.near = isMobile ? 7 : 9
      fog.far = isMobile ? 16 : 20
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <WorkspaceComposition />
    </>
  )
}
