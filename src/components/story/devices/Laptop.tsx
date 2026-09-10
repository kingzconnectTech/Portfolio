import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { storyColors } from '../materials'
import { normalizeGltfScene } from '../normalizeGltf'

type LaptopProps = {
  openAmount?: number
  screenBright?: number
  showUI?: boolean
  codeStage?: number
  scale?: number
}

/** Realistic laptop — GLB normalized to ~0.36m width */
export function RealisticLaptop({
  openAmount = 1,
  screenBright = 0.4,
  showUI = true,
  codeStage = 0,
  scale = 1,
}: LaptopProps) {
  const group = useRef<THREE.Group>(null)
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/laptop.glb',
      (gltf) => {
        setModel(
          normalizeGltfScene(gltf.scene, {
            targetSize: 0.36,
            ground: true,
            centerXZ: true,
          }),
        )
      },
      undefined,
      (error) => console.error('Error loading laptop model:', error),
    )
  }, [])

  useFrame(() => {
    // Soft emissive pulse on any emissive materials if present
    if (!group.current) return
    group.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material && 'emissiveIntensity' in obj.material) {
        const m = obj.material as THREE.MeshStandardMaterial
        if (m.emissive && m.emissive.getHex() !== 0) {
          m.emissiveIntensity = 0.35 + screenBright * 0.9
        }
      }
    })
    void openAmount
  })

  const codeLines =
    codeStage < 0.4
      ? ['<div className="hero">', '  <h1>Hello World</h1>', '  <p>Curiosity.</p>', '</div>']
      : codeStage < 0.75
        ? ['import { createRoot } from "react-dom"', 'const App = () => <Hero />', 'createRoot(el).render(<App />)']
        : ['// React · Node · API · DB', 'app.use("/api", router)', 'await db.query(sql)', 'res.json(payload)']

  if (!model) {
    return (
      <mesh scale={scale}>
        <boxGeometry args={[0.35, 0.02, 0.24]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    )
  }

  return (
    <group ref={group} scale={scale}>
      <primitive object={model} />
      {showUI && openAmount > 0.25 && (
        <Html
          transform
          position={[0, 0.16, 0.02]}
          distanceFactor={0.85}
          style={{ width: 280, height: 165, pointerEvents: 'none', opacity: Math.min(1, openAmount) }}
        >
          <LaptopIDE codeLines={codeLines} codeStage={codeStage} />
        </Html>
      )}
    </group>
  )
}

function LaptopIDE({ codeLines, codeStage }: { codeLines: string[]; codeStage: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0d1117',
        borderRadius: 3,
        overflow: 'hidden',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 8.5,
        color: '#c9d1d9',
        display: 'grid',
        gridTemplateColumns: '72px 1fr 88px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ background: '#010409', padding: 6, borderRight: '1px solid #21262d' }}>
        <div style={{ color: '#8b949e', marginBottom: 6, fontSize: 7 }}>EXPLORER</div>
        {['src', '  App.tsx', '  api.ts', 'public', 'package.json'].map((f) => (
          <div key={f} style={{ color: f.includes('.') ? '#79c0ff' : '#8b949e', marginBottom: 2 }}>
            {f}
          </div>
        ))}
      </div>
      <div style={{ padding: 8 }}>
        <div style={{ color: '#8b949e', marginBottom: 6, fontSize: 7 }}>App.tsx — editor</div>
        {codeLines.map((l) => (
          <div key={l} style={{ marginBottom: 2, color: l.includes('import') || l.includes('<') ? '#ff7b72' : '#c9d1d9' }}>
            {l}
          </div>
        ))}
        <div style={{ marginTop: 10, color: '#3fb950', fontSize: 7 }}>$ npm run dev — ready on :5173</div>
      </div>
      <div style={{ background: '#161b22', padding: 6, borderLeft: '1px solid #21262d' }}>
        <div style={{ color: '#8b949e', marginBottom: 6, fontSize: 7 }}>PREVIEW</div>
        <div
          style={{
            background: '#0d1117',
            borderRadius: 2,
            padding: 8,
            color: storyColors.cream,
            fontSize: 9,
            minHeight: 70,
          }}
        >
          {codeStage < 0.4 ? 'Hello World' : codeStage < 0.75 ? 'React App' : 'API · Live'}
        </div>
      </div>
    </div>
  )
}
