import { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials } from '../materials'
import { normalizeGltfScene } from '../normalizeGltf'

type MouseProps = {
  scale?: number
  scrollPulse?: number
}

export function RealisticMouse({ scale = 1, scrollPulse = 0 }: MouseProps) {
  const mats = useStoryMaterials()
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/mouse.glb',
      (gltf) => {
        setModel(
          normalizeGltfScene(gltf.scene, {
            targetSize: 0.12,
            ground: true,
            centerXZ: true,
          }),
        )
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

      <mesh position={[0, 0.035, -0.01]} material={mats.ledOn}>
        <circleGeometry args={[0.003, 12]} />
      </mesh>
    </group>
  )
}
