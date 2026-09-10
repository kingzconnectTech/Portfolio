import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useStoryProgress } from './StoryContext'
import { smoothstep } from './math'

export function WorkspaceComposition() {
  const { progress, isMobile } = useStoryProgress()
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null)

  // Preload models
  const laptop = useGLTF('/models/laptop.glb')
  const smartphone = useGLTF('/models/smartphone.glb')
  const monitor = useGLTF('/models/monitor.glb')
  const keyboard = useGLTF('/models/keyboard.glb')
  const server = useGLTF('/models/server.glb')
  const desk = useGLTF('/models/desk.glb')
  const mouse = useGLTF('/models/mouse.glb')
  const mug = useGLTF('/models/mug.glb')

  // Calculate visibility based on chapter - make workspace visible across most chapters
  const behindScreenProgress = smoothstep(0.48, 0.58, progress) * (1 - smoothstep(0.58, 0.68, progress))
  const projectsProgress = smoothstep(0.38, 0.48, progress) * (1 - smoothstep(0.48, 0.58, progress))
  const curiosityProgress = smoothstep(0.18, 0.28, progress) * (1 - smoothstep(0.28, 0.38, progress))
  const generalVisibility = smoothstep(0.08, 0.15, progress) * (1 - smoothstep(0.85, 0.92, progress))

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    // Subtle floating animation for the entire composition
    groupRef.current.position.y = Math.sin(time * 0.3) * 0.02

    // Device-specific hover effects
    if (hoveredDevice) {
      const targetScale = 1.05
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1))
    } else {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.1))
    }
  })

  const totalVisibility = Math.max(generalVisibility, behindScreenProgress, projectsProgress, curiosityProgress)

  if (totalVisibility < 0.01) return null

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={isMobile ? 0.7 : 1}>
      {/* Desk - always visible as base */}
      <primitive
        object={desk.scene.clone()}
        position={[0, 0, 0]}
        scale={1}
        rotation={[0, 0, 0]}
      />

      {/* Laptop - visible across most chapters */}
      {generalVisibility > 0.1 && (
        <primitive
          object={laptop.scene.clone()}
          position={[-1.2, 0.75, 0.5]}
          scale={0.8}
          rotation={[0, 0.3, 0]}
          onPointerOver={() => setHoveredDevice('laptop')}
          onPointerOut={() => setHoveredDevice(null)}
        />
      )}

      {/* Monitor - visible across most chapters */}
      {generalVisibility > 0.2 && (
        <primitive
          object={monitor.scene.clone()}
          position={[0, 1.2, -0.3]}
          scale={0.9}
          rotation={[0, 0, 0]}
          onPointerOver={() => setHoveredDevice('monitor')}
          onPointerOut={() => setHoveredDevice(null)}
        />
      )}

      {/* Keyboard - visible across most chapters */}
      {generalVisibility > 0.3 && (
        <primitive
          object={keyboard.scene.clone()}
          position={[0, 0.85, 0.8]}
          scale={0.8}
          rotation={[0, 0, 0]}
          onPointerOver={() => setHoveredDevice('keyboard')}
          onPointerOut={() => setHoveredDevice(null)}
        />
      )}

      {/* Smartphone - visible across most chapters */}
      {generalVisibility > 0.2 && (
        <primitive
          object={smartphone.scene.clone()}
          position={[1.2, 0.9, 0.5]}
          scale={0.6}
          rotation={[0, -0.3, 0]}
          onPointerOver={() => setHoveredDevice('smartphone')}
          onPointerOut={() => setHoveredDevice(null)}
        />
      )}

      {/* Server - visible in later chapters */}
      {generalVisibility > 0.5 && (
        <primitive
          object={server.scene.clone()}
          position={[2, 0.5, -1]}
          scale={0.7}
          rotation={[0, -0.2, 0]}
          onPointerOver={() => setHoveredDevice('server')}
          onPointerOut={() => setHoveredDevice(null)}
        />
      )}

      {/* Mouse - visible across most chapters */}
      {generalVisibility > 0.3 && (
        <primitive
          object={mouse.scene.clone()}
          position={[0.5, 0.86, 1.1]}
          scale={0.8}
          rotation={[0, 0.1, 0]}
          onPointerOver={() => setHoveredDevice('mouse')}
          onPointerOut={() => setHoveredDevice(null)}
        />
      )}

      {/* Mug - visible across most chapters */}
      {generalVisibility > 0.2 && (
        <primitive
          object={mug.scene.clone()}
          position={[-0.8, 0.88, 1]}
          scale={0.7}
          rotation={[0, 0.1, 0]}
          onPointerOver={() => setHoveredDevice('mug')}
          onPointerOut={() => setHoveredDevice(null)}
        />
      )}

      {/* Hover info panels */}
      {hoveredDevice && (
        <group position={[0, 2, 0]}>
          <mesh>
            <planeGeometry args={[2, 0.8]} />
            <meshBasicMaterial color="#141210" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.9, 0.7]} />
            <meshBasicMaterial color="#1a1816" transparent opacity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  )
}

// Preload all models
useGLTF.preload('/models/laptop.glb')
useGLTF.preload('/models/smartphone.glb')
useGLTF.preload('/models/monitor.glb')
useGLTF.preload('/models/keyboard.glb')
useGLTF.preload('/models/server.glb')
useGLTF.preload('/models/desk.glb')
useGLTF.preload('/models/mouse.glb')
useGLTF.preload('/models/mug.glb')
