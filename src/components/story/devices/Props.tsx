import { useState, useEffect } from 'react'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials, storyColors } from '../materials'

export function WalnutDesk({
  width = 2.4,
  depth = 1.2,
  height = 0.74,
}: {
  width?: number
  depth?: number
  height?: number
}) {
  const mats = useStoryMaterials()
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/desk.glb',
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
        console.error('Error loading desk model:', error)
      },
    )
  }, [])

  void width
  void depth
  void height

  if (!model) {
    const topT = 0.055
    return (
      <group>
        <RoundedBox
          args={[width, topT, depth]}
          radius={0.018}
          smoothness={5}
          position={[0, height, 0]}
          castShadow
          receiveShadow
          material={mats.walnut}
        />
        <mesh position={[0, height - topT / 2 - 0.012, 0]} material={mats.walnutDark} receiveShadow>
          <boxGeometry args={[width * 0.97, 0.022, depth * 0.97]} />
        </mesh>
        <mesh position={[0, height - topT - 0.008, 0]} material={mats.walnutDark}>
          <boxGeometry args={[width * 0.94, 0.012, depth * 0.94]} />
        </mesh>
        {[
          [-width / 2 + 0.1, height / 2, -depth / 2 + 0.1],
          [width / 2 - 0.1, height / 2, -depth / 2 + 0.1],
          [-width / 2 + 0.1, height / 2, depth / 2 - 0.1],
          [width / 2 - 0.1, height / 2, depth / 2 - 0.1],
        ].map((p, i) => (
          <group key={i} position={p as [number, number, number]}>
            <RoundedBox
              args={[0.08, height - topT, 0.08]}
              radius={0.01}
              smoothness={3}
              castShadow
              material={mats.walnutDark}
            />
            <mesh position={[0, 0, 0.04]} material={mats.walnut}>
              <boxGeometry args={[0.06, height - topT - 0.02, 0.02]} />
            </mesh>
          </group>
        ))}
      </group>
    )
  }

  return <primitive object={model} />
}

export function CoffeeMug({ scale = 1 }: { scale?: number }) {
  const mats = useStoryMaterials()
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/mug.glb',
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
        console.error('Error loading mug model:', error)
      },
    )
  }, [])

  if (!model) {
    return (
      <group scale={scale}>
        <mesh material={mats.ceramic} castShadow receiveShadow>
          <cylinderGeometry args={[0.048, 0.042, 0.095, 28]} />
        </mesh>
        <mesh position={[0, 0.042, 0]} material={mats.ceramic} castShadow>
          <torusGeometry args={[0.048, 0.006, 16, 28]} />
        </mesh>
        <group position={[0.058, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={mats.ceramic} castShadow>
            <torusGeometry args={[0.032, 0.008, 12, 20, Math.PI]} />
          </mesh>
        </group>
        <mesh position={[0, 0.038, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.012, 24]} />
          <meshStandardMaterial color="#2a1810" roughness={0.85} metalness={0.02} />
        </mesh>
      </group>
    )
  }

  return <primitive object={model} scale={scale} />
}

export function Notebook({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number }) {
  const mats = useStoryMaterials()
  return (
    <group scale={scale} rotation={[0, rotation, 0]}>
      <RoundedBox args={[0.24, 0.022, 0.32]} radius={0.006} smoothness={4} castShadow material={mats.cream} />
      <mesh position={[0, 0.003, 0]} material={mats.paper} receiveShadow>
        <boxGeometry args={[0.22, 0.016, 0.3]} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-0.11, 0.012, -0.14 + i * 0.025]} rotation={[0, 0, Math.PI / 2]} material={mats.metalFine}>
          <torusGeometry args={[0.006, 0.002, 8, 16, Math.PI]} />
        </mesh>
      ))}
      <mesh position={[-0.11, 0.012, 0]} material={mats.amber}>
        <boxGeometry args={[0.014, 0.024, 0.32]} />
      </mesh>
    </group>
  )
}

export function Book({
  color = '#3a2a1a',
  thickness = 0.04,
  rotation = 0.15,
}: {
  color?: string
  thickness?: number
  rotation?: number
}) {
  return (
    <group rotation={[0, rotation, 0.02]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.15, thickness, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.14, thickness * 0.88, 0.205]} />
        <meshStandardMaterial color="#f2eee6" roughness={0.92} />
      </mesh>
      <mesh position={[-0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.22, thickness * 0.9, 0.008]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>
      <mesh position={[0, thickness / 2 - 0.002, 0]}>
        <boxGeometry args={[0.145, 0.003, 0.215]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.6} />
      </mesh>
    </group>
  )
}

export function Headphones({ scale = 1 }: { scale?: number }) {
  const mats = useStoryMaterials()
  return (
    <group scale={scale} rotation={[0.2, 0.4, 0.1]}>
      <mesh material={mats.anodized} castShadow>
        <torusGeometry args={[0.095, 0.014, 12, 28, Math.PI]} />
      </mesh>
      <mesh material={mats.rubber} position={[0, 0.008, 0]}>
        <torusGeometry args={[0.095, 0.008, 8, 24, Math.PI]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.095, -0.025, 0]} rotation={[0.3, 0, s * 0.25]}>
          <mesh material={mats.anodizedDark} castShadow receiveShadow>
            <cylinderGeometry args={[0.045, 0.05, 0.04, 20]} />
          </mesh>
          <mesh position={[s * 0.012, 0, 0]} material={mats.rubber}>
            <cylinderGeometry args={[0.04, 0.04, 0.025, 18]} />
          </mesh>
          <mesh position={[s * 0.022, 0, 0]} material={mats.metalFine}>
            <circleGeometry args={[0.025, 20]} />
          </mesh>
          <mesh position={[s * 0.04, 0.015, 0]} material={mats.metalFine}>
            <sphereGeometry args={[0.012, 16, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function TechPlaque({ label, kind = 0 }: { label: string; kind?: number }) {
  const mats = useStoryMaterials()
  return (
    <group>
      {kind === 0 && (
        <RoundedBox args={[0.45, 0.24, 0.07]} radius={0.012} smoothness={4} castShadow material={mats.anodized} />
      )}
      {kind === 1 && (
        <RoundedBox args={[0.3, 0.3, 0.3]} radius={0.025} smoothness={5} castShadow material={mats.metalFine} />
      )}
      {kind === 2 && (
        <RoundedBox args={[0.38, 0.12, 0.26]} radius={0.012} smoothness={4} castShadow material={mats.amber} />
      )}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[kind === 1 ? 0.28 : 0.35, kind === 1 ? 0.28 : 0.1, 0.004]} />
        <meshStandardMaterial color="#4a4e55" roughness={0.4} metalness={0.6} />
      </mesh>
      <Html position={[0, kind === 1 ? 0.24 : 0.18, 0.045]} center style={{ pointerEvents: 'none' }}>
        <span
          style={{
            color: storyColors.cream,
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: 10,
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  )
}
