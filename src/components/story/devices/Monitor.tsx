import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials, storyColors } from '../materials'
import { normalizeGltfScene } from '../normalizeGltf'

type MonitorProps = {
  width?: number
  height?: number
  showUI?: boolean
  uiVariant?: 'ide' | 'web' | 'data' | 'blank'
  tilt?: number
  label?: string
}

export function RealisticMonitor({
  showUI = true,
  uiVariant = 'web',
  tilt = -0.06,
  label,
}: MonitorProps) {
  const mats = useStoryMaterials()
  const screenMat = useRef(mats.screenBright.clone())
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/monitor.glb',
      (gltf) => {
        setModel(
          normalizeGltfScene(gltf.scene, {
            targetSize: 0.55,
            ground: true,
            centerXZ: true,
          }),
        )
      },
      undefined,
      (error) => {
        console.error('Error loading monitor model:', error)
      },
    )
  }, [])

  useFrame(({ clock }) => {
    screenMat.current.emissiveIntensity = 0.4 + Math.sin(clock.elapsedTime * 0.6) * 0.05
  })

  if (!model) {
    return (
      <group>
        <RoundedBox
          args={[1.05, 0.68, 0.05]}
          radius={0.015}
          smoothness={5}
          castShadow
          material={mats.anodizedDark}
        />
      </group>
    )
  }

  return (
    <group>
      <group rotation={[tilt, 0, 0]}>
        <primitive object={model} />

        {showUI && (
          <Html
            transform
            position={[0, 0.22, 0.04]}
            distanceFactor={0.9}
            style={{ width: 260, pointerEvents: 'none' }}
          >
            <MonitorUI variant={uiVariant} label={label} />
          </Html>
        )}
      </group>
    </group>
  )
}

function MonitorUI({ variant, label }: { variant: MonitorProps['uiVariant']; label?: string }) {
  if (variant === 'blank') {
    return <div style={{ width: 260, height: 160, background: '#070b12' }} />
  }
  if (variant === 'data') {
    return (
      <div
        style={{
          width: 260,
          height: 160,
          background: '#0a0e14',
          padding: 12,
          color: storyColors.cream,
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 9,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ color: '#8b949e', marginBottom: 8 }}>SYSTEM MONITOR</div>
        {['API  98ms', 'SERVER  ok', 'DB  12ms', 'QUEUE  3'].map((r) => (
          <div key={r} style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span>{r.split('  ')[0]}</span>
            <span style={{ color: '#3dff8a' }}>{r.split('  ')[1]}</span>
          </div>
        ))}
        <div style={{ marginTop: 10, height: 36, background: 'linear-gradient(90deg,#1a3355,#3dff8a33)', borderRadius: 2 }} />
      </div>
    )
  }
  if (variant === 'ide') {
    return (
      <div
        style={{
          width: 260,
          height: 160,
          background: '#0d1117',
          padding: 10,
          color: '#c9d1d9',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 9,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ color: '#8b949e', marginBottom: 6 }}>editor</div>
        <div style={{ color: '#ff7b72' }}>const build = async () =&gt; {'{'}</div>
        <div style={{ paddingLeft: 10 }}>await compile()</div>
        <div style={{ paddingLeft: 10 }}>await ship()</div>
        <div style={{ color: '#ff7b72' }}>{'}'}</div>
      </div>
    )
  }
  return (
    <div
      style={{
        width: 260,
        height: 160,
        background: 'linear-gradient(160deg,#1a1816,#0f0e0d)',
        color: storyColors.cream,
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '8px 12px',
          borderBottom: '1px solid rgba(239,238,233,0.1)',
          fontSize: 8,
          letterSpacing: '0.12em',
        }}
      >
        <span>KINGZCONNECT</span>
        <span style={{ opacity: 0.45 }}>WORK</span>
        <span style={{ opacity: 0.45 }}>STUDIO</span>
      </div>
      <div style={{ padding: '18px 12px 8px' }}>
        <div style={{ fontSize: 16, marginBottom: 4 }}>{label ?? 'Built with intention.'}</div>
        <div style={{ fontSize: 9, opacity: 0.5 }}>Interfaces that feel like places.</div>
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '0 12px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 42,
              background: i === 1 ? 'rgba(196,165,116,0.18)' : 'rgba(239,238,233,0.05)',
              border: '1px solid rgba(239,238,233,0.08)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
