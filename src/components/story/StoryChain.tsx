import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useStoryProgress } from './StoryContext'
import { lerp, smoothstep } from './math'
import { storyColors } from './materials'
import { WorkspaceComposition } from './WorkspaceComposition'

/**
 * Simplified Story chain for new scroll-driven narrative.
 * Uses static composition with subtle animations instead of camera journeys.
 */
export function StoryChain() {
  const { progress } = useStoryProgress()
  const root = useRef<THREE.Group>(null)

  const worldFade = 1 - smoothstep(0.88, 0.96, progress)

  useFrame(() => {
    if (!root.current) return
    root.current.visible = worldFade > 0.02
    root.current.scale.setScalar(lerp(0.92, 1, worldFade))
  })

  return (
    <group ref={root}>
      {/* Ground disc for contact shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[5, 48]} />
        <meshStandardMaterial color="#141210" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Static workspace composition */}
      <WorkspaceComposition />
    </group>
  )
}

/** Static camera for the new Story experience - no camera journey */
export function StoryCamera() {
  const { reducedMotion } = useStoryProgress()
  const target = useRef(new THREE.Vector3(0, 0.5, 4))
  const look = useRef(new THREE.Vector3(0, 0.5, 0))

  useFrame(({ camera }, dt) => {
    if (reducedMotion) {
      camera.position.copy(target.current)
      camera.lookAt(look.current)
    } else {
      // Subtle parallax based on scroll
      const k = 1 - Math.exp(-2.5 * dt)
      camera.position.lerp(target.current, k)
      const curLook = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position)
      curLook.lerp(look.current, k)
      camera.lookAt(curLook)
    }
  })

  return null
}

export function StoryLighting() {
  const { progress, isMobile } = useStoryProgress()
  const warm = 1 - smoothstep(0.88, 0.96, progress)
  const daylight = smoothstep(0.75, 0.9, progress) * (1 - smoothstep(0.92, 0.99, progress))

  return (
    <>
      <ambientLight intensity={0.28 + daylight * 0.2} color="#cfc8bc" />
      <directionalLight
        position={[4.5, 6.5, 3.5]}
        intensity={0.7 + daylight * 0.5}
        color="#fff4e6"
        castShadow={!isMobile}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-3, 2.5, -2]} intensity={0.2 * warm} color="#7a8a9a" />
      <pointLight position={[0, 2.4, 1.2]} intensity={0.35 * warm} color={storyColors.amber} distance={9} />
      <spotLight position={[1.5, 3.5, 2]} angle={0.45} penumbra={0.7} intensity={0.4 * warm} color="#ffe8c8" />
      {!isMobile && <Environment preset="warehouse" />}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.45 * warm} scale={14} blur={2.8} far={5} />
      <fog attach="fog" args={[storyColors.charcoalDeep, isMobile ? 7 : 9, isMobile ? 16 : 20]} />
    </>
  )
}
