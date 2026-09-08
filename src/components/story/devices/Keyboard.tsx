import { useState, useEffect } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials, storyColors } from '../materials'

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

      <mesh position={[0, 0.006, 0.12]}>
        <boxGeometry args={[0.72, 0.003, 0.01]} />
        <meshStandardMaterial
          color={storyColors.amber}
          emissive={storyColors.amber}
          emissiveIntensity={0.4}
        />
      </mesh>

      {[[-0.35, 0.018], [0.35, 0.018]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} material={i === 0 ? mats.ledOn : mats.amber}>
          <circleGeometry args={[0.003, 12]} />
        </mesh>
      ))}

      {showCable && (
        <group position={[0.45, -0.008, 0.05]} rotation={[0, 0.4, 0.15]}>
          <mesh material={mats.rubber} castShadow>
            <cylinderGeometry args={[0.009, 0.009, 0.4, 12]} />
          </mesh>
          <mesh position={[0, -0.2, 0]} material={mats.metalFine}>
            <cylinderGeometry args={[0.012, 0.012, 0.025, 16]} />
          </mesh>
        </group>
      )}
    </group>
  )
}
