import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials, storyColors } from '../materials'
import { mobileTechLabels } from '../../../data/story'

type PhoneProps = {
  showUI?: boolean
  networkPulse?: number
  scale?: number
}

export function RealisticPhone({ showUI = true, networkPulse = 0, scale = 1 }: PhoneProps) {
  const mats = useStoryMaterials()
  const screenMat = useRef(mats.screenBright.clone())
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/smartphone.glb',
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
        console.error('Error loading smartphone model:', error)
      },
    )
  }, [])

  useFrame(({ clock }) => {
    screenMat.current.emissiveIntensity =
      0.6 + Math.sin(clock.elapsedTime * 1.5) * 0.06 + networkPulse * 0.45
  })

  if (!model) {
    return (
      <group scale={scale}>
        <RoundedBox
          args={[0.43, 0.88, 0.052]}
          radius={0.052}
          smoothness={10}
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
          position={[0, 0, 0.032]}
          distanceFactor={0.95}
          style={{ width: 160, pointerEvents: 'none' }}
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
        width: 160,
        height: 320,
        background: 'linear-gradient(165deg, #141210 0%, #0a0908 100%)',
        borderRadius: 24,
        padding: 14,
        color: storyColors.cream,
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 7,
          opacity: 0.45,
          marginBottom: 16,
        }}
      >
        <span>9:41</span>
        <span style={{ color: networkPulse > 0.3 ? '#3dff8a' : undefined }}>
          {networkPulse > 0.3 ? '● LIVE' : '5G'}
        </span>
      </div>
      <div
        style={{
          fontSize: 7,
          letterSpacing: '0.18em',
          opacity: 0.4,
          marginBottom: 8,
        }}
      >
        KINGZCONNECT
      </div>
      <div style={{ fontSize: 16, marginBottom: 14, fontWeight: 500 }}>Today</div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 52,
            marginBottom: 8,
            background: 'rgba(239,238,233,0.06)',
            border: '1px solid rgba(239,238,233,0.1)',
            borderRadius: 12,
            padding: 10,
            fontSize: 9,
          }}
        >
          <div
            style={{
              opacity: 0.4,
              fontSize: 6,
              marginBottom: 4,
              letterSpacing: '0.08em',
            }}
          >
            CARD 0{i}
          </div>
          <div style={{ opacity: 0.7 }}>Activity stream</div>
          <div style={{ fontSize: 6, opacity: 0.3, marginTop: 4 }}>2 hours ago</div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
        {mobileTechLabels.map((l) => (
          <span
            key={l}
            style={{
              fontSize: 5.5,
              letterSpacing: '0.08em',
              padding: '3px 6px',
              border: '1px solid rgba(196,165,116,0.4)',
              color: storyColors.amber,
              borderRadius: 6,
            }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
