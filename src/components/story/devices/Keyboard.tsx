import { useState, useEffect } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials } from '../materials'
import { normalizeGltfScene } from '../normalizeGltf'

type KeyboardProps = {
  scale?: number
  showCable?: boolean
}

export function RealisticKeyboard({ scale = 1, showCable = true }: KeyboardProps) {
  const mats = useStoryMaterials()
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/keyboard.glb',
      (gltf) => {
        setModel(
          normalizeGltfScene(gltf.scene, {
            targetSize: 0.42,
            ground: true,
            centerXZ: true,
          }),
        )
      },
      undefined,
      (error) => {
        console.error('Error loading keyboard model:', error)
      },
    )
  }, [])

  if (!model) {
    return (
      <group scale={scale}>
        <RoundedBox
          args={[0.8, 0.032, 0.3]}
          radius={0.012}
          smoothness={5}
          castShadow
          receiveShadow
          material={mats.anodizedDark}
        />
      </group>
    )
  }

  return (
    <group scale={scale}>
      <primitive object={model} />

      {showCable && (
        <group position={[0.22, 0.01, 0.08]} rotation={[0, 0.4, 0.15]}>
          <mesh material={mats.rubber} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.22, 10]} />
          </mesh>
        </group>
      )}
    </group>
  )
}
