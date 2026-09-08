import { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials, storyColors } from '../materials'

type MouseProps = {
  scale?: number
  scrollPulse?: number
}

export function RealisticMouse({ scale = 1, scrollPulse = 0 }: MouseProps) {
  const mats = useStoryMaterials()
  const [model, setModel] = useState<THREE.Group | null>(null)
  const wheelRef = useState<THREE.Mesh | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/mouse.glb',
      (gltf) => {
        const clonedScene = gltf.scene.clone()
        clonedScene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = true
            obj.receiveShadow = true
          }
        })
        setModel(clonedScene)
      },
      undefined,
      (error) => {
        console.error('Error loading mouse model:', error)
      },
    )
  }, [])

  useFrame(({ clock }) => {
    void clock
    void scrollPulse
  })

  if (!model) {
    return (
      <group scale={scale}>
        <mesh castShadow receiveShadow material={mats.anodizedDark}>
          <boxGeometry args={[0.18, 0.04, 0.1]} />
        </mesh>
      </group>
    )
  }

  return (
    <group scale={scale}>
      <primitive object={model} />

      <mesh position={[0, 0.02, -0.02]} material={mats.ledOn}>
        <circleGeometry args={[0.004, 12]} />
      </mesh>

      <mesh position={[0, 0.015, 0.015]}>
        <boxGeometry args={[0.02, 0.004, 0.02]} />
        <meshStandardMaterial
          color={storyColors.amber}
          emissive={storyColors.amber}
          emissiveIntensity={0.3 + scrollPulse * 0.5}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
    </group>
  )
}
