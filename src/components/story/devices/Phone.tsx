import { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials, storyColors } from '../materials'
import { mobileTechLabels } from '../../../data/story'
import { normalizeGltfScene } from '../normalizeGltf'

type PhoneProps = {
  showUI?: boolean
  networkPulse?: number
  scale?: number
}

/** Smartphone GLB normalized to ~0.16m height */
export function RealisticPhone({ showUI = true, networkPulse = 0, scale = 1 }: PhoneProps) {
  const mats = useStoryMaterials()
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/smartphone.glb',
      (gltf) => {
        setModel(
          normalizeGltfScene(gltf.scene, {
            targetSize: 0.16,
            ground: true,
            centerXZ: true,
          }),
        )
      },
      undefined,
      (error) => console.error('Error loading smartphone model:', error),
    )
  }, [])

  useFrame(({ clock }) => {
    void clock
    void networkPulse
  })

  if (!model) {
    return (
      <group scale={scale}>
        <RoundedBox
          args={[0.078, 0.16, 0.01]}
          radius={0.01}
          smoothness={8}
          castShadow
          receiveShadow
          material={mats.metalFine}
        />
      </group>
    )
  }

  return (
    <group scale={scale}>
      <primitive object={model} />
      {showUI && (
        <Html
          transform
          position={[0, 0.08, 0.012]}
          distanceFactor={0.55}
          style={{ width: 140, pointerEvents: 'none' }}
        >
          <MobileUI networkPulse={networkPulse} />
        </Html>
      )}
    </group>
  )
}

function MobileUI({ networkPulse }: { networkPulse: number }) {
  return (
    <div
      style={{
        width: 140,
        height: 280,
        background: 'linear-gradient(165deg, #141210 0%, #0a0908 100%)',
        borderRadius: 18,
        padding: 10,
        color: storyColors.cream,
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7, opacity: 0.45, marginBottom: 12 }}>
        <span>9:41</span>
        <span style={{ color: networkPulse > 0.3 ? '#3dff8a' : undefined }}>
          {networkPulse > 0.3 ? '● LIVE' : '5G'}
        </span>
      </div>
      <div style={{ fontSize: 7, letterSpacing: '0.16em', opacity: 0.4, marginBottom: 4 }}>KINGZCONNECT</div>
      <div style={{ fontSize: 14, marginBottom: 10 }}>Today</div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 42,
            marginBottom: 6,
            background: 'rgba(239,238,233,0.05)',
            border: '1px solid rgba(239,238,233,0.08)',
            borderRadius: 8,
            padding: 7,
            fontSize: 8,
          }}
        >
          <div style={{ opacity: 0.4, fontSize: 6, marginBottom: 2 }}>CARD 0{i}</div>
          Activity stream
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
        {mobileTechLabels.map((l: string) => (
          <span
            key={l}
            style={{
              fontSize: 6,
              letterSpacing: '0.06em',
              padding: '2px 4px',
              border: '1px solid rgba(196,165,116,0.35)',
              color: storyColors.amber,
            }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
