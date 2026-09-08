import { StoryChain, StoryCamera, StoryLighting } from './StoryChain'
import { useStoryProgress } from './StoryContext'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { storyColors } from './materials'
import { smoothstep } from './math'

export function StoryWorld() {
  const { progress, isMobile } = useStoryProgress()
  const bg = useRef(new THREE.Color(storyColors.charcoalDeep))

  useFrame(({ scene }) => {
    const voiding = smoothstep(0.88, 0.97, progress)
    bg.current.set(storyColors.charcoalDeep).lerp(new THREE.Color('#080808'), voiding)
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
      <StoryCamera />
      <StoryLighting />
      <StoryChain />
    </>
  )
}
